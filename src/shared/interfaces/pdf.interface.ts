import { InvoiceItem } from 'src/modules/invoice-items/entities/invoice-item.entity';

export interface IGeneratePDF {}

export interface InvoicePDF {
  invoiceNumber: string;
  createdAt: string;
  total: number;
  tokenSymbol: string;
  dueDate: string;
  name: string;
  organization: string;
  address: string;
  email: string;
  invoiceItems: InvoiceItem[];
}
