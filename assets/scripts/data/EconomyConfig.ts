import { ProductId } from '../core/GameTypes';

export type ProductCategory = 'snack' | 'drink' | 'ready-food';
export type ProductStock = Record<ProductId, number>;
export type OperationStrategy = 'traffic' | 'tips' | 'hours';

export interface EconomyState {
    wallet: number;
    lifetimeProfit: number;
    roundsCompleted: number;
    unlockedProductIds: ProductId[];
    warehouseStock: ProductStock;
    lastSales: ProductStock;
    nextTrendCategory: ProductCategory;
    reputation: number;
    lastRating: number;
    nextStrategy?: OperationStrategy;
    shelfLevel: number;
    microwaveLevel: number;
    storeLevel: number;
}

export interface ProductEconomy {
    buyCost: number;
    sellPrice: number;
    unlockCost: number;
    initiallyUnlocked: boolean;
    category: ProductCategory;
}

export interface ShiftRules {
    shiftSeconds: number;
    maxCustomers: number;
    minItems: number;
    maxItems: number;
    patienceSeconds: number;
    impatientEnabled: boolean;
    bulkShopperEnabled: boolean;
}

export type UpgradeKind = 'shelf' | 'microwave' | 'store';

export const PRODUCT_ECONOMY: Record<ProductId, ProductEconomy> = {
    'snack-bag': { buyCost: 3, sellPrice: 9, unlockCost: 0, initiallyUnlocked: true, category: 'snack' },
    'lemon-drink': { buyCost: 4, sellPrice: 12, unlockCost: 0, initiallyUnlocked: true, category: 'drink' },
    'rice-ball': { buyCost: 5, sellPrice: 16, unlockCost: 130, initiallyUnlocked: false, category: 'ready-food' },
    'strawberry-milk': { buyCost: 5, sellPrice: 14, unlockCost: 0, initiallyUnlocked: true, category: 'drink' },
    'pudding-cup': { buyCost: 7, sellPrice: 20, unlockCost: 280, initiallyUnlocked: false, category: 'ready-food' },
    'star-candy': { buyCost: 8, sellPrice: 24, unlockCost: 450, initiallyUnlocked: false, category: 'snack' },
};

export const CATEGORY_NAMES: Record<ProductCategory, string> = {
    snack: '零食',
    drink: '饮料',
    'ready-food': '即食食品',
};

export const UPGRADE_MAX_LEVEL: Record<UpgradeKind, number> = {
    shelf: 3,
    microwave: 3,
    store: 3,
};

const UPGRADE_COSTS: Record<UpgradeKind, number[]> = {
    shelf: [0, 180, 360],
    microwave: [160, 320, 600],
    store: [0, 360, 720],
};

export function createInitialEconomyState(): EconomyState {
    return {
        wallet: 30,
        lifetimeProfit: 0,
        roundsCompleted: 0,
        unlockedProductIds: (Object.keys(PRODUCT_ECONOMY) as ProductId[])
            .filter((productId) => PRODUCT_ECONOMY[productId].initiallyUnlocked),
        warehouseStock: createProductStock({
            'snack-bag': 5,
            'lemon-drink': 5,
            'strawberry-milk': 5,
        }),
        lastSales: createProductStock(),
        nextTrendCategory: 'drink',
        reputation: 80,
        lastRating: 4,
        nextStrategy: undefined,
        shelfLevel: 1,
        microwaveLevel: 0,
        storeLevel: 1,
    };
}

export function getUpgradeCost(kind: UpgradeKind, currentLevel: number): number | undefined {
    if (currentLevel >= UPGRADE_MAX_LEVEL[kind]) {
        return undefined;
    }
    return UPGRADE_COSTS[kind][currentLevel];
}

export function getShiftRules(state: EconomyState): ShiftRules {
    if (state.storeLevel >= 3) {
        return {
            shiftSeconds: 90,
            maxCustomers: 2,
            minItems: 2,
            maxItems: Math.min(3, state.unlockedProductIds.length),
            patienceSeconds: 24,
            impatientEnabled: true,
            bulkShopperEnabled: true,
        };
    }
    if (state.storeLevel >= 2) {
        return {
            shiftSeconds: 90,
            maxCustomers: 2,
            minItems: 1,
            maxItems: Math.min(2, state.unlockedProductIds.length),
            patienceSeconds: 25,
            impatientEnabled: false,
            bulkShopperEnabled: true,
        };
    }
    return {
        shiftSeconds: 90,
        maxCustomers: 2,
        minItems: 1,
        maxItems: Math.min(2, state.unlockedProductIds.length),
        patienceSeconds: 29,
        impatientEnabled: false,
        bulkShopperEnabled: false,
    };
}

export function getStockCap(shelfLevel: number): number {
    return 2 + shelfLevel;
}

export function getRestockSeconds(shelfLevel: number): number {
    return Math.max(0.7, 1.5 - (shelfLevel - 1) * 0.3);
}

export function getHeatSeconds(microwaveLevel: number): number {
    return Math.max(1.5, 3.4 - (microwaveLevel - 1) * 0.8);
}

export function getWarehouseCapacity(storeLevel: number): number {
    return 24 + (storeLevel - 1) * 12;
}

export function createProductStock(values: Partial<ProductStock> = {}): ProductStock {
    return {
        'snack-bag': values['snack-bag'] ?? 0,
        'lemon-drink': values['lemon-drink'] ?? 0,
        'rice-ball': values['rice-ball'] ?? 0,
        'strawberry-milk': values['strawberry-milk'] ?? 0,
        'pudding-cup': values['pudding-cup'] ?? 0,
        'star-candy': values['star-candy'] ?? 0,
    };
}
