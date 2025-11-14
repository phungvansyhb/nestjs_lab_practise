import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(12)
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(12)
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @IsNotEmpty()
    @MinLength(6)
    @Transform(({ value }) => value?.trim())
    password: string;

    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;
}
