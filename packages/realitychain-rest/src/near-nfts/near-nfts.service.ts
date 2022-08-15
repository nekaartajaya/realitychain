import { Injectable } from '@nestjs/common';
import { CreateNearNftDto } from './dto/create-near-nft.dto';
import { UpdateNearNftDto } from './dto/update-near-nft.dto';

@Injectable()
export class NearNftsService {
  create(createNearNftDto: CreateNearNftDto) {
    return 'This action adds a new nearNft';
  }

  findAll() {
    return `This action returns all nearNfts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nearNft`;
  }

  update(id: number, updateNearNftDto: UpdateNearNftDto) {
    return `This action updates a #${id} nearNft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nearNft`;
  }
}
