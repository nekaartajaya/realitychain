#!/bin/bash
NEAR_ENV=testnet near dev-deploy --wasmFile ../out/main.wasm --helperUrl https://near-contract-helper.onrender.com

input="./neardev/dev-account"
cat "$input" > "../../../../addresses/dev/nft-parcel-address"
