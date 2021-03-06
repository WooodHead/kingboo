import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { DataCollectionNotificationSender } from '../core/abstract/data-collection-notification.sender';
import { AppConfigService } from '../config/app-config.service';
import { RmqDataCollectionNotificationSender } from './rmq-data-collection-notification.sender';
import { DataToProcessSender } from '../core/abstract/data-to-process.sender';
import { RmqDataToProcessSender } from './rmq-data-to-process.sender';

@Module({
  providers: [
    {
      provide: DataCollectionNotificationSender,
      useFactory: (config: AppConfigService) => {
        const clientProxy = ClientProxyFactory.create(config.dataCollectionNotificationsMqClient);
        return new RmqDataCollectionNotificationSender(clientProxy);
      },
      inject: [AppConfigService],
    },
    {
      provide: DataToProcessSender,
      useFactory: (config: AppConfigService) => {
        const clientProxy = ClientProxyFactory.create(config.dataToProcessMqClient);
        return new RmqDataToProcessSender(clientProxy);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [
    DataCollectionNotificationSender,
    DataToProcessSender,
  ]
})
export class MqModule {}
