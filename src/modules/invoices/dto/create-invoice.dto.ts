import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { CreateInvoiceItemDto } from 'src/modules/invoice-items/dto/create-invoice-item.dto';

export class CreateInvoiceDto {
  @IsNotEmpty()
  customerUuid: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsNotEmpty()
  paymentName: string;

  @IsNotEmpty()
  chainId: number;

  @IsNotEmpty()
  tokenName: string;

  @IsNotEmpty()
  tokenSymbol: string;

  @IsNotEmpty()
  @Transform((tokenAddress) => String(tokenAddress.value).toLocaleLowerCase())
  tokenAddress: string;

  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
