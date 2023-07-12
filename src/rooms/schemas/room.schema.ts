import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import config from 'src/config';

@Schema({ strict: false, timestamps: config.db.lib.mongoose.timestamps })
export class Room {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  advantage: string;

  @Prop({ ref: 'Grid', type: Types.ObjectId })
  room_picture: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ default: false })
  is_archived: boolean;
}

export type RoomDocument = Room & Document;

export const RoomSchema = SchemaFactory.createForClass(Room);
