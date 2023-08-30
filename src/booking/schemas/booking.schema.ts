import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Customer' }] })
  customer: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Hotel' }] })
  hotel: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Room' }] })
  room: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Card' }] })
  card: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  payment_auth: string;

  @Prop({ required: true })
  check_in_date: Date;

  @Prop({ required: true })
  check_out_date: Date;

  @Prop({ required: true })
  night_numbers: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
