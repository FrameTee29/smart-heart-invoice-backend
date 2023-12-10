import { IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/shared/dto/base.dto';

export class QueryCustomerDto extends BaseQueryDto {
  @IsOptional()
  walletAddress: string;
}
