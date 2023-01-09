import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Roast',
      brand: 'Some',
      flavors: ['None']
    }
  ];

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  findAll() {
    return this.coffeeRepository.find();
  }

  async findOne(coffeeId: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { 'id': coffeeId }});
    if (!coffee) {
      //throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
      //throw new NotFoundException('Coffee not found');
      throw 'Random error';
    }

    return coffee;
  }

  create(newCoffee: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(newCoffee);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updatedCoffee: any) {
    const coffee = await this.coffeeRepository.preload({
      'id': +id,
      ...updatedCoffee
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
}
