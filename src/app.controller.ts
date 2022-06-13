import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Guest } from './auth/decorators/auth.decorator'

@Guest()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping() {
    return this.appService.ping()
  }
}
