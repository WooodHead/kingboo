import * as Joi from '@hapi/joi';
import { SchemaMap } from '@hapi/joi';
import { AppConfig } from './app.config';
import { RabbitOptions, rabbitValidationSchemaMap } from '@kb/rabbit';
import { MongoOptions } from '@kb/mongo/interface/mongo-options';
import { mongoValidationSchemaMap } from '@kb/mongo/validation.schema';

export const appConfigValidationSchemaMap: SchemaMap<AppConfig> = {
  mongo: Joi.object<MongoOptions>(mongoValidationSchemaMap).required(),
  collectingScenarioMqClient: Joi.object<RabbitOptions>(rabbitValidationSchemaMap).required(),
  userNotificationsMqClient: Joi.object<RabbitOptions>(rabbitValidationSchemaMap).required(),
};
