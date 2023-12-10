import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './config/default.config';

import { AppController } from './app.controller';

import { InvoicesModule } from './modules/invoices/invoices.module';
import { SequenceModule } from './modules/sequence/sequence.module';
import { CustomersModule } from './modules/customers/customers.module';
import { InvoiceItemsModule } from './modules/invoice-items/invoice-items.module';
import { PdfModule } from './modules/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database') || {},
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('redis') || {},
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    SequenceModule,
    InvoicesModule,
    CustomersModule,
    InvoiceItemsModule,
    PdfModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
