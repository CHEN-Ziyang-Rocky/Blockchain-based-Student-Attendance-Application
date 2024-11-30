// Do not change these configurations after the blockchain is initialized
module.exports = {
    // INFO: The mining reward could decrease over time like bitcoin. See https://en.bitcoin.it/wiki/Mining#Reward.
    MINING_REWARD: 5000000000,
    // INFO: Usually it's a fee over transaction size (not quantity)
    FEE_PER_TRANSACTION: 1,
    // INFO: Usually the limit is determined by block size (not quantity)
    TRANSACTIONS_PER_BLOCK: 2,
    genesisBlock: {
        index: 0,
        previousHash: '0',
        timestamp: 1465154705,
        nonce: 0,
        difficulty: Number.MAX_SAFE_INTEGER,
        transactions: [
            {
                id: '63ec3ac02f822450039df13ddf7c3c0f19bab4acd4dc928c62fcd78d5ebc6dba',
                hash: null,
                type: 'regular',
                data: {
                    inputs: [],
                    outputs: []
                }
            }
        ]
    },
    pow: {
        getDifficulty: (blocks, index) => {
            const BASE_DIFFICULTY = Number.MAX_SAFE_INTEGER;
            const EVERY_X_BLOCKS = 10;
            const TARGET_TIME = 10;

            if (blocks.length <= EVERY_X_BLOCKS){
                return BASE_DIFFICULTY;
            }

            if ((index + 1) % EVERY_X_BLOCKS !== 0) {
                return blocks[blocks.length-1].difficulty;
            }


            const adjustmentStartIndex = Math.max(0, blocks.length - EVERY_X_BLOCKS);
            const timeSpent = blocks[blocks.length-1].timestamp - blocks[adjustmentStartIndex].timestamp;
            const averageTime = timeSpent / EVERY_X_BLOCKS;
            const currentDifficulty = blocks[blocks.length-1].difficulty;
            console.log(`average of time ${averageTime} target time ${TARGET_TIME}, currentDifficulty ${currentDifficulty}`);

            let newDifficulty;
            newDifficulty = currentDifficulty * (TARGET_TIME / averageTime);

            return Math.max(newDifficulty, 1);
        }
    }
};
