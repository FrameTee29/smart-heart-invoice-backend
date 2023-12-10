import { IsNotEmpty } from 'class-validator';

export class UpdateInvoiceHookDto {
  @IsNotEmpty()
  invoiceNumber: string;
}
