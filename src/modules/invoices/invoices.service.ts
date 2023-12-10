import { Queue } from 'bull';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceHookDto } from './dto/update-invoice.dto';
import { QueryCountInvoiceDto, QueryInvoiceDto } from './dto/query-invoice.dto';
import { CreateInvoiceItemDto } from '../invoice-items/dto/create-invoice-item.dto';

import { IPaginateOptions, IPaginationMeta, paginate } from 'src/shared/utils/paginate';

import { PdfService } from '../pdf/pdf.service';
import { SequenceService } from '../sequence/sequence.service';

import { Invoice } from './entities/invoice.entity';
import { Customer } from '../customers/entities/customer.entity';
import { InvoiceItem } from '../invoice-items/entities/invoice-item.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly sequenceService: SequenceService,
    private readonly pdfService: PdfService,
    @InjectQueue('invoice') private InvoiceQueue: Queue,
  ) {}

  counterInvoice = 0;
  lastInvoice = '';

  async countInvoicesByStatus(status: string, query: QueryCountInvoiceDto): Promise<number> {
    const where = { where: { status } };
    if (query.walletAddress) {
      Object.assign(where['where'], { customer: { walletAddress: query.walletAddress } });
    }
    return this.invoiceRepository.count(where);
  }

  async getCountInvoice(queryCountInvoiceDto: QueryCountInvoiceDto) {
    const [total, pending, overdue, paid] = await Promise.all([
      this.invoiceRepository.count({ where: { customer: { walletAddress: queryCountInvoiceDto.walletAddress } } }),
      this.countInvoicesByStatus('pending', queryCountInvoiceDto),
      this.countInvoicesByStatus('overdue', queryCountInvoiceDto),
      this.countInvoicesByStatus('paid', queryCountInvoiceDto),
    ]);

    return { total, pending, overdue, paid };
  }

  async getAllInvoices(options: IPaginateOptions, queryInvoice: QueryInvoiceDto): Promise<IPaginationMeta<Invoice>> {
    const invoiceBuilder = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer');

    if (queryInvoice.walletAddress) {
      invoiceBuilder.andWhere('customer.walletAddress = :walletAddress', {
        walletAddress: queryInvoice.walletAddress,
      });
    }

    if (queryInvoice.status) {
      invoiceBuilder.andWhere('invoice.status = :status', {
        status: queryInvoice.status,
      });
    }

    if (queryInvoice.key) {
      invoiceBuilder.andWhere(`customer.${queryInvoice.key} = :search`, {
        search: queryInvoice.search,
      });
    }

    return paginate<Invoice>(invoiceBuilder, options);
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    const customer = await this.customerRepository.findOne({ where: { uuid: createInvoiceDto.customerUuid } });

    if (!customer) {
      throw new NotFoundException(`User uuid ${createInvoiceDto.customerUuid} is not found.`);
    }

    const invoiceNumber = await this.generateInvoiceNumber();

    const newInvoice = new Invoice();
    newInvoice.invoiceNumber = invoiceNumber;
    newInvoice.dueDate = new Date();
    newInvoice.paymentName = createInvoiceDto.paymentName;
    newInvoice.chainId = createInvoiceDto.chainId;
    newInvoice.tokenName = createInvoiceDto.tokenName;
    newInvoice.tokenSymbol = createInvoiceDto.tokenSymbol;
    newInvoice.tokenAddress = createInvoiceDto.tokenAddress;
    newInvoice.status = 'pending';
    newInvoice.customer = customer;

    const { items: newInvoiceItems, total } = this.createInvoiceItems(createInvoiceDto.items);
    newInvoice.invoiceItems = newInvoiceItems;
    newInvoice.total = total.toString();
    const newInvoiceData = await this.invoiceRepository.create(newInvoice);

    const result = await this.invoiceRepository.save(newInvoiceData);

    await this.generateInvoicePDF(result);

    return result;
  }

  async getInvoiceByUuid(invoiceUuid: string) {
    return await this.invoiceRepository.findOne({ where: { uuid: invoiceUuid } });
  }

  async getInvoiceByInvoiceNumber(invoiceNumber: string) {
    return await this.invoiceRepository.findOne({ where: { invoiceNumber: invoiceNumber }, relations: ['customer'] });
  }

  async deleteInvoice(invoiceUuid: string) {
    const invoice = await this.invoiceRepository.findOne({ where: { uuid: invoiceUuid } });

    return await this.invoiceRepository.remove(invoice);
  }

  // * Add into Queue
  async updateInvoiceQueue(updateInvoiceHookDto: UpdateInvoiceHookDto) {
    this.counterInvoice++;
    this.lastInvoice = updateInvoiceHookDto.invoiceNumber;
    const invoiceNumber = updateInvoiceHookDto.invoiceNumber.replace(/\//g, '');

    console.log(`[invoice] - {updateInvoiceJob} message is `, invoiceNumber);

    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
    });

    console.log(`[invoice] - {updateInvoiceJob} findOne `, invoice);

    if (!invoice) {
      return { message: `Invoice number ${invoiceNumber} is not found` };
    }

    try {
      invoice.status = 'paid';
      await this.invoiceRepository.update(invoice.uuid, invoice);

      console.log(`[invoice] - {updateInvoiceJob} updated status to Paid successfully `);

      return { message: 'Updated successfully' };
    } catch (err) {
      console.error(`[invoice] - {updateInvoiceJob} updated status to Paid failed `);

      return { message: 'Failed Updated because =>', err };
    }
  }

  // * Private function
  private async generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const sequenceId = await this.sequenceService.getNextId();

    const sequenceValue = sequenceId.toString().padStart(3, '0');

    const invoiceNumber = `SMARTINV${year}${month}${day}${sequenceValue}`;

    return invoiceNumber;
  }

  private createInvoiceItems(itemData: CreateInvoiceItemDto[]) {
    let total = 0;
    const items = itemData.map((data: CreateInvoiceItemDto) => {
      const invoiceItem = new InvoiceItem();

      const amount = data.price * data.quantity;
      invoiceItem.amount = amount;
      total += amount;

      Object.assign(invoiceItem, data);

      return invoiceItem;
    });

    return { items, total };
  }

  private async generateInvoicePDF(invoice: Invoice) {
    const data = {
      // Invoice
      invoiceNumber: invoice.invoiceNumber,
      createdAt: dayjs(invoice.createdAt).format('DD/MM/YYYY'),
      total: Number(invoice.total),
      tokenSymbol: invoice.tokenSymbol,
      dueDate: dayjs(invoice.dueDate).format('DD MMM YYYY'),

      // Customer
      name: invoice.customer.name,
      organization: invoice.customer.organization,
      address: invoice.customer.address,
      phoneNumber: invoice.customer.phoneNumber,
      email: invoice.customer.email,

      // tbody
      invoiceItems: invoice.invoiceItems,
    };

    await this.pdfService.generatePDF(data);

    return invoice;
  }

  async getCounterInvoice() {
    return { counter: this.counterInvoice, lastInvoice: this.lastInvoice };
  }
}
