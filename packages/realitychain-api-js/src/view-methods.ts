import { ParasContract, RcParcelsContract, TokenSeriesJson } from './interfaces';

export async function nftGetSeries(contract: RcParcelsContract | ParasContract): Promise<TokenSeriesJson[]> {
  return (await contract.nft_get_series()) as TokenSeriesJson[];
}

export async function nftTokensForOwner(
  contract: RcParcelsContract | ParasContract,
  accountId: string,
  fromIndex: string = "0",
  limit: number = 50,
): Promise<string[]> {
  return (await contract.nft_tokens_for_owner({
    account_id: accountId,
    from_index: fromIndex,
    limit,
  })) as string[];
}

export async function nftGetSeriesSingle(
  contract: RcParcelsContract | ParasContract,
  tokenSeriesId: string,
): Promise<TokenSeriesJson> {
  return (await contract.nft_get_series_single({
    token_series_id: tokenSeriesId,
  })) as TokenSeriesJson;
}

export async function getOwner(contract: RcParcelsContract | ParasContract, tokenId: string): Promise<TokenSeriesJson> {
  return (await contract.get_owner()) as TokenSeriesJson;
}

export async function getOwnerBySeriesId(contract: RcParcelsContract, tokenSeriesId: string): Promise<TokenSeriesJson> {
  return (await contract.get_owner_by_series_id({
    token_series_id: tokenSeriesId,
  })) as TokenSeriesJson;
}

export async function getOwnerById(contract: RcParcelsContract, tokenId: string): Promise<TokenSeriesJson> {
  return (await contract.get_owner_by_id({
    token_id: tokenId,
  })) as TokenSeriesJson;
}

export async function nftToken(contract: RcParcelsContract | ParasContract, tokenId: string): Promise<any> {
  return await contract.nft_token({
    token_id: tokenId,
  });
}
