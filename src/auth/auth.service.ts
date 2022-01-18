import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(creds: AuthCredentialsDto): Promise<{ token: string }> {
    await this.usersRepository.createUser(creds);
    const token = await this.createToken(creds.username);
    return { token };
  }

  async signIn(creds: AuthCredentialsDto): Promise<{ token: string }> {
    await this.usersRepository.checkCreds(creds);
    const token = await this.createToken(creds.username);
    return { token };
  }

  async createToken(username: string): Promise<string> {
    const payload: JwtPayload = { username };
    return await this.jwtService.sign(payload);
  }
}
