import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, BookMark } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt:JwtService,
    private config:ConfigService
    ) { }
  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);
      // save the new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // return the saved user
      return this.sinToken(user.id,user.email);
    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }
  async signin(dto:AuthDto) {
    //first find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user doesn't exist throw exception
    if(!user){
      throw new ForbiddenException(
        'Credentials incorrect',
      )
    }
    //compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password
    );
    //if password incorrect throw exception
    if(!pwMatches){

      throw new ForbiddenException(
        'Credentials incorrect',
      )
    };
    //send back the user
    delete user.hash;
    return this.sinToken(user.id,user.email);
  }

  async sinToken(userId:number,email:string):Promise<{access_token:string}>{
    const payload={
      sub:userId,
      email
    };
    const secret=this.config.get('JWT_SECRET');
    const token= await this.jwt.signAsync(
      payload,{
        expiresIn:'15m',
        secret:secret
      }
    );
    return {
      access_token:token
    }
  }
}