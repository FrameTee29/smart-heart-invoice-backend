import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from 'src/shared/models/base.entity';

@Entity({ name: 'sequence' })
export class Sequence extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  value: number;
}
