import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coffee } from "./coffee.entity";

@Entity()
export class Flavor {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // No JoinTable decorator needed as Coffee is the owner of relationship
  @ManyToMany(type => Coffee, coffee => coffee.flavors)
  coffees: Coffee[];
}
