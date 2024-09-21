import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import { NftTestContract } from '../wrappers/NftTestContract';
import '@ton/test-utils';
import { NftItem } from '../wrappers/NftItem';

describe('NftTestContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftTestContract: SandboxContract<NftTestContract>;
    const collectionContent: string = ' Testing Nft On TON';

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
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
            },
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
                value: toNano('0.08'),
            },
            'Mint',
        );

        ///MINT 2
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: toNano('0.8'),
            },
            'Mint',
        );

        // MINT 3
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: toNano('0.8'),
            },
            'Mint',
        );
        // MINT 4
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: toNano('0.8'),
            },
            'Mint',
        );

        console.log(
            'Collection Data Content: ',
            (await nftTestContract.getGetCollectionData()).collection_content.beginParse().loadStringTail(),
        );

        const nftItemAddress = await nftTestContract.getGetNftAddressByIndex(1n);
        const nftItem: SandboxContract<NftItem> = blockchain.openContract(NftItem.fromAddress(nftItemAddress!));
        console.log('Nft Item Address: ', nftItemAddress);
        console.log(await nftTestContract.getGetCollectionData());
        console.log(nftItem);
        // let nftItemData = (await nftItem.getGetItemData());
        // console.log("NftItem Old Owner: ", nftItemData.owner);
        //const individualContent = (await nftItem.getGetItemData()).individual_content.beginParse().loadStringTail();
        //console.log("Individual Content: ",individualContent);
        let ParentContractBalance;
        ParentContractBalance = await nftTestContract.getGetMyBalance();
        console.log('Parent Contract Balance After Mint: ', fromNano(ParentContractBalance));

        ////-------------TRANSFER TEST-------------////////////////
        const user = await blockchain.treasury('user');
        console.log('User Address: ', user.address);

        /*await nftItem.send(deployer.getSender(),
    {
        value: toNano("0.02")
    },
      {
        query_id: 0n,
        new_owner: user.address,
        $$type: "Transfer",
        response_destination: deployer.address,
        custom_payload: collectionContent.slice().asCell(),
        forward_amount: 0
      }) */

        /*  const newnftItemData = nftItem.getGetNftData();
        console.log(newnftItemData);
         const newOwner = await newnftItemData.owner_address; 
        console.log('NftItem New Owner: ', newOwner); */
    });

    // withdraw // WORKED
    it('should allow owner to withdraw balance', async () => {
        // Step 1: Mint an NFT to add funds to the contract
        const mintAmount = toNano('0.8');
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: mintAmount,
            },
            'Mint',
        );
        // mint 2
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: mintAmount,
            },
            'Mint',
        );
        // mint 3
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: mintAmount,
            },
            'Mint',
        );

        // Capture the contract balance before withdrawal
        const balanceBeforeWithdraw = await nftTestContract.getGetMyBalance();
        console.log(`Balance before withdraw: ${fromNano(balanceBeforeWithdraw)} TON`);

        // Get owner's balance before withdrawal
        const ownerBalanceBefore = await deployer.getBalance();
        console.log(`Owner's balance before withdraw: ${fromNano(ownerBalanceBefore)} TON`);
        const contractBalance = await nftTestContract.getGetMyBalance();
        console.log(`Expecetd Amount to withdraw: ${fromNano(contractBalance - toNano('0.01'))} TON`);

        // Perform the withdrawal
        await nftTestContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'), // This value should cover any additional gas fees for the transaction.
            },
            'Withdraw',
        );

        // Capture the contract balance after withdrawal
        const balanceAfterWithdraw = await nftTestContract.getGetMyBalance();
        console.log(`Balance after withdraw: ${fromNano(balanceAfterWithdraw)} TON`);

        // Get owner's balance after withdrawal
        const ownerBalanceAfter = await deployer.getBalance();
        console.log(`Owner's balance after withdraw: ${fromNano(ownerBalanceAfter)} TON`);

        // Verify that the contract balance has decreased
        expect(balanceAfterWithdraw).toBeLessThan(balanceBeforeWithdraw);

        // Verify that the owner's balance has increased
        expect(ownerBalanceAfter).toBeGreaterThan(ownerBalanceBefore);
    });
});

// git add .
// git commit -m "first commit"
// git push -u origin main
