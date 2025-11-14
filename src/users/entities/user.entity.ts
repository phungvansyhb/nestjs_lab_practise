import { AbstractEntity } from "src/abstract/AbtractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends AbstractEntity {

    @Column({length : 124})
    firstName: string;

    @Column({length : 124})
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hashedPassword: string;

}
