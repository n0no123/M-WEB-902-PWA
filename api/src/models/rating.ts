import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Recipe} from "./recipe";

@Entity()
export class Rating {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
        type: "integer",
    })
    rating: number;

    @ManyToOne(
        () => Recipe,
        recipe => recipe.ratings,
    )
    recipe: Recipe;

    @ManyToOne(
        () => User,
        user => user.ratings,
    )
    user: User;
}
