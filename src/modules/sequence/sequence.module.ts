import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SequenceService } from './sequence.service';

import { Sequence } from './entities/sequence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sequence])],
  providers: [SequenceService],
  exports: [SequenceService],
})
export class SequenceModule {}
