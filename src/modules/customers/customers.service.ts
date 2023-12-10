import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { IPaginateOptions, IPaginationMeta, paginate } from 'src/shared/utils/paginate';

import { QueryCustomerDto } from './dto/query-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async getAllCustomer(options: IPaginateOptions, queryCustomer: QueryCustomerDto): Promise<IPaginationMeta<Customer>> {
    const customerBuilder = await this.customerRepository.createQueryBuilder('customer');

    if (queryCustomer.walletAddress) {
      customerBuilder.andWhere('customer.walletAddress = :walletAddress', {
        walletAddress: queryCustomer.walletAddress,
      });
    }

    if (queryCustomer.key) {
      customerBuilder.andWhere(`customer.${queryCustomer.key} = :search`, {
        search: queryCustomer.search,
      });
    }

    return paginate<Customer>(customerBuilder, options);
  }

  async getCustomerByWalletAddress(walletAddress: string) {
    return await this.customerRepository.findOne({ where: { walletAddress: walletAddress } });
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: [{ walletAddress: createCustomerDto.walletAddress }],
    });

    if (customer) {
      throw new BadRequestException(`This wallet address ${customer.walletAddress} is already exist.`);
    }

    return await this.customerRepository.save(createCustomerDto);
  }

  async updateCustomerByWalletAddress(walletAddress: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { walletAddress: walletAddress.toLocaleLowerCase() },
    });

    if (!customer) {
      throw new NotFoundException(`Wallet Address ${walletAddress} is not found.`);
    }

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }
}
