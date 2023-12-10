import { IsOptional } from 'class-validator';

import { BaseQueryDto } from 'src/shared/dto/base.dto';

export class QueryInvoiceDto extends BaseQueryDto {
  @IsOptional()
  walletAddress: string;

  @IsOptional()
  status: string;
}

export class QueryCountInvoiceDto {
  @IsOptional()
  walletAddress: string;
}
