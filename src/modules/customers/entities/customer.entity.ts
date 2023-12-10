import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/shared/models/base.entity';
import { Invoice } from 'src/modules/invoices/entities/invoice.entity';

@Entity({ name: 'customer' })
export class Customer extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  organization: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ name: 'wallet_address' })
  walletAddress: string;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];
}
