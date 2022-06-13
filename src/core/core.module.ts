import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validateConfig } from './config/config.validator'
import { AppConfigService } from './services/config.service'
import { PrismaService } from './services/prisma.service'

@Global()
@Module({
  imports: [ConfigModule.forRoot({ validate: validateConfig })],
  providers: [AppConfigService, PrismaService],
  exports: [AppConfigService, PrismaService],
})
export class CoreModule {}
