#!/bin/bash
ft_input="../../../fungible-token-address"
ft_acc=$( cat "$ft_input" )

parcel_input="../../../nft-parcel-address"
parcel_acc=$( cat "$parcel_input" )

voucher_input="../../../nft-voucher-address"
voucher_acc=$( cat "$voucher_input" )

params="{\"voucher_nft_id\": \"$voucher_acc\", \"parcel_nft_id\": \"$parcel_acc\", \"real_ft_id\": \"$ft_acc\", \"owner_id\": \"agustinustheo.testnet\", \"treasury_id\":\"agustinustheo.testnet\"}"

near call $parcel_acc new_default_meta "'$params'" --accountId agustinustheo.testnet
