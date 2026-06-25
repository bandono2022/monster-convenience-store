import { ProductDefinition, ProductId } from '../core/GameTypes';

export const PRODUCT_CATALOG: Record<ProductId, ProductDefinition> = {
    'snack-bag': {
        id: 'snack-bag',
        displayName: '怪兽薯片',
        baseReward: 8,
        resourcePath: 'game-art/items-transparent/snack-bag/spriteFrame',
    },
    'lemon-drink': {
        id: 'lemon-drink',
        displayName: '柠檬汽水',
        baseReward: 10,
        resourcePath: 'game-art/items-transparent/lemon-drink/spriteFrame',
    },
    'rice-ball': {
        id: 'rice-ball',
        displayName: '微笑饭团',
        baseReward: 9,
        resourcePath: 'game-art/items-transparent/rice-ball/spriteFrame',
    },
    'strawberry-milk': {
        id: 'strawberry-milk',
        displayName: '草莓牛奶',
        baseReward: 11,
        resourcePath: 'game-art/items-transparent/strawberry-milk/spriteFrame',
    },
    'pudding-cup': {
        id: 'pudding-cup',
        displayName: '怪兽布丁',
        baseReward: 12,
        resourcePath: 'game-art/items-transparent/pudding-cup/spriteFrame',
    },
    'star-candy': {
        id: 'star-candy',
        displayName: '星星糖果',
        baseReward: 13,
        resourcePath: 'game-art/items-transparent/star-candy/spriteFrame',
    },
};
