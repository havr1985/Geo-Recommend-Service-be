import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  readonly _id: Types.ObjectId;
  
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  roles: Role;
}

export const UserSchema = SchemaFactory.createForClass(User)
