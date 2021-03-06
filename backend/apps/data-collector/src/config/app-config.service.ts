import { ConfigService } from '@kb/config';
import { AppConfig } from './app.config';
import { RmqOptions } from '@nestjs/microservices';
import { buildRmqOptions } from '@kb/rabbit';
import { appConfigValidationSchemaMap } from './validation.schema';
import { LaunchOptions } from 'puppeteer';
import { EmulatorOptions, FirestoreConfigService } from '@kb/firestore';

export class AppConfigService extends ConfigService<AppConfig> implements FirestoreConfigService {

  constructor(appConfig: AppConfig) {
    super(appConfig, appConfigValidationSchemaMap);
  }

  get projectId(): string {
    return this.config.firestore.projectId;
  }

  get clientEmail(): string {
    return this.config.firestore.clientEmail;
  }

  get clientKey(): string {
    return this.config.firestore.clientKey;
  }

  get emulator(): EmulatorOptions {
    return this.config.firestore.emulator;
  };

  get rawResultLimitationDays(): number {
    return this.config.rawSearchResultLimitationDays;
  }

  get saveRawResultAsJson(): boolean {
    return this.config.saveRawResultAsJson;
  }

  get takeScreenshotOnError(): boolean {
    return this.config.takeScreenshotOnError;
  }

  get puppeteerLaunchOptions(): LaunchOptions {
    const {
      executablePath,
      headlessModeOff,
      devtoolsTurnedOn,
      slowMoMs,
    } = this.config.puppeteer;
    return {
      executablePath,
      headless: !headlessModeOff,
      slowMo: slowMoMs,
      devtools: devtoolsTurnedOn,
    };
  }

  get enableStylesOnResultsPage(): boolean {
    return this.config.puppeteer.enableStylesOnResultsPage;
  }

  get dataCollectionNotificationsMqClient(): RmqOptions {
    return buildRmqOptions(this.config.dataCollectionNotificationsMqClient);
  }

  get dataToProcessMqClient(): RmqOptions {
    return buildRmqOptions(this.config.dataToProcessMqClient);
  }
}
