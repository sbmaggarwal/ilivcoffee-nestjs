import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res
} from "@nestjs/common";
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Controller("coffees")
export class CoffeesController {

  constructor(
    private readonly coffeeService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  @Get()
  getCoffee(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(":id")
  async getMyCoffee(@Res() response, @Param("id") id: number) {
    return await this.coffeeService.findOne(id);
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
