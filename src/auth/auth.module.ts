// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './config/jwt.strategy';
import { LocalStrategy } from './config/local.strategy';
import { UsersModule } from '../users/users.module';
import { SessionSerializer } from './config/session.serializer';
import config from 'src/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: config.app.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
