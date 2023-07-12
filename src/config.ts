import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  app: {
    title: 'Booking Hotels API',
    secret: process.env.SECRET || 'MEA2N',
    prefix: process.env.API_URL_PREFIX || 'api/v1',
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/booking',
    lib: {
      mongoose: {
        timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
    },
  },
  uploads: {
    path: process.env.UPLOAD_FILES_PATH
      ? `./${process.env.UPLOAD_FILES_PATH}`
      : './uploads/images',
    uploader: {
      limits: {
        fileSize: 52428800, // Max file size in bytes (50 MB)
      },
      thumbnail: {
        width: 100,
        height: 100,
      },
      accept: ['image/png', 'image/jpeg'],
    },
  },
  corsConfig: {
    origin: ['http://localhost:8000'],
    credentials: true,
  },
};

export default config;
