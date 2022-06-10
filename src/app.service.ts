import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  public ping() {
    return { ping: 'pong' }
  }
}
