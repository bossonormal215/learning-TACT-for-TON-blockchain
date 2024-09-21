import { toNano, Address } from '@ton/core';
import { NewNftLesson } from '../wrappers/NewNftLesson';
import { NetworkProvider } from '@ton/blueprint';
import { MintNFT } from '../build/NewNftLesson/tact_NftCollection';

export async function run(provider: NetworkProvider) {
    // Define the deployer address
    let deployer: Address = Address.parse('0QC6V3GlAlOwW2_giOe1zTuJsJ_m4MvbY_Rrjnowc8qBPqzj');
    const newNftLesson = provider.open(await NewNftLesson.fromInit());
    const ownerAddress: Address = deployer;

    // Step 1: Deploy the contract
    await newNftLesson.send(
        provider.sender(),
        {
            value: toNano('0.05'), // Ensure this covers deployment fees
        },
        {
            $$type: 'Deploy',
            queryId: 0n, // Initialize queryId (optional)
        },
    );

    await provider.waitForDeploy(newNftLesson.address);

    console.log(`Contract deployed at address: ${newNftLesson.address.toString()}`);

    // Step 2: Mint an NFT (send a separate transaction after deployment)
    const mintMsg: MintNFT = {
        $$type: 'MintNFT',
        queryId: 1n, // Unique queryId
        newOwner: ownerAddress, // The owner who will receive the minted NFT
        forwardAmount: toNano('0.02'),
        forwardPayload: null, // Optional payload (set to null if not needed)
    };

    // Send the MintNFT message to the contract (Separate transaction after deployment)
    await newNftLesson.send(
        provider.sender(),
        {
            value: toNano('0.05'), // Sufficient funds to cover minting cost
        },
        mintMsg, // Now sending the MintNFT message
    );

    console.log(`Minted NFT for owner: ${ownerAddress.toString()}`);
}
