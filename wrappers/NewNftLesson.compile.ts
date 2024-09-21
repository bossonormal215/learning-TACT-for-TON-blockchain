import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/new_nft_lesson.tact',
    options: {
        debug: true,
    },
};
