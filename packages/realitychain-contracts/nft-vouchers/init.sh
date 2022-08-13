#!/bin/bash
owner_input="../../../owner-address"
owner_acc=$( cat "$owner_input" )

ft_input="../../../fungible-token-address"
ft_acc=$( cat "$ft_input" )

parcel_input="../../../nft-parcel-address"
parcel_acc=$( cat "$parcel_input" )

voucher_input="../../../nft-voucher-address"
voucher_acc=$( cat "$voucher_input" )

params="{\"voucher_nft_id\": \"$voucher_acc\", \"parcel_nft_id\": \"$parcel_acc\", \"real_ft_id\": \"$ft_acc\", \"owner_id\": \"$owner_acc\", \"treasury_id\":\"$owner_acc\"}"

near call $voucher_acc new_default_meta "'$params'" --accountId $owner_acc
