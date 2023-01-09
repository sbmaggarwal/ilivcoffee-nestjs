import { Module } from '@nestjs/common';
import { CoffeesController } from "./coffees.controller";
import { CoffeesService } from "./coffees.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coffee } from "./entities/coffee.entity";
import { Flavor } from "./entities/flavor.entity";
import { Event } from "../events/entities/event.entity";
import * as process from "process";
import { ConfigModule } from "@nestjs/config";

class ConfigService {}
class DevConfigService {}
class ProdConfigService {}

@Module({
  // Pass all entities which we want to register with Type ORM (to make it aware)
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
  controllers: [CoffeesController],
  providers: [CoffeesService,
    {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'development' ? DevConfigService : ProdConfigService
    }],
  exports: [CoffeesService]
})
export class CoffeesModule {}
