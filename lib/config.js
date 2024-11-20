// Do not change these configurations after the blockchain is initialized
module.exports = {
    // INFO: The mining reward could decreases over time like bitcoin. See https://en.bitcoin.it/wiki/Mining#Reward.
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
            // Proof-of-work difficulty settings
            const BASE_DIFFICULTY = Number.MAX_SAFE_INTEGER;
            const EVERY_X_BLOCKS = 2016; // Adjust based on your desired interval (e.g., 2016 for Bitcoin)
            const TARGET_TIME = 10 * 60; // Target time for block generation (10 minutes)

            if ((index - 1) % EVERY_X_BLOCKS != 0) {
                return (index === 0) ? BASE_DIFFICULTY : blocks[index - 1].difficulty; // 返回第一个区块的难度或基础难度
            }

            // Calculate the starting index for difficulty adjustment
            const adjustmentStartIndex = Math.max(0, index - EVERY_X_BLOCKS);
            const timeSpent = blocks[index].timestamp - blocks[adjustmentStartIndex].timestamp; // Time taken to mine the last N blocks

            // Calculate average time per block
            const averageTime = timeSpent / (index - adjustmentStartIndex);

            // Determine new difficulty based on average time
            let newDifficulty;
            if (averageTime < TARGET_TIME) {
                newDifficulty = Math.floor(BASE_DIFFICULTY / Math.pow(Math.floor((index + 1) / EVERY_X_BLOCKS) + 1, 2)); // Increase difficulty
            }else if (averageTime < TARGET_TIME){
                newDifficulty = blocks[index - 1].difficulty
            }
            else {
                newDifficulty = Math.floor(BASE_DIFFICULTY / Math.pow(Math.floor((index + 1) / EVERY_X_BLOCKS) + 1, 3)); // Decrease difficulty
            }

            return Math.max(newDifficulty, 1); // Ensure difficulty is at least 1`

        }
    }
};
