import { ConnectedWalletAccount, utils, WalletConnection } from 'near-api-js';
import { oneYoctoNear } from './constant';
import {
  NftBuyDto,
  NftCreateParcelSeriesDto,
  NftDecreaseSeriesCopiesDto,
  NftMintDto,
  RcParcelsContract,
  TokenSeriesIdDto,
  TokenSeriesJson,
  Nep141Contract,
  StorageDepositDto,
  FtTransferCallDto,
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
  ParasContract,
  NftCreateUtilitySeriesDto,
  NftSetSeriesTokenMetadataExtraDto,
} from './interfaces';
import BN from 'bn.js';
import { Action, createTransaction, functionCall } from 'near-api-js/lib/transaction';
import { PublicKey } from 'near-api-js/lib/utils';
import { baseDecode } from 'borsh';

export async function createNearTransaction({
  wallet,
  receiverId,
  actions,
  nonceOffset = 1,
}: {
  wallet: ConnectedWalletAccount,
  receiverId: string;
  actions: Action[];
  nonceOffset?: number;
}) {
  const localKey = await wallet.connection.signer.getPublicKey(
    wallet.accountId,
    wallet.connection.networkId
  );
  let accessKey = await wallet.accessKeyForTransaction(
    receiverId,
    actions,
    localKey
  );
  if (!accessKey) {
    throw new Error(
      `Cannot find matching key for transaction sent to ${receiverId}`
    );
  }

  const block = await wallet.connection.provider.block({ finality: 'final' });
  const blockHash = baseDecode(block.header.hash);

  const publicKey = PublicKey.from(accessKey.public_key);
  const nonce = accessKey.access_key.nonce + nonceOffset;

  return createTransaction(
    wallet.accountId,
    publicKey,
    receiverId,
    nonce,
    actions,
    blockHash
  );
}

export interface FunctionCallOptions {
  methodName: string;
  args?: object;
  gas?: string;
  amount?: string;
}

export interface Transaction {
  receiverId: string;
  functionCalls: FunctionCallOptions[];
}

export const getGas = (gas: string) =>
  gas ? new BN(gas) : new BN('100000000000000');
export const getAmount = (amount: string) =>
  amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');

export const executeMultipleTransactions = async (
  wallet: ConnectedWalletAccount,
  transactions: Transaction[],
  callbackUrl?: string
) => {
  const currentTransactions = await Promise.all(
    transactions.map((t, i) => {
      return createNearTransaction({
        wallet,
        receiverId: t.receiverId,
        nonceOffset: i + 1,
        actions: t.functionCalls.map((fc) =>
          functionCall(
            fc.methodName,
            fc.args,
            getGas(fc.gas),
            getAmount(fc.amount)
          )
        ),
      });
    })
  );

  return wallet.walletConnection.requestSignTransactions(currentTransactions, callbackUrl);
};

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
  contract: RcParcelsContract,
  args: NftSetSeriesTokenMetadataDto,
  gas: number = 300000000000000,
): Promise<TokenSeriesJson> {
  return (await contract.nft_set_series_metadata({
    args,
    gas,
    amount: oneYoctoNear,
  })) as TokenSeriesJson;
}

export async function nftSetSeriesMetadataExtra(
  contract: RcParcelsContract,
  args: NftSetSeriesTokenMetadataExtraDto,
  gas: number = 300000000000000,
): Promise<TokenSeriesJson> {
  return (await contract.nft_set_series_metadata_extra({
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
  contract: RcParcelsContract | ParasContract,
  args: NftDecreaseSeriesCopiesDto,
  gas: number = 300000000000000,
): Promise<any> {
  return (await contract.nft_decrease_series_copies({
    args,
    gas,
    amount: oneYoctoNear,
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
