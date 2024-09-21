import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";

contract NftItem with Deployable, Ownable {
    owner: Address;
    collection_address: Address;
    item_index: Int;
    individual_content: String; // Assume this is a string holding IPFS metadata hash
    is_initialized: Bool;

    init(
        owner: Address,
        collection_address: Address,
        item_index: Int,
        individual_content: String
    ) {
        // require(sender() == collection_address, "Not From Collection");
        self.owner  = owner;
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.individual_content = individual_content;
        self.is_initialized = false;
    }

    receive(msg: Transfer) {
        self.requireOwner(); // must e equal to NFTCollection address
        let ctx: Context = context();
        let msgValue: Int = ctx.value;

        if (self.is_initialized == false) {
            require(ctx.sender == self.collection_address, "Must be initialized by the collection");
            self.is_initialized = true;
            self.owner = msg.new_owner;
            self.individual_content = msg.custom_payload.asSlice().asString(); // Load metadata
        } else {
            require(ctx.sender == self.owner, "Not Owner");
            self.owner = msg.new_owner;
            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode: SendPayGasSeparately,
                    bounce: true,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                });
            }

            msgValue = msgValue - ctx.readForwardFee();
            send(SendParameters{
                to: msg.response_destination,
                value: msgValue - msg.forward_amount,
                mode: SendPayGasSeparately,
                bounce: true,
                body: Excesses { query_id: msg.query_id }.toCell()
            });
        }
    }

    get fun get_nft_item_data(): ItemData {
        return ItemData{
            owner: self.owner,
            collection_address: self.collection_address,
            item_index: self.item_index,
            individual_content: self.individual_content.asSlice().asCell(), // IPFS hash as string
            is_initialized: self.is_initialized  
        };
    }

    get fun getMyBalance(): Int {
        return myBalance();
    }
}
