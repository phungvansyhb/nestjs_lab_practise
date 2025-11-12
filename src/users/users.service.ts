import { PasswordUtil } from 'src/utils/passwordUtils';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private userRepository:Repository<User>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  create(createUserDto: CreateUserDto) {
    const createdUser = new User();
    Object.assign(createdUser, createUserDto);
    const hashedPassword = PasswordUtil.hashPassword(createUserDto.password);
    createdUser.hashedPassword = hashedPassword;
    return this.userRepository.save(createdUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
