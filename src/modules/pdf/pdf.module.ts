import { Module } from '@nestjs/common';

import { PdfController } from './pdf.controller';

import { PdfService } from './pdf.service';

@Module({
  imports: [],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}