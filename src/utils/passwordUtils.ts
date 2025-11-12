import * as bcrypt from 'bcrypt';

export class PasswordUtil{
    saltOrRounds = 10;
    static hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    static comparePasswords(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}
