// mongoose.config.ts
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig: MongooseModuleOptions = {
  uri: 'mongodb+srv://admin:admin@bookings.eebig.mongodb.net/booking?retryWrites=true&w=majority',
};
