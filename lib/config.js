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
    pow: { // 使用冒号而不是等号
        getDifficulty: (blocks, index) => {
            const BASE_DIFFICULTY = Number.MAX_SAFE_INTEGER; // 设置合理的初始难度
            const EVERY_X_BLOCKS = 2016; // 调整为你想要的区间
            const TARGET_TIME = 10 * 60; // 目标时间（10分钟）
            const POW_CURVE = 5; // 调整曲线


            if ((index + 1) % EVERY_X_BLOCKS !== 0) {
                return Math.max(
                Math.floor(
                    BASE_DIFFICULTY / Math.pow(
                        Math.floor(((index || blocks.length) + 1) / EVERY_X_BLOCKS) + 1
                        , POW_CURVE)
                )
                , 0);
            }

            // 计算调整的起始索引
            const adjustmentStartIndex = Math.max(0, index - EVERY_X_BLOCKS);
            const timeSpent = blocks[index].timestamp - blocks[adjustmentStartIndex].timestamp; // 计算时间

            // 计算平均时间
            const averageTime = timeSpent / (index - adjustmentStartIndex);

            // 计算当前难度
            const currentDifficulty = Math.floor(
                BASE_DIFFICULTY / Math.pow(Math.floor((index + 1) / EVERY_X_BLOCKS) + 1, POW_CURVE)
            );

            // 确定新难度
            let newDifficulty;
            if (averageTime < TARGET_TIME) {
                // 如果平均时间小于目标，增加难度
                newDifficulty = Math.floor(currentDifficulty * (TARGET_TIME / averageTime));
            } else if (averageTime === TARGET_TIME) {
                // 保持相同难度
                newDifficulty = currentDifficulty;
            } else {
                // 如果平均时间大于目标，降低难度
                newDifficulty = Math.floor(BASE_DIFFICULTY / Math.pow(Math.floor((index + 1) / EVERY_X_BLOCKS) + 1, POW_CURVE + 1));
            }

            return Math.max(newDifficulty, 1); // 确保难度至少为1
        }
    }
};
