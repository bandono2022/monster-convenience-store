import { ProductId, ProductPreparation, ProductVariant } from '../core/GameTypes';
import { getHeatSeconds } from './EconomyConfig';

export type ProcessingDeviceId = 'microwave';

export interface ProcessingRule {
    deviceId: ProcessingDeviceId;
    inputProductId: ProductId;
    outputPreparation: Exclude<ProductPreparation, 'normal'>;
    rewardBonus: number;
    requiredDeviceLevel: number;
}

export const PROCESSING_DEVICE_NAMES: Record<ProcessingDeviceId, string> = {
    microwave: '微波炉',
};

export const PROCESSING_RULES: ProcessingRule[] = [
    {
        deviceId: 'microwave',
        inputProductId: 'rice-ball',
        outputPreparation: 'heated',
        rewardBonus: 4,
        requiredDeviceLevel: 1,
    },
];

export function getProductPreparation(item: ProductVariant | { productId: ProductId; heated?: boolean }): ProductPreparation {
    if ('preparation' in item && item.preparation) {
        return item.preparation;
    }
    return item.heated ? 'heated' : 'normal';
}

export function toLegacyHeated(preparation: ProductPreparation): boolean | undefined {
    return preparation === 'heated' ? true : undefined;
}

export function getProcessingRuleForOrderItem(
    item: ProductVariant | { productId: ProductId; heated?: boolean },
): ProcessingRule | undefined {
    const preparation = getProductPreparation(item);
    if (preparation === 'normal') {
        return undefined;
    }
    return PROCESSING_RULES.find((rule) => (
        rule.inputProductId === item.productId
        && rule.outputPreparation === preparation
    ));
}

export function getProcessableProductIds(deviceId: ProcessingDeviceId): ProductId[] {
    return PROCESSING_RULES
        .filter((rule) => rule.deviceId === deviceId)
        .map((rule) => rule.inputProductId);
}

export function isProductProcessable(productId: ProductId, deviceId?: ProcessingDeviceId): boolean {
    return PROCESSING_RULES.some((rule) => (
        rule.inputProductId === productId
        && (!deviceId || rule.deviceId === deviceId)
    ));
}

export function getProcessingSeconds(deviceId: ProcessingDeviceId, deviceLevel: number): number {
    if (deviceId === 'microwave') {
        return getHeatSeconds(deviceLevel);
    }
    return 3;
}

export function getPreparationRewardBonus(item: ProductVariant | { productId: ProductId; heated?: boolean }): number {
    return getProcessingRuleForOrderItem(item)?.rewardBonus ?? 0;
}

export function getPreparedVariant(productId: ProductId, preparation: ProductPreparation): ProductVariant {
    return { productId, preparation };
}
