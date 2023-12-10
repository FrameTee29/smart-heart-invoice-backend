import { IsNotEmpty } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;
}
