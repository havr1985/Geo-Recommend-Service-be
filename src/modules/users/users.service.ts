import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateObjectId } from 'src/shared/util/validate-object-id.util';
import { hashPassword } from 'src/shared/util/password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  findAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async findUserById(id: string): Promise<User> {
    validateObjectId(id);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, roles } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      roles,
    });
    return newUser.save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    validateObjectId(id);
    const { username, email, password } = updateUserDto;
    const updatedData: Partial<UserDocument> = {};
    if (username !== undefined) {
      updatedData.username = username;
    }
    if (email !== undefined) {
      updatedData.email = email;
    }
    if (password) {
      updatedData.password = await argon2.hash(password);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
        select: '-password',
      })
      .exec();
    if (!updatedData) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    validateObjectId(id);
    const user = await this.findUserById(id);
    await this.userModel.deleteOne(user);
  }
}
