import { ObjectLiteral } from 'typeorm';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export class IPaginateOptions {
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
}

export interface IPaginationMeta<T> {
  data: T[];
  meta: IMeta;
}

export interface IMeta {
  itemCount: number;
  totalItems?: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
}

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginateOptions,
): Promise<IPaginationMeta<T>> {
  const take = options.limit;
  const skip = (options.page - 1) * options.limit;

  queryBuilder.skip(skip).take(take);
  const [list, totalItems] = await queryBuilder.getManyAndCount();

  return {
    data: list,
    meta: {
      itemCount: list.length,
      totalItems: totalItems,
      itemsPerPage: options.limit,
      totalPages: Math.ceil(totalItems / options.limit),
      currentPage: options.page,
    },
  };
}
