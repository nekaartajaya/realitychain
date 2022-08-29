const { connect, transactions, keyStores, utils } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
// NOTE: replace "example" with your accountId
const CONTRACT_NAME = "deploy-parcels-2.testnet";
const FT_CONTRACT = "dev-1660427718063-22239243730502";
const WHITELIST_ACCOUNT_ID = "rc-orang.testnet";
const ADMIN_ACCOUNT_ID = "agustinustheo.testnet";
const WASM_PATH = path.join(__dirname, "../out/main.wasm");

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
};

sendTransactions();

async function sendTransactions() {
  const near = await connect({ ...config, keyStore });
  const account = await near.account(WHITELIST_ACCOUNT_ID);

  for (let i = 0; i < 1100; i++) {
    await account.signAndSendTransaction({
      receiverId: CONTRACT_NAME,
      actions: [
        transactions.functionCall(
          "nft_create_series",
          Buffer.from(
            JSON.stringify({
              parcel_metadata: {
                world_id: `world_id_${i + 1}`,
                land_id: `land_id_${i + 1}`,
                size_x: 11,
                size_y: 11,
                pos_x: -120,
                pos_y: -120,
                land_type: "Building",
              },
              token_metadata: {
                title: `NFT Voucher #${i + 1}`,
                media:
                  "https://gateway.pinata.cloud/ipfs/QmS2XmnmZC1FEqJB7ZL5iLcQ1LmxUfzAqsQ4WFfer2af38",
                reference:
                  "https://gateway.pinata.cloud/ipfs/QmS2XmnmZC1FEqJB7ZL5iLcQ1LmxUfzAqsQ4WFfer2af38",
                copies: 1,
                issued_at: "",
                description: null,
                media_hash: null,
                expires_at: null,
                starts_at: null,
                updated_at: null,
                extra: null,
                reference_hash: null,
              },
              price: null,
              royalty: {
                [i <= 1000 ? WHITELIST_ACCOUNT_ID : ADMIN_ACCOUNT_ID]: 1000,
              },
            })
          ),
          30000000000000, // attached gas
          utils.format.parseNearAmount("2") // account creation costs 2 NEAR for storage
        ),
        transactions.functionCall(
          "nft_mint",
          Buffer.from(
            JSON.stringify({
              token_series_id: `${i + 1}`,
              receiver_id: i <= 1000 ? WHITELIST_ACCOUNT_ID : ADMIN_ACCOUNT_ID,
            })
          ),
          30000000000000, // attached gas
          utils.format.parseNearAmount("2") // account creation costs 2 NEAR for storage
        ),
      ],
    });

    console.log("Create and mint series Id: ", i + 1);
  }
}
