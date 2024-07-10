import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { diskStorage } from "multer"; // diskStorage 임포트 추가
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/temp",
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException("Only image files are allowed!"),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const BE_BASE_URL = this.configService.get("BE_BASE_URL");

    return { imageUrl: `${BE_BASE_URL}/uploads/temp/${file.filename}` };
  }
}
