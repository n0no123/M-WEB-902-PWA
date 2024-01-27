import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, OneToOne, JoinColumn} from 'typeorm';
import {Recipe} from "./recipe";
import {Rating} from "./rating";
import {Cookbook} from "./cookbook";
import {PushSubscription} from "web-push";

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
        nullable: true,
        type: 'json',
    })
    notificationLink: PushSubscription;

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

    @OneToMany(
        () => Rating,
        rating => rating.user
    )
    ratings: Rating[];

    @OneToOne(
        () => Cookbook,
        cookbook => cookbook.user
    )
    @JoinColumn()
    cookbook: Cookbook;
}
