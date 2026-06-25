import { OrderDifficulty } from '../core/GameTypes';

export const VERTICAL_SLICE_DIFFICULTY: OrderDifficulty = {
    availableProductIds: [
        'snack-bag',
        'lemon-drink',
        'rice-ball',
        'strawberry-milk',
        'pudding-cup',
        'star-candy',
    ],
    minItems: 1,
    maxItems: 2,
    patienceMs: 12_000,
};
