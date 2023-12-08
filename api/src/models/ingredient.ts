import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Recipe} from "./recipe";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
    })
    name: string;

    @PrimaryColumn()
    @Column({
        nullable: false,
    })
    quantityWithUnit: string;

    @ManyToOne(
        () => Recipe,
        recipe => recipe.ingredients,
    )
    recipe: Recipe;
}
