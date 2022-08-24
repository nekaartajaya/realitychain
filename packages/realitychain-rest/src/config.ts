import {
  rcParcelsTestnetConfig,
  rcParcelsMainnetConfig,
  testnetNep141Config,
} from '@realitychain/api';

export function getParcelsConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return rcParcelsMainnetConfig;
    case 'development':
    case 'testnet':
      return rcParcelsTestnetConfig;
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/near-nfts/config.ts.`,
      );
  }
}

export function getNep141Config(env) {
  switch (env) {
    case 'development':
    case 'testnet':
      return testnetNep141Config;
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/near-nfts/config.ts.`,
      );
  }
}
