import { Test, TestingModule } from '@nestjs/testing';
import { AmazonService } from './amazon.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AmazonService', () => {
  let service: AmazonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmazonService,
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

    service = module.get<AmazonService>(AmazonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
