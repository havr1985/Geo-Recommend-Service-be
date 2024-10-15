import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import * as argon2 from 'argon2';
import { TokenPayload } from 'src/shared/interfaces/token-payload.interface';
import { comparePassword } from 'src/shared/util/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);
    const isPasswordValid = await comparePassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const { email, password } = user;
    const loginUser = await this.validateUser(email, password);
    const payload: TokenPayload = {
      userId: loginUser._id.toString(),
      username: loginUser.username,
      role: loginUser.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
