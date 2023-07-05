import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards} from "@nestjs/common";
import { GetUser } from "src/auth/decorators";
import { JwtGuard } from "src/auth/guard";
import { BookMarkService } from "./bookmark.service";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookMarkController {
    constructor(private bookMarkService:BookMarkService){}
    @Get()
    getBookmarks(@GetUser('id') userId:number){
        return this.bookMarkService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId:number, @Param('id',ParseIntPipe) bookMarkId:number){
        return this.bookMarkService.getBookmarkById(userId,bookMarkId);
    }

    @Patch()
    editBookmarkById(@GetUser('id') userId:number,@Body() dto : EditBookmarkDto,@Param('id',ParseIntPipe) bookMarkId:number){
        return this.bookMarkService.editBookmarkById(userId,bookMarkId,dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    deleteBookmarkById(@GetUser('id') userId:number,@Param('id',ParseIntPipe) bookMarkId:number){
        return this.bookMarkService.deleteBookmarkById(userId,bookMarkId);
    }

    @Post()
    createBookmak(@GetUser('id') userId:number,@Body() dto:CreateBookmarkDto){
        return this.bookMarkService.createBookmak(userId,dto);
    }

}