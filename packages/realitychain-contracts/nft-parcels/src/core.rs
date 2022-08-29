use crate::metadata::ParcelMetadata;
use crate::*;

use near_sdk::{
    assert_one_yocto, env, near_bindgen, serde_json::json, AccountId, Balance, PromiseOrValue,
};

#[near_bindgen]
impl RealityParcelsContract {
    #[init]
    pub fn new_default_meta(
        parcel_nft_id: AccountId,
        real_ft_id: AccountId,
        owner_id: AccountId,
        treasury_id: AccountId,
    ) -> Self {
        Self::new(
            parcel_nft_id,
            real_ft_id,
            owner_id,
            treasury_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "Reality Chain Collectibles".to_string(),
                symbol: "REAL".to_string(),
                icon: Some(DATA_IMAGE_SVG_REAL_ICON.to_string()),
                base_uri: Some("https://ipfs.fleek.co/ipfs".to_string()),
                reference: None,
                reference_hash: None,
            },
            500,
        )
    }

    #[init]
    pub fn new(
        parcel_nft_id: AccountId,
        real_ft_id: AccountId,
        owner_id: AccountId,
        treasury_id: AccountId,
        metadata: NFTContractMetadata,
        current_fee: u16,
    ) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        Self {
            parcel_nft_id: parcel_nft_id,
            real_ft_id: real_ft_id,
            tokens: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::ParcelMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            owner_by_series_id: TreeMap::new(StorageKey::TokenSeriesById),
            token_series_by_id: UnorderedMap::new(StorageKey::TokenSeriesById),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            treasury_id: treasury_id,
            transaction_fee: TransactionFee {
                next_fee: None,
                start_time: None,
                current_fee,
            },
            market_data_transaction_fee: MarketDataTransactionFee {
                transaction_fee: UnorderedMap::new(StorageKey::MarketDataTransactionFee),
            },
            locked_amount: U128::from(0),
        }
    }

    #[init(ignore_state)]
    pub fn migrate() -> Self {
        let prev: RealityParcelsContractV2 = env::state_read().expect("ERR_NOT_INITIALIZED");
        assert_eq!(
            env::predecessor_account_id(),
            prev.tokens.owner_id,
            "RealityChain: Only owner"
        );

        RealityParcelsContract {
            parcel_nft_id: env::predecessor_account_id(),
            real_ft_id: env::predecessor_account_id(),
            tokens: prev.tokens,
            metadata: prev.metadata,
            owner_by_series_id: TreeMap::new(StorageKey::TokenSeriesById),
            token_series_by_id: prev.token_series_by_id,
            treasury_id: prev.treasury_id,
            transaction_fee: prev.transaction_fee,
            market_data_transaction_fee: MarketDataTransactionFee {
                transaction_fee: UnorderedMap::new(StorageKey::MarketDataTransactionFee),
            },
            locked_amount: U128::from(0),
        }
    }

    #[payable]
    pub fn set_transaction_fee(&mut self, next_fee: u16, start_time: Option<TimestampSec>) {
        assert_one_yocto();
        assert_eq!(
            env::predecessor_account_id(),
            self.tokens.owner_id,
            "RealityChain: Owner only"
        );

        assert!(
            next_fee < 10_000,
            "RealityChain: transaction fee is more than 10_000"
        );

        if let Some(start_time) = start_time {
            assert!(
                start_time > to_sec(env::block_timestamp()),
                "start_time is less than current block_timestamp"
            );
            self.transaction_fee.next_fee = Some(next_fee);
            self.transaction_fee.start_time = Some(start_time);
        } else {
            self.transaction_fee.current_fee = next_fee;
            self.transaction_fee.next_fee = None;
            self.transaction_fee.start_time = None;
        }
    }

    pub fn calculate_market_data_transaction_fee(
        &mut self,
        token_series_id: &TokenSeriesId,
    ) -> u128 {
        if let Some(transaction_fee) = self
            .market_data_transaction_fee
            .transaction_fee
            .get(token_series_id)
        {
            return transaction_fee;
        }

        // fallback to default transaction fee
        self.calculate_current_transaction_fee()
    }

    pub fn calculate_current_transaction_fee(&mut self) -> u128 {
        let transaction_fee: &TransactionFee = &self.transaction_fee;
        if transaction_fee.next_fee.is_some()
            && to_sec(env::block_timestamp()) >= transaction_fee.start_time.unwrap()
        {
            self.transaction_fee.current_fee = transaction_fee.next_fee.unwrap();
            self.transaction_fee.next_fee = None;
            self.transaction_fee.start_time = None;
        }
        self.transaction_fee.current_fee as u128
    }

    pub fn get_transaction_fee(&self) -> &TransactionFee {
        &self.transaction_fee
    }

    pub fn get_market_data_transaction_fee(&self, token_series_id: &TokenId) -> u128 {
        if let Some(transaction_fee) = self
            .market_data_transaction_fee
            .transaction_fee
            .get(token_series_id)
        {
            return transaction_fee;
        }
        // fallback to default transaction fee
        self.transaction_fee.current_fee as u128
    }

    // Treasury
    #[payable]
    pub fn set_treasury(&mut self, treasury_id: AccountId) {
        assert_one_yocto();
        assert_eq!(
            env::predecessor_account_id(),
            self.tokens.owner_id,
            "RealityChain: Owner only"
        );
        self.treasury_id = treasury_id;
    }

    // CUSTOM

    #[payable]
    pub fn nft_create_series(
        &mut self,
        creator_id: Option<AccountId>,
        parcel_metadata: ParcelMetadata,
        token_metadata: TokenMetadata,
        price: Option<U128>,
        royalty: Option<HashMap<AccountId, u32>>,
    ) -> TokenSeriesJson {
        let initial_storage_usage = env::storage_usage();
        let caller_id = env::predecessor_account_id();

        if creator_id.is_some() {
            assert_eq!(
                creator_id.unwrap(),
                caller_id,
                "RealityChain: Caller is not creator_id"
            );
        }

        let token_series_id = format!("{}", (self.token_series_by_id.len() + 1));

        assert!(
            self.token_series_by_id.get(&token_series_id).is_none(),
            "RealityChain: duplicate token_series_id"
        );

        let title = token_metadata.title.clone();
        assert!(
            title.is_some(),
            "RealityChain: token_metadata.title is required"
        );

        let mut new_token_metadata = token_metadata;
        new_token_metadata.copies = Some(1);

        let mut total_perpetual = 0;
        let mut total_accounts = 0;
        let royalty_res: HashMap<AccountId, u32> = if let Some(royalty) = royalty {
            for (k, v) in royalty.iter() {
                if !is_valid_account_id(k.as_bytes()) {
                    env::panic_str("Not valid account_id for royalty".as_ref());
                };
                total_perpetual += *v;
                total_accounts += 1;
            }
            royalty
        } else {
            HashMap::new()
        };

        assert!(
            total_accounts <= 10,
            "RealityChain: royalty exceeds 10 accounts"
        );

        assert!(
            total_perpetual <= 9000,
            "Reality Chain Exceeds maximum royalty -> 9000",
        );

        let price_res: Option<u128> = if let Some(price) = price {
            assert!(
                price.0 < MAX_PRICE,
                "RealityChain: price higher than {}",
                MAX_PRICE
            );
            Some(price.0)
        } else {
            None
        };

        self.token_series_by_id.insert(
            &token_series_id,
            &TokenSeries {
                parcel_metadata: parcel_metadata.clone(),
                metadata: new_token_metadata.clone(),
                creator_id: caller_id.clone(),
                tokens: UnorderedSet::new(
                    StorageKey::TokensBySeriesInner {
                        token_series: token_series_id.clone(),
                    }
                    .try_to_vec()
                    .unwrap(),
                ),
                price: price_res,
                is_mintable: true,
                royalty: royalty_res.clone(),
            },
        );

        // set market data transaction fee
        let current_transaction_fee = self.calculate_current_transaction_fee();
        self.market_data_transaction_fee
            .transaction_fee
            .insert(&token_series_id, &current_transaction_fee);

        env::log_str(
            &json!({
                "type": "nft_create_series",
                "params": {
                    "token_series_id": token_series_id.clone(),
                    "parcel_metadata": parcel_metadata,
                    "token_metadata": new_token_metadata,
                    "creator_id": caller_id,
                    "price": price,
                    "royalty": royalty_res,
                    "transaction_fee": &current_transaction_fee.to_string()
                }
            })
            .to_string(),
        );

        refund_deposit(env::storage_usage() - initial_storage_usage, 0);

        TokenSeriesJson {
            token_series_id: token_series_id.clone(),
            metadata: new_token_metadata,
            parcel_metadata,
            creator_id: caller_id,
            royalty: royalty_res,
            transaction_fee: Some(current_transaction_fee.into()),
        }
    }

    #[payable]
    pub fn nft_set_series_price(
        &mut self,
        token_series_id: TokenSeriesId,
        price: Option<U128>,
    ) -> Option<U128> {
        assert_one_yocto();

        let mut token_series = self
            .token_series_by_id
            .get(&token_series_id)
            .expect("Token series not exist");
        assert_eq!(
            env::predecessor_account_id(),
            token_series.creator_id,
            "RealityChain: Creator only"
        );

        assert!(
            token_series.is_mintable,
            "RealityChain: token series is not mintable"
        );

        if let Some(price) = price {
            assert!(
                price.0 < MAX_PRICE,
                "RealityChain: price higher than {}",
                MAX_PRICE
            );
            token_series.price = Some(price.0);
        } else {
            token_series.price = None;
        }

        self.token_series_by_id
            .insert(&token_series_id, &token_series);

        // set market data transaction fee
        let current_transaction_fee = self.calculate_current_transaction_fee();
        self.market_data_transaction_fee
            .transaction_fee
            .insert(&token_series_id, &current_transaction_fee);

        env::log_str(
            &json!({
                "type": "nft_set_series_price",
                "params": {
                    "token_series_id": token_series_id,
                    "price": price,
                    "transaction_fee": current_transaction_fee.to_string()
                }
            })
            .to_string(),
        );

        price
    }

    #[payable]
    pub fn nft_set_series_parcel_metadata(
        &mut self,
        token_series_id: TokenSeriesId,
        parcel_metadata: ParcelMetadata,
    ) -> TokenSeriesJson {
        assert_one_yocto();
        let caller_id = env::predecessor_account_id();

        let mut token_series = self
            .token_series_by_id
            .get(&token_series_id)
            .expect("Token series not exist");

        assert!(
            caller_id.clone() == token_series.creator_id || Some(caller_id.clone()) == self.owner_by_series_id.get(&token_series_id),
            "RealityChain: Creator or Owner only"
        );

        assert!(
            token_series.is_mintable,
            "RealityChain: token series is not mintable"
        );

        token_series.parcel_metadata = parcel_metadata.clone();

        self.token_series_by_id
            .insert(&token_series_id, &token_series);

        // set market data transaction fee
        let current_transaction_fee = self.calculate_current_transaction_fee();
        self.market_data_transaction_fee
            .transaction_fee
            .insert(&token_series_id, &current_transaction_fee);

        env::log_str(
            &json!({
                "type": "nft_set_series_parcel_metadata",
                "params": {
                    "token_series_id": token_series_id.clone(),
                    "token_metadata": token_series.metadata,
                    "creator_id": caller_id,
                    "price": token_series.price.unwrap_or(0).to_string(),
                    "royalty": token_series.royalty,
                    "transaction_fee": &current_transaction_fee.to_string()
                }
            })
            .to_string(),
        );

        TokenSeriesJson {
            token_series_id: token_series_id.clone(),
            metadata: token_series.metadata,
            parcel_metadata,
            creator_id: caller_id,
            royalty: token_series.royalty,
            transaction_fee: Some(current_transaction_fee.into()),
        }
    }

    #[payable]
    pub fn nft_set_series_metadata(
        &mut self,
        token_series_id: TokenSeriesId,
        metadata: TokenMetadata,
    ) -> TokenSeriesJson {
        assert_one_yocto();
        let caller_id = env::predecessor_account_id();

        let mut token_series = self
            .token_series_by_id
            .get(&token_series_id)
            .expect("Token series not exist");

        assert!(
            caller_id.clone() == token_series.creator_id || Some(caller_id.clone()) == self.owner_by_series_id.get(&token_series_id),
            "RealityChain: Creator or Owner only"
        );

        assert!(
            token_series.is_mintable,
            "RealityChain: token series is not mintable"
        );

        let copies = token_series.metadata.copies.clone();
        assert!(
            copies.is_some(),
            "RealityChain: token_series.metadata.copies is required"
        );

        token_series.metadata = metadata.clone();

        self.token_series_by_id
            .insert(&token_series_id, &token_series);

        // set market data transaction fee
        let current_transaction_fee = self.calculate_current_transaction_fee();
        self.market_data_transaction_fee
            .transaction_fee
            .insert(&token_series_id, &current_transaction_fee);

        env::log_str(
            &json!({
                "type": "nft_set_series_metadata",
                "params": {
                    "token_series_id": token_series_id.clone(),
                    "parcel_metadata": token_series.parcel_metadata,
                    "creator_id": caller_id,
                    "price": token_series.price.unwrap_or(0).to_string(),
                    "royalty": token_series.royalty,
                    "transaction_fee": &current_transaction_fee.to_string()
                }
            })
            .to_string(),
        );

        TokenSeriesJson {
            token_series_id: token_series_id.clone(),
            metadata,
            parcel_metadata: token_series.parcel_metadata,
            creator_id: caller_id,
            royalty: token_series.royalty,
            transaction_fee: Some(current_transaction_fee.into()),
        }
    }

    #[payable]
    pub fn nft_burn(&mut self, token_id: TokenId) {
        assert_one_yocto();

        let owner_id = self.tokens.owner_by_id.get(&token_id).unwrap();
        assert_eq!(owner_id, env::predecessor_account_id(), "Token owner only");

        if let Some(next_approval_id_by_id) = &mut self.tokens.next_approval_id_by_id {
            next_approval_id_by_id.remove(&token_id);
        }

        if let Some(approvals_by_id) = &mut self.tokens.approvals_by_id {
            approvals_by_id.remove(&token_id);
        }

        if let Some(tokens_per_owner) = &mut self.tokens.tokens_per_owner {
            let mut token_ids = tokens_per_owner.get(&owner_id).unwrap();
            token_ids.remove(&token_id);
            tokens_per_owner.insert(&owner_id, &token_ids);
        }

        if let Some(token_metadata_by_id) = &mut self.tokens.token_metadata_by_id {
            token_metadata_by_id.remove(&token_id);
        }

        self.tokens.owner_by_id.remove(&token_id);

        let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
        let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
        self.owner_by_series_id.remove(&token_series_id);

        NearEvent::log_nft_burn(owner_id.to_string(), vec![token_id], None, None);
    }

    // CUSTOM VIEWS

    pub fn nft_get_series_single(&self, token_series_id: TokenSeriesId) -> TokenSeriesJson {
        let token_series = self
            .token_series_by_id
            .get(&token_series_id)
            .expect("Series does not exist");
        let current_transaction_fee = self.get_market_data_transaction_fee(&token_series_id);
        TokenSeriesJson {
            token_series_id: token_series_id.clone(),
            metadata: token_series.metadata,
            parcel_metadata: token_series.parcel_metadata,
            creator_id: token_series.creator_id,
            royalty: token_series.royalty,
            transaction_fee: Some(current_transaction_fee.into()),
        }
    }

    pub fn nft_get_series_format(self) -> (char, &'static str, &'static str) {
        (TOKEN_DELIMETER, TITLE_DELIMETER, EDITION_DELIMETER)
    }

    pub fn nft_get_series_price(self, token_series_id: TokenSeriesId) -> Option<U128> {
        let price = self.token_series_by_id.get(&token_series_id).unwrap().price;
        price.map(U128::from)
    }

    pub fn nft_get_series(
        &self,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<TokenSeriesJson> {
        let start_index: u128 = from_index.map(From::from).unwrap_or_default();
        assert!(
            (self.token_series_by_id.len() as u128) > start_index,
            "Out of bounds, please use a smaller from_index."
        );
        let limit = limit.map(|v| v as usize).unwrap_or(usize::MAX);
        assert_ne!(limit, 0, "Cannot provide limit of 0.");

        self.token_series_by_id
            .iter()
            .skip(start_index as usize)
            .take(limit)
            .map(|(token_series_id, token_series)| TokenSeriesJson {
                token_series_id: token_series_id.clone(),
                metadata: token_series.metadata,
                parcel_metadata: token_series.parcel_metadata,
                creator_id: token_series.creator_id,
                royalty: token_series.royalty,
                transaction_fee: None,
            })
            .collect()
    }

    pub fn nft_supply_for_series(&self, token_series_id: TokenSeriesId) -> U64 {
        self.token_series_by_id
            .get(&token_series_id)
            .expect("Token series not exist")
            .tokens
            .len()
            .into()
    }

    pub fn nft_tokens_by_series(
        &self,
        token_series_id: TokenSeriesId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Token> {
        let start_index: u128 = from_index.map(From::from).unwrap_or_default();
        let tokens = self
            .token_series_by_id
            .get(&token_series_id)
            .unwrap()
            .tokens;
        assert!(
            (tokens.len() as u128) > start_index,
            "Out of bounds, please use a smaller from_index."
        );
        let limit = limit.map(|v| v as usize).unwrap_or(usize::MAX);
        assert_ne!(limit, 0, "Cannot provide limit of 0.");

        tokens
            .iter()
            .skip(start_index as usize)
            .take(limit)
            .map(|token_id| self.nft_token(token_id).unwrap())
            .collect()
    }

    pub fn nft_token(&self, token_id: TokenId) -> Option<Token> {
        let owner_id = self.tokens.owner_by_id.get(&token_id)?;
        let approved_account_ids = self
            .tokens
            .approvals_by_id
            .as_ref()
            .and_then(|by_id| by_id.get(&token_id).or_else(|| Some(HashMap::new())));

        // CUSTOM (switch metadata for the token_series metadata)
        let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
        let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
        let series_metadata = self
            .token_series_by_id
            .get(&token_series_id)
            .unwrap()
            .metadata;

        let mut token_metadata = self
            .tokens
            .token_metadata_by_id
            .as_ref()
            .unwrap()
            .get(&token_id)
            .unwrap();

        token_metadata.title = Some(format!(
            "{}{}{}",
            series_metadata.title.unwrap(),
            TITLE_DELIMETER,
            token_id_iter.next().unwrap()
        ));

        token_metadata.reference = series_metadata.reference;
        token_metadata.media = series_metadata.media;
        token_metadata.copies = series_metadata.copies;
        token_metadata.extra = series_metadata.extra;

        Some(Token {
            token_id,
            owner_id,
            metadata: Some(token_metadata),
            approved_account_ids,
        })
    }

    // CUSTOM core standard repeated here because no macro below

    pub fn nft_transfer_unsafe(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    ) {
        let sender_id = env::predecessor_account_id();
        let (previous_owner_id, _) = self.tokens.internal_transfer(
            &sender_id,
            &receiver_id.clone(),
            &token_id.clone(),
            approval_id,
            memo.clone(),
        );

        let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
        let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
        self.owner_by_series_id.insert(&token_series_id, &receiver_id);

        let authorized_id: Option<AccountId> = if sender_id != previous_owner_id {
            Some(sender_id)
        } else {
            None
        };

        let authorized_id_str: Option<String> = if let Some(id) = authorized_id {
            Some(id.to_string())
        } else {
            Some("".to_string())
        };

        NearEvent::log_nft_transfer(
            previous_owner_id.to_string(),
            receiver_id.to_string(),
            vec![token_id],
            memo,
            authorized_id_str,
        );
    }

    #[payable]
    pub fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    ) {
        let sender_id = env::predecessor_account_id();
        let previous_owner_id = self
            .tokens
            .owner_by_id
            .get(&token_id)
            .expect("Token not found");
        let receiver_id_str = receiver_id.to_string();
        self.tokens
            .nft_transfer(receiver_id.clone(), token_id.clone(), approval_id, memo.clone());

        let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
        let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
        self.owner_by_series_id.insert(&token_series_id, &receiver_id);

        let authorized_id: Option<AccountId> = if sender_id != previous_owner_id {
            Some(sender_id)
        } else {
            None
        };

        let authorized_id_str: Option<String> = if let Some(id) = authorized_id {
            Some(id.to_string())
        } else {
            Some("".to_string())
        };

        NearEvent::log_nft_transfer(
            previous_owner_id.to_string(),
            receiver_id_str,
            vec![token_id],
            memo,
            authorized_id_str,
        );
    }

    #[payable]
    pub fn nft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<bool> {
        assert_one_yocto();
        let sender_id = env::predecessor_account_id();
        let (previous_owner_id, old_approvals) = self.tokens.internal_transfer(
            &sender_id,
            &receiver_id,
            &token_id,
            approval_id,
            memo.clone(),
        );

        let authorized_id: Option<AccountId> = if sender_id != previous_owner_id {
            Some(sender_id.clone())
        } else {
            None
        };

        let authorized_id_str: Option<String> = if let Some(id) = authorized_id {
            Some(id.to_string())
        } else {
            Some("".to_string())
        };

        NearEvent::log_nft_transfer(
            previous_owner_id.clone().to_string(),
            receiver_id.to_string(),
            vec![token_id.clone()],
            memo,
            authorized_id_str,
        );

        // Initiating receiver's call and the callback
        ext_non_fungible_token_receiver::ext(self.parcel_nft_id.clone())
            .nft_on_transfer(sender_id, previous_owner_id.clone(), token_id.clone(), msg)
            .then(
                ext_self::ext(self.parcel_nft_id.clone()).nft_resolve_transfer(
                    previous_owner_id,
                    receiver_id.into(),
                    token_id,
                    old_approvals,
                ),
            )
            .into()
    }

    // CUSTOM enumeration standard modified here because no macro below

    pub fn nft_total_supply(&self) -> U128 {
        (self.tokens.owner_by_id.len() as u128).into()
    }

    pub fn nft_tokens(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<Token> {
        // Get starting index, whether or not it was explicitly given.
        // Defaults to 0 based on the spec:
        // https://nomicon.io/Standards/NonFungibleToken/Enumeration.html#interface
        let start_index: u128 = from_index.map(From::from).unwrap_or_default();
        assert!(
            (self.tokens.owner_by_id.len() as u128) > start_index,
            "Out of bounds, please use a smaller from_index."
        );
        let limit = limit.map(|v| v as usize).unwrap_or(usize::MAX);
        assert_ne!(limit, 0, "Cannot provide limit of 0.");
        self.tokens
            .owner_by_id
            .iter()
            .skip(start_index as usize)
            .take(limit)
            .map(|(token_id, _)| self.nft_token(token_id).unwrap())
            .collect()
    }

    pub fn nft_supply_for_owner(self, account_id: AccountId) -> U128 {
        let tokens_per_owner = self.tokens.tokens_per_owner.expect(
            "Could not find tokens_per_owner when calling a method on the enumeration standard.",
        );
        tokens_per_owner
            .get(&account_id)
            .map(|account_tokens| U128::from(account_tokens.len() as u128))
            .unwrap_or(U128(0))
    }

    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Token> {
        let tokens_per_owner = self.tokens.tokens_per_owner.as_ref().expect(
            "Could not find tokens_per_owner when calling a method on the enumeration standard.",
        );
        let token_set = if let Some(token_set) = tokens_per_owner.get(&account_id) {
            token_set
        } else {
            return vec![];
        };
        let limit = limit.map(|v| v as usize).unwrap_or(usize::MAX);
        assert_ne!(limit, 0, "Cannot provide limit of 0.");
        let start_index: u128 = from_index.map(From::from).unwrap_or_default();
        assert!(
            token_set.len() as u128 > start_index,
            "Out of bounds, please use a smaller from_index."
        );
        token_set
            .iter()
            .skip(start_index as usize)
            .take(limit)
            .map(|token_id| self.nft_token(token_id).unwrap())
            .collect()
    }

    pub fn nft_payout(&self, token_id: TokenId, balance: U128, max_len_payout: u32) -> Payout {
        let owner_id = self.tokens.owner_by_id.get(&token_id).expect("No token id");
        let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
        let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
        let royalty = self
            .token_series_by_id
            .get(&token_series_id)
            .expect("no type")
            .royalty;

        assert!(
            royalty.len() as u32 <= max_len_payout,
            "Market cannot payout to that many receivers"
        );

        let balance_u128: u128 = balance.into();

        let mut payout: Payout = Payout {
            payout: HashMap::new(),
        };
        let mut total_perpetual = 0;

        for (k, v) in royalty.iter() {
            if *k != owner_id {
                let key = k.clone();
                payout
                    .payout
                    .insert(key, royalty_to_payout(*v, balance_u128));
                total_perpetual += *v;
            }
        }
        payout.payout.insert(
            owner_id,
            royalty_to_payout(10000 - total_perpetual, balance_u128),
        );
        payout
    }

    #[payable]
    pub fn nft_transfer_payout(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        balance: Option<U128>,
        max_len_payout: Option<u32>,
    ) -> Option<Payout> {
        assert_one_yocto();

        let sender_id = env::predecessor_account_id();
        // Transfer
        let previous_token = self.nft_token(token_id.clone()).expect("no token");
        self.tokens
            .nft_transfer(receiver_id.clone(), token_id.clone(), approval_id, None);
            
        let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
        let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
        self.owner_by_series_id.insert(&token_series_id, &receiver_id);

        // Payout calculation
        let previous_owner_id = previous_token.owner_id;
        let mut total_perpetual = 0;
        let payout = if let Some(balance) = balance {
            let balance_u128: u128 = u128::from(balance);
            let mut payout: Payout = Payout {
                payout: HashMap::new(),
            };

            let mut token_id_iter = token_id.split(TOKEN_DELIMETER);
            let token_series_id = token_id_iter.next().unwrap().parse().unwrap();
            let royalty = self
                .token_series_by_id
                .get(&token_series_id)
                .expect("no type")
                .royalty;

            assert!(
                royalty.len() as u32 <= max_len_payout.unwrap(),
                "Market cannot payout to that many receivers"
            );
            for (k, v) in royalty.iter() {
                let key = k.clone();
                if key != previous_owner_id {
                    payout
                        .payout
                        .insert(key, royalty_to_payout(*v, balance_u128));
                    total_perpetual += *v;
                }
            }

            assert!(total_perpetual <= 10000, "Total payout overflow");

            payout.payout.insert(
                previous_owner_id.clone(),
                royalty_to_payout(10000 - total_perpetual, balance_u128),
            );
            Some(payout)
        } else {
            None
        };

        let authorized_id: Option<AccountId> = if sender_id != previous_owner_id {
            Some(sender_id)
        } else {
            None
        };

        let authorized_id_str: Option<String> = if let Some(id) = authorized_id {
            Some(id.to_string())
        } else {
            Some("".to_string())
        };

        NearEvent::log_nft_transfer(
            previous_owner_id.to_string(),
            receiver_id.to_string(),
            vec![token_id],
            None,
            authorized_id_str,
        );

        payout
    }

    pub fn get_owner(&self) -> AccountId {
        self.tokens.owner_id.clone()
    }
}

fn royalty_to_payout(a: u32, b: Balance) -> U128 {
    U128(a as u128 * b / 10_000u128)
}
