import {Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Recipe} from "./recipe";

@Entity()
export class Cookbook {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(
        () => User,
        user => user.cookbook,
    )
    user: User;

    @ManyToMany(() => Recipe)
    @JoinTable()
    recipe: Recipe[];
}
