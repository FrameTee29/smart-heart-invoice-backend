import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/shared/models/base.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { InvoiceItem } from 'src/modules/invoice-items/entities/invoice-item.entity';

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {
  constructor(invoice?: Partial<Invoice>) {
    super();
    Object.assign(this, invoice);
  }

  @Column({ name: 'invoice_number', nullable: false })
  invoiceNumber: string;

  @Column({ name: 'due_date', nullable: false })
  dueDate: Date;

  @Column({ name: 'payment_name', nullable: false })
  paymentName: string;

  @Column({ name: 'chain_id', nullable: false })
  chainId: number;

  @Column({ name: 'token_name', nullable: false })
  tokenName: string;

  @Column({ name: 'token_symbol', nullable: false })
  tokenSymbol: string;

  @Column({ name: 'token_address', nullable: false })
  tokenAddress: string;

  @Column({ name: 'total' })
  total: string;

  @Column({ name: 'status', nullable: false })
  status: string;

  @Column({ name: 'txn_hash', nullable: true })
  txnHash: string;

  @Column({ name: 'txn_count', nullable: true })
  txnCount: string;

  @Column({ name: 'destination_address', nullable: true })
  destinationAddress: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  @JoinColumn({ name: 'customer_uuid' })
  customer: Customer;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, { cascade: true, onDelete: 'CASCADE' })
  invoiceItems: InvoiceItem[];
}
