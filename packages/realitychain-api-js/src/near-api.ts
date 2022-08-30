import { keyStores, Near, connect, Contract, WalletAccount, WalletConnection } from 'near-api-js';
import { ContractConfig, Nep141Config, ParasConfig, RcParcelsConfig } from './constant';
import { Nep141Contract, ParasContract, RcParcelsContract } from './interfaces';

export async function createNearConnection(keyStore: keyStores.KeyStore, config: ContractConfig): Promise<Near> {
  return await connect({
    headers: {},
    deps: {
      keyStore,
    },
    ...config,
  });
}

export function useAccount(connection: Near, config: ContractConfig): WalletConnection {
  return new WalletAccount(connection, config.contractName);
}

export async function parasContractWithAccountId(
  accountId: string,
  keyStore: keyStores.KeyStore,
  config: ParasConfig,
): Promise<ParasContract> {
  const connection = await createNearConnection(keyStore, config);
  const wallet = useAccount(connection, config);

  return (await new Contract(wallet.account(), config.contractName, {
    viewMethods: ['nft_get_series', 'nft_get_series_single', 'nft_token', 'nft_tokens_for_owner', 'get_owner'],
    changeMethods: [
      'nft_create_series',
      'nft_buy',
      'nft_mint',
      'nft_decrease_series_copies',
      'nft_set_series_non_mintable',
      'nft_set_series_price',
    ],
  })) as ParasContract;
}

export async function parcelsContractWithAccountId(
  accountId: string,
  keyStore: keyStores.KeyStore,
  config: RcParcelsConfig,
): Promise<RcParcelsContract> {
  const connection = await createNearConnection(keyStore, config);
  const wallet = useAccount(connection, config);

  return (await new Contract(wallet.account(), config.contractName, {
    viewMethods: [
      'nft_get_series',
      'nft_get_series_single',
      'nft_token',
      'nft_tokens_for_owner',
      'get_owner',
      'get_owner_by_id',
      'get_owner_by_series_id',
    ],
    changeMethods: [
      'nft_create_series',
      'nft_buy',
      'nft_mint',
      'nft_decrease_series_copies',
      'nft_set_series_non_mintable',
      'nft_set_series_price',
      'nft_set_series_parcel_metadata',
      'nft_set_series_metadata',
      'nft_set_series_metadata_extra',
    ],
  })) as RcParcelsContract;
}

export async function nep141ContractWithAccountId(
  accountId: string,
  keyStore: keyStores.KeyStore,
  config: Nep141Config,
): Promise<Nep141Contract> {
  const connection = await createNearConnection(keyStore, config);
  const wallet = useAccount(connection, config);

  return (await new Contract(wallet.account(), config.contractName, {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  })) as Nep141Contract;
}
