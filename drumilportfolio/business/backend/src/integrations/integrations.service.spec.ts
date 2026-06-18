import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationsService } from './integrations.service';
import { PrismaService } from '../prisma/prisma.service';
import { ShopifyService } from './shopify/shopify.service';
import { AmazonService } from './amazon/amazon.service';

describe('IntegrationsService', () => {
  let service: IntegrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationsService,
        {
          provide: PrismaService,
          useValue: {
            integration: {
              findMany: jest.fn(),
              upsert: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: ShopifyService,
          useValue: { syncOrders: jest.fn() },
        },
        {
          provide: AmazonService,
          useValue: { syncOrders: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<IntegrationsService>(IntegrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
