import { Module } from "@nestjs/common";
import { BookMarkController } from "./bookmark.controller";
import { BookMarkService } from "./bookmark.service";
@Module({
    controllers:[BookMarkController],
    providers:[BookMarkService],
})
export class BookMarkModule{}