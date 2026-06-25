export type ProductId =
    | 'snack-bag'
    | 'lemon-drink'
    | 'rice-ball'
    | 'strawberry-milk'
    | 'pudding-cup'
    | 'star-candy';

export type ProductPreparation = 'normal' | 'heated';

export interface ProductVariant {
    productId: ProductId;
    preparation?: ProductPreparation;
}

export interface ProductDefinition {
    id: ProductId;
    displayName: string;
    baseReward: number;
    resourcePath: string;
}

export interface Order {
    id: number;
    productIds: ProductId[];
    reward: number;
    patienceMs: number;
}

export interface OrderDifficulty {
    availableProductIds: ProductId[];
    minItems: number;
    maxItems: number;
    patienceMs: number;
}
