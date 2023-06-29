import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, BookMark } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwt:JwtService) { }
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
      return user;
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
    return user;
  }
}