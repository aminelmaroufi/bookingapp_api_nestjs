import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import config from 'src/config';

@Schema({ strict: false, timestamps: config.db.lib.mongoose.timestamps })
export class File extends Document {
  @Prop({ required: true })
  filename: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
// FileSchema.virtual('preview').get(function get_preview(this: File) {
//   return `/api/files/${this._id}/view`;
// });
