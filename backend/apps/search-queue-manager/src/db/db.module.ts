import { Module } from '@nestjs/common';
import { MongoSearchRequestRepository } from './mongo-search-request.repository';
import { SearchRequestRepository } from '../core/abstract/search-request.repository';
import { AppConfigService } from '../config/app-config.service';
import { getModelToken, MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { SearchRequestSchema, SearchRequestSchemaKey } from './schema/search-request.schema';
import { Model } from 'mongoose';
import { SearchRequestDocument } from './interface/searchRequest.document';
import { SearchRequestDocumentMapper } from './mapper/search-request-document.mapper';

@Module({
  imports: [
    // FaunaClientModule.register({ configClass: AppConfigService }),
    MongooseModule.forRootAsync({
      useFactory: async (config: AppConfigService) => ({
        uri: config.mongoAddress,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as MongooseModuleOptions),
      inject: [AppConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: SearchRequestSchemaKey,
        schema: SearchRequestSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: SearchRequestRepository,
      useFactory: (searchRequestModel: Model<SearchRequestDocument>) => {
        const mapper = new SearchRequestDocumentMapper();
        return new MongoSearchRequestRepository(mapper, searchRequestModel);
      },
      inject: [getModelToken(SearchRequestSchemaKey)],
    },
  ],
  exports: [
    SearchRequestRepository,
  ],
})
export class DbModule {

}