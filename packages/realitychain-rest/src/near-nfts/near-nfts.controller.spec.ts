import { Test, TestingModule } from '@nestjs/testing';
import { NearNftsController } from './near-nfts.controller';
import { NearNftsService } from './near-nfts.service';

describe('NearNftsController', () => {
  let controller: NearNftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NearNftsController],
      providers: [NearNftsService],
    }).compile();

    controller = module.get<NearNftsController>(NearNftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
