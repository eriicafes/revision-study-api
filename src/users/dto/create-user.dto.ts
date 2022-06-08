import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    password: string;
}
