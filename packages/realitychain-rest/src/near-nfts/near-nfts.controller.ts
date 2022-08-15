import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NearNftsService } from './near-nfts.service';
import { CreateNearNftDto } from './dto/create-near-nft.dto';
import { UpdateNearNftDto } from './dto/update-near-nft.dto';

@Controller('near-nfts')
export class NearNftsController {
  constructor(private readonly nearNftsService: NearNftsService) {}

  @Post()
  create(@Body() createNearNftDto: CreateNearNftDto) {
    return this.nearNftsService.create(createNearNftDto);
  }

  @Get()
  findAll() {
    return this.nearNftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nearNftsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNearNftDto: UpdateNearNftDto) {
    return this.nearNftsService.update(+id, updateNearNftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nearNftsService.remove(+id);
  }
}
