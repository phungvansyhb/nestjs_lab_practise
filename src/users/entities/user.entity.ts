import { AbstractEntity } from "src/abstract/abtractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends AbstractEntity {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hashedPassword: string;

}
