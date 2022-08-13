#!/bin/bash
owner_input="../../../owner-address"
owner_acc=$( cat "$owner_input" )

ft_input="../../../fungible-token-address"
ft_acc=$( cat "$ft_input" )

params="{\"owner_id\": \"$ft_acc\", \"total_supply\": \"1000000000000000000000000\", \"metadata\": { \"spec\": \"ft-1.0.0\", \"name\": \"Real FT Token V2.1\", \"symbol\": \"REAL21\", \"decimals\": 8 }}"

near call $ft_acc new "'$params'" --accountId $ft_acc
near call $ft_acc storage_deposit '' --accountId $owner_acc --amount 0.00125

params2="{\"receiver_id\": \"$owner_acc\", \"amount\": \"100000000000000000000000\"}"

near call $ft_acc ft_transfer "'$params2'" --accountId $ft_acc --amount 0.000000000000000000000001
