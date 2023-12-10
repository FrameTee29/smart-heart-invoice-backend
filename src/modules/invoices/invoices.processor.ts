import { Job } from 'bull';
import { Repository } from 'typeorm';
import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';

import { Invoice } from './entities/invoice.entity';

interface UpdateInvoiceJobMessage {
  invoiceNumber: string;
}

@Processor('invoice')
export class InvoiceConsumer {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  @Process('updateInvoiceJob')
  async updateInvoiceJob(job: Job<UpdateInvoiceJobMessage>) {
    const { invoiceNumber } = job.data;

    console.log(`[invoice] - {updateInvoiceJob} message is `, job.data);

    const invoice = await this.invoiceRepository.findOne({ where: { invoiceNumber } });

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
}
