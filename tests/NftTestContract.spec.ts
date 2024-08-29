import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import { NftTestContract } from '../wrappers/NftTestContract';
import '@ton/test-utils';
import { NftItem } from '../wrappers/NftItem';

describe('NftTestContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftTestContract: SandboxContract<NftTestContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        const collectionContent: string = " Testing Nft On TON";
        const ownerAddress = deployer.address;

        nftTestContract = blockchain.openContract(await NftTestContract.fromInit(ownerAddress, collectionContent));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftTestContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftTestContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftTestContract are ready to use
    });

    it('Mint An Nft', async () => {
        await nftTestContract.send(
            deployer.getSender(),
            {
            value: toNano('0.08')
            }, 
           'Mint')

    console.log("Collection Data Content: ", (await nftTestContract.getGetCollectionData()).collection_content.beginParse().loadStringTail())

    const nftItemAddress = await nftTestContract.getGetNftAddressByIndex(0n);
    const nftItem: SandboxContract<NftItem> =  blockchain.openContract( NftItem.fromAddress(nftItemAddress!));
    console.log("Nft Item Address: ", nftItemAddress);
    // let nftItemData = (await nftItem.getGetItemData());
    // console.log("NftItem Old Owner: ", nftItemData.owner);
    //const individualContent = (await nftItem.getGetItemData()).individual_content.beginParse().loadStringTail();
    //console.log("Individual Content: ",individualContent); 
    const ContractBalanceAfterMint = await nftTestContract.getGetMyBalance();
    console.log("Parent Contract Balance After Mint: ", fromNano(ContractBalanceAfterMint));

    ////-------------TRANSFER TEST-------------////////////////
    const user = await blockchain.treasury("user");
    console.log("User Address: ", user.address)


   await nftItem.send(deployer.getSender(),
    {
        value: toNano("0.02")
    },
      {
        $$type: "Transfer",
        new_owner: user.address,
        query_id: 0n
      })

    //   const newnftItemData = nftItem.getGetItemData();
    //    const newOwner = (await newnftItemData).owner;
    //    console.log("NftItem New Owner: ", newOwner);

    });

});
