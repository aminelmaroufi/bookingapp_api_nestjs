import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import config from 'src/config';
import { Hotel } from 'src/hotels/schemas/hotel.schema';

@Schema({ strict: false, timestamps: config.db.lib.mongoose.timestamps })
export class Room extends Document {
  @Prop({ unique: true, required: true })
  title: string;

  @Prop({ required: true })
  advantage: string;

  @Prop({ type: Types.ObjectId, ref: 'File' })
  room_picture: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ default: false })
  is_archived: boolean;

  // @Prop({ type: Types.ObjectId, ref: 'Hotel' })
  // hotel: Hotel;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
