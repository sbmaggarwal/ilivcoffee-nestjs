import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {

  @IsPositive()
  @IsOptional()
  //@Type(() => Number) Not needed as we have set enableImplicitConversion in bootstrap
  limit: number;

  @IsPositive()
  @IsOptional()
  //@Type(() => Number) Not needed as we have set enableImplicitConversion in bootstrap
  offset: number;
}
