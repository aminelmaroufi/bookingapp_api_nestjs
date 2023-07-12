// src/users/schemas/user.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export interface Customer extends User {
  stripeId: string;
  cards: string[];
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ default: null })
  stripeId: string;

  @Prop({ default: [] })
  cards: string[];
}

export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(User);
