import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicesController } from './invoices.controller';

import { Invoice } from './entities/invoice.entity';
import { Sequence } from '../sequence/entities/sequence.entity';
import { Customer } from '../customers/entities/customer.entity';
import { InvoiceItem } from '../invoice-items/entities/invoice-item.entity';

import { PdfService } from '../pdf/pdf.service';
import { InvoicesService } from './invoices.service';
import { SequenceService } from '../sequence/sequence.service';

import { InvoiceConsumer } from './invoices.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem, Customer, Sequence]),
    BullModule.registerQueue({ name: 'invoice' }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, SequenceService, InvoiceConsumer, PdfService],
})
export class InvoicesModule {}
