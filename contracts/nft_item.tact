import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";


contract NftItem with Deployable, Ownable {
    owner: Address;
    collection_address: Address;
    item_index: Int;
    individual_content: String;
    is_initialized: Bool;

     init(
        owner: Address,
        collection_address: Address,
        item_index: Int,
        individual_content: String,
        is_initialized: Bool
     ) {
        self.owner = owner;
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.individual_content = individual_content;
        self.is_initialized = is_initialized;
     }

     receive(msg: Transfer) {
        self.requireOwner();
        self.owner = msg.new_owner;
     }

     get fun get_Item_data(): ItemData {
        return ItemData{
            owner: self.owner,
            collection_address: self.collection_address,
            item_index: self.item_index,
            individual_content: self.individual_content.asSlice().asCell(),
            is_initialized: self.is_initialized
        }
     }

     get fun getMyBalance(): Int {
        return myBalance();
    }
}
