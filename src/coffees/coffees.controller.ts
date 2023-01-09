import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from "@nestjs/common";
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@Controller("coffees")
export class CoffeesController {

  constructor(private readonly coffeeService: CoffeesService) {}

  @Get()
  getCoffee(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(":id")
  getMyCoffee(@Res() response, @Param("id") id: number) {
    return response.status(200).send(this.coffeeService.findOne(id));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  createCoffee(@Body() body: CreateCoffeeDto) {
    return this.coffeeService.create(body);
  }

  @Patch(":id")
  updateCoffee(@Res() response, @Param("id") id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return response.status(200).send(this.coffeeService.update(id, updateCoffeeDto));
  }

  @Delete(":id")
  deleteCoffee(@Res() response, @Param("id") id: number) {
    return response.status(200).send(this.coffeeService.remove(id));
  }

}
