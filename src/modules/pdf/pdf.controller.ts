import { Controller, Get, NotFoundException, Param, Post, Res } from '@nestjs/common';

import * as fs from 'fs';
import type { Response } from 'express';

@Controller('pdf')
export class PdfController {
  @Get('/download/:invoiceNumber')
  async downloadFile(@Param('invoiceNumber') invoiceNumber: string, @Res() res: Response) {
    const folder = `./files/invoices`;
    const fileName = `${invoiceNumber}.pdf`;
    const path = `${folder}/${fileName}`;

    try {
      fs.accessSync(path, fs.constants.R_OK);

      const fileStream = fs.createReadStream(path);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      fileStream.pipe(res);
    } catch (err) {
      throw new NotFoundException(`Invalid ${invoiceNumber}.pdf`);
    }
  }

  @Get('get-file')
  getTestFile() {
    const templateFile = './templates/invoice';
    const contentFile = `${templateFile}/content.hbs`;

    //Get HTML content from HTML file
    const content = fs.readFileSync(contentFile, 'utf-8');

    console.log('Get File ==>', content);

    return { message: 'Successfully', content };
  }

  @Post('create-file/:name')
  async createFile(@Param('name') name: string) {
    await new Promise((resolve, reject) => {
      fs.writeFile(`./files/invoices/${name}.txt`, 'test', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });

    return { message: 'create successfully' };
  }
}
