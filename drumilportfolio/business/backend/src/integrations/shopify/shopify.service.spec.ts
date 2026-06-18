import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyService } from './shopify.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ShopifyService', () => {
  let service: ShopifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopifyService,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            order: {
              create: jest.fn(),
            },
            product: {
              findUnique: jest.fn(),
            },
            inventory: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ShopifyService>(ShopifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
