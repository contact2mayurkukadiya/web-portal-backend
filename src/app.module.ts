import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './modules/admin/admin.module';
import { AccountModule } from './modules/account/account.module';
import { DocumentModule } from './modules/document/document.module';
import { DeviceModule } from './modules/device/device.module';
import { HistoryExportModule } from './modules/history-export/history-export.module';
import { PackageModule } from './modules/package/package.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: process.env.POSTGRES_SYNCHRONIZE,
      autoLoadEntities: true,
      keepConnectionAlive: true,
      logging: false
    }),
    SharedModule,
    AuthModule,
    AdminModule,
    AccountModule,
    DocumentModule,
    DeviceModule,
    HistoryExportModule,
    PackageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
