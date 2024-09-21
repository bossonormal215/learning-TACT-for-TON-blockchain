
       struct GetNftData {
            is_initialized: Bool;
            index: Int;
            collection_address: Address; 
            owner_address: Address;
            // individual_content: b.toCell()
            individual_content: Cell;
          }


        message LogEventMintRecord {
             minter: Address;
             item_id: Int;
             generate_number: Int;
        }



// [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
message(0x5fcc3d14) Transfer { 
// message Transfer { 
    query_id: Int as uint64;            
    new_owner: Address; 
    response_destination: Address; 
    custom_payload: Cell; 
    forward_amount: Int as coins; 
    forward_payload: Slice as remaining; 
}

 message(0x5fcc3d14) Transfer1 { 
    query_id: Int as uint64;            
    new_owner: Address; 
    response_destination: Address?; 
    custom_payload: Cell?; 
    forward_amount: Int as coins; 
    forward_payload: Slice as remaining; 
}

message(0x05138d91) OwnershipAssigned{
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining; 
}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}

message(0x2fcb26a2) GetStaticData { 
    query_id: Int as uint64;
}

message(0x8b771735) ReportStaticData{
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}

struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}

struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
    
}

struct ItemData { 
    owner: Address;
    collection_address: Address; 
    item_index: Int;
    individual_content: Cell;
    is_initialized: Bool; 
}


// struct CollectionMetadata {
//    image: String;   //"https://ton.org/_next/static/media/smart-challenge1.7210ca54.png",
//    name:  String;   //"TON Smart Challenge #2",
//    description: String;   //"TON Smart Challenge #2 Winners Trophy",
//    socialLinks: String[];
// }
