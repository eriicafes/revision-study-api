import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './config/config.validator';
import { AppConfigService } from './services/config.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ validate: validateConfig }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService]
})
export class CoreModule { }
