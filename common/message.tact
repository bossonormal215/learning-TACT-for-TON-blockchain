// =====================================
// Standard Jettom messages
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
// =====================================
message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    custom_payload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?;
}

// transfer tokens between jetton wallets or master contract
message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    responseDestination: Address;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?;
}

message(0x7362d09c) TransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Cell?;
}

message(0x59f07bc) Burn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    forwardPayload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    // the owner property seems redundant,
    // the owner can be extracted from the sender of the message.
    owner: Address;
    responseDestination: Address?;
}

message(0xd53276db) Excesses {
    queryId: Int as uint64;
}

// -------------------------------------
// NFT standard messages
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
// -------------------------------------

message(0x693d3950) GetRoyaltyParams {
    queryId: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    queryId: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as coins;
    destination: Address;
}

// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer
message(0x5fcc3d14) NFTTransfer {
    queryId: Int as uint64;
    // newOwner is address of the new owner of the NFT item.
    newOwner: Address;
    // responseDestination is the address where to send a response
    // with confirmation of a successful transfer and the rest of
    // the incoming message coins.
    responseDestination: Address;
    // customPayload is the optional custom data.
    customPayload: Cell?;
    // forwardAmount is the amount of nanotons to be sent to the new owner.
    forwardAmount: Int as coins;
    // forwardPayload is the optional custom data that should be
    // sent to the new owner.
    forwardPayload: Cell?;
}

message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Cell?;
}

message(0x2fcb26a2) GetStaticData {
    queryId: Int as uint64;
}

message(0x8b771735) ReportStaticData {
    queryId: Int as uint64;
    index: Int as uint256;
    collection: Address;
}

struct GetNftData {
    init: Bool;
    index: Int as uint256;
    collectionAddress: Address;
    ownerAddress: Address;
    individualContent: Cell;
}

struct CollectionData {
    nextItemIndex: Int;
    collectionContent: Cell;
    ownerAddress: Address;
}

// https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md#get-methods
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}

struct Tep64TokenData {
    // flag is the flag of the content type.
    // 0 means on-chain, 1 means off-chain.
    //
    // https://github.com/ton-blockchain/TEPs/pull/191/files
    // https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/nft/nft-collection.fc#L161
    flag: Int as uint8;
    content: String;
}