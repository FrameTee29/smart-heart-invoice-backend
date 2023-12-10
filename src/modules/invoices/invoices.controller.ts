import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { IPaginateOptions } from 'src/shared/utils/paginate';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceHookDto } from './dto/update-invoice.dto';
import { QueryCountInvoiceDto, QueryInvoiceDto } from './dto/query-invoice.dto';

import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/list')
  getAllInvoices(@Query() queryInvoice: QueryInvoiceDto) {
    const options: IPaginateOptions = {
      page: queryInvoice.page,
      limit: queryInvoice.limit,
    };
    return this.invoicesService.getAllInvoices(options, queryInvoice);
  }

  @Get('/count/status')
  getCountInvoice(@Query() queryCountInvoiceDto: QueryCountInvoiceDto) {
    return this.invoicesService.getCountInvoice(queryCountInvoiceDto);
  }

  @Get('/:uuid')
  getInvoiceByUuid(@Param('uuid') uuid: string) {
    return this.invoicesService.getInvoiceByUuid(uuid);
  }

  @Get('/invoice-number/:invoiceNumber')
  getInvoiceByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoicesService.getInvoiceByInvoiceNumber(invoiceNumber);
  }

  @Post('/create')
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }

  @Patch('/update')
  updateInvoice() {
    return;
  }

  @Delete('/delete/:uuid')
  deleteInvoice(@Param('uuid') invoiceUuid: string) {
    return this.invoicesService.deleteInvoice(invoiceUuid);
  }

  @Get('/hook/update')
  hookUpdateInvoice(@Query() updateInvoiceHookDto: UpdateInvoiceHookDto) {
    return this.invoicesService.updateInvoiceQueue(updateInvoiceHookDto);
  }

  @Get('/hook/counter')
  getHookCounter() {
    return this.invoicesService.getCounterInvoice();
  }
}
