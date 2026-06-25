import {
    _decorator,
    Color,
    Component,
    Graphics,
    Label,
    Node,
    resources,
    Sprite,
    SpriteFrame,
    sys,
    UITransform,
    Vec3,
} from 'cc';
import { PRODUCT_CATALOG } from '../data/ProductCatalog';
import {
    CATEGORY_NAMES,
    createProductStock,
    createInitialEconomyState,
    EconomyState,
    getHeatSeconds,
    getRestockSeconds,
    getShiftRules,
    getStockCap,
    getUpgradeCost,
    getWarehouseCapacity,
    OperationStrategy,
    PRODUCT_ECONOMY,
    ProductCategory,
    ProductStock,
    ShiftRules,
    UpgradeKind,
    UPGRADE_MAX_LEVEL,
} from '../data/EconomyConfig';
import {
    getPreparationRewardBonus,
    getProcessableProductIds,
    getProcessingRuleForOrderItem,
    getProcessingSeconds,
    isProductProcessable,
    PROCESSING_DEVICE_NAMES,
    ProcessingDeviceId,
    toLegacyHeated,
} from '../data/ProcessingConfig';
import { ProductId } from '../core/GameTypes';
import { GameTweenFx } from './fx/GameTweenFx';

const { ccclass } = _decorator;

const DESIGN_WIDTH = 750;
const DESIGN_HEIGHT = 1334;
const SAVE_KEY = 'monster-store-economy-v1';
const IDLE_RENDER_INTERVAL = 2.5;
const FEEDBACK_RENDER_INTERVAL = 0.6;
const HUD_Y = 610;
const HUD_HEIGHT = 64;
const HUD_SATISFACTION_X = -260;
const HUD_SATISFACTION_WIDTH = 188;
const HUD_TIMER_X = 0;
const HUD_TIMER_WIDTH = 226;
const HUD_COIN_X = 220;
const HUD_COIN_WIDTH = 170;
const HUD_PAUSE_X = 342;
const HUD_PAUSE_SIZE = 58;
const CUSTOMER_ROW_Y = 312;
const CUSTOMER_SPACING_X = 188;
const CUSTOMER_ORDER_Y = 154;
const CUSTOMER_MONSTER_Y = -92;
const CUSTOMER_MONSTER_SIZE = 314;
const ORDER_BUBBLE_WIDTH = 276;
const ORDER_BUBBLE_HEIGHT = 178;
const ORDER_BUBBLE_RADIUS = 28;
const ORDER_TAIL_X = -104;
const ORDER_TAIL_Y = -90;
const ORDER_ITEM_Y = 34;
const ORDER_ITEM_SLOT_SIZE = 60;
const ORDER_ITEM_NODE_SIZE = 70;
const ORDER_ITEM_TWO_SPACING = 76;
const ORDER_ITEM_THREE_SPACING = 62;
const ORDER_PATIENCE_Y = -48;
const ORDER_PATIENCE_HEART_X = -96;
const ORDER_PATIENCE_BAR_X = 18;
const ORDER_PATIENCE_BAR_WIDTH = 176;
const ORDER_PATIENCE_FILL_WIDTH = 166;
const WORKSTATION_Y = 44;
const WORKSTATION_HEIGHT = 232;
const EQUIPMENT_BASE_Y = -96;
const EQUIPMENT_BASELINE_Y = -101;
const MICROWAVE_X = -264;
const DELIVERY_PAD_X = 0;
const CASHIER_X = 258;
const MICROWAVE_SCALE = 1.04;
const DELIVERY_PAD_SCALE = 1.08;
const CASHIER_SCALE = 1.00;
const PRODUCT_CARD_WIDTH = 228;
const PRODUCT_CARD_HEIGHT = 264;
const PRODUCT_GRID_START_Y = -230;
const PRODUCT_GRID_ROW_GAP = 292;
const PRODUCT_GRID_COLUMN_SPACING = 236;
const PRODUCT_ICON_MOUNT_Y = 44;
const PRODUCT_ICON_PANEL_WIDTH = 132;
const PRODUCT_ICON_PANEL_HEIGHT = 112;
const PRODUCT_NAME_Y = -56;
const PRODUCT_STOCK_LABEL_X = 22;
const PRODUCT_STOCK_LABEL_Y = -98;

type CustomerKind = 'normal' | 'impatient' | 'bulk-shopper';
type CustomerMood = 'waiting' | 'happy' | 'urgent' | 'angry';
type OrderItem = {
    productId: ProductId;
    heated?: boolean;
};

type CustomerState = {
    id: number;
    kind: CustomerKind;
    order: OrderItem[];
    served: OrderItem[];
    patience: number;
    maxPatience: number;
    mood: CustomerMood;
    transitionRemaining: number;
    reactionRemaining: number;
    pendingOutcome?: 'completed' | 'partial' | 'missed';
    showHint: boolean;
    paymentAmount?: number;
    lowPatienceFxPlayed: boolean;
};

type MicrowaveState = {
    mode: 'idle' | 'heating' | 'ready';
    remaining: number;
    customerId?: number;
    productId?: ProductId;
};

type TrayState = {
    customerId?: number;
    items: OrderItem[];
};

type FeedbackTone = 'info' | 'success' | 'warning' | 'error' | 'heat';
type PurchaseGuidance = 'shortage' | 'normal' | 'overstock';
type ToastState = {
    message: string;
    tone: FeedbackTone;
    remaining: number;
    x: number;
    y: number;
};
type PaymentBurstState = {
    amount: number;
    remaining: number;
};
type ErrorFxState = {
    customerId?: number;
    productId?: ProductId;
    target: 'order' | 'tray' | 'both';
    remaining: number;
};
type ProductCardSkin = 'heat' | 'star' | 'leaf';
const PRODUCT_CARD_BADGES: Record<ProductCardSkin, { width: number; height: number; x: number; y: number }> = {
    heat: { width: 72, height: 66, x: 69, y: 93 },
    star: { width: 73, height: 66, x: 69, y: 93 },
    leaf: { width: 75, height: 65, x: 71, y: 93 },
};

const PRODUCT_IDS: ProductId[] = [
    'snack-bag',
    'lemon-drink',
    'rice-ball',
    'strawberry-milk',
    'pudding-cup',
    'star-candy',
];
const CORE_ASSET_COUNT = PRODUCT_IDS.length + 7;

const PRODUCT_COLORS: Record<ProductId, Color> = {
    'snack-bag': new Color(255, 98, 84),
    'lemon-drink': new Color(103, 199, 165),
    'rice-ball': new Color(255, 243, 214),
    'strawberry-milk': new Color(255, 158, 168),
    'pudding-cup': new Color(255, 194, 71),
    'star-candy': new Color(120, 89, 143),
};

const STRATEGY_NAMES: Record<OperationStrategy, string> = {
    traffic: '客流推广',
    tips: '优质服务',
    hours: '延长营业',
};

const CUSTOMER_KIND_NAMES: Record<CustomerKind, string> = {
    normal: '普通顾客',
    impatient: '急性顾客',
    'bulk-shopper': '大单顾客',
};

@ccclass('MonsterStorePrototype')
export class MonsterStorePrototype extends Component {
    private currentDay = 1;
    private economy: EconomyState = createInitialEconomyState();
    private shiftRules: ShiftRules = getShiftRules(this.economy);
    private customers: CustomerState[] = [];
    private activeCustomerIndex = 0;
    private nextCustomerId = 1;
    private nextOrderIndex = 0;
    private stock: Record<ProductId, number> = {
        'snack-bag': 3,
        'lemon-drink': 3,
        'rice-ball': 3,
        'strawberry-milk': 3,
        'pudding-cup': 3,
        'star-candy': 3,
    };
    private salesThisShift: ProductStock = createProductStock();
    private purchaseCart: ProductStock = createProductStock();
    private restocking = new Map<ProductId, number>();
    private microwave: MicrowaveState = { mode: 'idle', remaining: 0 };
    private tray: TrayState = { items: [] };
    private shiftRemaining = this.shiftRules.shiftSeconds;
    private revenue = 0;
    private goodsCost = 0;
    private combo = 0;
    private completed = 0;
    private missed = 0;
    private message = '完成订单赚取利润，营业后自由升级便利店';
    private shopMessage = '使用本次利润升级商品与设备';
    private feedbackTone: FeedbackTone = 'info';
    private productFrames = new Map<ProductId, SpriteFrame>();
    private characterFrames = new Map<string, SpriteFrame>();
    private storeBackgroundFrame?: SpriteFrame;
    private unifiedMicrowaveFrame?: SpriteFrame;
    private unifiedDeliveryPadFrame?: SpriteFrame;
    private unifiedCashierFrame?: SpriteFrame;
    private productCardBaseFrame?: SpriteFrame;
    private productCardBadgeFrames = new Map<ProductCardSkin, SpriteFrame>();
    private formalUiFrames = new Map<string, SpriteFrame>();
    private coreAssetsPending = CORE_ASSET_COUNT;
    private artReady = false;
    private refreshAccumulator = 0;
    private liveUiAccumulator = 0;
    private timerValueLabel?: Label;
    private microwaveProgressFill?: Node;
    private patienceFillNodes = new Map<number, Node>();
    private ended = false;
    private preparing = false;
    private home = true;
    private soldOutMissed = 0;
    private closeConfirmArmed = false;
    private closingRequested = false;
    private closeReason?: 'manual' | 'sold-out';
    private reviewPoints = 0;
    private reviewCount = 0;
    private roundRating = 4;
    private activeStrategy?: OperationStrategy;
    private activeStrategyTier = 1;
    private pauseMenuOpen = false;
    private toast?: ToastState;
    private paymentBurst?: PaymentBurstState;
    private errorFx?: ErrorFxState;

    start() {
        this.loadEconomy();
        this.currentDay = this.economy.roundsCompleted + 1;
        this.home = true;
        this.loadProductFrames();
        this.loadCharacterFrames();
        this.loadEnvironmentFrames();
        this.loadUiGeneratedFrames();
    }

    update(deltaTime: number) {
        const toastWasVisible = Boolean(this.toast);
        if (this.toast) {
            this.toast.remaining = Math.max(0, this.toast.remaining - deltaTime);
            if (this.toast.remaining <= 0) {
                this.toast = undefined;
            }
        }
        if (toastWasVisible && !this.toast) {
            this.render();
        }
        const paymentBurstWasVisible = Boolean(this.paymentBurst);
        if (this.paymentBurst) {
            this.paymentBurst.remaining = Math.max(0, this.paymentBurst.remaining - deltaTime);
            if (this.paymentBurst.remaining <= 0) {
                this.paymentBurst = undefined;
            }
        }
        if (paymentBurstWasVisible && !this.paymentBurst) {
            this.render();
        }
        const errorFxWasVisible = Boolean(this.errorFx);
        if (this.errorFx) {
            this.errorFx.remaining = Math.max(0, this.errorFx.remaining - deltaTime);
            if (this.errorFx.remaining <= 0) {
                this.errorFx = undefined;
            }
        }
        if (errorFxWasVisible && !this.errorFx) {
            this.render();
        }

        if (this.home || this.ended || !this.artReady || this.pauseMenuOpen) {
            return;
        }

        this.shiftRemaining = Math.max(0, this.shiftRemaining - deltaTime);
        if (this.shiftRemaining <= 0) {
            this.settleShift();
            return;
        }

        for (let index = this.customers.length - 1; index >= 0; index -= 1) {
            const customer = this.customers[index];
            if (customer.transitionRemaining > 0) {
                customer.transitionRemaining -= deltaTime;
                if (customer.transitionRemaining <= 0 && customer.pendingOutcome) {
                    this.replaceCustomer(index);
                    if (this.ended) {
                        return;
                    }
                }
                continue;
            }

            customer.patience -= deltaTime;
            if (customer.patience <= 0) {
                this.missed += 1;
                this.combo = 0;
                this.recordReview(1);
                this.setFeedback('顾客生气离开，连击中断', 'error');
                customer.mood = 'angry';
                customer.transitionRemaining = 0.8;
                customer.pendingOutcome = 'missed';
                if (this.microwave.customerId === customer.id) {
                    this.microwave = { mode: 'idle', remaining: 0 };
                }
                this.clearTrayForCustomer(customer.id);
                if (this.activeCustomerIndex === index) {
                    this.activeCustomerIndex = this.chooseNextCustomerIndex(index);
                }
                continue;
            }
            if (customer.reactionRemaining > 0) {
                customer.reactionRemaining = Math.max(0, customer.reactionRemaining - deltaTime);
            } else {
                customer.mood = customer.patience / customer.maxPatience < 0.35 ? 'urgent' : 'waiting';
            }
            if (
                !customer.lowPatienceFxPlayed
                && !customer.pendingOutcome
                && customer.patience / customer.maxPatience < 0.3
            ) {
                customer.lowPatienceFxPlayed = true;
                customer.mood = 'urgent';
                this.render();
                this.playLowPatienceFx(customer.id);
            }
        }

        for (const [productId, remaining] of this.restocking.entries()) {
            const next = remaining - deltaTime;
            if (next <= 0) {
                this.restocking.delete(productId);
                if (this.economy.warehouseStock[productId] > 0) {
                    this.economy.warehouseStock[productId] -= 1;
                    this.stock[productId] += 1;
                    this.queueShelfRefill(productId);
                }
            } else {
                this.restocking.set(productId, next);
            }
        }

        if (this.microwave.mode === 'heating') {
            this.microwave.remaining -= deltaTime;
            if (this.microwave.remaining <= 0) {
                this.microwave = {
                    mode: 'ready',
                    remaining: 0,
                    customerId: this.microwave.customerId,
                    productId: this.microwave.productId,
                };
                const productName = this.microwave.productId
                    ? PRODUCT_CATALOG[this.microwave.productId].displayName
                    : '热食';
                this.setFeedback(`${productName}加工完成，点击闪亮的微波炉交付`, 'success');
                this.render();
                this.playMicrowaveReadyFx();
            }
        }

        this.liveUiAccumulator += deltaTime;
        if (this.liveUiAccumulator >= 0.2) {
            this.liveUiAccumulator = 0;
            this.updateLiveUi();
        }
        this.refreshAccumulator += deltaTime;
        const renderInterval = (this.paymentBurst || this.errorFx)
            ? FEEDBACK_RENDER_INTERVAL
            : IDLE_RENDER_INTERVAL;
        if (this.refreshAccumulator >= renderInterval) {
            this.refreshAccumulator = 0;
            this.render();
        }
    }

    private createCustomer(): CustomerState {
        const orderNumber = this.nextOrderIndex;
        this.nextOrderIndex += 1;
        const tutorialOrder = this.economy.lifetimeProfit === 0 && this.currentDay === 1 && orderNumber < 2;
        const kind: CustomerKind = tutorialOrder
            ? 'normal'
            : this.shiftRules.bulkShopperEnabled && orderNumber % 4 === 2
                ? 'bulk-shopper'
                : this.shiftRules.impatientEnabled && orderNumber % 3 === 1
                    ? 'impatient'
                    : 'normal';
        const itemRange = this.shiftRules.maxItems - this.shiftRules.minItems + 1;
        const standardItemCount = tutorialOrder
            ? 1
            : this.shiftRules.minItems + (orderNumber % itemRange);
        const order: OrderItem[] = [];
        const demandPool = this.getDemandPool();
        const fulfillablePool = this.getFulfillableDemandPool();
        const uniqueDemandCount = new Set(demandPool).size;
        const uniqueFulfillableCount = new Set(fulfillablePool).size;
        const desiredItemCount = kind === 'bulk-shopper'
            ? Math.min(this.economy.storeLevel >= 3 ? 3 : 2, uniqueDemandCount)
            : Math.min(standardItemCount, uniqueDemandCount);
        const riskSlotEnabled = !tutorialOrder && orderNumber >= 2 && desiredItemCount > 1 && orderNumber % 3 === 2;
        const itemCount = Math.min(
            desiredItemCount,
            uniqueFulfillableCount + (riskSlotEnabled ? 1 : 0),
        );

        const microwaveCandidates = getProcessableProductIds('microwave')
            .filter((productId) => fulfillablePool.includes(productId));
        if (this.economy.microwaveLevel > 0 && microwaveCandidates.length > 0 && orderNumber % 3 === 1) {
            const productId = this.pickUniqueDemandProduct(microwaveCandidates, order, orderNumber) ?? microwaveCandidates[0];
            order.push({ productId, heated: true });
        }
        while (order.length < itemCount) {
            const useIndependentDemand = riskSlotEnabled && order.length === itemCount - 1;
            const sourcePool = useIndependentDemand ? demandPool : fulfillablePool;
            const productId = this.pickUniqueDemandProduct(sourcePool, order, orderNumber + order.length);
            if (!productId) {
                break;
            }
            order.push({ productId });
        }

        const maxPatience = kind === 'impatient'
            ? this.shiftRules.patienceSeconds * 0.65
            : kind === 'bulk-shopper'
                ? this.shiftRules.patienceSeconds * 1.2
                : this.shiftRules.patienceSeconds;
        const strategyPatienceMultiplier = this.activeStrategy === 'traffic'
            ? 1 - this.activeStrategyTier * 0.06
            : 1;
        const adjustedPatience = maxPatience * strategyPatienceMultiplier;

        return {
            id: this.nextCustomerId++,
            kind,
            order,
            served: [],
            patience: adjustedPatience,
            maxPatience: adjustedPatience,
            mood: 'waiting',
            transitionRemaining: 0,
            reactionRemaining: 0,
            showHint: tutorialOrder,
            lowPatienceFxPlayed: false,
        };
    }

    private replaceCustomer(index: number) {
        const leavingCustomerId = this.customers[index]?.id;
        if (leavingCustomerId && this.microwave.customerId === leavingCustomerId) {
            this.microwave = { mode: 'idle', remaining: 0 };
        }
        this.clearTrayForCustomer(leavingCustomerId);
        this.checkAutoCloseWhenSoldOut();
        if (this.closingRequested) {
            this.customers.splice(index, 1);
            if (this.customers.length === 0) {
                this.settleShift();
                return;
            }
            this.activeCustomerIndex = this.chooseUrgentCustomer();
            return;
        }
        if (this.getFulfillableDemandPool().length === 0) {
            this.customers.splice(index, 1);
            this.activeCustomerIndex = this.chooseUrgentCustomer();
            return;
        }
        this.customers[index] = this.createCustomer();
        this.activeCustomerIndex = Math.min(this.activeCustomerIndex, this.customers.length - 1);
    }

    private loadProductFrames() {
        for (const productId of PRODUCT_IDS) {
            resources.load(PRODUCT_CATALOG[productId].resourcePath, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.productFrames.set(productId, frame);
                }
                this.markCoreAssetLoaded();
            });
        }
    }

    private loadCharacterFrames() {
        const moods: CustomerMood[] = ['waiting', 'happy', 'urgent', 'angry'];
        const kinds: CustomerKind[] = ['normal', 'impatient', 'bulk-shopper'];
        for (const kind of kinds) {
            for (const mood of moods) {
                resources.load(`game-art/characters/${kind}/${mood}/spriteFrame`, SpriteFrame, (error, frame) => {
                    if (!error && frame) {
                        this.characterFrames.set(`${kind}-${mood}`, frame);
                    }
                    if (mood === 'waiting') {
                        this.markCoreAssetLoaded();
                    }
                });
            }
        }
    }

    private loadEnvironmentFrames() {
        resources.load('game-art/environment/store-background/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.storeBackgroundFrame = frame;
            }
            this.markCoreAssetLoaded();
        });

        resources.load('game-art/equipment/unified/microwave/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.unifiedMicrowaveFrame = frame;
            }
            this.markCoreAssetLoaded();
        });

        resources.load('game-art/equipment/unified/delivery-pad/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.unifiedDeliveryPadFrame = frame;
            }
            this.markCoreAssetLoaded();
        });

        resources.load('game-art/equipment/unified/cashier/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.unifiedCashierFrame = frame;
            }
            this.markCoreAssetLoaded();
        });
    }

    private loadUiGeneratedFrames() {
        resources.load('ui_layered/product_card_v1/product_card_base_slots/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.productCardBaseFrame = frame;
                if (this.artReady && !this.home && !this.preparing && !this.ended) {
                    this.render();
                }
            }
        });

        const productCardBadgePaths: Record<ProductCardSkin, string> = {
            heat: 'ui_layered/product_card_v1/badge_heat_corner/spriteFrame',
            star: 'ui_layered/product_card_v1/badge_star_corner/spriteFrame',
            leaf: 'ui_layered/product_card_v1/badge_leaf_corner/spriteFrame',
        };
        (Object.entries(productCardBadgePaths) as [ProductCardSkin, string][]).forEach(([skin, path]) => {
            resources.load(path, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.productCardBadgeFrames.set(skin, frame);
                    if (this.artReady && !this.home && !this.preparing && !this.ended) {
                        this.render();
                    }
                }
            });
        });

        const formalUiPaths: Record<string, string> = {
            'panel-teal': 'ui_formal_v2/production/hud/hud_panel_teal/spriteFrame',
            'panel-timer': 'ui_formal_v2/production/hud/hud_panel_timer/spriteFrame',
            coin: 'ui_formal_v2/production/hud/icon_coin/spriteFrame',
            clock: 'ui_formal_v2/production/hud/icon_clock/spriteFrame',
            star: 'ui_formal_v2/production/hud/icon_star/spriteFrame',
            heart: 'ui_formal_v2/production/common/icon_heart/spriteFrame',
            pause: 'ui_formal_v2/production/common/icon_pause/spriteFrame',
            'bubble-selected': 'ui_formal_v2/production/order/order_bubble_selected/spriteFrame',
            'bubble-normal': 'ui_formal_v2/production/order/order_bubble_normal/spriteFrame',
        };
        Object.entries(formalUiPaths).forEach(([key, path]) => {
            resources.load(path, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    if (key.startsWith('panel-')) {
                        frame.insetLeft = 64;
                        frame.insetRight = 28;
                        frame.insetTop = 20;
                        frame.insetBottom = 20;
                    } else if (key.startsWith('bubble-')) {
                        frame.insetLeft = 112;
                        frame.insetRight = 40;
                        frame.insetTop = 40;
                        frame.insetBottom = 62;
                    }
                    this.formalUiFrames.set(key, frame);
                    if (this.artReady && !this.home && !this.preparing && !this.ended) {
                        this.render();
                    }
                }
            });
        });
    }

    private render() {
        this.node.destroyAllChildren();
        this.timerValueLabel = undefined;
        this.microwaveProgressFill = undefined;
        this.patienceFillNodes.clear();
        if (this.storeBackgroundFrame) {
            this.addArtwork(this.node, 'StoreBackground', this.storeBackgroundFrame, DESIGN_WIDTH, DESIGN_HEIGHT);
        } else {
            this.addSurface(this.node, 'Background', DESIGN_WIDTH, DESIGN_HEIGHT, 0, this.color(255, 243, 214));
        }
        this.addSurface(this.node, 'HeaderBand', DESIGN_WIDTH, 132, 0, this.color(54, 158, 170, 242), 0, 601);
        this.addSurface(this.node, 'StoreBand', DESIGN_WIDTH, 480, 0, this.color(255, 250, 239, 72), 0, 280);
        this.addSurface(this.node, 'CounterBand', DESIGN_WIDTH, 620, 0, this.color(103, 199, 165, 238), 0, -357);

        this.renderHeader();

        if (!this.artReady) {
            this.renderLoadingPanel();
            return;
        }

        if (this.home) {
            this.renderHomePanel();
            return;
        }

        if (this.preparing) {
            this.renderPreparationPanel();
            return;
        }

        if (this.ended) {
            this.renderEndPanel();
            return;
        }

        this.renderCustomers();
        this.renderCounterForeground();
        this.renderWorkstation();
        this.renderProducts();
        this.renderPaymentBurst();
        this.renderPauseMenu();
        this.renderToast();
    }

    private renderCounterForeground() {
        this.addSurface(this.node, 'CounterBackShadow', DESIGN_WIDTH, 18, 0, this.color(51, 33, 62, 90), 0, 152);
        this.addSurface(this.node, 'CounterLip', DESIGN_WIDTH, 46, 0, this.color(255, 250, 239, 248), 0, 130);
        this.addSurface(this.node, 'CounterLipLine', DESIGN_WIDTH, 8, 0, this.color(51, 33, 62, 220), 0, 156);
        this.addSurface(this.node, 'CounterLipHighlight', DESIGN_WIDTH, 6, 0, this.color(255, 255, 255, 190), 0, 134);
        this.addSurface(this.node, 'CounterTealTrim', DESIGN_WIDTH, 12, 0, this.color(54, 158, 170), 0, 104);
    }

    private renderHeader() {
        if (this.home) {
            this.addPill(this.node, `资金 ${this.economy.wallet}`, -240, 600, 210, 68, this.color(51, 33, 62));
            this.addPill(this.node, `口碑 ${this.economy.reputation}`, 0, 600, 180, 68, this.color(255, 98, 84));
            this.addPill(this.node, `店铺 Lv.${this.economy.storeLevel}`, 238, 600, 190, 68, this.color(51, 33, 62));
            return;
        }
        this.renderHudCard('SatisfactionHud', '满意度', `${this.getLiveSatisfactionPercent()}%`, '❤', HUD_SATISFACTION_X, HUD_SATISFACTION_WIDTH, this.color(22, 86, 78), this.color(255, 98, 84));
        this.renderHudCard('TimerHud', '时间', `${Math.ceil(this.shiftRemaining)}`, '◷', HUD_TIMER_X, HUD_TIMER_WIDTH, this.color(255, 98, 84), this.color(255, 250, 239));
        this.renderHudCard('CoinHud', '金币', `${this.economy.wallet}`, '★', HUD_COIN_X, HUD_COIN_WIDTH, this.color(22, 86, 78), this.color(255, 194, 71));
        this.renderPauseButton();
    }

    private renderHudCard(
        name: string,
        label: string,
        value: string,
        icon: string,
        x: number,
        width: number,
        fill: Color,
        accent: Color,
    ) {
        const panelKey = name === 'TimerHud' ? 'panel-timer' : 'panel-teal';
        const panelFrame = this.formalUiFrames.get(panelKey);
        let card: Node;
        if (panelFrame) {
            card = this.addArtwork(this.node, name, panelFrame, width, HUD_HEIGHT, x, HUD_Y);
            const panelSprite = card.getComponent(Sprite);
            if (panelSprite) {
                panelSprite.type = Sprite.Type.SLICED;
            }
        } else {
            card = this.createNode(name, width, HUD_HEIGHT, this.node);
            card.setPosition(x, HUD_Y, 0);
            this.drawRect(card, width, HUD_HEIGHT, 28, fill, this.color(51, 33, 62), 5);
            const gloss = this.createNode(`${name}Gloss`, width - 18, 26, card);
            gloss.setPosition(0, 12, 0);
            this.drawRect(gloss, width - 18, 26, 13, this.color(255, 255, 255, 22));
        }

        const iconFrame = name === 'TimerHud'
            ? this.formalUiFrames.get('clock')
            : name === 'CoinHud'
                ? this.formalUiFrames.get('star')
                : this.formalUiFrames.get('heart');
        if (iconFrame) {
            this.addArtwork(card, `${name}Icon`, iconFrame, 58, 58, -width / 2 + 36, 0);
        } else {
            const iconNode = this.createNode(`${name}Icon`, 50, 50, card);
            iconNode.setPosition(-width / 2 + 36, 0, 0);
            this.drawRect(iconNode, 50, 50, 25, accent, this.color(51, 33, 62), 4);
            this.addLabel(iconNode, icon, 0, 1, icon === '◷' ? 32 : 30, fill, true, 44);
        }

        this.addLabel(card, label, 22, 16, 20, this.color(255, 250, 239), true, width - 88);
        const valueNode = this.addLabel(card, value, 22, -12, 32, this.color(255, 255, 255), true, width - 88);
        if (name === 'TimerHud') {
            this.timerValueLabel = valueNode.getChildByName('LabelText')?.getComponent(Label);
        }
    }

    private renderPauseButton() {
        if (this.home || this.preparing || this.ended || !this.artReady) {
            return;
        }
        const pauseFrame = this.formalUiFrames.get('pause');
        let button: Node;
        if (pauseFrame) {
            button = this.addArtwork(
                this.node,
                'PauseButton',
                pauseFrame,
                HUD_PAUSE_SIZE,
                HUD_PAUSE_SIZE,
                HUD_PAUSE_X,
                HUD_Y,
            );
            if (this.pauseMenuOpen) {
                button.setScale(new Vec3(1.06, 1.06, 1));
            }
        } else {
            button = this.createNode('PauseButton', HUD_PAUSE_SIZE, HUD_PAUSE_SIZE, this.node);
            button.setPosition(HUD_PAUSE_X, HUD_Y, 0);
            this.drawRect(
                button,
                HUD_PAUSE_SIZE,
                HUD_PAUSE_SIZE,
                HUD_PAUSE_SIZE / 2,
                this.pauseMenuOpen ? this.color(120, 89, 143) : this.color(22, 86, 78),
                this.color(51, 33, 62),
                5,
            );
            const highlight = this.createNode('PauseHighlight', 46, 18, button);
            highlight.setPosition(0, 12, 0);
            this.drawRect(highlight, 46, 18, 9, this.color(255, 255, 255, 24));
            this.addLabel(button, 'Ⅱ', 0, 1, 28, this.color(255, 255, 255), true, 44);
        }
        button.on(Node.EventType.TOUCH_END, () => {
            this.pauseMenuOpen = !this.pauseMenuOpen;
            this.closeConfirmArmed = false;
            this.setFeedback(this.pauseMenuOpen ? '营业已暂停' : '继续营业', 'info', 120, 510);
            this.render();
        }, this);
    }

    private renderPauseMenu() {
        if (!this.pauseMenuOpen) {
            return;
        }

        const scrim = this.createNode('PauseScrim', DESIGN_WIDTH, DESIGN_HEIGHT, this.node);
        this.drawRect(scrim, DESIGN_WIDTH, DESIGN_HEIGHT, 0, this.color(51, 33, 62, 95));

        const panel = this.createNode('PauseMenu', 440, 410, this.node);
        panel.setPosition(0, 250, 0);
        this.drawRect(panel, 440, 410, 30, this.color(255, 250, 239, 252), this.color(51, 33, 62), 5);
        this.addLabel(panel, '暂停', 0, 152, 38, this.color(51, 33, 62), true, 220);
        this.addLabel(panel, '营业计时已暂停', 0, 108, 20, this.color(120, 89, 143), true, 300);

        this.addButton(panel, '继续营业', 0, 42, 330, 62, this.color(54, 158, 170), () => {
            this.pauseMenuOpen = false;
            this.closeConfirmArmed = false;
            this.setFeedback('继续营业', 'info', 120, 510);
            this.render();
        });

        this.addButton(panel, this.getStopAcceptingLabel(), 0, -42, 330, 62, this.getStopAcceptingColor(), () => {
            this.handlePauseStopAccepting();
        });

        this.addButton(panel, '设置', 0, -126, 330, 62, this.color(120, 89, 143), () => {
            this.setFeedback('设置功能后续开放', 'info', 0, 510);
            this.render();
        });
    }

    private renderToast() {
        if (!this.toast) {
            return;
        }
        const toneColors: Record<FeedbackTone, Color> = {
            info: this.color(51, 33, 62, 235),
            success: this.color(32, 137, 126, 235),
            warning: this.color(218, 139, 37, 238),
            error: this.color(216, 67, 67, 238),
            heat: this.color(224, 102, 120, 238),
        };
        const toneIcons: Record<FeedbackTone, string> = {
            info: 'i',
            success: '✓',
            warning: '!',
            error: '!',
            heat: '火',
        };
        const width = Math.min(610, Math.max(260, this.toast.message.length * 22 + 84));
        const x = Math.max(-DESIGN_WIDTH / 2 + width / 2 + 20, Math.min(DESIGN_WIDTH / 2 - width / 2 - 20, this.toast.x));
        const y = Math.max(-DESIGN_HEIGHT / 2 + 54, Math.min(DESIGN_HEIGHT / 2 - 160, this.toast.y));
        const toast = this.createNode('Toast', width, 56, this.node);
        toast.setPosition(x, y, 0);
        this.drawRect(toast, width, 56, 22, toneColors[this.toast.tone], this.color(255, 255, 255), 3);

        const icon = this.createNode('ToastIcon', 34, 34, toast);
        icon.setPosition(-width / 2 + 32, 0, 0);
        this.drawRect(icon, 34, 34, 17, this.color(255, 255, 255, 238));
        this.addLabel(icon, toneIcons[this.toast.tone], 0, 0, 20, toneColors[this.toast.tone], true, 28);
        this.addLabel(toast, this.toast.message, 22, 0, 20, this.color(255, 255, 255), true, width - 92);
    }

    private renderPaymentBurst() {
        if (!this.paymentBurst) {
            return;
        }
        const progress = 1 - this.paymentBurst.remaining / 0.95;
        const y = 118 + progress * 92;
        const root = this.createNode('PaymentBurst', 220, 100, this.node);
        root.setPosition(236, y, 0);
        const amount = this.createNode('PaymentAmount', 126, 44, root);
        amount.setPosition(0, 18, 0);
        this.drawRect(amount, 126, 44, 18, this.color(255, 194, 71, 235), this.color(255, 255, 255), 3);
        this.addLabel(amount, `+${this.paymentBurst.amount}`, 8, 0, 25, this.color(51, 33, 62), true, 92);
        for (let index = 0; index < 3; index += 1) {
            const coin = this.createNode(`PaymentCoin-${index}`, 32, 32, root);
            coin.setPosition(-54 + index * 54, -20 + Math.sin(progress * Math.PI + index) * 10, 0);
            this.drawRect(coin, 32, 32, 16, this.color(255, 194, 71), this.color(255, 250, 239), 3);
            this.addLabel(coin, '$', 0, 0, 20, this.color(151, 102, 28), true, 24);
        }
    }

    private renderLoadingPanel() {
        const panel = this.createNode('LoadingPanel', 620, 320, this.node);
        panel.setPosition(0, 80, 0);
        this.drawRect(panel, 620, 320, 34, this.color(255, 255, 255), this.color(51, 33, 62), 6);
        this.addLabel(panel, '正在准备便利店...', 0, 55, 34, this.color(51, 33, 62), true, 500);
        const progress = 1 - this.coreAssetsPending / CORE_ASSET_COUNT;
        const track = this.createNode('LoadingTrack', 460, 30, panel);
        track.setPosition(0, -40, 0);
        this.drawRect(track, 460, 30, 15, this.color(221, 211, 198));
        const fillWidth = Math.max(12, 452 * progress);
        const fill = this.createNode('LoadingFill', fillWidth, 22, track);
        fill.setPosition((fillWidth - 452) / 2, 0, 0);
        this.drawRect(fill, fillWidth, 22, 11, this.color(103, 199, 165));
    }

    private renderCustomers() {
        for (let index = 0; index < this.customers.length; index += 1) {
            const customer = this.customers[index];
            const x = this.customers.length === 1 ? 0 : index === 0 ? -CUSTOMER_SPACING_X : CUSTOMER_SPACING_X;
            const active = index === this.activeCustomerIndex;
            const card = this.createNode(`Customer-${customer.id}`, 356, 390, this.node);
            card.setPosition(x, CUSTOMER_ROW_Y, 0);
            card.on(Node.EventType.TOUCH_END, () => {
                if (this.activeCustomerIndex === index) {
                    this.pop(card);
                    return;
                }
                this.activeCustomerIndex = index;
                this.render();
                const selected = this.node.getChildByName(`Customer-${customer.id}`);
                if (selected) {
                    this.playCustomerSelectFx(customer.id);
                }
            }, this);

            this.drawMonster(card, 0, CUSTOMER_MONSTER_Y, customer.kind, customer.mood, active, CUSTOMER_MONSTER_SIZE);
            this.renderOrderIcons(card, customer, CUSTOMER_ORDER_Y, active);
            if (
                customer.paymentAmount !== undefined
                && (customer.pendingOutcome === 'completed' || customer.pendingOutcome === 'partial')
            ) {
                this.addLabel(
                    card,
                    customer.pendingOutcome === 'partial'
                        ? `部分付款 +${customer.paymentAmount}`
                        : `金币 +${customer.paymentAmount}`,
                    0,
                    -152,
                    21,
                    this.color(255, 255, 255),
                    true,
                    156,
                    this.color(255, 194, 71),
                );
            }
        }
    }

    private drawMonster(parent: Node, x: number, y: number, kind: CustomerKind, mood: CustomerMood, active: boolean, size = 220) {
        const motion = this.getMonsterMotion(mood, active);
        const frame = this.characterFrames.get(`${kind}-${mood}`);
        if (frame) {
            const monster = this.createNode('MonsterArt', size, size, parent);
            monster.setPosition(x + motion.x, y + motion.y, 0);
            monster.setScale(new Vec3(motion.scaleX, motion.scaleY, 1));
            const sprite = monster.addComponent(Sprite);
            sprite.spriteFrame = frame;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            monster.getComponent(UITransform)?.setContentSize(size, size);
            this.renderMonsterMoodMark(parent, x, y, mood);
            return;
        }

        const root = this.createNode('Monster', 170, 150, parent);
        root.setPosition(x + motion.x, y + motion.y, 0);
        root.setScale(new Vec3(motion.scaleX, motion.scaleY, 1));
        const bodyColor = kind === 'impatient'
            ? this.color(255, 194, 71)
            : kind === 'bulk-shopper'
                ? this.color(75, 164, 218)
                : this.color(255, 98, 84);
        this.drawRect(root, 158, 136, 65, bodyColor, this.color(51, 33, 62), 5);

        const eye = this.createNode('Eye', 58, 58, root);
        eye.setPosition(0, 22, 0);
        this.drawRect(eye, 58, 58, 29, this.color(255, 255, 255), this.color(51, 33, 62), 4);
        const pupil = this.createNode('Pupil', 26, 26, eye);
        this.drawRect(pupil, 26, 26, 13, this.color(51, 33, 62));

        const mouth = this.createNode('Mouth', 66, 28, root);
        mouth.setPosition(0, -34, 0);
        this.drawRect(mouth, 66, 28, 14, active ? this.color(51, 33, 62) : this.color(120, 89, 143));

        const hornLeft = this.createNode('HornLeft', 26, 36, root);
        hornLeft.setPosition(-54, 73, 0);
        this.drawRect(hornLeft, 26, 36, 12, this.color(255, 194, 71), this.color(51, 33, 62), 3);
        hornLeft.angle = -18;
        const hornRight = this.createNode('HornRight', 26, 36, root);
        hornRight.setPosition(54, 73, 0);
        this.drawRect(hornRight, 26, 36, 12, this.color(255, 194, 71), this.color(51, 33, 62), 3);
        hornRight.angle = 18;
        this.renderMonsterMoodMark(parent, x, y, mood);
    }

    private getMonsterMotion(mood: CustomerMood, active: boolean) {
        if (mood === 'happy') {
            return {
                x: 0,
                y: 12,
                scaleX: 1.06,
                scaleY: 1.06,
            };
        }
        if (mood === 'urgent') {
            return {
                x: active ? 3 : 0,
                y: 2,
                scaleX: 1.03,
                scaleY: 1.02,
            };
        }
        if (mood === 'angry') {
            return {
                x: active ? -4 : 0,
                y: 4,
                scaleX: 1.06,
                scaleY: 1.04,
            };
        }
        return {
            x: 0,
            y: 0,
            scaleX: active ? 1.01 : 1,
            scaleY: active ? 1.01 : 1,
        };
    }

    private renderMonsterMoodMark(parent: Node, x: number, y: number, mood: CustomerMood) {
        if (mood !== 'urgent' && mood !== 'angry') {
            return;
        }
        const mark = this.createNode('MonsterMoodMark', 42, 42, parent);
        mark.setPosition(x + 92, y + 76, 0);
        this.drawRect(
            mark,
            42,
            42,
            21,
            mood === 'angry' ? this.color(216, 67, 67, 230) : this.color(255, 194, 71, 230),
            this.color(255, 255, 255),
            3,
        );
        this.addLabel(mark, '!', 0, 0, 28, this.color(255, 255, 255), true, 28);
    }

    private renderOrderIcons(parent: Node, customer: CustomerState, y: number, active: boolean) {
        const width = ORDER_BUBBLE_WIDTH;
        const height = ORDER_BUBBLE_HEIGHT;
        const errorActive = this.isErrorFxFor(customer.id, 'order');
        if (errorActive) {
            const glow = this.createNode('OrderGlow', width + 20, height + 20, parent);
            glow.setPosition(0, y, 0);
            this.drawRect(glow, width + 20, height + 20, ORDER_BUBBLE_RADIUS + 6, this.color(216, 67, 67, 78));
        }

        const bubbleFrame = this.formalUiFrames.get(active ? 'bubble-selected' : 'bubble-normal');
        let order: Node;
        if (bubbleFrame) {
            order = this.addArtwork(parent, 'Order', bubbleFrame, width, height, 0, y);
            const bubbleSprite = order.getComponent(Sprite);
            if (bubbleSprite) {
                bubbleSprite.type = Sprite.Type.SLICED;
            }
        } else {
            const kindColor = customer.kind === 'normal'
                ? this.color(255, 98, 84)
                : customer.kind === 'impatient'
                    ? this.color(120, 89, 143)
                    : this.color(54, 158, 170);
            const borderColor = errorActive ? this.color(216, 67, 67) : active ? this.color(255, 98, 84) : kindColor;
            const shadow = this.createNode('OrderBubbleShadow', width, height, parent);
            shadow.setPosition(0, y - 5, 0);
            this.drawRect(shadow, width, height, ORDER_BUBBLE_RADIUS, this.color(51, 33, 62, 32));

            const tail = this.createNode('OrderTail', 32, 32, parent);
            tail.setPosition(ORDER_TAIL_X, y + ORDER_TAIL_Y, 0);
            this.drawSpeechTail(tail, 28, this.color(255, 250, 239, 250), borderColor, active ? 5 : 4);

            order = this.createNode('Order', width, height, parent);
            order.setPosition(0, y, 0);
            this.drawRect(order, width, height, ORDER_BUBBLE_RADIUS, this.color(255, 250, 239, 250), borderColor, active ? 6 : 4);
        }
        if (customer.pendingOutcome === 'completed' || customer.pendingOutcome === 'partial') {
            const stamp = this.createNode('OrderDoneStamp', 120, 48, order);
            stamp.setPosition(84, 36, 0);
            stamp.angle = -8;
            this.drawRect(
                stamp,
                120,
                48,
                18,
                customer.pendingOutcome === 'completed' ? this.color(103, 199, 165, 235) : this.color(255, 194, 71, 235),
                this.color(255, 255, 255),
                3,
            );
            this.addLabel(stamp, customer.pendingOutcome === 'completed' ? 'DONE' : 'PART', 0, 0, 23, this.color(255, 255, 255), true, 86);
        }

        const spacing = customer.order.length >= 3 ? ORDER_ITEM_THREE_SPACING : ORDER_ITEM_TWO_SPACING;
        const startX = -((customer.order.length - 1) * spacing) / 2;
        customer.order.forEach((item, index) => {
            const served = this.isItemPrepared(customer, item);
            const heatingForCustomer = (
                item.heated
                && this.microwave.customerId === customer.id
                && this.microwave.mode === 'heating'
            );
            const readyForCustomer = (
                item.heated
                && this.microwave.customerId === customer.id
                && this.microwave.mode === 'ready'
            );
            const icon = this.createNode(`Order-${item.productId}`, ORDER_ITEM_NODE_SIZE, ORDER_ITEM_NODE_SIZE, order);
            icon.setPosition(startX + index * spacing, ORDER_ITEM_Y, 0);
            const itemError = errorActive && this.errorFx?.productId === item.productId;
            this.drawRect(
                icon,
                ORDER_ITEM_SLOT_SIZE,
                ORDER_ITEM_SLOT_SIZE,
                14,
                itemError ? this.color(255, 232, 232, 240) : served ? this.color(236, 228, 214, 170) : this.color(255, 255, 255, 220),
                itemError ? this.color(216, 67, 67) : this.color(120, 89, 143, served ? 90 : 210),
                itemError ? 5 : 3,
            );
            this.addProductSprite(icon, item.productId, served ? 50 : 56);
            if (item.heated && !served) {
                const heatBadge = this.createNode(`OrderHeat-${item.productId}`, 28, 28, order);
                heatBadge.setPosition(startX + index * spacing + 31, ORDER_ITEM_Y + 31, 0);
                this.drawRect(
                    heatBadge,
                    28,
                    28,
                    14,
                    heatingForCustomer ? this.color(255, 158, 168) : readyForCustomer ? this.color(255, 194, 71) : this.color(120, 89, 143),
                    this.color(255, 255, 255),
                    3,
                );
                this.addLabel(heatBadge, readyForCustomer ? '✓' : '火', 0, 0, 16, this.color(255, 255, 255), true, 22);
            }
            if (served) {
                const check = this.createNode(`OrderServed-${item.productId}`, 32, 32, order);
                check.setPosition(startX + index * spacing + 30, ORDER_ITEM_Y - 24, 0);
                this.drawRect(check, 32, 32, 16, this.color(103, 199, 165), this.color(255, 255, 255), 3);
                this.addLabel(check, '✓', 1, 0, 21, this.color(255, 255, 255), true, 24);
            }
        });
        const ratio = Math.max(0, customer.patience / customer.maxPatience);
        const patienceHeartFrame = this.formalUiFrames.get('heart');
        if (patienceHeartFrame) {
            this.addArtwork(
                order,
                'PatienceHeart',
                patienceHeartFrame,
                38,
                38,
                ORDER_PATIENCE_HEART_X,
                ORDER_PATIENCE_Y,
            );
        } else {
            const heart = this.createNode('PatienceHeart', 34, 34, order);
            heart.setPosition(ORDER_PATIENCE_HEART_X, ORDER_PATIENCE_Y, 0);
            this.drawRect(heart, 34, 34, 17, this.color(255, 98, 84), this.color(51, 33, 62), 4);
            this.addLabel(heart, '❤', 0, 1, 20, this.color(255, 255, 255), true, 28);
        }

        const bar = this.createNode('Patience', ORDER_PATIENCE_BAR_WIDTH, 22, order);
        bar.setPosition(ORDER_PATIENCE_BAR_X, ORDER_PATIENCE_Y, 0);
        this.drawRect(bar, ORDER_PATIENCE_BAR_WIDTH, 22, 11, this.color(51, 33, 62));

        const fillRatio = Math.max(8 / ORDER_PATIENCE_FILL_WIDTH, ratio);
        const fill = this.createNode('PatienceFill', ORDER_PATIENCE_FILL_WIDTH, 12, bar);
        fill.setPosition((ORDER_PATIENCE_FILL_WIDTH / 2) * (fillRatio - 1), 0, 0);
        fill.setScale(new Vec3(fillRatio, 1, 1));
        const fillColor = ratio > 0.55
            ? this.color(103, 199, 165)
            : ratio > 0.25
                ? this.color(255, 194, 71)
                : this.color(255, 98, 84);
        this.drawRect(fill, ORDER_PATIENCE_FILL_WIDTH, 12, 6, fillColor);
        this.patienceFillNodes.set(customer.id, fill);
    }

    private renderWorkstation() {
        const workstationBand = this.createNode('WorkstationBand', DESIGN_WIDTH, WORKSTATION_HEIGHT, this.node);
        workstationBand.setPosition(0, WORKSTATION_Y, 0);
        this.drawRect(workstationBand, DESIGN_WIDTH, WORKSTATION_HEIGHT, 0, this.color(255, 243, 214, 248));
        this.addSurface(workstationBand, 'CounterShadow', DESIGN_WIDTH, 24, 0, this.color(51, 33, 62, 90), 0, 108);
        this.addSurface(workstationBand, 'CounterTop', DESIGN_WIDTH, 20, 0, this.color(51, 33, 62), 0, 96);
        this.addSurface(workstationBand, 'CounterTrim', DESIGN_WIDTH, 14, 0, this.color(54, 158, 170), 0, 80);

        this.addSurface(workstationBand, 'MicrowaveGroundShadow', 190, 14, 7, this.color(51, 33, 62, 42), MICROWAVE_X, EQUIPMENT_BASELINE_Y + 7);
        this.addSurface(workstationBand, 'DeliveryPadGroundShadow', 208, 12, 6, this.color(51, 33, 62, 32), DELIVERY_PAD_X, EQUIPMENT_BASELINE_Y + 6);
        this.addSurface(workstationBand, 'CashierGroundShadow', 184, 14, 7, this.color(51, 33, 62, 40), CASHIER_X, EQUIPMENT_BASELINE_Y + 7);

        const microwave = this.createNode('Microwave', 242, 182, workstationBand);
        microwave.setPosition(MICROWAVE_X, EQUIPMENT_BASELINE_Y - MICROWAVE_SCALE * EQUIPMENT_BASE_Y, 0);
        microwave.setScale(new Vec3(MICROWAVE_SCALE, MICROWAVE_SCALE, 1));
        const microwaveLocked = this.economy.microwaveLevel === 0;
        if (this.microwave.mode !== 'idle') {
            const glow = this.createNode('MicrowaveGlow', 224, 162, microwave);
            glow.setPosition(0, EQUIPMENT_BASE_Y + 166 / 2, 0);
            this.drawRect(
                glow,
                224,
                162,
                22,
                this.microwave.mode === 'ready' ? this.color(255, 194, 71, 54) : this.color(255, 98, 84, 42),
            );
        }
        this.drawMicrowaveFace(microwave, microwaveLocked, EQUIPMENT_BASE_Y + 166 / 2, this.microwave.mode);
        if (this.microwave.mode === 'heating') {
            const progressWidth = 194 * Math.max(0, 1 - this.microwave.remaining / getProcessingSeconds('microwave', this.economy.microwaveLevel));
            const track = this.createNode('HeatProgressTrack', 200, 14, microwave);
            track.setPosition(0, EQUIPMENT_BASE_Y + 6, 0);
            this.drawRect(track, 200, 14, 7, this.color(221, 211, 198));
            const fillWidth = Math.max(8, progressWidth);
            const fill = this.createNode('HeatProgressFill', fillWidth, 10, track);
            fill.setPosition((fillWidth - 194) / 2, 0, 0);
            this.drawRect(fill, fillWidth, 10, 5, this.color(255, 98, 84));
            this.microwaveProgressFill = fill;
        } else if (this.microwave.mode === 'ready') {
            const ready = this.createNode('MicrowaveReadyBadge', 38, 38, microwave);
            ready.setPosition(68, EQUIPMENT_BASE_Y + 126, 0);
            this.drawRect(ready, 38, 38, 19, this.color(103, 199, 165), this.color(255, 255, 255), 3);
            this.addLabel(ready, '✓', 1, 1, 25, this.color(255, 255, 255), true, 30);
        }
        microwave.on(Node.EventType.TOUCH_END, () => this.handleMicrowaveTap(), this);

        const tray = this.drawDeliveryTray(workstationBand, DELIVERY_PAD_X, this.getScaledEquipmentBaseY(120, DELIVERY_PAD_SCALE));
        tray.setScale(new Vec3(DELIVERY_PAD_SCALE, DELIVERY_PAD_SCALE, 1));
        this.renderTrayContents(tray);
        tray.on(Node.EventType.TOUCH_END, () => this.handleTrayTap(), this);
        const cashier = this.drawCashier(workstationBand, CASHIER_X, this.getScaledEquipmentBaseY(169, CASHIER_SCALE));
        cashier.setScale(new Vec3(CASHIER_SCALE, CASHIER_SCALE, 1));
    }

    private getScaledEquipmentBaseY(height: number, scale: number) {
        return EQUIPMENT_BASELINE_Y + height * (scale - 1) / 2;
    }

    private drawMicrowaveFace(parent: Node, locked: boolean, y = -16, mode: MicrowaveState['mode'] = 'idle') {
        if (this.unifiedMicrowaveFrame) {
            this.addArtwork(parent, 'MicrowaveUnifiedArt', this.unifiedMicrowaveFrame, 206, 166, 0, y);
            if (mode !== 'idle') {
                const windowGlow = this.createNode('MicrowaveWindowGlow', 84, 54, parent);
                windowGlow.setPosition(-40, y + 4, 0);
                this.drawRect(
                    windowGlow,
                    84,
                    54,
                    8,
                    mode === 'ready' ? this.color(255, 194, 71, 76) : this.color(255, 98, 84, 54),
                );
                const buttonGlow = this.createNode('MicrowaveButtonGlow', 34, 34, parent);
                buttonGlow.setPosition(70, y - 47, 0);
                this.drawRect(
                    buttonGlow,
                    34,
                    34,
                    11,
                    mode === 'ready' ? this.color(255, 194, 71, 115) : this.color(255, 98, 84, 105),
                );
            }
            return;
        }

        const bodyTone = locked ? this.color(185, 180, 176) : this.color(236, 228, 214);
        const door = this.createNode('MicrowaveDoor', 108, 72, parent);
        door.setPosition(-34, y + 6, 0);
        this.drawRect(door, 108, 72, 10, locked ? this.color(122, 122, 122) : this.color(42, 52, 58), this.color(20, 18, 25), 4);
        this.addSurface(door, 'DoorReflection', 86, 54, 8, locked ? this.color(160, 160, 160, 80) : this.color(80, 105, 118, 92), 0, 0);

        const handle = this.createNode('MicrowaveHandle', 10, 68, parent);
        handle.setPosition(26, y + 6, 0);
        this.drawRect(handle, 10, 68, 5, bodyTone, this.color(20, 18, 25), 2);

        const panel = this.createNode('MicrowavePanel', 44, 84, parent);
        panel.setPosition(68, y + 8, 0);
        this.drawRect(panel, 44, 84, 8, locked ? this.color(132, 130, 126) : this.color(38, 80, 82), this.color(20, 18, 25), 3);
        for (let index = 0; index < 3; index += 1) {
            this.addSurface(panel, `MicrowaveLight-${index}`, 9, 9, 4.5, locked ? this.color(190, 190, 190) : this.color(187, 222, 68), -12 + index * 12, 20);
        }
        const heatButton = this.createNode('MicrowaveHeatButton', 30, 30, panel);
        heatButton.setPosition(0, -24, 0);
        const heatFill = locked
            ? this.color(160, 150, 145)
            : mode === 'ready'
                ? this.color(255, 194, 71)
                : this.color(255, 98, 84);
        this.drawRect(heatButton, 30, 30, 9, heatFill, this.color(20, 18, 25), 2);
        this.addLabel(heatButton, '火', 0, 0, 17, this.color(255, 255, 255), true, 26);
    }

    private drawDeliveryTray(parent: Node, x: number, baseY: number) {
        let tray: Node;
        if (this.unifiedDeliveryPadFrame) {
            tray = this.addArtwork(parent, 'DeliveryPadUnifiedArt', this.unifiedDeliveryPadFrame, 244, 120, x, baseY + 120 / 2);
        } else {
            tray = this.createNode('DeliveryTray', 238, 82, parent);
            tray.setPosition(x, baseY + 82 / 2, 0);
            this.drawRect(tray, 238, 76, 18, this.color(44, 147, 142), this.color(20, 18, 25), 4);
            this.addSurface(tray, 'TrayPad', 202, 52, 12, this.color(255, 250, 239), 0, 0);
            this.addSurface(tray, 'TrayPadShadow', 176, 6, 3, this.color(221, 211, 198), -4, -14);
        }
        return tray;
    }

    private renderTrayContents(tray: Node) {
        const errorActive = Boolean(this.errorFx && (this.errorFx.target === 'tray' || this.errorFx.target === 'both'));
        if (errorActive) {
            const glow = this.createNode('TrayErrorGlow', 260, 132, tray);
            this.drawRect(glow, 260, 132, 28, this.color(216, 67, 67, 76));
        }

        if (this.tray.items.length === 0) {
            return;
        }

        const customer = this.getTrayCustomer();
        const ready = customer ? this.isTrayReadyFor(customer) : false;
        const labelFill = ready ? this.color(103, 199, 165, 238) : this.color(120, 89, 143, 228);
        this.addLabel(
            tray,
            ready ? 'READY' : `给${this.getCustomerSide(this.tray.customerId)}`,
            0,
            42,
            ready ? 20 : 15,
            this.color(255, 255, 255),
            true,
            ready ? 98 : 122,
            labelFill,
        );

        const spacing = this.tray.items.length >= 3 ? 48 : 58;
        const startX = -((this.tray.items.length - 1) * spacing) / 2;
        this.tray.items.forEach((item, index) => {
            const slot = this.createNode(`TrayItem-${index}`, 48, 48, tray);
            slot.setPosition(startX + index * spacing, -4, 0);
            this.drawRect(slot, 48, 48, 13, this.color(255, 255, 255, 226), this.color(51, 33, 62, 160), 2);
            this.addProductSprite(slot, item.productId, 39);
            if (item.heated) {
                const heat = this.createNode(`TrayHeat-${index}`, 22, 22, tray);
                heat.setPosition(startX + index * spacing + 22, 19, 0);
                this.drawRect(heat, 22, 22, 11, this.color(255, 98, 84), this.color(255, 255, 255), 2);
                this.addLabel(heat, '火', 0, 0, 13, this.color(255, 255, 255), true, 18);
            }
        });
    }

    private drawCashier(parent: Node, x: number, baseY: number): Node {
        const collecting = Boolean(this.paymentBurst);
        const screenLabel = '营业额';
        const screenValue = `${this.revenue}`;
        const screenFill = collecting
            ? this.color(77, 154, 70, 235)
            : this.color(53, 116, 54, 226);
        if (this.unifiedCashierFrame) {
            const cashier = this.addArtwork(parent, 'CashierUnifiedArt', this.unifiedCashierFrame, 218, 169, x, baseY + 169 / 2);
            const screen = this.createNode('CashierAmountOverlay', 94, 48, cashier);
            screen.setPosition(-26, 40, 0);
            this.drawRect(screen, 94, 48, 8, screenFill, this.color(20, 18, 25), 2);
            this.addLabel(screen, screenLabel, -18, 10, 14, this.color(210, 240, 190), true, 52);
            this.addLabel(screen, screenValue, 14, -8, 23, this.color(255, 255, 255), true, 64);
            return cashier;
        }

        const cashier = this.createNode('Cashier', 218, 132, parent);
        cashier.setPosition(x, baseY + 132 / 2, 0);
        this.drawRect(cashier, 218, 132, 22, this.color(51, 48, 55), this.color(51, 33, 62), 5);

        const screen = this.createNode('CashierScreen', 118, 66, cashier);
        screen.setPosition(-24, 20, 0);
        this.drawRect(screen, 118, 66, 10, screenFill, this.color(20, 18, 25), 4);
        this.addLabel(screen, screenLabel, -24, 16, 15, this.color(210, 240, 190), true, 64);
        this.addLabel(screen, screenValue, 16, -8, 28, this.color(255, 255, 255), true, 78);

        const printer = this.createNode('ReceiptPrinter', 36, 82, cashier);
        printer.setPosition(78, 12, 0);
        this.drawRect(printer, 36, 82, 8, this.color(28, 30, 34), this.color(20, 18, 25), 3);
        this.addSurface(printer, 'ReceiptPaper', 24, 38, 4, this.color(255, 250, 239), 0, 24);

        const keyColors = [this.color(236, 228, 214), this.color(236, 228, 214), this.color(103, 199, 165), this.color(255, 98, 84)];
        keyColors.forEach((fill, index) => {
            const key = this.createNode(`CashierKey-${index}`, 28, 18, cashier);
            key.setPosition(-78 + (index % 2) * 34, -40 - Math.floor(index / 2) * 22, 0);
            this.drawRect(key, 28, 18, 5, fill, this.color(20, 18, 25), 2);
        });
        return cashier;
    }

    private renderProducts() {
        PRODUCT_IDS.forEach((productId, index) => {
            const column = index % 3;
            const row = Math.floor(index / 3);
            const x = -PRODUCT_GRID_COLUMN_SPACING + column * PRODUCT_GRID_COLUMN_SPACING;
            const y = PRODUCT_GRID_START_Y - row * PRODUCT_GRID_ROW_GAP;
            const card = this.createNode(`Product-${productId}`, PRODUCT_CARD_WIDTH, PRODUCT_CARD_HEIGHT, this.node);
            card.setPosition(x, y, 0);
            const locked = !this.economy.unlockedProductIds.includes(productId);
            const isRestocking = this.restocking.has(productId);
            const empty = this.stock[productId] <= 0;
            const activeCustomer = this.customers[this.activeCustomerIndex];
            const needed = this.findNeededItem(activeCustomer, productId);
            const highlightNeeded = needed && activeCustomer.showHint;
            const hasFormalCard = this.hasLayeredProductCard(productId);
            this.renderProductCardBackground(card, productId, Boolean(highlightNeeded), locked || empty);
            const iconMount = this.createNode(`ProductIconMount-${productId}`, PRODUCT_ICON_PANEL_WIDTH, PRODUCT_ICON_PANEL_HEIGHT, card);
            iconMount.setPosition(0, PRODUCT_ICON_MOUNT_Y, 0);
            const iconSize = hasFormalCard
                ? productId === 'rice-ball' ? 100 : 94
                : productId === 'rice-ball' ? 116 : 110;
            this.addProductSprite(iconMount, productId, locked ? 98 : iconSize);
            this.addLabel(
                card,
                PRODUCT_CATALOG[productId].displayName,
                0,
                hasFormalCard ? -38 : PRODUCT_NAME_Y,
                hasFormalCard ? 18 : 22,
                this.color(51, 33, 62),
                true,
                184,
            );

            const shelfTag = this.createNode(`ShelfStock-${productId}`, 126, 36, card);
            shelfTag.setPosition(PRODUCT_STOCK_LABEL_X, hasFormalCard ? -91 : PRODUCT_STOCK_LABEL_Y, 0);
            this.addLabel(shelfTag, `货架 ${this.stock[productId]}`, 0, 0, 16, this.color(255, 255, 255), true, 86);

            if (empty && !isRestocking && !locked) {
                this.addLabel(
                    card,
                    this.economy.warehouseStock[productId] > 0 ? '补货中' : '售罄',
                    0,
                    8,
                    22,
                    this.color(255, 255, 255),
                    true,
                    132,
                    this.economy.warehouseStock[productId] > 0 ? this.color(255, 194, 71) : this.color(255, 98, 84),
                );
            }
            if (locked) {
                this.addLabel(card, '营业后解锁', 0, 0, 20, this.color(255, 255, 255), true, 132, this.color(160, 150, 145));
            }

            card.on(Node.EventType.TOUCH_END, () => this.handleProductTap(productId, card), this);
        });
    }

    private renderProductCardBackground(card: Node, productId: ProductId, highlighted: boolean, muted: boolean) {
        const skin = this.getProductCardSkin(productId);
        if (highlighted) {
            const glow = this.createNode(`ProductNeedGlow-${productId}`, PRODUCT_CARD_WIDTH + 12, PRODUCT_CARD_HEIGHT + 12, card);
            this.drawRect(
                glow,
                PRODUCT_CARD_WIDTH + 12,
                PRODUCT_CARD_HEIGHT + 12,
                33,
                skin === 'heat' ? this.color(255, 98, 84, 58) : this.color(255, 194, 71, 58),
                skin === 'heat' ? this.color(255, 98, 84, 150) : this.color(255, 194, 71, 150),
                4,
            );
        }

        const badgeFrame = this.productCardBadgeFrames.get(skin);
        if (this.productCardBaseFrame && badgeFrame) {
            this.addArtwork(
                card,
                `ProductCardBaseArt-${productId}`,
                this.productCardBaseFrame,
                PRODUCT_CARD_WIDTH,
                PRODUCT_CARD_HEIGHT,
            );
            const badgeSize = PRODUCT_CARD_BADGES[skin];
            this.addArtwork(
                card,
                `ProductCardBadgeArt-${productId}`,
                badgeFrame,
                badgeSize.width,
                badgeSize.height,
                badgeSize.x,
                badgeSize.y,
            );
            if (muted) {
                const overlay = this.createNode(`ProductMutedOverlay-${productId}`, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, card);
                this.drawRect(overlay, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, 26, this.color(255, 255, 255, 110));
            }
            return;
        }

        const productBorder = highlighted
            ? skin === 'heat'
                ? this.color(255, 98, 84)
                : this.color(255, 194, 71)
            : muted
                ? this.color(160, 150, 145)
                : PRODUCT_COLORS[productId];

        this.drawRect(
            card,
            PRODUCT_CARD_WIDTH,
            PRODUCT_CARD_HEIGHT,
            28,
            muted ? this.color(235, 225, 215) : this.color(255, 250, 239),
            productBorder,
            highlighted ? 8 : 5,
        );

        this.addSurface(
            card,
            `ProductImagePanel-${productId}`,
            PRODUCT_ICON_PANEL_WIDTH,
            PRODUCT_ICON_PANEL_HEIGHT,
            18,
            muted ? this.color(242, 233, 222) : this.color(255, 250, 239),
            0,
            PRODUCT_ICON_MOUNT_Y,
        );
        this.addSurface(
            card,
            `ProductImageShelfShadow-${productId}`,
            92,
            8,
            4,
            this.color(51, 33, 62, 34),
            0,
            PRODUCT_ICON_MOUNT_Y - 56,
        );
        this.addSurface(card, `ShelfLine-${productId}`, 136, 10, 5, this.color(221, 211, 198, 190), 0, -28);

        const shelfStockBg = this.createNode(`ShelfStockBg-${productId}`, 126, 36, card);
        shelfStockBg.setPosition(PRODUCT_STOCK_LABEL_X, PRODUCT_STOCK_LABEL_Y, 0);
        this.drawRect(shelfStockBg, 126, 36, 13, this.color(44, 147, 142), this.color(51, 33, 62), 3);

        this.renderProductCardBadge(card, productId, skin);

        if (muted) {
            const overlay = this.createNode(`ProductMutedOverlay-${productId}`, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, card);
            this.drawRect(overlay, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, 26, this.color(255, 255, 255, 110));
        }
    }

    private renderProductCardBadge(card: Node, productId: ProductId, skin: ProductCardSkin) {
        if (skin === 'leaf') {
            return;
        }
        const badge = this.createNode(`ProductBadge-${productId}`, 74, 32, card);
        badge.setPosition(-52, 101, 0);
        const fill = skin === 'heat'
            ? this.color(255, 98, 84)
            : this.color(255, 194, 71);
        const text = skin === 'heat' ? '热食' : '热门';
        this.drawRect(badge, 74, 32, 16, fill);
        this.addLabel(badge, text, 0, 0, 15, this.color(255, 255, 255), true, 58);
    }

    private hasLayeredProductCard(productId: ProductId) {
        const skin = this.getProductCardSkin(productId);
        return Boolean(this.productCardBaseFrame && this.productCardBadgeFrames.has(skin));
    }

    private getProductCardSkin(productId: ProductId): ProductCardSkin {
        if (isProductProcessable(productId, 'microwave')) {
            return 'heat';
        }
        if (PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory) {
            return 'star';
        }
        return 'leaf';
    }

    private renderMessage() {
        const message = this.createNode('Message', 660, 64, this.node);
        message.setPosition(0, -610, 0);
        const toneColors: Record<FeedbackTone, Color> = {
            info: this.color(51, 33, 62),
            success: this.color(32, 137, 126),
            warning: this.color(218, 139, 37),
            error: this.color(216, 67, 67),
            heat: this.color(224, 102, 120),
        };
        const toneLabels: Record<FeedbackTone, string> = {
            info: '提示',
            success: '成功',
            warning: '注意',
            error: '错误',
            heat: '加热',
        };
        this.drawRect(message, 660, 64, 22, toneColors[this.feedbackTone], this.color(255, 255, 255), 3);
        this.addLabel(message, `${toneLabels[this.feedbackTone]}｜${this.message}`, -82, 0, 21, this.color(255, 255, 255), true, 430);
        this.addButton(
            message,
            this.getStopAcceptingLabel(),
            238,
            0,
            142,
            44,
            this.getStopAcceptingColor(),
            () => this.handleStopAccepting(),
        );
    }

    private getStopAcceptingLabel() {
        if (this.closingRequested) {
            return `清场中 ${this.customers.length}`;
        }
        if (this.closeConfirmArmed) {
            return '确认关店';
        }
        return this.isAllSellableInventoryEmpty() ? '库存售空' : '停止接客';
    }

    private getStopAcceptingColor() {
        if (this.closingRequested) {
            return this.color(160, 150, 145);
        }
        if (this.closeConfirmArmed || this.isAllSellableInventoryEmpty()) {
            return this.color(255, 98, 84);
        }
        return this.color(120, 89, 143);
    }

    private renderHomePanel() {
        const warehouseUnits = this.getWarehouseUnits();
        const capacity = getWarehouseCapacity(this.economy.storeLevel);
        this.addSurface(this.node, 'HomeOverlay', DESIGN_WIDTH, 1160, 0, this.color(255, 250, 239, 248), 0, -25);
        this.addLabel(this.node, '怪兽便利店', 0, 510, 46, this.color(51, 33, 62), true, 600);
        this.addLabel(this.node, `第 ${this.currentDay} 轮经营中心`, 0, 450, 24, this.color(120, 89, 143), true, 420);

        const trend = this.createNode('HomeTrend', 330, 120, this.node);
        trend.setPosition(-180, 345, 0);
        this.drawRect(trend, 330, 120, 18, this.color(255, 255, 255), this.color(255, 98, 84), 5);
        this.addLabel(trend, '明日热门', 0, 34, 19, this.color(255, 98, 84), true, 280);
        this.addLabel(trend, CATEGORY_NAMES[this.economy.nextTrendCategory], 0, -18, 30, this.color(51, 33, 62), true, 280);

        const strategy = this.createNode('HomeStrategy', 330, 120, this.node);
        strategy.setPosition(180, 345, 0);
        const strategyReady = Boolean(this.economy.nextStrategy) || this.isTrialRound();
        this.drawRect(
            strategy,
            330,
            120,
            18,
            this.color(255, 255, 255),
            strategyReady ? this.color(54, 158, 170) : this.color(255, 98, 84),
            5,
        );
        this.addLabel(strategy, '经营策略', 0, 34, 19, strategyReady ? this.color(54, 158, 170) : this.color(255, 98, 84), true, 280);
        this.addLabel(
            strategy,
            this.economy.nextStrategy
                ? STRATEGY_NAMES[this.economy.nextStrategy]
                : this.isTrialRound() ? '新店试营业' : '待选择',
            0,
            -18,
            28,
            this.color(51, 33, 62),
            true,
            280,
        );

        this.addLabel(this.node, `仓库库存 ${warehouseUnits}/${capacity}`, -220, 255, 22, this.color(51, 33, 62), true, 260);
        this.addLabel(this.node, `累计利润 ${this.economy.lifetimeProfit}`, 0, 255, 22, this.color(51, 33, 62), true, 230);
        this.addLabel(
            this.node,
            this.isTrialRound() ? '首轮目标 9 单' : `上轮 ${this.economy.lastRating.toFixed(1)} 星`,
            220,
            255,
            22,
            this.color(51, 33, 62),
            true,
            230,
        );

        PRODUCT_IDS.forEach((productId, index) => {
            const column = index % 3;
            const row = Math.floor(index / 3);
            this.renderHomeInventoryCard(productId, -240 + column * 240, 115 - row * 185);
        });

        if (!strategyReady) {
            this.renderStrategyChoices(-265, -370);
            this.addLabel(
                this.node,
                '选择任意经营策略后，即可进入经营前准备',
                0,
                -500,
                20,
                this.color(255, 255, 255),
                true,
                650,
                this.color(255, 98, 84),
            );
            return;
        }

        this.addLabel(
            this.node,
            `设备：货架 Lv.${this.economy.shelfLevel} · 微波炉 Lv.${this.economy.microwaveLevel} · 仓库容量 ${capacity}`,
            0,
            -305,
            20,
            this.color(120, 89, 143),
            true,
            650,
        );
        this.addButton(this.node, '经营前准备', 0, -420, 630, 110, this.color(54, 158, 170), () => this.enterPreparation());
        this.addLabel(
            this.node,
            this.economy.nextStrategy
                ? `已选择${STRATEGY_NAMES[this.economy.nextStrategy]}，确认库存后开始营业`
                : '试营业目标：完成 9 单，优秀目标：完成 11 单',
            0,
            -510,
            20,
            this.color(255, 255, 255),
            true,
            650,
            this.color(54, 158, 170),
        );
    }

    private renderHomeInventoryCard(productId: ProductId, x: number, y: number) {
        const unlocked = this.economy.unlockedProductIds.includes(productId);
        const card = this.createNode(`HomeInventory-${productId}`, 215, 160, this.node);
        card.setPosition(x, y, 0);
        const trend = PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory;
        this.drawRect(
            card,
            215,
            160,
            18,
            unlocked ? this.color(255, 255, 255) : this.color(235, 225, 215),
            trend && unlocked ? this.color(255, 98, 84) : unlocked ? PRODUCT_COLORS[productId] : this.color(160, 150, 145),
            trend && unlocked ? 7 : 4,
        );
        this.addProductSprite(card, productId, 78);
        this.addLabel(card, PRODUCT_CATALOG[productId].displayName, 0, 58, 18, this.color(51, 33, 62), true, 190);
        this.addLabel(
            card,
            unlocked ? `库存 ${this.economy.warehouseStock[productId]} · 上轮 ${this.economy.lastSales[productId]}` : '尚未解锁',
            0,
            -58,
            16,
            unlocked ? this.color(120, 89, 143) : this.color(160, 150, 145),
            true,
            190,
        );
        if (trend && unlocked) {
            this.addLabel(card, '热门', -70, 58, 14, this.color(255, 255, 255), true, 60, this.color(255, 98, 84));
        }
    }

    private renderPreparationPanel() {
        const cartUnits = this.getPurchaseCartUnits();
        const cartCost = this.getPurchaseCartCost();
        const warehouseUnits = this.getWarehouseUnits();
        const capacity = getWarehouseCapacity(this.economy.storeLevel);

        this.addSurface(this.node, 'PreparationOverlay', DESIGN_WIDTH, 1160, 0, this.color(255, 250, 239, 250), 0, -25);
        this.addLabel(this.node, '经营前准备', 0, 500, 42, this.color(51, 33, 62), true, 560);
        this.addLabel(
            this.node,
            `明日热门：${CATEGORY_NAMES[this.economy.nextTrendCategory]}`,
            0,
            435,
            23,
            this.color(255, 255, 255),
            true,
            620,
            this.color(255, 98, 84),
        );
        this.addLabel(this.node, `经营资金 ${this.economy.wallet}`, -225, 375, 22, this.color(51, 33, 62), true, 220);
        this.addLabel(this.node, `仓库 ${warehouseUnits + cartUnits}/${capacity}`, 0, 375, 22, this.color(51, 33, 62), true, 220);
        this.addLabel(this.node, `采购支出 ${cartCost}`, 225, 375, 22, this.color(255, 98, 84), true, 220);

        PRODUCT_IDS.forEach((productId, index) => {
            const column = index % 3;
            const row = Math.floor(index / 3);
            const x = -244 + column * 244;
            const y = 205 - row * 235;
            this.renderPurchaseCard(productId, x, y);
        });

        this.addButton(this.node, '补至基础库存', -205, -420, 280, 78, this.color(120, 89, 143), () => this.fillBasicPurchase());
        this.addButton(this.node, '确认采购并营业', 165, -420, 390, 78, this.color(54, 158, 170), () => this.confirmPurchase());
        this.addButton(this.node, '返回经营中心', -250, -520, 230, 58, this.color(51, 33, 62), () => this.leavePreparation());
        this.addLabel(this.node, this.shopMessage, 80, -520, 19, this.color(51, 33, 62), true, 470);
    }

    private renderPurchaseCard(productId: ProductId, x: number, y: number) {
        const unlocked = this.economy.unlockedProductIds.includes(productId);
        const economy = PRODUCT_ECONOMY[productId];
        const card = this.createNode(`Purchase-${productId}`, 218, 205, this.node);
        card.setPosition(x, y, 0);
        const trend = economy.category === this.economy.nextTrendCategory;
        this.drawRect(
            card,
            218,
            205,
            20,
            unlocked ? this.color(255, 255, 255) : this.color(235, 225, 215),
            trend ? this.color(255, 98, 84) : unlocked ? PRODUCT_COLORS[productId] : this.color(160, 150, 145),
            trend ? 8 : 4,
        );
        this.addProductSprite(card, productId, 82);
        this.addLabel(card, PRODUCT_CATALOG[productId].displayName, 0, 76, 19, this.color(51, 33, 62), true, 190);
        this.addLabel(
            card,
            unlocked ? `库存 ${this.economy.warehouseStock[productId]}` : '尚未解锁',
            0,
            -45,
            17,
            this.color(120, 89, 143),
            true,
            110,
        );
        if (trend && unlocked) {
            this.addLabel(card, '热门', 68, 45, 14, this.color(255, 255, 255), true, 58, this.color(255, 98, 84));
        }
        if (!unlocked) {
            return;
        }

        const guidance = this.getPurchaseGuidance(productId);
        this.addLabel(
            card,
            this.getPurchaseGuidanceLabel(guidance),
            -68,
            45,
            14,
            this.color(255, 255, 255),
            true,
            64,
            this.getPurchaseGuidanceColor(guidance),
        );
        this.addButton(card, '−', -72, -78, 52, 44, this.color(120, 89, 143), () => this.adjustPurchase(productId, -1));
        this.addLabel(card, `+${this.purchaseCart[productId]}`, 0, -78, 20, this.color(51, 33, 62), true, 68);
        this.addButton(card, '+', 72, -78, 52, 44, this.color(54, 158, 170), () => this.adjustPurchase(productId, 1));
    }

    private renderEndPanel() {
        const profit = this.revenue - this.goodsCost;
        this.addSurface(this.node, 'SettlementOverlay', DESIGN_WIDTH, 1160, 0, this.color(255, 250, 239, 248), 0, -25);
        this.addLabel(this.node, `第 ${this.currentDay} 轮营业结算`, 0, 500, 40, this.color(51, 33, 62), true, 600);
        this.addLabel(this.node, `营业额 ${this.revenue}`, -220, 430, 25, this.color(54, 158, 170), true, 190);
        this.addLabel(this.node, `进货成本 ${this.goodsCost}`, 0, 430, 25, this.color(255, 98, 84), true, 210);
        this.addLabel(this.node, `净利润 ${profit}`, 220, 430, 25, profit >= 0 ? this.color(54, 158, 170) : this.color(255, 98, 84), true, 190);
        this.addPill(this.node, `资金 ${this.economy.wallet}`, -220, 365, 200, 56, this.color(54, 158, 170));
        this.addPill(this.node, `本轮 ${this.roundRating.toFixed(1)} 星`, 0, 365, 200, 56, this.color(255, 194, 71));
        this.addPill(this.node, `口碑 ${this.economy.reputation}`, 220, 365, 200, 56, this.color(51, 33, 62));
        this.addLabel(this.node, '经营升级', 0, 295, 30, this.color(51, 33, 62), true, 400);

        const nextProduct = PRODUCT_IDS.find((productId) => !this.economy.unlockedProductIds.includes(productId));
        if (nextProduct) {
            const economy = PRODUCT_ECONOMY[nextProduct];
            this.renderUpgradeCard(
                `解锁 ${PRODUCT_CATALOG[nextProduct].displayName}`,
                `售价 ${economy.sellPrice} · 成本 ${economy.buyCost}`,
                economy.unlockCost,
                -235,
                175,
                () => this.unlockNextProduct(),
            );
        } else {
            this.renderUpgradeCard('商品图鉴', '全部商品已解锁', undefined, -235, 175, () => undefined);
        }

        this.renderSystemUpgradeCard('shelf', 0, 175);
        this.renderSystemUpgradeCard('store', 235, 175);
        this.renderSystemUpgradeCard('microwave', -235, -15);

        this.addButton(this.node, '返回经营中心', 117, -15, 445, 150, this.color(54, 158, 170), () => this.returnToHome());
        this.addLabel(this.node, `完成 ${this.completed} 单 · 流失 ${this.missed} 位顾客 · 累计利润 ${this.economy.lifetimeProfit}`, 0, -155, 22, this.color(51, 33, 62), true, 650);
        this.addLabel(this.node, this.shopMessage, 0, -215, 21, this.color(255, 255, 255), true, 650, profit >= 0 ? this.color(54, 158, 170) : this.color(255, 98, 84));
        this.renderStrategyChoices();
    }

    private renderStrategyChoices(titleY = -300, cardY = -405) {
        const tier = this.getStrategyTier();
        this.addLabel(this.node, `选择下一轮经营策略 · 好评加成 Lv.${tier}`, 0, titleY, 24, this.color(51, 33, 62), true, 620);
        const details: Record<OperationStrategy, string> = {
            traffic: `售价 +${tier * 6}% · 顾客耐心缩短`,
            tips: `快速服务额外小费 +${tier * 3}`,
            hours: `营业时间 +${tier * 8} 秒`,
        };
        const strategies: OperationStrategy[] = ['traffic', 'tips', 'hours'];
        strategies.forEach((strategy, index) => {
            const selected = this.economy.nextStrategy === strategy;
            const card = this.createNode(`Strategy-${strategy}`, 220, 120, this.node);
            card.setPosition(-240 + index * 240, cardY, 0);
            this.drawRect(
                card,
                220,
                120,
                18,
                selected ? this.color(255, 250, 239) : this.color(255, 255, 255),
                selected ? this.color(255, 98, 84) : this.color(120, 89, 143),
                selected ? 8 : 4,
            );
            this.addLabel(card, selected ? `已选 · ${STRATEGY_NAMES[strategy]}` : STRATEGY_NAMES[strategy], 0, 28, 20, this.color(51, 33, 62), true, 200);
            this.addLabel(card, details[strategy], 0, -24, 15, this.color(120, 89, 143), true, 200);
            card.on(Node.EventType.TOUCH_END, () => this.selectStrategy(strategy), this);
        });
    }

    private renderUpgradeCard(
        title: string,
        detail: string,
        cost: number | undefined,
        x: number,
        y: number,
        onClick: () => void,
    ) {
        const card = this.createNode(`Upgrade-${title}`, 210, 160, this.node);
        card.setPosition(x, y, 0);
        const affordable = cost === undefined || this.economy.wallet >= cost;
        const border = cost === undefined
            ? this.color(160, 150, 145)
            : affordable ? this.color(54, 158, 170) : this.color(255, 98, 84);
        this.drawRect(card, 210, 160, 18, this.color(255, 255, 255), border, 5);
        this.addLabel(card, title, 0, 48, 20, this.color(51, 33, 62), true, 188);
        this.addLabel(card, detail, 0, 8, 16, this.color(120, 89, 143), true, 188);
        this.addLabel(
            card,
            cost === undefined ? '已满级' : `${cost} 金币`,
            0,
            -48,
            18,
            this.color(255, 255, 255),
            true,
            150,
            border,
        );
        if (cost !== undefined) {
            card.on(Node.EventType.TOUCH_END, onClick, this);
        }
    }

    private renderSystemUpgradeCard(kind: UpgradeKind, x: number, y: number) {
        const level = this.getUpgradeLevel(kind);
        const cost = getUpgradeCost(kind, level);
        const titles: Record<UpgradeKind, string> = {
            shelf: `货架 Lv.${level}`,
            microwave: level === 0 ? '购买微波炉' : `微波炉 Lv.${level}`,
            store: `便利店 Lv.${level}`,
        };
        const details: Record<UpgradeKind, string> = {
            shelf: `库存 ${getStockCap(level)} · 补货 ${getRestockSeconds(level).toFixed(1)}秒`,
            microwave: level === 0
                ? this.economy.unlockedProductIds.includes('rice-ball') ? '解锁热食高价订单' : '需先解锁微笑饭团'
                : `加热 ${getHeatSeconds(level).toFixed(1)}秒`,
            store: level === 1 ? '提升组合订单与客流压力' : level === 2 ? '升级后开放急客高峰' : '最高客流等级',
        };
        this.renderUpgradeCard(titles[kind], details[kind], cost, x, y, () => this.buyUpgrade(kind));
    }

    private unlockNextProduct() {
        const productId = PRODUCT_IDS.find((candidate) => !this.economy.unlockedProductIds.includes(candidate));
        if (!productId) {
            return;
        }
        const cost = PRODUCT_ECONOMY[productId].unlockCost;
        if (this.economy.wallet < cost) {
            this.shopMessage = `资金不足，还需要 ${cost - this.economy.wallet} 金币`;
            this.render();
            return;
        }
        this.economy.wallet -= cost;
        this.economy.unlockedProductIds.push(productId);
        this.shopMessage = `${PRODUCT_CATALOG[productId].displayName} 已解锁，下轮开始出现在订单中`;
        this.saveEconomy();
        this.render();
    }

    private buyUpgrade(kind: UpgradeKind) {
        const level = this.getUpgradeLevel(kind);
        const cost = getUpgradeCost(kind, level);
        if (kind === 'microwave' && level === 0 && !this.economy.unlockedProductIds.includes('rice-ball')) {
            this.shopMessage = '先解锁微笑饭团，再购买微波炉开启热食路线';
            this.render();
            return;
        }
        if (cost === undefined || level >= UPGRADE_MAX_LEVEL[kind]) {
            this.shopMessage = '该设备已经达到最高等级';
            this.render();
            return;
        }
        if (this.economy.wallet < cost) {
            this.shopMessage = `资金不足，还需要 ${cost - this.economy.wallet} 金币`;
            this.render();
            return;
        }
        this.economy.wallet -= cost;
        if (kind === 'shelf') {
            this.economy.shelfLevel += 1;
        } else if (kind === 'microwave') {
            this.economy.microwaveLevel += 1;
        } else {
            this.economy.storeLevel += 1;
        }
        this.shopMessage = '升级完成，新能力将在下一轮营业生效';
        this.saveEconomy();
        this.render();
    }

    private selectStrategy(strategy: OperationStrategy) {
        this.economy.nextStrategy = strategy;
        this.shopMessage = `已选择${STRATEGY_NAMES[strategy]}，将在下一轮营业生效`;
        this.saveEconomy();
        this.render();
    }

    private getUpgradeLevel(kind: UpgradeKind): number {
        if (kind === 'shelf') {
            return this.economy.shelfLevel;
        }
        if (kind === 'microwave') {
            return this.economy.microwaveLevel;
        }
        return this.economy.storeLevel;
    }

    private getProcessingDeviceLevel(deviceId: ProcessingDeviceId): number {
        if (deviceId === 'microwave') {
            return this.economy.microwaveLevel;
        }
        return 0;
    }

    private getTrayCustomer(): CustomerState | undefined {
        return this.customers.find((customer) => customer.id === this.tray.customerId);
    }

    private isTrayLockedForOtherCustomer(customer: CustomerState): boolean {
        return this.tray.customerId !== undefined && this.tray.customerId !== customer.id;
    }

    private ensureTrayForCustomer(customer: CustomerState, productId: ProductId | undefined, x: number, y: number): boolean {
        if (this.isTrayLockedForOtherCustomer(customer)) {
            this.setFeedback(`托盘正在准备${this.getCustomerSide(this.tray.customerId)}顾客订单，先完成这份托盘`, 'warning', x, y);
            this.setErrorFx(customer.id, productId, 'tray');
            this.render();
            this.shakeTray();
            return false;
        }
        if (this.tray.customerId === undefined) {
            this.tray.customerId = customer.id;
        }
        return true;
    }

    private addTrayItem(customer: CustomerState, item: OrderItem) {
        this.tray.customerId = customer.id;
        this.tray.items.push(item);
    }

    private clearTray() {
        this.tray = { items: [] };
    }

    private clearTrayForCustomer(customerId: number | undefined) {
        if (customerId !== undefined && this.tray.customerId === customerId) {
            this.clearTray();
        }
    }

    private isTrayReadyFor(customer: CustomerState): boolean {
        if (this.tray.customerId !== customer.id || this.tray.items.length === 0) {
            return false;
        }
        const prepared = [...customer.served, ...this.tray.items];
        return customer.order.every((item) => prepared.some((candidate) => this.sameItem(candidate, item)));
    }

    private getMissingTrayItemNames(customer: CustomerState): string[] {
        return customer.order
            .filter((item) => !this.isItemPrepared(customer, item))
            .map((item) => PRODUCT_CATALOG[item.productId].displayName);
    }

    private handleProductTap(productId: ProductId, card: Node) {
        const feedbackX = card.position.x;
        const feedbackY = card.position.y + 140;
        if (!this.economy.unlockedProductIds.includes(productId)) {
            this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 尚未取得销售许可`, 'info', feedbackX, feedbackY);
            this.render();
            return;
        }

        if (this.restocking.has(productId)) {
            this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 正在补上货架，请稍等`, 'warning', feedbackX, feedbackY);
            this.render();
            return;
        }

        if (this.stock[productId] <= 0) {
            if (this.economy.warehouseStock[productId] > 0) {
                this.queueShelfRefill(productId);
                this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 正在从仓库补上货架`, 'warning', feedbackX, feedbackY);
            } else {
                this.handleSoldOut(productId);
            }
            this.render();
            return;
        }

        const customer = this.customers[this.activeCustomerIndex];
        const needed = this.findNeededItem(customer, productId);

        if (!needed) {
            const alreadyPrepared = customer.order.some((item) => (
                item.productId === productId
                && this.isItemPrepared(customer, item)
            ));
            if (alreadyPrepared) {
                this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 已经在托盘里`, 'info', feedbackX, feedbackY);
                this.render();
                return;
            }
            this.combo = 0;
            customer.patience = Math.max(0, customer.patience - 2);
            this.setFeedback(`选错了：${PRODUCT_CATALOG[productId].displayName} 不在当前订单中`, 'error', feedbackX, feedbackY);
            this.setErrorFx(customer.id, productId, 'both');
            this.triggerCustomerReaction(customer.id, 'angry');
            this.render();
            this.playWrongProductFx(productId, customer.id);
            return;
        }

        const customerId = customer.id;
        const processingRule = getProcessingRuleForOrderItem(needed);
        if (processingRule) {
            const deviceName = PROCESSING_DEVICE_NAMES[processingRule.deviceId];
            const deviceLevel = this.getProcessingDeviceLevel(processingRule.deviceId);
            if (deviceLevel < processingRule.requiredDeviceLevel) {
                this.setFeedback(`${deviceName}尚未解锁，暂时不能处理${PRODUCT_CATALOG[productId].displayName}`, 'warning', feedbackX, feedbackY);
                this.render();
                return;
            }
            if (this.microwave.mode !== 'idle') {
                this.setFeedback(`${deviceName}被占用，先处理其他商品或顾客`, 'warning', -220, 210);
                this.render();
                const renderedCard = this.node.getChildByName(`Product-${productId}`);
                if (renderedCard) {
                    this.shake(renderedCard);
                }
                return;
            }
            if (!this.ensureTrayForCustomer(customer, productId, feedbackX, feedbackY)) {
                return;
            }
            this.consumeStock(productId);
            this.microwave = {
                mode: 'heating',
                remaining: getProcessingSeconds(processingRule.deviceId, deviceLevel),
                customerId: customer.id,
                productId,
            };
            this.setFeedback(`${PRODUCT_CATALOG[productId].displayName}已放入${deviceName}，完成后点击设备放入托盘`, 'heat', -220, 210);
            this.render();
            this.playProductCorrectFx(productId, customerId);
            this.playMicrowaveStartFx(productId);
            return;
        }

        if (!this.ensureTrayForCustomer(customer, productId, feedbackX, feedbackY)) {
            return;
        }
        this.consumeStock(productId);
        this.addTrayItem(customer, { productId });
        const ready = this.isTrayReadyFor(customer);
        this.setFeedback(
            ready
                ? '托盘已备齐，点击 READY 托盘交付'
                : `已放入托盘：${PRODUCT_CATALOG[productId].displayName}`,
            ready ? 'success' : 'info',
            feedbackX,
            feedbackY,
        );
        this.render();
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
        this.playProductCorrectFx(productId, customerId);
        this.playOrderItemCompleteFx(customerId, productId);
    }

    private handleMicrowaveTap() {
        if (this.economy.microwaveLevel === 0) {
            this.setFeedback('营业结束后可以使用利润购买微波炉', 'info', -220, 210);
            this.render();
            return;
        }

        if (this.microwave.mode === 'idle') {
            this.setFeedback('先选择带火焰角标的商品', 'info', -220, 210);
            this.render();
            return;
        }

        if (this.microwave.mode === 'heating') {
            this.setFeedback(`仍在加热，还需 ${this.microwave.remaining.toFixed(1)} 秒`, 'heat', -220, 210);
            this.render();
            return;
        }

        const customer = this.customers[this.activeCustomerIndex];
        const customerId = customer.id;
        const productId = this.microwave.productId;
        const productName = productId ? PRODUCT_CATALOG[productId].displayName : '热食';
        if (this.microwave.customerId !== customer.id) {
            this.setFeedback(`这份${productName}属于${this.getCustomerSide(this.microwave.customerId)}顾客，请先切换`, 'warning', -220, 210);
            this.render();
            return;
        }
        if (!productId) {
            this.setFeedback('设备里没有可交付商品', 'warning', -220, 210);
            this.render();
            return;
        }
        const needed = customer.order.find((item) => (
            item.productId === productId
            && getProcessingRuleForOrderItem(item)?.deviceId === 'microwave'
            && !this.isItemPrepared(customer, item)
        ));

        if (!needed) {
            this.setFeedback(`当前顾客不需要这份${productName}，请切换顾客`, 'warning', -220, 210);
            this.render();
            return;
        }

        if (!this.ensureTrayForCustomer(customer, productId, -220, 210)) {
            return;
        }
        const preparedRule = getProcessingRuleForOrderItem(needed);
        this.addTrayItem(customer, {
            productId,
            heated: toLegacyHeated(preparedRule?.outputPreparation ?? 'heated'),
        });
        this.microwave = { mode: 'idle', remaining: 0 };
        const ready = this.isTrayReadyFor(customer);
        this.setFeedback(
            ready
                ? '托盘已备齐，点击 READY 托盘交付'
                : `${productName}已放入托盘`,
            ready ? 'success' : 'info',
            -220,
            210,
        );
        this.render();
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
        this.playProductCorrectFx(productId, customerId);
        this.playMicrowaveToTrayFx(productId);
    }

    private handleTrayTap() {
        if (this.tray.items.length === 0 || this.tray.customerId === undefined) {
            this.setFeedback('托盘还是空的，先选择订单商品', 'info', 0, 210);
            this.render();
            this.shakeTray();
            return;
        }

        const customerIndex = this.customers.findIndex((customer) => customer.id === this.tray.customerId);
        const customer = this.customers[customerIndex];
        if (customerIndex < 0 || !customer || customer.pendingOutcome) {
            this.clearTray();
            this.render();
            return;
        }

        if (!this.isTrayReadyFor(customer)) {
            const missing = this.getMissingTrayItemNames(customer);
            const firstMissing = customer.order.find((item) => !this.isItemPrepared(customer, item));
            this.activeCustomerIndex = customerIndex;
            this.setFeedback(
                missing.length > 0 ? `托盘还缺：${missing.join('、')}` : '托盘还没备齐',
                'warning',
                0,
                210,
            );
            this.setErrorFx(customer.id, firstMissing?.productId, 'both');
            this.render();
            this.shakeTray();
            return;
        }

        for (const item of this.tray.items) {
            if (!customer.served.some((served) => this.sameItem(served, item))) {
                customer.served.push(item);
            }
        }
        this.clearTray();
        this.activeCustomerIndex = customerIndex;
        this.setFeedback('托盘交付成功', 'success', 0, 210);
        this.checkCompletionForIndex(customerIndex);
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
    }

    private checkCompletion() {
        this.checkCompletionForIndex(this.activeCustomerIndex);
    }

    private checkCompletionForIndex(index: number) {
        const customer = this.customers[index];
        if (!customer || customer.pendingOutcome) {
            this.render();
            return;
        }
        const complete = customer.order.every((item) => (
            customer.served.some((served) => this.sameItem(served, item))
        ));

        if (!complete) {
            if (index === this.activeCustomerIndex) {
                this.resolveActiveCustomerIfUnfulfillable();
            }
            this.render();
            return;
        }

        this.finishCustomerOrder(index);
    }

    private finishCustomerOrder(index: number) {
        const customer = this.customers[index];
        this.clearTrayForCustomer(customer.id);
        const patienceRatio = customer.patience / customer.maxPatience;
        this.combo += 1;
        this.completed += 1;
        const sale = this.getOrderSale(customer.order);
        const strategyTip = this.activeStrategy === 'tips' && patienceRatio > 0.6
            ? this.activeStrategyTier * 3
            : 0;
        const tip = Math.min(this.combo, 5) + (patienceRatio > 0.6 ? 4 : 0) + strategyTip;
        const income = sale + tip;
        this.revenue += income;
        this.paymentBurst = { amount: income, remaining: 0.95 };
        this.recordReview(patienceRatio > 0.6 ? 5 : patienceRatio > 0.3 ? 4 : 3);
        for (const item of customer.order) {
            this.salesThisShift[item.productId] += 1;
        }
        this.setFeedback(
            patienceRatio > 0.6
                ? `完美服务！收入 ${income}，包含小费 ${tip}`
                : `顾客付款，收入 ${income}`,
            'success',
        );
        customer.mood = 'happy';
        customer.paymentAmount = income;
        customer.transitionRemaining = 0.85;
        customer.pendingOutcome = 'completed';
        this.activeCustomerIndex = this.chooseNextCustomerIndex(index);
        this.render();
        this.playOrderCompleteFx(customer.id, income);
    }

    private chooseUrgentCustomer(): number {
        if (this.customers.length < 2) {
            return 0;
        }
        return this.customers[1].patience < this.customers[0].patience ? 1 : 0;
    }

    private sameItem(left: OrderItem, right: OrderItem): boolean {
        return left.productId === right.productId && Boolean(left.heated) === Boolean(right.heated);
    }

    private getPreparedItems(customer: CustomerState): OrderItem[] {
        if (this.tray.customerId !== customer.id) {
            return customer.served;
        }
        return [...customer.served, ...this.tray.items];
    }

    private isItemPrepared(customer: CustomerState, item: OrderItem): boolean {
        return this.getPreparedItems(customer).some((prepared) => this.sameItem(prepared, item));
    }

    private findNeededItem(customer: CustomerState, productId: ProductId): OrderItem | undefined {
        return customer.order.find((item) => (
            item.productId === productId
            && !this.isItemPrepared(customer, item)
        ));
    }

    private getOrderSale(items: OrderItem[]): number {
        const baseSale = items.reduce((sum, item) => (
            sum + PRODUCT_ECONOMY[item.productId].sellPrice + getPreparationRewardBonus(item)
        ), 0);
        const multiplier = this.activeStrategy === 'traffic'
            ? 1 + this.activeStrategyTier * 0.06
            : 1;
        return Math.round(baseSale * multiplier);
    }

    private updateLiveUi() {
        if (this.timerValueLabel) {
            const nextTime = `${Math.ceil(this.shiftRemaining)}`;
            if (this.timerValueLabel.string !== nextTime) {
                this.timerValueLabel.string = nextTime;
            }
        }

        for (const customer of this.customers) {
            const fill = this.patienceFillNodes.get(customer.id);
            if (!fill?.parent) {
                continue;
            }
            const ratio = Math.max(0, customer.patience / customer.maxPatience);
            const fillRatio = Math.max(8 / 186, ratio);
            fill.setPosition(93 * (fillRatio - 1), 0, 0);
            fill.setScale(new Vec3(fillRatio, 1, 1));
        }

        if (this.microwave.mode === 'heating' && this.microwaveProgressFill?.parent) {
            const progressWidth = 194 * Math.max(0, 1 - this.microwave.remaining / getProcessingSeconds('microwave', this.economy.microwaveLevel));
            const fillWidth = Math.max(8, progressWidth);
            this.microwaveProgressFill.getComponent(UITransform)?.setContentSize(fillWidth, 10);
            this.microwaveProgressFill.setPosition((fillWidth - 194) / 2, 0, 0);
            this.drawRect(this.microwaveProgressFill, fillWidth, 10, 5, this.color(255, 98, 84));
        }
    }

    private recordReview(stars: number) {
        this.reviewPoints += Math.max(1, Math.min(5, stars));
        this.reviewCount += 1;
    }

    private getLiveSatisfactionPercent(): number {
        if (this.reviewCount <= 0) {
            return 100;
        }
        return Math.max(20, Math.min(100, Math.round((this.reviewPoints / (this.reviewCount * 5)) * 100)));
    }

    private getStrategyTier(): number {
        return this.economy.lastRating >= 4.5 ? 2 : 1;
    }

    private startDay(day: number) {
        this.currentDay = day;
        this.activeStrategy = this.economy.nextStrategy;
        this.activeStrategyTier = this.getStrategyTier();
        this.economy.nextStrategy = undefined;
        this.shiftRules = getShiftRules(this.economy);
        if (this.activeStrategy === 'hours') {
            this.shiftRules = {
                ...this.shiftRules,
                shiftSeconds: this.shiftRules.shiftSeconds + this.activeStrategyTier * 8,
            };
        }
        const stockCap = getStockCap(this.economy.shelfLevel);
        this.stock = createProductStock();
        this.restocking.clear();
        this.microwave = { mode: 'idle', remaining: 0 };
        this.clearTray();
        for (const productId of this.economy.unlockedProductIds) {
            const amount = Math.min(stockCap, this.economy.warehouseStock[productId]);
            this.stock[productId] = amount;
            this.economy.warehouseStock[productId] -= amount;
        }
        this.shiftRemaining = this.shiftRules.shiftSeconds;
        this.revenue = 0;
        this.goodsCost = 0;
        this.salesThisShift = createProductStock();
        this.combo = 0;
        this.completed = 0;
        this.missed = 0;
        this.soldOutMissed = 0;
        this.reviewPoints = 0;
        this.reviewCount = 0;
        this.roundRating = this.economy.lastRating;
        this.nextOrderIndex = 0;
        this.nextCustomerId = 1;
        this.activeCustomerIndex = 0;
        this.ended = false;
        this.preparing = false;
        this.home = false;
        this.closeConfirmArmed = false;
        this.closingRequested = false;
        this.closeReason = undefined;
        this.setStatusMessage(
            this.currentDay === 1
                ? '首轮目标 9 单；前两单标记商品，之后自行判断并切换顾客'
                : this.activeStrategy
                    ? `${STRATEGY_NAMES[this.activeStrategy]}生效，完成订单后顾客自动付款`
                    : `店铺 Lv.${this.economy.storeLevel} 开始营业，完成订单后顾客自动付款`,
            'info',
        );
        this.customers = [];
        for (let count = 0; count < this.shiftRules.maxCustomers; count += 1) {
            if (this.getFulfillableDemandPool().length === 0) {
                break;
            }
            this.customers.push(this.createCustomer());
        }
        this.checkAutoCloseWhenSoldOut();
        this.saveEconomy();
        this.render();
    }

    private consumeStock(productId: ProductId) {
        this.stock[productId] = Math.max(0, this.stock[productId] - 1);
        this.goodsCost += PRODUCT_ECONOMY[productId].buyCost;
        this.queueShelfRefill(productId);
    }

    private settleShift() {
        if (this.ended) {
            return;
        }
        this.clearTray();
        if (!this.closingRequested) {
            for (const customer of this.customers) {
                if (!customer.pendingOutcome) {
                    this.missed += 1;
                    this.recordReview(2);
                }
            }
        }
        if (this.closeReason === 'manual') {
            this.recordReview(2);
        }
        for (const productId of PRODUCT_IDS) {
            this.economy.warehouseStock[productId] += this.stock[productId];
            this.stock[productId] = 0;
        }
        const profit = this.revenue - this.goodsCost;
        this.economy.wallet += this.revenue;
        this.economy.lifetimeProfit = Math.max(0, this.economy.lifetimeProfit + profit);
        this.economy.lastSales = createProductStock(this.salesThisShift);
        this.economy.nextTrendCategory = this.getNextTrendCategory();
        this.economy.roundsCompleted = Math.max(this.economy.roundsCompleted, this.currentDay);
        this.roundRating = this.reviewCount > 0
            ? Math.round((this.reviewPoints / this.reviewCount) * 10) / 10
            : 3;
        this.economy.lastRating = this.roundRating;
        this.economy.reputation = Math.round(this.economy.reputation * 0.7 + this.roundRating * 20 * 0.3);
        this.economy.nextStrategy = undefined;
        this.ended = true;
        this.preparing = false;
        this.shopMessage = profit >= 0
            ? `本轮净利润 ${profit} · 售罄流失 ${this.soldOutMissed} 位顾客${this.getCloseReasonText()}${this.getTrialResultText()}`
            : `本轮亏损 ${Math.abs(profit)}，需要调整经营节奏${this.getCloseReasonText()}${this.getTrialResultText()}`;
        this.saveEconomy();
        this.render();
    }

    private loadEconomy() {
        const initial = createInitialEconomyState();
        try {
            const stored = sys.localStorage.getItem(SAVE_KEY);
            if (!stored) {
                this.economy = initial;
                return;
            }
            const parsed = JSON.parse(stored) as Partial<EconomyState>;
            this.economy = {
                ...initial,
                ...parsed,
                warehouseStock: parsed.warehouseStock
                    ? createProductStock(parsed.warehouseStock)
                    : createProductStock(initial.warehouseStock),
                lastSales: createProductStock(parsed.lastSales),
                unlockedProductIds: Array.isArray(parsed.unlockedProductIds)
                    ? parsed.unlockedProductIds.filter((productId): productId is ProductId => PRODUCT_IDS.includes(productId))
                    : initial.unlockedProductIds,
            };
        } catch {
            this.economy = initial;
        }
    }

    private saveEconomy() {
        sys.localStorage.setItem(SAVE_KEY, JSON.stringify(this.economy));
    }

    private enterPreparation() {
        if (!this.economy.nextStrategy && !this.isTrialRound()) {
            this.shopMessage = '请先在经营中心选择下一轮经营策略';
            this.render();
            return;
        }
        this.purchaseCart = createProductStock();
        this.home = false;
        this.preparing = true;
        this.ended = true;
        this.shopMessage = this.getPreparationAdvice();
        this.render();
    }

    private adjustPurchase(productId: ProductId, amount: number) {
        const next = Math.max(0, this.purchaseCart[productId] + amount);
        if (amount > 0) {
            const capacity = getWarehouseCapacity(this.economy.storeLevel);
            if (this.getWarehouseUnits() + this.getPurchaseCartUnits() >= capacity) {
                this.shopMessage = '仓库容量不足，请减少采购或扩建便利店';
                this.render();
                return;
            }
            if (this.getPurchaseCartCost() + PRODUCT_ECONOMY[productId].buyCost > this.economy.wallet) {
                this.shopMessage = '经营资金不足，无法继续采购';
                this.render();
                return;
            }
        }
        this.purchaseCart[productId] = next;
        this.shopMessage = this.getPreparationAdvice();
        this.render();
    }

    private fillBasicPurchase() {
        this.purchaseCart = createProductStock();
        const target = 4;
        for (const productId of this.economy.unlockedProductIds) {
            while (
                this.economy.warehouseStock[productId] + this.purchaseCart[productId] < target
                && this.getWarehouseUnits() + this.getPurchaseCartUnits() < getWarehouseCapacity(this.economy.storeLevel)
                && this.getPurchaseCartCost() + PRODUCT_ECONOMY[productId].buyCost <= this.economy.wallet
            ) {
                this.purchaseCart[productId] += 1;
            }
        }
        this.shopMessage = this.getPreparationAdvice();
        this.render();
    }

    private confirmPurchase() {
        if (!this.economy.nextStrategy && !this.isTrialRound()) {
            this.shopMessage = '需要先在经营中心选择下一轮经营策略';
            this.render();
            return;
        }
        const availableUnits = this.economy.unlockedProductIds.reduce((sum, productId) => (
            sum + this.economy.warehouseStock[productId] + this.purchaseCart[productId]
        ), 0);
        if (availableUnits <= 0) {
            this.shopMessage = '至少需要采购一种已解锁商品才能开始营业';
            this.render();
            return;
        }
        const cost = this.getPurchaseCartCost();
        if (cost > this.economy.wallet) {
            this.shopMessage = '采购支出超过经营资金';
            this.render();
            return;
        }
        if (this.getWarehouseUnits() + this.getPurchaseCartUnits() > getWarehouseCapacity(this.economy.storeLevel)) {
            this.shopMessage = '采购数量超过仓库容量';
            this.render();
            return;
        }
        this.economy.wallet -= cost;
        for (const productId of PRODUCT_IDS) {
            this.economy.warehouseStock[productId] += this.purchaseCart[productId];
        }
        this.purchaseCart = createProductStock();
        this.saveEconomy();
        this.startDay(this.currentDay);
    }

    private leavePreparation() {
        this.purchaseCart = createProductStock();
        this.home = true;
        this.preparing = false;
        this.ended = true;
        this.shopMessage = '已返回经营中心，采购清单已清空';
        this.render();
    }

    private returnToHome() {
        if (!this.economy.nextStrategy) {
            this.shopMessage = '请先选择下一轮经营策略，再返回经营中心';
            this.render();
            return;
        }
        this.currentDay = this.economy.roundsCompleted + 1;
        this.home = true;
        this.preparing = false;
        this.ended = true;
        this.shopMessage = `第 ${this.currentDay} 轮经营准备`;
        this.saveEconomy();
        this.render();
    }

    private queueShelfRefill(productId: ProductId) {
        if (
            this.restocking.has(productId)
            || this.stock[productId] >= getStockCap(this.economy.shelfLevel)
            || this.economy.warehouseStock[productId] <= 0
        ) {
            return;
        }
        this.restocking.set(productId, getRestockSeconds(this.economy.shelfLevel));
    }

    private handleSoldOut(productId: ProductId) {
        const customer = this.customers[this.activeCustomerIndex];
        const needed = customer.order.some((item) => (
            item.productId === productId
            && !this.isItemPrepared(customer, item)
        ));
        if (!needed) {
            this.combo = 0;
            customer.patience = Math.max(0, customer.patience - 2);
            this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 已售罄，而且不在当前订单中`, 'error');
            this.setErrorFx(customer.id, productId, 'order');
            this.triggerCustomerReaction(customer.id, 'angry');
            return;
        }

        this.finishUnfulfillableCustomer(this.activeCustomerIndex, productId);
    }

    private handleStopAccepting() {
        if (this.closingRequested) {
            this.setFeedback(`已经停止接客，请完成店内 ${this.customers.length} 位顾客的订单`, 'warning');
            this.render();
            return;
        }
        if (!this.closeConfirmArmed) {
            this.closeConfirmArmed = true;
            this.setFeedback(
                this.isAllSellableInventoryEmpty()
                    ? '库存已经售空，再次点击即可结束接客'
                    : '再次点击确认停止接客；店内顾客仍需完成服务',
                'warning',
            );
            this.render();
            return;
        }

        this.closeConfirmArmed = false;
        this.closingRequested = true;
        this.closeReason = this.isAllSellableInventoryEmpty() ? 'sold-out' : 'manual';
        this.setFeedback(`已停止接客，完成店内 ${this.customers.length} 位顾客后自动结算`, 'warning');
        this.resolveUnfulfillableCustomers();
        this.render();
    }

    private handlePauseStopAccepting() {
        if (this.closingRequested) {
            this.setFeedback(`已经停止接客，请完成店内 ${this.customers.length} 位顾客的订单`, 'warning', 0, 510);
            this.render();
            return;
        }
        if (!this.closeConfirmArmed) {
            this.closeConfirmArmed = true;
            this.setFeedback(
                this.isAllSellableInventoryEmpty()
                    ? '库存已经售空，再次点击即可结束接客'
                    : '再次点击确认停止接客',
                'warning',
                0,
                510,
            );
            this.render();
            return;
        }

        this.closeConfirmArmed = false;
        this.closingRequested = true;
        this.closeReason = this.isAllSellableInventoryEmpty() ? 'sold-out' : 'manual';
        this.pauseMenuOpen = false;
        this.setFeedback(`已停止接客，完成店内 ${this.customers.length} 位顾客后自动结算`, 'warning', 0, 510);
        this.resolveUnfulfillableCustomers();
        this.render();
    }

    private checkAutoCloseWhenSoldOut() {
        if (this.closingRequested || !this.isAllSellableInventoryEmpty()) {
            return;
        }
        this.beginAutoClose();
    }

    private beginAutoClose() {
        this.closingRequested = true;
        this.closeReason = 'sold-out';
        this.setFeedback('商品已全部售空，自动停止接客；处理完店内顾客后结算', 'warning');
        this.resolveUnfulfillableCustomers();
    }

    private resolveUnfulfillableCustomers() {
        for (let index = 0; index < this.customers.length; index += 1) {
            const customer = this.customers[index];
            if (customer.pendingOutcome) {
                continue;
            }
            const missingItem = customer.order.find((item) => (
                !this.isItemPrepared(customer, item)
                && !this.canStillFulfillItem(customer, item)
            ));
            if (missingItem) {
                this.finishUnfulfillableCustomer(index, missingItem.productId);
            }
        }
    }

    private resolveActiveCustomerIfUnfulfillable(): boolean {
        const customer = this.customers[this.activeCustomerIndex];
        const missingItem = customer.order.find((item) => (
            !this.isItemPrepared(customer, item)
            && !this.canStillFulfillItem(customer, item)
        ));
        if (!missingItem) {
            return false;
        }

        this.finishUnfulfillableCustomer(this.activeCustomerIndex, missingItem.productId);
        return true;
    }

    private canStillFulfillItem(customer: CustomerState, item: OrderItem): boolean {
        if (this.tray.customerId === customer.id && this.tray.items.some((prepared) => this.sameItem(prepared, item))) {
            return true;
        }
        if (this.stock[item.productId] > 0 || this.economy.warehouseStock[item.productId] > 0) {
            return true;
        }
        return Boolean(
            getProcessingRuleForOrderItem(item)
            && this.microwave.customerId === customer.id
            && this.microwave.productId === item.productId
            && this.microwave.mode !== 'idle'
        );
    }

    private finishUnfulfillableCustomer(index: number, missingProductId: ProductId) {
        const customer = this.customers[index];
        if (customer.pendingOutcome) {
            return;
        }

        const preparedItems = this.getPreparedItems(customer);
        const partialIncome = this.getOrderSale(preparedItems);
        if (partialIncome > 0) {
            this.revenue += partialIncome;
            customer.paymentAmount = partialIncome;
            for (const item of preparedItems) {
                this.salesThisShift[item.productId] += 1;
            }
        }

        this.missed += 1;
        this.soldOutMissed += 1;
        this.combo = 0;
        customer.mood = 'angry';
        customer.transitionRemaining = 0.8;
        customer.pendingOutcome = partialIncome > 0 ? 'partial' : 'missed';
        this.recordReview(partialIncome > 0 ? 2 : 1);
        if (this.microwave.customerId === customer.id) {
            this.microwave = { mode: 'idle', remaining: 0 };
        }
        this.clearTrayForCustomer(customer.id);
        this.setFeedback(
            partialIncome > 0
                ? `${PRODUCT_CATALOG[missingProductId].displayName} 售罄，顾客为已拿商品付款 ${partialIncome} 后离开`
                : `${PRODUCT_CATALOG[missingProductId].displayName} 售罄，顾客生气离开`,
            'error',
        );
        this.activeCustomerIndex = this.chooseNextCustomerIndex(index);
    }

    private isAllSellableInventoryEmpty(): boolean {
        return this.microwave.mode === 'idle' && this.economy.unlockedProductIds.every((productId) => (
            this.stock[productId] <= 0 && this.economy.warehouseStock[productId] <= 0
        ));
    }

    private getCloseReasonText(): string {
        if (this.closeReason === 'sold-out') {
            return ' · 库存售空后关店';
        }
        if (this.closeReason === 'manual') {
            return ' · 主动提前关店';
        }
        return '';
    }

    private getTrialResultText(): string {
        if (this.currentDay !== 1) {
            return '';
        }
        if (this.completed >= 11) {
            return ' · 首轮优秀';
        }
        if (this.completed >= 9) {
            return ' · 首轮达标';
        }
        return ' · 首轮未达标';
    }

    private getDemandPool(): ProductId[] {
        const pool: ProductId[] = [];
        for (const productId of this.economy.unlockedProductIds) {
            const weight = PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory ? 3 : 1;
            for (let count = 0; count < weight; count += 1) {
                pool.push(productId);
            }
        }
        return pool;
    }

    private getFulfillableDemandPool(): ProductId[] {
        const pool: ProductId[] = [];
        for (const productId of this.economy.unlockedProductIds) {
            const reserved = this.customers.reduce((sum, customer) => {
                if (customer.pendingOutcome) {
                    return sum;
                }
                return sum + customer.order.filter((item) => (
                    item.productId === productId
                    && !this.isItemPrepared(customer, item)
                )).length;
            }, 0);
            const available = this.stock[productId] + this.economy.warehouseStock[productId] - reserved;
            if (available <= 0) {
                continue;
            }
            const weight = PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory ? 3 : 1;
            for (let count = 0; count < weight; count += 1) {
                pool.push(productId);
            }
        }
        return pool;
    }

    private pickUniqueDemandProduct(pool: ProductId[], order: OrderItem[], seed: number): ProductId | undefined {
        for (let offset = 0; offset < pool.length; offset += 1) {
            const productId = pool[(seed + offset) % pool.length];
            if (!order.some((item) => item.productId === productId)) {
                return productId;
            }
        }
        return undefined;
    }

    private getNextTrendCategory(): ProductCategory {
        const available = Array.from(new Set(
            this.economy.unlockedProductIds.map((productId) => PRODUCT_ECONOMY[productId].category),
        ));
        return available[(this.currentDay + this.completed) % available.length] ?? 'drink';
    }

    private isTrialRound(): boolean {
        return this.economy.roundsCompleted === 0 && this.currentDay === 1;
    }

    private getWarehouseUnits(): number {
        return PRODUCT_IDS.reduce((sum, productId) => sum + this.economy.warehouseStock[productId], 0);
    }

    private getPurchaseCartUnits(): number {
        return PRODUCT_IDS.reduce((sum, productId) => sum + this.purchaseCart[productId], 0);
    }

    private getPurchaseCartCost(): number {
        return PRODUCT_IDS.reduce((sum, productId) => (
            sum + this.purchaseCart[productId] * PRODUCT_ECONOMY[productId].buyCost
        ), 0);
    }

    private getPurchaseGuidance(productId: ProductId): PurchaseGuidance {
        const currentStock = this.economy.warehouseStock[productId] + this.purchaseCart[productId];
        const lastSales = this.economy.lastSales[productId];
        const referenceDemand = lastSales > 0 ? lastSales : 4;
        const trendBonus = PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory ? 1 : 0;
        const shortageThreshold = Math.max(2, Math.ceil(referenceDemand * 0.5) + trendBonus);
        const overstockThreshold = Math.max(9, Math.ceil(referenceDemand * 1.5) + 3 + trendBonus);

        if (currentStock <= shortageThreshold) {
            return 'shortage';
        }
        if (currentStock >= overstockThreshold) {
            return 'overstock';
        }
        return 'normal';
    }

    private getPurchaseGuidanceLabel(guidance: PurchaseGuidance): string {
        if (guidance === 'shortage') {
            return '紧缺';
        }
        if (guidance === 'overstock') {
            return '积压';
        }
        return '正常';
    }

    private getPurchaseGuidanceColor(guidance: PurchaseGuidance): Color {
        if (guidance === 'shortage') {
            return this.color(255, 98, 84);
        }
        if (guidance === 'overstock') {
            return this.color(120, 89, 143);
        }
        return this.color(54, 158, 170);
    }

    private getPreparationAdvice(): string {
        const unlocked = this.economy.unlockedProductIds;
        const shortages = unlocked
            .filter((productId) => this.getPurchaseGuidance(productId) === 'shortage')
            .sort((left, right) => (
                Number(PRODUCT_ECONOMY[right].category === this.economy.nextTrendCategory)
                - Number(PRODUCT_ECONOMY[left].category === this.economy.nextTrendCategory)
            ));
        const overstock = unlocked.filter((productId) => this.getPurchaseGuidance(productId) === 'overstock');

        if (shortages.length > 0) {
            return `建议优先补充：${shortages.slice(0, 2).map((productId) => PRODUCT_CATALOG[productId].displayName).join('、')}`;
        }
        if (overstock.length > 0) {
            return `${overstock.slice(0, 2).map((productId) => PRODUCT_CATALOG[productId].displayName).join('、')}可能积压，谨慎追加`;
        }
        return `库存结构较均衡，可适当增加${CATEGORY_NAMES[this.economy.nextTrendCategory]}`;
    }

    private chooseNextCustomerIndex(exclude?: number): number {
        if (this.customers.length < 2) {
            return 0;
        }
        const candidates = this.customers
            .map((customer, index) => ({ customer, index }))
            .filter(({ index }) => index !== exclude && this.customers[index].transitionRemaining <= 0);
        if (candidates.length === 0) {
            return exclude === 0 ? 1 : 0;
        }
        return candidates.reduce((best, current) => (
            current.customer.patience < best.customer.patience ? current : best
        )).index;
    }

    private addProductSprite(parent: Node, productId: ProductId, size: number) {
        const frame = this.productFrames.get(productId);
        if (!frame) {
            const placeholder = this.createNode('Placeholder', size, size, parent);
            this.drawRect(placeholder, size, size, size * 0.22, PRODUCT_COLORS[productId]);
            return;
        }

        const rect = frame.rect;
        const rectWidth = Math.max(1, rect?.width ?? size);
        const rectHeight = Math.max(1, rect?.height ?? size);
        const aspect = rectWidth / rectHeight;
        const renderWidth = aspect >= 1 ? size : size * aspect;
        const renderHeight = aspect >= 1 ? size / aspect : size;
        const spriteNode = this.createNode(`Sprite-${productId}`, renderWidth, renderHeight, parent);
        const sprite = spriteNode.addComponent(Sprite);
        sprite.spriteFrame = frame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        spriteNode.getComponent(UITransform)?.setContentSize(renderWidth, renderHeight);
    }

    private addArtwork(
        parent: Node,
        name: string,
        frame: SpriteFrame,
        width: number,
        height: number,
        x = 0,
        y = 0,
    ) {
        const artwork = this.createNode(name, width, height, parent);
        artwork.setPosition(x, y, 0);
        const sprite = artwork.addComponent(Sprite);
        sprite.spriteFrame = frame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        artwork.getComponent(UITransform)?.setContentSize(width, height);
        return artwork;
    }

    private addPill(parent: Node, text: string, x: number, y: number, width: number, height: number, fill: Color) {
        const pill = this.createNode(text, width, height, parent);
        pill.setPosition(x, y, 0);
        this.drawRect(pill, width, height, height / 2, fill);
        this.addLabel(pill, text, 0, 0, 24, this.color(255, 255, 255), true, width - 20);
    }

    private addButton(
        parent: Node,
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        fill: Color,
        onClick: () => void,
    ) {
        const button = this.createNode(text, width, height, parent);
        button.setPosition(x, y, 0);
        this.drawRect(button, width, height, 24, fill, this.color(51, 33, 62), 4);
        let lastTriggerAt = 0;
        const trigger = () => {
            const now = Date.now();
            if (now - lastTriggerAt < 120) {
                return;
            }
            lastTriggerAt = now;
            onClick();
        };
        this.addLabel(button, text, 0, 0, 28, this.color(255, 255, 255), true, width - 30);
        const hitArea = this.createNode(`${text}-HitArea`, width, height, button);
        button.on(Node.EventType.TOUCH_END, trigger, this);
        hitArea.on(Node.EventType.TOUCH_END, trigger, this);
        return button;
    }

    private addLabel(
        parent: Node,
        text: string,
        x: number,
        y: number,
        fontSize: number,
        color: Color,
        bold = false,
        width = 300,
        background?: Color,
    ) {
        const container = this.createNode(`Label-${text}`, width, fontSize + 24, parent);
        container.setPosition(x, y, 0);
        if (background) {
            const labelBackground = this.createNode('LabelBackground', width, fontSize + 20, container);
            this.drawRect(labelBackground, width, fontSize + 20, (fontSize + 20) / 2, background);
        }
        const labelNode = this.createNode('LabelText', width, fontSize + 24, container);
        const label = labelNode.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 6;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.overflow = Label.Overflow.SHRINK;
        label.isBold = bold;
        return container;
    }

    private setFeedback(message: string, tone: FeedbackTone, x = 0, y = 260) {
        this.message = message;
        this.feedbackTone = tone;
        this.toast = {
            message,
            tone,
            remaining: tone === 'error' ? 1.4 : 1.1,
            x,
            y,
        };
    }

    private setStatusMessage(message: string, tone: FeedbackTone) {
        this.message = message;
        this.feedbackTone = tone;
        this.toast = undefined;
    }

    private markCoreAssetLoaded() {
        this.coreAssetsPending = Math.max(0, this.coreAssetsPending - 1);
        if (this.coreAssetsPending === 0) {
            this.artReady = true;
            this.render();
        }
    }

    private getCustomerSide(customerId?: number): string {
        const index = this.customers.findIndex((customer) => customer.id === customerId);
        if (index === 0) {
            return '左侧';
        }
        if (index === 1) {
            return '右侧';
        }
        return '当前';
    }

    private addSurface(
        parent: Node,
        name: string,
        width: number,
        height: number,
        radius: number,
        fill: Color,
        x = 0,
        y = 0,
    ) {
        const surface = this.createNode(name, width, height, parent);
        surface.setPosition(x, y, 0);
        this.drawRect(surface, width, height, radius, fill);
        return surface;
    }

    private createNode(name: string, width: number, height: number, parent: Node) {
        const node = new Node(name);
        node.layer = parent.layer;
        const transform = node.addComponent(UITransform);
        transform.setContentSize(width, height);
        parent.addChild(node);
        return node;
    }

    private drawRect(node: Node, width: number, height: number, radius: number, fill: Color, stroke?: Color, lineWidth = 0) {
        const oldGraphics = node.getComponent(Graphics);
        if (oldGraphics) {
            oldGraphics.destroy();
        }
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = fill;
        graphics.roundRect(-width / 2, -height / 2, width, height, radius);
        graphics.fill();
        if (stroke && lineWidth > 0) {
            graphics.lineWidth = lineWidth;
            graphics.strokeColor = stroke;
            graphics.roundRect(-width / 2, -height / 2, width, height, radius);
            graphics.stroke();
        }
    }

    private drawSpeechTail(node: Node, size: number, fill: Color, stroke: Color, lineWidth: number) {
        const oldGraphics = node.getComponent(Graphics);
        if (oldGraphics) {
            oldGraphics.destroy();
        }
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = fill;
        graphics.moveTo(-size / 2, size / 2);
        graphics.lineTo(size / 2, size / 2);
        graphics.lineTo(-size / 2, -size / 2);
        graphics.close();
        graphics.fill();
        graphics.lineWidth = lineWidth;
        graphics.strokeColor = stroke;
        graphics.moveTo(-size / 2, size / 2);
        graphics.lineTo(size / 2, size / 2);
        graphics.lineTo(-size / 2, -size / 2);
        graphics.close();
        graphics.stroke();
    }

    private getRenderedCustomerNode(customerId: number | undefined): Node | undefined {
        if (customerId === undefined) {
            return undefined;
        }
        return this.node.getChildByName(`Customer-${customerId}`) ?? undefined;
    }

    private getRenderedOrderItemNode(customerId: number | undefined, productId: ProductId): Node | undefined {
        const customerNode = this.getRenderedCustomerNode(customerId);
        return customerNode
            ?.getChildByName('Order')
            ?.getChildByName(`Order-${productId}`) ?? undefined;
    }

    private getRenderedProductNode(productId: ProductId): Node | undefined {
        return this.node.getChildByName(`Product-${productId}`) ?? undefined;
    }

    private getMicrowaveNode(): Node | undefined {
        return this.node.getChildByName('WorkstationBand')?.getChildByName('Microwave') ?? undefined;
    }

    private getTrayNode(): Node | undefined {
        const workstation = this.node.getChildByName('WorkstationBand');
        return workstation?.getChildByName('DeliveryPadUnifiedArt')
            ?? workstation?.getChildByName('DeliveryTray')
            ?? undefined;
    }

    private getCashierNode(): Node | undefined {
        const workstation = this.node.getChildByName('WorkstationBand');
        return workstation?.getChildByName('CashierUnifiedArt')
            ?? workstation?.getChildByName('Cashier')
            ?? undefined;
    }

    private playCustomerSelectFx(customerId: number | undefined) {
        const customerNode = this.getRenderedCustomerNode(customerId);
        if (customerNode) {
            GameTweenFx.pop(customerNode, 0.035);
        }
    }

    private playProductCorrectFx(productId: ProductId, customerId: number | undefined) {
        const card = this.getRenderedProductNode(productId);
        if (card) {
            GameTweenFx.pop(card, 0.045);
            GameTweenFx.flash(card);
        }
        const item = this.getRenderedOrderItemNode(customerId, productId);
        if (item) {
            GameTweenFx.pulse(item, 0.04);
        }
    }

    private playWrongProductFx(productId: ProductId, customerId: number | undefined) {
        const card = this.getRenderedProductNode(productId);
        if (card) {
            GameTweenFx.shake(card);
        }
        const customer = this.getRenderedCustomerNode(customerId);
        if (customer) {
            GameTweenFx.customerAngry(customer);
        }
    }

    private playOrderItemCompleteFx(customerId: number | undefined, productId: ProductId) {
        const item = this.getRenderedOrderItemNode(customerId, productId);
        if (item) {
            GameTweenFx.pop(item, 0.12);
            GameTweenFx.flash(item);
        }
        const tray = this.getTrayNode();
        if (tray) {
            GameTweenFx.pulse(tray, 0.035);
        }
        const product = this.getRenderedProductNode(productId);
        if (product && tray) {
            this.playProductFlyFx(productId, product, tray);
        }
    }

    private playOrderCompleteFx(customerId: number | undefined, income: number) {
        const customer = this.getRenderedCustomerNode(customerId);
        if (customer) {
            GameTweenFx.customerHappy(customer);
            GameTweenFx.floatText(this.node, `+${income}`, new Vec3(customer.position.x, customer.position.y + 98, 0));
        }
        this.playPaymentFx(customer, income);
    }

    private playPaymentFx(sourceNode: Node | undefined, income: number) {
        const cashier = this.getCashierNode();
        if (cashier) {
            GameTweenFx.flash(cashier);
            GameTweenFx.pop(cashier, 0.045);
        }
        const coinHud = this.node.getChildByName('CoinHud');
        const startNode = cashier ?? sourceNode;
        if (!coinHud || !startNode) {
            return;
        }
        for (let index = 0; index < 3; index += 1) {
            const start = startNode.worldPosition.clone();
            start.x += -26 + index * 26;
            start.y += 30 + index * 6;
            const end = coinHud.worldPosition.clone();
            end.x += -16 + index * 16;
            GameTweenFx.coinFly(start, end, this.node);
        }
    }

    private playLowPatienceFx(customerId: number | undefined) {
        const customer = this.getRenderedCustomerNode(customerId);
        if (customer) {
            GameTweenFx.customerAngry(customer);
        }
        const patience = customer?.getChildByName('Order')?.getChildByName('Patience');
        if (patience) {
            GameTweenFx.progressPulse(patience);
        }
    }

    private playMicrowaveStartFx(productId: ProductId) {
        const microwave = this.getMicrowaveNode();
        if (microwave) {
            GameTweenFx.progressPulse(microwave);
            GameTweenFx.pop(microwave, 0.04);
        }
        const product = this.getRenderedProductNode(productId);
        if (product && microwave) {
            this.playProductFlyFx(productId, product, microwave);
        }
    }

    private playMicrowaveReadyFx() {
        const microwave = this.getMicrowaveNode();
        if (microwave) {
            GameTweenFx.flash(microwave);
            GameTweenFx.progressPulse(microwave);
        }
    }

    private playMicrowaveToTrayFx(productId: ProductId) {
        const microwave = this.getMicrowaveNode();
        const tray = this.getTrayNode();
        if (microwave) {
            GameTweenFx.pop(microwave, 0.04);
        }
        if (tray) {
            GameTweenFx.pulse(tray, 0.035);
        }
        if (microwave && tray) {
            this.playProductFlyFx(productId, microwave, tray);
        }
    }

    private playProductFlyFx(productId: ProductId, from: Node, to: Node) {
        const fxNode = this.createNode(`ProductFlyFx-${productId}`, 60, 60, this.node);
        fxNode.setWorldPosition(from.worldPosition);
        this.addProductSprite(fxNode, productId, 54);
        GameTweenFx.flyTo(fxNode, to.worldPosition, 0.34);
        this.scheduleOnce(() => {
            if (fxNode.isValid) {
                fxNode.destroy();
            }
        }, 0.38);
    }

    private pop(node: Node) {
        GameTweenFx.pop(node);
    }

    private shake(node: Node) {
        GameTweenFx.shake(node);
    }

    private shakeTray() {
        const workstation = this.node.getChildByName('WorkstationBand');
        const tray = workstation?.getChildByName('DeliveryPadUnifiedArt') ?? workstation?.getChildByName('DeliveryTray');
        if (tray) {
            this.shake(tray);
        }
    }

    private setErrorFx(customerId: number | undefined, productId: ProductId | undefined, target: ErrorFxState['target']) {
        this.errorFx = {
            customerId,
            productId,
            target,
            remaining: 0.45,
        };
    }

    private isErrorFxFor(customerId: number | undefined, target: 'order' | 'tray'): boolean {
        if (!this.errorFx) {
            return false;
        }
        if (this.errorFx.customerId !== undefined && customerId !== this.errorFx.customerId) {
            return false;
        }
        return this.errorFx.target === target || this.errorFx.target === 'both';
    }

    private triggerCustomerReaction(customerId: number | undefined, mood: CustomerMood) {
        const customer = this.customers.find((candidate) => candidate.id === customerId);
        if (!customer || customer.pendingOutcome) {
            return;
        }
        customer.mood = mood;
        customer.reactionRemaining = 0.45;
    }

    private color(r: number, g: number, b: number, a = 255) {
        return new Color(r, g, b, a);
    }
}
