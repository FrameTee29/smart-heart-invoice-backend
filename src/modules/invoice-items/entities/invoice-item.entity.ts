import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/shared/models/base.entity';
import { Invoice } from 'src/modules/invoices/entities/invoice.entity';

@Entity({ name: 'invoice_item' })
export class InvoiceItem extends BaseEntity {
  @Column()
  description: string;

  @Column()
  quantity: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_uuid' })
  invoice: Invoice;
}
