#!/bin/bash
NEAR_ENV=testnet near dev-deploy --wasmFile res/fungible_token.wasm --helperUrl https://near-contract-helper.onrender.com

input="./neardev/dev-account"
cat "$input" > "../../../../addresses/fungible-token-address"
