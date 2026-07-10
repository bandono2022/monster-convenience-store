import { OrderDifficulty, ProductId } from '../core/GameTypes';
import { ProductStock, createProductStock } from './EconomyConfig';

export type DayCheckpoint = 1 | 3 | 7;
export type OrderPlanKind = 'normal-single' | 'normal-double' | 'heated-single' | 'normal-heated' | 'premium-double';
export type CustomerPlanKind = 'normal' | 'impatient' | 'bulk-shopper';

export interface DayTarget {
    passOrders: number;
    excellentOrders: number;
    passRevenue: number;
    excellentRevenue: number;
}

export interface DayBalanceConfig {
    target: DayTarget;
    suggestedStock: ProductStock;
    patienceSeconds: Record<CustomerPlanKind, number>;
    orderWeights: Partial<Record<OrderPlanKind, number>>;
    productWeights: Partial<Record<ProductId, number>>;
    customerWeights: Record<CustomerPlanKind, number>;
}

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

export const DAY_BALANCE: Record<DayCheckpoint, DayBalanceConfig> = {
    1: {
        target: { passOrders: 8, excellentOrders: 10, passRevenue: 95, excellentRevenue: 120 },
        suggestedStock: createProductStock({
            'snack-bag': 5,
            'lemon-drink': 5,
            'strawberry-milk': 5,
        }),
        patienceSeconds: { normal: 32, impatient: 32, 'bulk-shopper': 32 },
        orderWeights: { 'normal-single': 100 },
        productWeights: { 'snack-bag': 4, 'lemon-drink': 4, 'strawberry-milk': 2 },
        customerWeights: { normal: 100, impatient: 0, 'bulk-shopper': 0 },
    },
    3: {
        target: { passOrders: 8, excellentOrders: 10, passRevenue: 150, excellentRevenue: 190 },
        suggestedStock: createProductStock({
            'snack-bag': 5,
            'lemon-drink': 6,
            'strawberry-milk': 5,
            'rice-ball': 4,
        }),
        patienceSeconds: { normal: 29, impatient: 29, 'bulk-shopper': 29 },
        orderWeights: { 'normal-single': 45, 'normal-double': 20, 'heated-single': 25, 'normal-heated': 10 },
        productWeights: { 'snack-bag': 2, 'lemon-drink': 2, 'strawberry-milk': 2, 'rice-ball': 3 },
        customerWeights: { normal: 100, impatient: 0, 'bulk-shopper': 0 },
    },
    7: {
        target: { passOrders: 10, excellentOrders: 12, passRevenue: 290, excellentRevenue: 360 },
        suggestedStock: createProductStock({
            'snack-bag': 6,
            'lemon-drink': 6,
            'strawberry-milk': 5,
            'rice-ball': 5,
            'pudding-cup': 4,
            'star-candy': 4,
        }),
        patienceSeconds: { normal: 25, impatient: 16, 'bulk-shopper': 30 },
        orderWeights: {
            'normal-single': 15,
            'heated-single': 10,
            'normal-double': 35,
            'normal-heated': 25,
            'premium-double': 15,
        },
        productWeights: {
            'snack-bag': 2,
            'lemon-drink': 2,
            'strawberry-milk': 2,
            'rice-ball': 3,
            'pudding-cup': 2,
            'star-candy': 2,
        },
        customerWeights: { normal: 60, impatient: 25, 'bulk-shopper': 15 },
    },
};

export function getDayBalance(day: number): DayBalanceConfig {
    if (day >= 7) {
        return DAY_BALANCE[7];
    }
    if (day >= 3) {
        return DAY_BALANCE[3];
    }
    return DAY_BALANCE[1];
}
