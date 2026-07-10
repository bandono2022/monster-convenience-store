import { ProductDefinition, ProductId } from '../core/GameTypes';

export const PRODUCT_CATALOG: Record<ProductId, ProductDefinition> = {
    'snack-bag': {
        id: 'snack-bag',
        displayName: '怪兽薯片',
        baseReward: 9,
        resourcePath: 'ui_gameplay_final_v1/products/snack_bag/spriteFrame',
    },
    'lemon-drink': {
        id: 'lemon-drink',
        displayName: '柠檬汽水',
        baseReward: 12,
        resourcePath: 'ui_gameplay_final_v1/products/lemon_drink/spriteFrame',
    },
    'rice-ball': {
        id: 'rice-ball',
        displayName: '微笑饭团',
        baseReward: 16,
        resourcePath: 'ui_gameplay_final_v1/products/rice_ball/spriteFrame',
    },
    'strawberry-milk': {
        id: 'strawberry-milk',
        displayName: '巧克力奶',
        baseReward: 14,
        resourcePath: 'ui_gameplay_final_v1/products/chocolate_milk/spriteFrame',
    },
    'pudding-cup': {
        id: 'pudding-cup',
        displayName: '怪兽布丁',
        baseReward: 20,
        resourcePath: 'ui_gameplay_final_v1/products/pudding_cup/spriteFrame',
    },
    'star-candy': {
        id: 'star-candy',
        displayName: '怪兽糖果',
        baseReward: 24,
        resourcePath: 'ui_gameplay_final_v1/products/candy_bag/spriteFrame',
    },
};
