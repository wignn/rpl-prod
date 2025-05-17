import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File not found');
    }

    const ext = path.extname(file.originalname);
    // const filePath = path.resolve('/usr/src/app/uploads', fileName);
    
    // Get current date in DD-MM-YYYY format
    const now = new Date();
    const dateString = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;

    // Fix forWhat to be consistent
    const fixedForWhat = 'greenakostjaya';
    
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const newFileName = `${fixedForWhat}-${dateString}-${uniqueSuffix}${ext}`;

    const oldPath = file.path;
    const newPath = path.join(path.dirname(oldPath), newFileName);

    fs.renameSync(oldPath, newPath);

    return {
      filename: newFileName,
      path: `files/${newFileName}`,
    };
  }
}
