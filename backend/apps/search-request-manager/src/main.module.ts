import { Module } from '@nestjs/common';
import { SearchRequestController } from './search-request.controller';
import { CoreModule } from './core/core.module';
import { AppModule } from './app/app.module';
import { ConfigModule } from '@kb/config';
import { getEnvironments } from './environments';
import { MainConfigService } from './main-config.service';
import { FaunaClientModule } from '@kb/fauna-client';

@Module({
  imports: [
    CoreModule,
    AppModule,
    ConfigModule.register(getEnvironments(), MainConfigService),
    FaunaClientModule.register(MainConfigService),
  ],
  controllers: [SearchRequestController],
  providers: [],
})
export class MainModule {
}
