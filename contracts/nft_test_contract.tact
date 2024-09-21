import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";
import "./nft_item.tact";

contract NftCollection with Deployable, Ownable {
    owner: Address;
    next_item_index: Int as uint32 = 0;
    collection_content: String; // IPFS hash for collection metadata
    royalty_params: RoyaltyParams?;


    const minting_fee: Int = ton("0.2"); // Minting fee set to 0.2 TON
    const minTonForStorage: Int = ton("0.02");
    const gasConsumption: Int = ton("0.02");

    init(
        owner: Address,
        collection_content: String,
        royalty_params: RoyaltyParams
    ) {
        self.owner = owner;
        self.collection_content = collection_content;
        self.royalty_params = royalty_params;
    }

    receive("Mint") {
        let ctx: Context = context();
        let receiver: Address = ctx.sender;

        require(ctx.value >= self.minting_fee, "Insufficient minting fee");

        self.mint(receiver);
        emit(LogEventMintRecord{minter: receiver, item_id: self.next_item_index, generate_number: nativeRandom() }.toCell());
    }

    fun mint(receiver: Address) {
        require(self.next_item_index >= 0, "Invalid item index");

        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMessage: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonForStorage - min(tonBalanceBeforeMessage, self.minTonForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption + self.minting_fee);

        send(SendParameters{
            to: contractAddress(nft_init),
            value: msgValue,
            bounce: false,
            mode: SendIgnoreErrors,
            body: Transfer{
                query_id: 0,
                new_owner: receiver,
                response_destination: myAddress(), // add to CA
                custom_payload: self.collection_content.asSlice().asCell(), // Collection metadata from IPFS
                forward_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: nft_init.code,
            data: nft_init.data
        });

        self.next_item_index = self.next_item_index + 1;
    }

    receive("Withdraw") {
        let ctx: Context = context();
        self.requireOwner();
        require(ctx.sender == self.owner, "Not Owner");

        let balance: Int = myBalance();
        require(balance > ton("0.01"), "No funds to withdraw");

        let amountToWithdraw: Int = balance - ton("0.05");

        send(SendParameters{
            to: self.owner,
            value: amountToWithdraw,
            mode: 0,
            bounce: false
        });
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        return initOf NftItem(self.owner, myAddress(), item_index, self.collection_content);
    }

    get fun get_nft_address_by_index(item_index: Int): Address {
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun get_Collection_Data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index,
            collection_content: self.collection_content.asSlice().asCell(),
            owner_address: self.owner
            
        };
    }

    get fun getMyBalance(): Int {
        return myBalance();
    }

    get fun getNext_item_index(): Int {
        return self.next_item_index;
    }
}
