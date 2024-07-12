import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { diskStorage } from "multer";
import { extname } from "path";
import { Upload } from "src/database/entities/upload.entity";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import { TempUpload } from "src/database/entities/tempUpload.entity";

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(TempUpload)
    private readonly tempUploadRepository: Repository<TempUpload>,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}
  getTemImageUploadConfig() {
    return {
      storage: diskStorage({
        destination: "./uploads/temp/img",
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
    };
  }
  getImageUploadConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uuidPath = uuidv4();
          const uploadPath = `./uploads/${uuidPath}`;
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
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
    };
  }

  async saveFileMetadata(filename: string, path: string) {
    const upload = new Upload();
    upload.filename = filename;
    upload.path = path;
    return await this.uploadRepository.save(upload);
  }

  async findFileByUUID(uuid: string) {
    return await this.uploadRepository.findOne({
      where: { path: `uploads/${uuid}` },
    });
  }
}
