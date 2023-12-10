import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @Transform((page) => Number(page.value))
  @IsNumber()
  @Min(1)
  readonly page: number = 1;

  @IsOptional()
  @Transform((limit) => Number(limit.value))
  @IsNumber()
  @Min(1)
  readonly limit: number = 10;

  @IsOptional()
  @Transform((search) => String(search.value))
  @IsString()
  search: string;

  @IsOptional()
  @Transform((key) => String(key.value))
  @IsString()
  key: string;
}
