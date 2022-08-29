const { connect, transactions, keyStores, utils } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
// NOTE: replace "example" with your accountId
const CONTRACT_NAME = "deploy-parcels-2.testnet";
const FT_CONTRACT = "dev-1660427718063-22239243730502";
const WHITELIST_ACCOUNT_ID = "rc-orang.testnet";
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
  const contractAccount = await near.account(CONTRACT_NAME);

  const deploy = await contractAccount.signAndSendTransaction({
    receiverId: CONTRACT_NAME,
    actions: [transactions.deployContract(fs.readFileSync(WASM_PATH))],
  });

  console.log("\nDeployment result: ", JSON.stringify(deploy));

  try {
    const newArgs = {
      parcel_nft_id: CONTRACT_NAME,
      real_ft_id: FT_CONTRACT,
      owner_id: WHITELIST_ACCOUNT_ID,
      treasury_id: WHITELIST_ACCOUNT_ID,
    };
    const init = await account.signAndSendTransaction({
      receiverId: CONTRACT_NAME,
      actions: [
        transactions.functionCall(
          "new_default_meta",
          Buffer.from(JSON.stringify(newArgs)),
          30000000000000, // attached gas
          "0"
        ),
      ],
    });

    console.log("Initialization result: ", JSON.stringify(init));
  } catch (e) {
    console.log("\n Initialization already accomplished");
  }

  const ft = await contractAccount.signAndSendTransaction({
    receiverId: FT_CONTRACT,
    actions: [
      transactions.functionCall(
        "storage_deposit",
        Buffer.from(JSON.stringify({})),
        30000000000000, // attached gas
        utils.format.parseNearAmount("0.00125") // account creation costs 0.00125 NEAR for storage
      ),
    ],
  });

  console.log("\nStorage deposit result: ", JSON.stringify(ft));
}
