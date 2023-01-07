import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";

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

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find(item => item.id == +id);
    if (!coffee) {
      //throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
      //throw new NotFoundException('Coffee not found');
      throw 'Random error';
    }

    return coffee;
  }

  create(newCoffee: any) {
    this.coffees.push(newCoffee);
  }

  update(id: string, updatedCoffee: any) {
    const existing = this.findOne(id);
    if (existing) {
      // update
    }

    return updatedCoffee;
  }

  remove(id: string) {
    const existingIdx = this.coffees.findIndex(item => item.id == +id);
    this.coffees.splice(existingIdx, 1);

    return existingIdx;
  }
}
