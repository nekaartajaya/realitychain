export interface ContractConfig {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  appName: string;
  contractName: string;
}

// tslint:disable-next-line
export interface Nep141Config extends ContractConfig {}
// tslint:disable-next-line
export interface RcParcelsConfig extends ContractConfig {}
// tslint:disable-next-line
export interface RcVouchersConfig extends ContractConfig {}

export const testnetNep141Config: Nep141Config = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Reality Chain Testnet',
  contractName: `dev-1659971238392-58880293835351`,
};

export const rcParcelsTestnetConfig: RcParcelsConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Reality Chain Testnet',
  contractName: `dev-1660421623735-59109855259501`,
};

export const rcParcelsMainnetConfig: RcParcelsConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  appName: 'Reality Chain Mainnet',
  contractName: `ms-parcels.near`,
};

export const rcVouchersTestnetConfig: RcVouchersConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Reality Chain Testnet',
  contractName: `dev-1660421640610-21758553617704`,
};

export const rcVouchersMainnetConfig: RcVouchersConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  appName: 'Reality Chain Mainnet',
  contractName: `ms-vouchers.near`,
};

export const oneYoctoNear: string = '1';
