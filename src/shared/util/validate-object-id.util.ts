import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('ID not valid');
  }
}
