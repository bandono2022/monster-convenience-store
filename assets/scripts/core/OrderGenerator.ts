import { PRODUCT_CATALOG } from '../data/ProductCatalog';
import { Order, OrderDifficulty, ProductId } from './GameTypes';

export type RandomSource = () => number;

export class OrderGenerator {
    private nextId = 1;

    constructor(
        private readonly difficulty: OrderDifficulty,
        private readonly random: RandomSource = Math.random,
    ) {}

    create(): Order {
        const productIds = this.pickProducts(this.pickItemCount());
        const reward = productIds.reduce(
            (total, productId) => total + PRODUCT_CATALOG[productId].baseReward,
            0,
        );

        return {
            id: this.nextId++,
            productIds,
            reward,
            patienceMs: this.difficulty.patienceMs,
        };
    }

    private pickItemCount(): number {
        const { minItems, maxItems } = this.difficulty;
        return minItems + Math.floor(this.random() * (maxItems - minItems + 1));
    }

    private pickProducts(count: number): ProductId[] {
        const available = [...this.difficulty.availableProductIds];
        const selected: ProductId[] = [];

        while (selected.length < count && available.length > 0) {
            const index = Math.floor(this.random() * available.length);
            selected.push(available.splice(index, 1)[0]);
        }

        return selected;
    }
}
