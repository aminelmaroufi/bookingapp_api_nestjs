import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Card extends Document {
  @Prop({ required: true })
  stripeId: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  number: string;
}

export type CardDocument = Card & Document;
export const CardSchema = SchemaFactory.createForClass(Card);
