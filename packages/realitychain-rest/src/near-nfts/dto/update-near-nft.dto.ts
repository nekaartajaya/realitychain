import { PartialType } from '@nestjs/mapped-types';
import { CreateNearNftDto } from './create-near-nft.dto';

export class UpdateNearNftDto extends PartialType(CreateNearNftDto) {}
