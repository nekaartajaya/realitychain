#!/bin/bash
owner_input="../../../../addresses/dev/owner-address"
owner_acc=$( cat "$owner_input" )

ft_input="../../../../addresses/dev/fungible-token-address"
ft_acc=$( cat "$ft_input" )

parcel_input="../../../../addresses/dev/nft-parcel-address"
parcel_acc=$( cat "$parcel_input" )

params="{\"parcel_nft_id\": \"$parcel_acc\", \"real_ft_id\": \"$ft_acc\", \"owner_id\": \"$owner_acc\", \"treasury_id\":\"$owner_acc\"}"

near call $parcel_acc new_default_meta "'$params'" --accountId $owner_acc

near call $ft_acc storage_deposit '' --accountId $parcel_acc --amount 0.00125
