import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '~/core/config/config.validator';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) { }

  public get<
    K extends keyof EnvironmentVariables,
    V extends EnvironmentVariables[K],
    >(key: K) {
    return this.configService.get<V>(key);
  }
}
