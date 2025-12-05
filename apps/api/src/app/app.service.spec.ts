import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, any> = {
                nodeEnv: 'test',
                port: 3333,
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a message with environment info', () => {
    const result = service.getData();
    expect(result).toEqual({
      message: 'Hello API',
      environment: 'Running in test mode on port 3333',
    });
  });

  it('should use ConfigService to get environment values', () => {
    service.getData();
    expect(configService.get).toHaveBeenCalledWith('nodeEnv');
    expect(configService.get).toHaveBeenCalledWith('port');
  });
});
