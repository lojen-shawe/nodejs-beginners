import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookMarkService{
    constructor(private prisma:PrismaService){}
    getBookmarks(userId:number){
        return this.prisma.bookMark.findMany({
            where:{
                userId,
            }
        })
    }

    getBookmarkById(userId:number,bookmarkId:number){
        return this.prisma.bookMark.findFirst({
            where:{
                Id:bookmarkId,
                userId,
            }
        })
    }

   async editBookmarkById(userId:number,bookmarkId:number,dto:EditBookmarkDto){
        const bookMark = await this.prisma.bookMark.findUnique({
            where:{
                Id:bookmarkId
            },
        });
        if(!bookMark||bookMark.userId!==userId)
            throw new ForbiddenException(
                'Access to resources denied'
            );
            return this.prisma.bookMark.update({
                where:{
                    Id:bookmarkId,
                },
                data:{
                 ...dto,
                }
            })
    }

   async deleteBookmarkById(userId:number,bookmarkId:number){
    const bookMark = await this.prisma.bookMark.findUnique({
        where:{
            Id:bookmarkId
        },
    });
    if(!bookMark||bookMark.userId!==userId)
        throw new ForbiddenException(
            'Access to resources denied'
        );
      this.prisma.bookMark.delete({
            where:{
                Id:bookmarkId,
            },
        });
    }

    createBookmak(userId:number,dto:CreateBookmarkDto){
        const bookmark=this.prisma.bookMark.create({
           data:{
            userId,
            ...dto
           } 
        });
        return bookmark;
    }
}