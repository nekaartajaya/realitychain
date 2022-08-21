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
export interface Nep141Config extends ContractConfig {}
// tslint:disable-next-line
export interface ParasConfig extends ContractConfig {}
// tslint:disable-next-line
export interface RcParcelsConfig extends ContractConfig {}
// tslint:disable-next-line
export interface RcVouchersConfig extends ContractConfig {}

export const testnetNep141Config: Nep141Config = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Reality Chain Testnet',
  contractName: 'dev-1660427718063-22239243730502',
};

export const parasTestnetConfig: ParasConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Paras Testnet',
  contractName: 'paras-token-v2.testnet',
};

export const parasMainnetConfig: ParasConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  appName: 'Paras Mainnet',
  contractName: 'paras-token-v2.testnet',
};

export const rcParcelsTestnetConfig: RcParcelsConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Reality Chain Testnet',
  contractName: 'dev-1660564749556-64354322458995',
};

export const rcParcelsMainnetConfig: RcParcelsConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  appName: 'Reality Chain Mainnet',
  contractName: 'ms-parcels.near',
};

export const rcVouchersTestnetConfig: RcVouchersConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  appName: 'Reality Chain Testnet',
  contractName: 'dev-1660564774361-10073544118461',
};

export const rcVouchersMainnetConfig: RcVouchersConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  appName: 'Reality Chain Mainnet',
  contractName: 'ms-vouchers.near',
};

export const oneYoctoNear: string = '1';
