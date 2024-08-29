import { toNano } from '@ton/core';
import { NftTestContract } from '../wrappers/NftTestContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftTestContract = provider.open(await NftTestContract.fromInit());

    await nftTestContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftTestContract.address);

    // run methods on `nftTestContract`
}
