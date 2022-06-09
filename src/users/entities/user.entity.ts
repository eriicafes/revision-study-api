import { User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
    id!: string;

    email!: string;

    firstName!: string;

    lastName!: string;

    createdAt!: Date;

    updatedAt!: Date;

    @Exclude()
    password!: string;

    constructor(user: User) {
        Object.assign(this, user)
    }
}
