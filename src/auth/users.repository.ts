/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    try {
      const hashedPassword = await this.encryptPassword(password);

      await this.save({ username, password: hashedPassword });
    } catch (error) {
      if (+error.code === 23505) {
        // dublicate uysername
        throw new ConflictException('User already exists');
      } else throw new InternalServerErrorException();
    }
  }

  async checkCreds({ username, password }: AuthCredentialsDto): Promise<void> {
    const user = await this.findOne({ username });
    if (!user) throw new UnauthorizedException('User or password incorrect');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('User or password incorrect');
  }

  async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
  }
}
