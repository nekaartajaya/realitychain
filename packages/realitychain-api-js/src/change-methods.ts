import { oneYoctoNear } from './constant';
import {
  FtStakeAndNftMintDto,
  NftBuyDto,
  NftCreateParcelSeriesDto,
  NftDecreaseSeriesCopiesDto,
  NftMintDto,
  RcParcelsContract,
  RcVouchersContract,
  TokenSeriesIdDto,
  TokenSeriesJson,
  NftCreateVoucherSeriesDto,
  Nep141Contract,
  StorageDepositDto,
  FtTransferCallDto,
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
  ParasContract,
  NftCreateUtilitySeriesDto,
} from './interfaces';

export async function nftCreateUtilitySeries(
  contract: ParasContract,
  args: NftCreateUtilitySeriesDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<TokenSeriesJson> {
  return (await contract.nft_create_series({
    args,
    gas,
    amount,
  })) as TokenSeriesJson;
}

export async function nftCreateParcelSeries(
  contract: RcParcelsContract,
  args: NftCreateParcelSeriesDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<TokenSeriesJson> {
  return (await contract.nft_create_series({
    args,
    gas,
    amount,
  })) as TokenSeriesJson;
}

export async function nftCreateVoucherSeries(
  contract: RcVouchersContract,
  args: NftCreateVoucherSeriesDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<TokenSeriesJson> {
  return (await contract.nft_create_series({
    args,
    gas,
    amount,
  })) as TokenSeriesJson;
}

export async function nftSetSeriesNonMintable(
  contract: RcParcelsContract | ParasContract,
  args: TokenSeriesIdDto,
  gas: number = 300000000000000,
): Promise<TokenSeriesJson> {
  return (await contract.nft_set_series_non_mintable({
    args,
    gas,
    amount: oneYoctoNear,
  })) as TokenSeriesJson;
}

export async function nftSetSeriesParcelMetadata(
  contract: RcParcelsContract,
  args: NftSetSeriesParcelMetadataDto,
  gas: number = 300000000000000,
): Promise<TokenSeriesJson> {
  return (await contract.nft_set_series_parcel_metadata({
    args,
    gas,
    amount: oneYoctoNear,
  })) as TokenSeriesJson;
}

export async function nftSetSeriesMetadata(
  contract: RcParcelsContract | RcVouchersContract,
  args: NftSetSeriesTokenMetadataDto,
  gas: number = 300000000000000,
): Promise<TokenSeriesJson> {
  return (await contract.nft_set_series_metadata({
    args,
    gas,
    amount: oneYoctoNear,
  })) as TokenSeriesJson;
}

export async function nftBuy(
  contract: RcParcelsContract | ParasContract,
  args: NftBuyDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<any> {
  return (await contract.nft_buy({
    args,
    gas,
    amount,
  })) as any;
}

export async function nftMint(
  contract: RcParcelsContract | ParasContract,
  args: NftMintDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<any> {
  return (await contract.nft_mint({
    args,
    gas,
    amount,
  })) as any;
}

export async function nftDecreaseSeriesCopies(
  contract: RcParcelsContract | RcVouchersContract | ParasContract,
  args: NftDecreaseSeriesCopiesDto,
  gas: number = 300000000000000,
): Promise<any> {
  return (await contract.nft_decrease_series_copies({
    args,
    gas,
    amount: oneYoctoNear,
  })) as any;
}

export async function ftStakeAndNftMint(
  contract: RcVouchersContract,
  args: FtStakeAndNftMintDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<any> {
  return (await contract.nft_mint({
    args,
    gas,
    amount,
  })) as any;
}

export async function ftTransferCall(
  contract: Nep141Contract,
  args: FtTransferCallDto,
  gas: number = 300000000000000,
): Promise<any> {
  return (await contract.ft_transfer_call({
    args,
    gas,
    amount: oneYoctoNear,
  })) as any;
}

export async function ftStorageDeposit(
  contract: Nep141Contract,
  args: StorageDepositDto,
  gas: number = 300000000000000,
  amount: string = '279370000000000000000000',
): Promise<any> {
  return (await contract.storage_deposit({
    args,
    gas,
    amount,
  })) as any;
}
