import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { Flavor } from "./entities/flavor.entity";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { Event } from "../events/entities/event.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    console.log(this.configService.get('DATABASE_HOST'));

    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(coffeeId: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { 'id': coffeeId }});

    if (!coffee) {
      throw new HttpException({message: 'Coffee not found'}, HttpStatus.NOT_FOUND);
      //throw new NotFoundException('Coffee not found');
      //throw 'Random error';
    }

    return coffee;
  }

  async create(newCoffee: CreateCoffeeDto) {
    const flavors = await Promise.all(
      newCoffee.flavors.map(name => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...newCoffee, flavors
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updatedCoffee: UpdateCoffeeDto) {
    const flavors = updatedCoffee.flavors && (await Promise.all(
      updatedCoffee.flavors.map(name => this.preloadFlavorByName(name)),
    ));

    const coffee = await this.coffeeRepository.preload({
      'id': +id,
      ...updatedCoffee,
      flavors
    });

    if (!coffee) {
      // update
      throw new NotFoundException(`Coffee with '${id}' not found!`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(coffeeId: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { 'id': coffeeId }});

    return this.coffeeRepository.remove(coffee);
  }

  // Transactions
  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOneBy({ 'name': name });
    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }
}
