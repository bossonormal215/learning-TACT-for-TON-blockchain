import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";
import "./nft_item.tact";

contract NftTestContract with Deployable, Ownable {
    owner: Address;
    next_item_index: Int as uint32 = 0;
    collection_content: String;
    // mint_price: Int;
    // mint_price: Int = ton("0.12");

    const minTonForStorage: Int = ton("0.03");
    const gasConsumption: Int = ton("0.03");

    // mintedItems: map<Address, Int>;
   
    init(
        owner: Address,
        collection_content: String,
        // mint_price: Int
    ) {
        self.owner = owner;
        self.collection_content = collection_content;
        // self.mint_price = mint_price;
    }

    receive("Mint") {
        let ctx: Context = context();
        let receiver: Address = ctx.sender;
        // self.requireOwner();
        // self.mint(receiver); // COMING BACK HERE
         // Set a required minting fee, for example, 0.2 TON
        let requiredMintFee: Int = ton("0.2");
        require(ctx.value >= requiredMintFee, "Insufficient minting fee");
        ///
        // Check how many NFTs this address has minted
        // let mintedCount: Int = self.mintedItems[receiver] ?? 0;

        // Set a limit, for example, 5 NFTs per address
        // let mintLimit: Int = 10;
        // require(mintedCount < mintLimit, "Minting limit reached");

        self.mint(receiver);
         // Increment the minted count
        // self.mintedItems[receiver] = mintedCount + 1;
    }

    fun mint(receiver: Address) {
        require(self.next_item_index >= 0, "Non-Sequence NFTs");
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        let ctx: Context = context();
        ///////-------------starting the calculation------------------/////////////////
        let msgValue: Int = context().value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonForStorage - min(tonBalanceBeforeMsg, self.minTonForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);

        send(SendParameters {
            to: contractAddress(nft_init),
            value: msgValue,  ///////////// everything that was sent to mint function will be sent to the NFTItem
            mode: SendIgnoreErrors,
            body: Transfer{
                query_id: 0,
                new_owner: receiver
            }.toCell(),
            code: nft_init.code,
            data: nft_init.data
        });

        self.next_item_index = self.next_item_index + 1;
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        let b: StringBuilder = beginString();
        b.append("Item # -");
        b.append(item_index.toString());
       let  is_initialized = true;
        return initOf NftItem(self.owner, myAddress(), item_index, b.toString(), is_initialized)
    }

    get fun get_nft_address_by_index(item_index: Int): Address {
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun get_Collection_Data(): CollectionData{
        return CollectionData{
            next_item_index: self.next_item_index,
            collection_content: self.collection_content.asSlice().asCell(),
            owner_address: self.owner
        }
    }

    get fun getMyBalance(): Int {
        return myBalance();
    }

    get fun getNext_item_index(): Int {
        return self.next_item_index;
    }


}
