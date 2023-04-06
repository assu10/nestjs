import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  //host: process.env.DATABASE_HOST,
  port: 13306,
  username: 'root',
  //username: process.env.DATABASE_USERNAME,
  password: 'test',
  //password: process.env.DATABASE_PASSWORD,
  database: 'test',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/dist/migrations/**/*{.ts,.js}'],  // /dist/migrations 에 있는 파일 실행
  migrationsTableName: 'migrations',
});
