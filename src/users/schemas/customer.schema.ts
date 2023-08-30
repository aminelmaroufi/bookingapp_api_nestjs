// src/users/schemas/user.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as crypto from 'crypto';
import { User } from './user.schema';

export interface Customer extends User {
  stripeId: string;
  cards: string[];
  token: string;
}

@Schema({ timestamps: true })
export class Customer extends User {
  @Prop({ require: true, default: null })
  stripeId: string;

  @Prop()
  token: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Card', default: [] }] })
  cards: string[];
}

export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.methods.hashPassword = function (password, salt) {
  if (salt && password) {
    return crypto
      .pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 64, 'sha512')
      .toString('base64');
  }
  return password;
};

CustomerSchema.methods.authenticate = async function (
  password,
): Promise<boolean> {
  return this.password === this.hashPassword(password, this.salt);
};

CustomerSchema.pre('save', async function pre_save(next) {
  if (this.password) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = await this.hashPassword(this.password, this.salt);
  }

  next();
});
