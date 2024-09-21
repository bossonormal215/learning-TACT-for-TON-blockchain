import { Address, toNano } from '@ton/core';
import { NftTestContract } from '../wrappers/NftTestContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let deployer: Address = Address.parse('0QC6V3GlAlOwW2_giOe1zTuJsJ_m4MvbY_Rrjnowc8qBPqzj');
    const collectionContent: string = ' Testing Nft Mine'; // IPFS collection metadata hash
    const ownerAddress: Address = deployer;
    const individual_content: string = ' Nft Item Content'; // IPFS NftItem metadata hash

    const nftTestContract = provider.open(await NftTestContract.fromInit(ownerAddress, collectionContent));

    await nftTestContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(nftTestContract.address);
    console.log('Nft Parent Contract Adrress: ', nftTestContract.address);

    // run methods on `mineMintNftContract`
    // MINT INTERRACTION
    await nftTestContract.send(
        provider.sender(),
        {
            value: toNano('0.3'),
        },
        'Mint',
    );

    // Withdraw Interraction
    await nftTestContract.send(
        provider.sender(),
        {
            value: toNano('0.05'), // This value should cover any additional gas fees for the transaction.
        },
        'Withdraw',
    );
}
