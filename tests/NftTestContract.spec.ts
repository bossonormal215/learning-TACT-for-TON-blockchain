import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { NftTestContract } from '../wrappers/NftTestContract';
import '@ton/test-utils';

describe('NftTestContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftTestContract: SandboxContract<NftTestContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftTestContract = blockchain.openContract(await NftTestContract.fromInit());

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
});
