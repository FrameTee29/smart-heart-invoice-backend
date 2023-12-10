import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { IPaginateOptions } from 'src/shared/utils/paginate';

import { CustomersService } from './customers.service';

import { QueryCustomerDto } from './dto/query-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  //   @Get('invoke-msg')
  //   async getInvokeMsg(@Query('msg') msg: string) {
  //     return await this.customerService.sendMessage(msg);
  //   }

  @Get('/list')
  getAllCustomers(@Query() queryCustomer: QueryCustomerDto) {
    const options: IPaginateOptions = {
      page: queryCustomer.page,
      limit: queryCustomer.limit,
    };
    return this.customersService.getAllCustomer(options, queryCustomer);
  }

  @Get('/wallet-address/:walletAddress')
  getCustomerByWalletAddress(@Param('walletAddress') walletAddress: string) {
    return this.customersService.getCustomerByWalletAddress(walletAddress);
  }

  @Post('/create')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.createCustomer(createCustomerDto);
  }

  @Patch('/update/wallet-address/:walletAddress')
  updateCustomerByWalletAddress(
    @Param('walletAddress') walletAddress: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.updateCustomerByWalletAddress(walletAddress, updateCustomerDto);
  }
}
