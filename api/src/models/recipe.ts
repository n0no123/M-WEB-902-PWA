import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Ingredient} from "./ingredient";
import {User} from "./user";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    name: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    description: string;

    @Column({
        nullable: false,
        type: 'simple-array',
    })
    steps: string[];

    @Column({
        nullable: false,
        type: 'simple-array',
    })
    tags: string[];

    @Column({
        nullable: false,
        type: "integer"
    })
    cookingTimeInMinutes: number;

    @Column({
        nullable: false,
        type: "integer"
    })
    preparationTimeInMinutes: number;

    @OneToMany(
        () => Ingredient,
        ingredient => ingredient.recipe
    )
    @JoinColumn()
    ingredients: Ingredient[];

    @Column({
        nullable: false,
        type: "float8"
    })
    rating: number;

    @ManyToOne(
        () => User,
        user => user.myRecipes
    )
    owner: User;

    @Column({
        nullable: false,
        type: "integer"
    })
    servings: number;
}
