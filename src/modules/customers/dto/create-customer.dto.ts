import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  organization: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Transform((walletAddress) => String(walletAddress.value).toLocaleLowerCase())
  walletAddress: string;

  @IsNotEmpty()
  address: string;
}
