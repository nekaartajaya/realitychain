import { ParasContract, RcParcelsContract, RcVouchersContract, TokenSeriesJson } from './interfaces';

export async function nftGetSeries(contract: RcParcelsContract | RcVouchersContract | ParasContract): Promise<TokenSeriesJson[]> {
  return (await contract.nft_get_series()) as TokenSeriesJson[];
}

export async function nftGetSeriesSingle(
  contract: RcParcelsContract | RcVouchersContract | ParasContract,
  tokenSeriesId: string,
): Promise<TokenSeriesJson> {
  return (await contract.nft_get_series_single({
    token_series_id: tokenSeriesId,
  })) as TokenSeriesJson;
}

export async function nftToken(contract: RcParcelsContract | RcVouchersContract | ParasContract, tokenId: string): Promise<any> {
  return await contract.nft_token({
    token_id: tokenId,
  });
}
