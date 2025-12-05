import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getData(): { message: string; environment: string } {
    const nodeEnv = this.configService.get<string>('nodeEnv');
    const port = this.configService.get<number>('port');

    return {
      message: 'Hello API',
      environment: `Running in ${nodeEnv} mode on port ${port}`,
    };
  }
}
