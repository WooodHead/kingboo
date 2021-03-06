import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HotelService } from './hotel.service';
import { DbModule } from '../db/db.module';
import { MqModule } from '../mq/mq.module';
import { ConfigModule } from '@kb/config';
import { getEnvironments } from '../config/environments';
import { AppConfigService } from '../config/app-config.service';
import { ProcessingModule } from '../processing/processing.module';
import { FileManager } from '@kb/util/file.manager';
import { DataToProcessConsumer } from './data-to-process.consumer';
import { PriceCalculator } from './price.calculator';
import { HotelFactory } from './hotel.factory';
import { HotelRepository } from '../core/abstract/hotel.repository';
import { MessageProcessor } from '../processing/message.processor';
import { logger } from '../logger';

@Module({
  imports: [
    ConfigModule.register(getEnvironments(), { configClass: AppConfigService }),
    DbModule,
    MqModule,
    ProcessingModule,
  ],
  controllers: [
    AppController,
    DataToProcessConsumer,
  ],
  providers: [
    {
      provide: HotelService,
      useFactory: (configService: AppConfigService,
                   hotelRepository: HotelRepository,
                   messageProcessor: MessageProcessor) => {
        const fileManager = new FileManager(logger);
        const hotelFactory = new HotelFactory();
        const priceCalculator = new PriceCalculator();
        return new HotelService(
          configService,
          fileManager,
          hotelFactory,
          hotelRepository,
          messageProcessor,
          priceCalculator,
        );
      },
      inject: [AppConfigService, HotelRepository, MessageProcessor],
    },
  ],
})
export class AppModule {
}
