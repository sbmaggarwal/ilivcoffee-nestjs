import { Module } from '@nestjs/common';
import { CoffeesController } from "./coffees.controller";
import { CoffeesService } from "./coffees.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coffee } from "./entities/coffee.entity";

@Module({
  // Pass all entities which we want to register with Type ORM (to make it aware)
  imports: [TypeOrmModule.forFeature([Coffee])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
