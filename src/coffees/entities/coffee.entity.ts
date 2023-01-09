import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity("coffee")
export class Coffee {

  @PrimaryGeneratedColumn()
  id: number;

  @Index() // add an index
  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({default: 0})
  recommendations: number;

  //Helps specify the owner side of the table - here it is Coffee table
  @JoinTable()
  // Type is external entity to link,
  // Next - specify what is coffee inside a flavor entity
  @ManyToMany(
    type => Flavor,
      flavor => flavor.coffees,
    {
      cascade: true // insert cascade
    }
  )
  flavors: Flavor[];

}