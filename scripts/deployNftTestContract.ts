import { Address, toNano } from '@ton/core';
import { NftTestContract } from '../wrappers/NftTestContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let deployer: Address = Address.parse("0QC6V3GlAlOwW2_giOe1zTuJsJ_m4MvbY_Rrjnowc8qBPqzj");
    const collectionContent: string = " Testing Nft Mine";
    const ownerAddress: Address = deployer;



    const mineMintNftContract = provider.open(await NftTestContract.fromInit(ownerAddress, collectionContent));

    await mineMintNftContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );  

    await provider.waitForDeploy(mineMintNftContract.address);
    console.log("Nft Parent Contract Adrress: ", mineMintNftContract.address)

    // run methods on `mineMintNftContract`
    // MINT INTERRACTION
   await mineMintNftContract.send(
        provider.sender(),
        {
            value: toNano("0.3")
        },
        "Mint"
    )
}
