import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import config from '../../config';

@Schema({ strict: false, timestamps: config.db.lib.mongoose.timestamps })
export class Hotel extends Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, ref: 'File' })
  main_picture: string;

  @Prop({ required: true, ref: 'File' })
  second_picture: string;

  @Prop({ required: true })
  short_address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  is_archived: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Room' }] })
  rooms: string[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export type HotelDocument = Hotel & Document;

export const HotelSchema = SchemaFactory.createForClass(Hotel);
