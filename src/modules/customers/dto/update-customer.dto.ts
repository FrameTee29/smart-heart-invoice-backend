import { IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  organization: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  address: string;
}
