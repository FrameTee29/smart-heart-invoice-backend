import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceItemsController } from './invoice-items.controller';

import { InvoiceItemsService } from './invoice-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [InvoiceItemsController],
  providers: [InvoiceItemsService],
})
export class InvoiceItemsModule {}
