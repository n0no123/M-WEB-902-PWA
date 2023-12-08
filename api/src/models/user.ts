import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable} from 'typeorm';
import {Recipe} from "./recipe";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        unique: true,
        nullable: false,
        type: 'varchar',
    })
    email: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    password: string;

    @OneToMany(
        () => Recipe,
        recipe => recipe.owner
    )
    @JoinTable()
    myRecipes: Recipe[];
}
