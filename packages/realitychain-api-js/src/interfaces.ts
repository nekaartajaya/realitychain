import { Contract } from 'near-api-js';

export interface StorageDepositDto {
  account_id: string;
  registration_only: string | null;
}

export interface FtTransferCallDto {
  receiver_id: string;
  amount: string;
  msg: string;
}

export interface ParcelMetadata {
  world_id: string;
  land_id: string;
  land_type: string;
  pos_x: number;
  pos_y: number;
  size_x: number;
  size_y: number;
}

export interface TokenMetadata {
  title: string | null;
  media: string | null;
  reference: string | null;
  issued_at: string | null;
  copies: number | null;
  description: string | null;
  media_hash: string | null;
  expires_at: string | null;
  starts_at: string | null;
  updated_at: string | null;
  extra: string | null;
  reference_hash: string | null;
}

export interface Token {
  token_id: string;
  owner_id: string;
  metadata: TokenMetadata;
  approved_account_ids: [x: string];
}

export interface ParasTokenMetadata {
  title: string | null;
  media: string | null;
  reference: string | null;
  issued_at: string | null;
  copies: number | null;
  description: string | null;
  media_hash: string | null;
  expires_at: string | null;
  starts_at: string | null;
  updated_at: string | null;
  extra: string | null;
  reference_hash: string | null;
  creator_id: string | null;
  collection_id: string | null;
  collection: string | null;
}

export interface ParasTokenSeries {
  _id: string | null;
  contract_id: string | null;
  token_series_id: string | null;
  creator_id: string;
  price: string | null;
  lowest_price: string | null;
  royalty: Royalty;
  metadata: ParasTokenMetadata;
  in_circulation: number;
  updated_at: number;
  has_price: string | null;
  transaction_fee: string | null;
  is_creator: boolean;
  categories: string[];
  view: number;
}

export interface Royalty {
  [x: string]: number;
}

export interface NftSetSeriesParcelMetadataDto {
  token_series_id: string;
  parcel_metadata: ParcelMetadata;
}

export interface NftSetSeriesTokenMetadataDto {
  token_series_id: string;
  metadata: TokenMetadata;
}

export interface NftSetSeriesTokenMetadataExtraDto {
  token_series_id: string;
  extra: string;
}

export interface NftCreateUtilitySeriesDto {
  token_metadata: TokenMetadata;
  price: any;
  royalty: Royalty;
}

export interface NftCreateParcelSeriesDto {
  parcel_metadata: ParcelMetadata;
  token_metadata: TokenMetadata;
  price: any;
  royalty: Royalty;
}

export interface NftCreateVoucherSeriesDto {
  token_metadata: TokenMetadata;
  price: any;
  royalty: Royalty;
}

export interface TokenSeriesJson {
  token_series_id: string;
  parcel_metadata: ParcelMetadata;
  metadata: TokenMetadata;
  creator_id: string;
  royalty: Royalty;
  transaction_fee: string;
}

export interface TokenSeriesIdDto {
  token_series_id: string;
}

export interface NftDecreaseSeriesCopiesDto {
  token_series_id: string;
  decrease_copies: string;
}

export interface NftBuyDto {
  token_series_id: string;
  receiver_id: string;
}

export interface NftMintDto {
  token_series_id: string;
  receiver_id: string;
}

export interface FtStakeAndNftMintDto {
  receiver_id: string;
  amount: string;
  token_series_id: string;
}

export interface Nep141Contract extends Contract {
  ft_balance_of;
  ft_transfer_call;
  storage_deposit;
}

export interface ParasContract extends Contract {
  nft_create_series: (params: {
    args: NftCreateUtilitySeriesDto;
    gas: number;
    amount: string;
  }) => Promise<TokenSeriesJson>;
  get_owner;
  nft_get_series;
  nft_tokens_for_owner;
  nft_buy;
  nft_mint;
  nft_decrease_series_copies;
  nft_set_series_non_mintable;
  nft_set_series_price;
  nft_get_series_single;
  nft_token;
  nft_set_series_metadata;
}

export interface RcParcelsContract extends Contract {
  new_default_meta;
  nft_create_series: (params: {
    args: NftCreateParcelSeriesDto;
    gas: number;
    amount: string;
  }) => Promise<TokenSeriesJson>;
  get_owner;
  get_owner_by_id;
  get_owner_by_series_id;
  nft_get_series;
  nft_tokens_for_owner;
  nft_buy;
  nft_mint;
  nft_decrease_series_copies;
  nft_set_series_non_mintable;
  nft_set_series_price;
  nft_get_series_single;
  nft_token;
  nft_set_series_metadata;
  nft_set_series_parcel_metadata;
  nft_set_series_metadata_extra;
}
