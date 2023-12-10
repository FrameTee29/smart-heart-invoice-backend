import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Sequence } from './entities/sequence.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private sequenceRepository: Repository<Sequence>,
  ) {}

  async getNextId(): Promise<number> {
    let value = 1;
    const sequence = await this.sequenceRepository.findOne({
      where: { name: 'invoice' },
      order: { createdAt: 'DESC' },
    });
    if (sequence) {
      value = sequence.value + 1;
    }

    const result = await this.sequenceRepository.save({ name: 'invoice', value });
    return result.value;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'reset sequence id', timeZone: 'Asia/Bangkok' })
  async resetSequenceTable() {
    console.log('Cron Reset sequence id', new Date());
    await this.sequenceRepository.delete({ name: 'invoice' });
  }
}
