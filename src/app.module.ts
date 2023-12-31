import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookMarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    AuthModule, 
    PrismaModule,
    BookMarkModule,
    UserModule
  ],
  controllers: [UserController],
  providers: [PrismaService],
})
export class AppModule {}
