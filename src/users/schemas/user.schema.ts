// src/users/schemas/user.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as crypto from 'crypto';

export interface User extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  picture: string;
  salt: string;
  data: any;
  provider: string;
  providerData: any;
  additionalProvidersData: any;
  roles: string[];
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  isMale: boolean;
  birthdate: Date;
  authenticate(password: string): Promise<boolean>;
  hashPassword(password: string, salt: string): Promise<string>;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  // get fullname(): string {
  //   return `${this.firstname} ${this.lastname}`;
  // }

  @Prop({
    type: String,
    get: function () {
      return this.firstname + ' ' + this.lastname;
    },
  })
  fullname: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Grid' })
  picture: string;

  @Prop()
  salt: string;

  @Prop({ type: Object })
  data: any;

  @Prop({ required: true })
  provider: string;

  @Prop({ type: Object })
  providerData: any;

  @Prop({ type: Object })
  additionalProvidersData: any;

  @Prop({ default: 'user', type: [{ type: String }] })
  roles: string[];

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop({ default: true })
  isMale: boolean;

  @Prop()
  birthdate: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.hashPassword = function (password, salt) {
  if (salt && password) {
    return crypto
      .pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 64, 'sha512')
      .toString('base64');
  }
  return password;
};

UserSchema.methods.authenticate = async function (password): Promise<boolean> {
  return this.password === this.hashPassword(password, this.salt);
};

UserSchema.pre('save', async function pre_save(next) {
  if (this.password) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = await this.hashPassword(this.password, this.salt);
  }

  next();
});
