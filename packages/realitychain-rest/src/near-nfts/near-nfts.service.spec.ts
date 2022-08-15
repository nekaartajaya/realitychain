import { Test, TestingModule } from '@nestjs/testing';
import { NearNftsService } from './near-nfts.service';

describe('NearNftsService', () => {
  let service: NearNftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NearNftsService],
    }).compile();

    service = module.get<NearNftsService>(NearNftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
