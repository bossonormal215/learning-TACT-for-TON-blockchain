import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { NewNftLesson } from '../wrappers/NewNftLesson';
import '@ton/test-utils';

describe('NewNftLesson', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let newNftLesson: SandboxContract<NewNftLesson>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        newNftLesson = blockchain.openContract(await NewNftLesson.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await newNftLesson.send(
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
            to: newNftLesson.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and newNftLesson are ready to use
    });
});
