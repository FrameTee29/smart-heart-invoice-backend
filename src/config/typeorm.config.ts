import { DataSource, DataSourceOptions } from 'typeorm';

import configuration from './default.config';

export const typeOrmOptions: DataSourceOptions = configuration().database;

console.log('TypeOrm=>');

const typeOrmSource = new DataSource(typeOrmOptions);
export default typeOrmSource;
