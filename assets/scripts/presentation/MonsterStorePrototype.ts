import {
    _decorator,
    Color,
    Component,
    Graphics,
    Label,
    Mask,
    Node,
    Camera,
    resources,
    Sprite,
    SpriteFrame,
    sys,
    UITransform,
    Vec3,
    view,
    ResolutionPolicy,
    profiler,
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
import { DayBalanceConfig, OrderPlanKind, getDayBalance } from '../data/VerticalSliceConfig';
import { ProductId } from '../core/GameTypes';
import { GameTweenFx } from './fx/GameTweenFx';

const { ccclass } = _decorator;

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;
const SAVE_KEY = 'monster-store-economy-v1';
const FINAL_UI_ROOT = 'ui_gameplay_final_v1';
const START_DIRECTLY_IN_GAMEPLAY = true;
const DIRECT_GAMEPLAY_SHIFT_REMAINING = 80;
const DIRECT_GAMEPLAY_PATIENCE_SECONDS = 999;
type RuntimeProbeState = 'partial' | 'heating' | 'microwave-ready' | 'payment' | 'waiting-switch';
type QaPatiencePreset = 'green' | 'yellow' | 'red' | 'empty' | 'mixed';
type QaFaceMoodPreset = CustomerMood;
type QaFlowPreset = 'ready-left' | 'right-current-empty' | 'heating' | 'microwave-ready' | 'low-stock' | 'red-patience' | 'first-test-live' | 'hot-food-natural' | 'sold-out-needed' | 'hot-ready-sold-out' | 'stock-noise' | 'ready-window-mixed' | 'ready-window-timeout' | 'ready-coin-small' | 'ready-coin-medium' | 'ready-coin-large' | 'ready-coin-timeout' | 'ready-patience-timeout' | 'post-shift-upgrade';
const IDLE_RENDER_INTERVAL = 2.5;
const FEEDBACK_RENDER_INTERVAL = 0.6;
const READY_REWARD_WINDOW_SECONDS = 5;
const READY_REWARD_WARNING_SECONDS = 2;
const HUD_Y = 612;
const HUD_HEIGHT = 66;
const HUD_SATISFACTION_X = 226;
const HUD_SATISFACTION_WIDTH = 154;
const HUD_TIMER_X = 0;
const HUD_TIMER_WIDTH = 260;
const HUD_COIN_X = -262;
const HUD_COIN_WIDTH = 198;
const HUD_PAUSE_X = 348;
const HUD_PAUSE_SIZE = 50;
const PAYMENT_BURST_X = -118;
const PAYMENT_BURST_Y = 370;
const PAYMENT_BURST_FLOAT_Y = 14;
const CUSTOMER_ROW_Y = 292;
const CUSTOMER_SINGLE_LAYOUT = { x: 0, orderX: 0, orderY: 142, monsterY: -116, monsterSize: 342 };
const CUSTOMER_PAIR_LAYOUTS = [
    { x: -158, orderX: 4, orderY: 142, monsterY: -116, monsterSize: 342 },
    { x: 168, orderX: 24, orderY: 142, monsterY: -116, monsterSize: 342 },
];
const ORDER_BUBBLE_WIDTH = 304;
const ORDER_BUBBLE_HEIGHT = 184;
const READY_ORDER_BUBBLE_WIDTH = 368;
const READY_ORDER_BUBBLE_HEIGHT = 208;
const ORDER_BUBBLE_RADIUS = 28;
const ORDER_TAIL_X = -104;
const ORDER_TAIL_Y = -90;
const READY_BADGE_WIDTH = 168;
const READY_BADGE_HEIGHT = 54;
const READY_BADGE_X = -54;
const READY_BADGE_Y = -78;
const PROBE_V3_ORDER_BUBBLE_CURRENT_HEIGHT_RATIO = 392 / 790;
const PROBE_V3_ORDER_BUBBLE_WAITING_HEIGHT_RATIO = 305 / 667;
const PROBE_V3_READY_BADGE_HEIGHT_RATIO = 218 / 572;
const PROBE_V3_ORDER_BUBBLE_CURRENT_WIDTH = 350;
const PROBE_V3_ORDER_BUBBLE_WAITING_WIDTH = 334;
const PROBE_V3_READY_ORDER_BUBBLE_WIDTH = 424;
const PROBE_V3_READY_BADGE_WIDTH = 238;
const PROBE_V3_READY_BADGE_X = -16;
const PROBE_V3_READY_BADGE_Y = -92;
const PROBE_V3_READY_BADGE_FONT_SIZE = 28;
const CUSTOMER_LAYERED_BODY_HEIGHT_RATIO = 520 / 420;
const CUSTOMER_LAYERED_BODY_SIZE_SCALE = 0.95;
const CUSTOMER_LAYERED_BODY_Y_OFFSET = 32;
const CUSTOMER_LAYERED_FACE_WIDTH_SCALE = 0.38;
const CUSTOMER_LAYERED_FACE_Y_OFFSET = 56;
const CUSTOMER_LAYERED_HANDS_HEIGHT_RATIO = 180 / 420;
const CUSTOMER_LAYERED_HANDS_WIDTH_SCALE = 0.72;
const CUSTOMER_LAYERED_HANDS_X = 0;
const CUSTOMER_LAYERED_HANDS_Y = -138;
const ORDER_ITEM_Y = 18;
const ORDER_ITEM_SLOT_SIZE = 70;
const ORDER_ITEM_NODE_SIZE = 80;
const ORDER_ITEM_TWO_SPACING = 86;
const ORDER_ITEM_THREE_SPACING = 76;
const ORDER_PATIENCE_Y = -48;
const ORDER_PATIENCE_HEART_X = -96;
const ORDER_PATIENCE_BAR_X = 18;
const ORDER_PATIENCE_BAR_WIDTH = 176;
const ORDER_PATIENCE_FILL_WIDTH = 166;
const WORKSTATION_Y = 20;
const WORKSTATION_HEIGHT = 276;
const EQUIPMENT_BASE_Y = -96;
const EQUIPMENT_BASELINE_Y = -140;
const MICROWAVE_X = -202;
const DELIVERY_PAD_X = 0;
const CASHIER_X = 188;
const MICROWAVE_SCALE = 1.24;
const DELIVERY_PAD_SCALE = 1.08;
const CASHIER_SCALE = 1.10;
const PRODUCT_CARD_WIDTH = 205;
const PRODUCT_CARD_HEIGHT = 180;
const PRODUCT_GRID_START_Y = -273;
const PRODUCT_GRID_ROW_GAP = 198;
const PRODUCT_GRID_COLUMN_SPACING = 226;
const PRODUCT_ICON_MOUNT_Y = 26;
const PRODUCT_ICON_PANEL_WIDTH = 112;
const PRODUCT_ICON_PANEL_HEIGHT = 86;
const PRODUCT_NAME_Y = -30;
const PRODUCT_STOCK_LABEL_X = 18;
const PRODUCT_STOCK_LABEL_Y = -62;

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
    readyWindowRemaining?: number;
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

type OrderBubbleVisualState = 'missing' | 'partial' | 'ready' | 'done' | 'error';
type OrderItemVisualState = 'missing' | 'partial' | 'heating' | 'ready' | 'done' | 'error';
type FeedbackTone = 'info' | 'success' | 'warning' | 'error' | 'heat';
type PurchaseGuidance = 'shortage' | 'normal' | 'overstock';
type ToastState = {
    message: string;
    tone: FeedbackTone;
    remaining: number;
    x: number;
    y: number;
    compact?: boolean;
};
type DragPreparedState = 'cold' | 'heated';
type DragSourceKind = 'product' | 'microwave-ready';
type DragDropTargetKind = 'order-item' | 'order-bubble' | 'microwave';
type DragDropTarget = {
    kind: DragDropTargetKind;
    accepts: boolean;
    rect: FigmaRect;
    customerId?: number;
    customerIndex?: number;
    orderIndex?: number;
};
type DragState = {
    kind: DragSourceKind;
    productId: ProductId;
    prepared: DragPreparedState;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    hasMovedPastTapThreshold: boolean;
    hoverTarget?: DragDropTarget;
    overlayTargetKey?: string;
};
type TouchLikeEvent = {
    getUILocation?: () => { x: number; y: number };
    getLocation?: () => { x: number; y: number };
    stopPropagation?: () => void;
    propagationStopped?: boolean;
};
type PaymentBurstState = {
    amount: number;
    remaining: number;
    lowReward?: boolean;
};
type ErrorFxState = {
    customerId?: number;
    productId?: ProductId;
    target: 'order' | 'tray' | 'both';
    remaining: number;
};
type ProductCardSkin = 'heat' | 'star' | 'leaf';
type WeightedOption<T extends string> = Partial<Record<T, number>>;
const PRODUCT_CARD_BADGES: Record<ProductCardSkin, { width: number; height: number; x: number; y: number }> = {
    heat: { width: 67, height: 53, x: 64, y: 64 },
    star: { width: 68, height: 53, x: 64, y: 64 },
    leaf: { width: 69, height: 52, x: 66, y: 64 },
};

const PRODUCT_IDS: ProductId[] = [
    'snack-bag',
    'lemon-drink',
    'rice-ball',
    'strawberry-milk',
    'pudding-cup',
    'star-candy',
];
const FINAL_PRODUCT_RESOURCE_PATHS: Record<ProductId, string> = {
    'snack-bag': `${FINAL_UI_ROOT}/products/snack_bag/spriteFrame`,
    'lemon-drink': `${FINAL_UI_ROOT}/products/lemon_drink/spriteFrame`,
    'rice-ball': `${FINAL_UI_ROOT}/products/rice_ball/spriteFrame`,
    'strawberry-milk': `${FINAL_UI_ROOT}/products/chocolate_milk/spriteFrame`,
    'pudding-cup': `${FINAL_UI_ROOT}/products/pudding_cup/spriteFrame`,
    'star-candy': `${FINAL_UI_ROOT}/products/candy_bag/spriteFrame`,
};
const DIRECT_GAMEPLAY_ORDER: OrderItem[] = [
    { productId: 'snack-bag' },
    { productId: 'lemon-drink' },
    { productId: 'rice-ball' },
];
const DIRECT_GAMEPLAY_PREVIEW_ORDER: OrderItem[] = [
    { productId: 'snack-bag' },
    { productId: 'lemon-drink' },
    { productId: 'rice-ball' },
];
const CORE_ASSET_COUNT = PRODUCT_IDS.length + 7;
type FigmaRect = { x: number; y: number; width: number; height: number };
type FigmaArtworkFit = 'stretch' | 'fill' | 'crop';
type FigmaImageTransform = { scaleX: number; scaleY: number; translateX: number; translateY: number };
type FigmaArtworkOptions = { fit?: FigmaArtworkFit; imageTransform?: FigmaImageTransform };
const FIGMA_BACKGROUND: FigmaRect = { x: 0, y: 0, width: 390, height: 844 };
const FIGMA_HEAD_BAR: FigmaRect = { x: 0, y: 0, width: 390, height: 76.1 };
const FIGMA_COIN_BASE: FigmaRect = { x: 7, y: 13, width: 116, height: 38 };
const FIGMA_TIME_BASE: FigmaRect = { x: 137, y: 13, width: 116, height: 54 };
const FIGMA_COIN_ICON: FigmaRect = { x: 15, y: 17, width: 30, height: 30 };
const FIGMA_CLOCK_ICON: FigmaRect = { x: 145, y: 17, width: 30, height: 30 };
const FIGMA_PAUSE_ICON: FigmaRect = { x: 340, y: 14, width: 36, height: 36 };
const FIGMA_COIN_TEXT: FigmaRect = { x: 53, y: 12, width: 54, height: 40 };
const FIGMA_TIMER_TEXT: FigmaRect = { x: 179, y: 12, width: 58, height: 40 };
const FIGMA_TIMER_TRACK: FigmaRect = { x: 145, y: 53, width: 100, height: 8 };
const FIGMA_TIMER_FILL: FigmaRect = { x: 146, y: 54, width: 68, height: 6 };
const FIGMA_BOTTOM_BAND: FigmaRect = { x: 0, y: 528, width: 390, height: 316 };
const FIGMA_PRODUCT_PANEL: FigmaRect = { x: 16, y: 540, width: 358, height: 218 };
const FIGMA_LEFT_CUSTOMER: FigmaRect = { x: 25, y: 168, width: 161, height: 178 };
const FIGMA_RIGHT_CUSTOMER: FigmaRect = { x: 205, y: 168, width: 161, height: 178 };
const FIGMA_LEFT_FACE: FigmaRect = { x: 82, y: 209, width: 47, height: 59 };
const FIGMA_RIGHT_FACE: FigmaRect = { x: 260, y: 209, width: 47, height: 59 };
const FINAL_FACE_NEUTRAL_SOURCE_HEIGHT: Record<string, number> = {
    normal: 257,
    impatient: 277,
};
const FINAL_FACE_TARGET_EYE_X_RATIO = 0.5;
const FINAL_FACE_TARGET_EYE_Y_RATIO = 0.379;
const FINAL_FACE_SOURCE_EYE_Y_RATIO = 0.379;
const FINAL_FACE_SOURCE_EYE_X_RATIO: Record<string, number> = {
    'normal-waiting': 0.498,
    'normal-happy': 0.5,
    'normal-urgent': 0.537,
    'normal-angry': 0.537,
    'impatient-waiting': 0.486,
    'impatient-happy': 0.502,
    'impatient-urgent': 0.534,
    'impatient-angry': 0.534,
};
const FIGMA_FINAL_PATIENCE_TRACK_RECTS: FigmaRect[] = [
    { x: 12, y: 194, width: 10, height: 116 },
    { x: 368, y: 194, width: 10, height: 116 },
];
const FINAL_PATIENCE_FILL_WIDTH = 6;
const FINAL_PATIENCE_FILL_HEIGHT = 106;
const FINAL_PATIENCE_SAFE_MIN_RATIO = 0.06;
const FIGMA_LEFT_HANDS: FigmaRect[] = [
    { x: 23, y: 292, width: 42, height: 39.12 },
    { x: 145, y: 292, width: 42.33, height: 39 },
];
const FIGMA_RIGHT_HANDS: FigmaRect[] = [
    { x: 206, y: 295, width: 44, height: 35 },
    { x: 320, y: 294.5, width: 44, height: 35 },
];
const FIGMA_COUNTER_FOREGROUND: FigmaRect = { x: -143, y: 308, width: 676, height: 158 };
const FIGMA_COUNTER_WORKTOP: FigmaRect = { x: -120, y: 422, width: 630, height: 124 };
const FIGMA_MICROWAVE: FigmaRect = { x: 0, y: 368.1206, width: 187, height: 123 };
const FIGMA_CASHIER: FigmaRect = { x: 187, y: 333.1206, width: 244, height: 160 };
const FIGMA_READY_COIN_STACK_RECTS: FigmaRect[] = [
    { x: 78, y: 328, width: 70, height: 42 },
    { x: 245, y: 328, width: 70, height: 42 },
];
const FIGMA_ORDER_BUBBLE_WIDTH = 196.436;
const FIGMA_ORDER_BUBBLE_HEIGHT = 103.507;
const FIGMA_LEFT_BUBBLE_SELECTED: FigmaRect = { x: 0, y: 77.2464, width: FIGMA_ORDER_BUBBLE_WIDTH, height: FIGMA_ORDER_BUBBLE_HEIGHT };
const FIGMA_LEFT_BUBBLE_UNSELECTED: FigmaRect = { x: 1, y: 77.2466, width: FIGMA_ORDER_BUBBLE_WIDTH, height: FIGMA_ORDER_BUBBLE_HEIGHT };
const FIGMA_RIGHT_BUBBLE_SELECTED: FigmaRect = { x: 194, y: 77, width: FIGMA_ORDER_BUBBLE_WIDTH, height: FIGMA_ORDER_BUBBLE_HEIGHT };
const FIGMA_RIGHT_BUBBLE_UNSELECTED: FigmaRect = { x: 193.564, y: 77.2464, width: FIGMA_ORDER_BUBBLE_WIDTH, height: FIGMA_ORDER_BUBBLE_HEIGHT };
const FIGMA_ORDER_SLOT_RECTS: FigmaRect[] = [
    { x: 28.65, y: 101.275, width: 43.436, height: 48.981 },
    { x: 77.63, y: 101.275, width: 42.512, height: 48.981 },
    { x: 126.611, y: 101.275, width: 42.512, height: 48.981 },
    { x: 220.877, y: 101.275, width: 42.512, height: 48.981 },
    { x: 269.857, y: 101.275, width: 42.512, height: 48.981 },
    { x: 317.915, y: 101.275, width: 43.436, height: 48.981 },
];
const FIGMA_ORDER_ICON_RECTS: FigmaRect[] = [
    { x: 30, y: 106, width: 40, height: 40 },
    { x: 78, y: 106, width: 40, height: 40 },
    { x: 128, y: 106, width: 40, height: 40 },
    { x: 223, y: 106, width: 40, height: 40 },
    { x: 271, y: 106, width: 40, height: 40 },
    { x: 321, y: 106, width: 40, height: 40 },
];
const FIGMA_ORDER_CHECK_RECTS: FigmaRect[] = [
    { x: 54, y: 133, width: 24, height: 24 },
    { x: 103, y: 133, width: 24, height: 24 },
    { x: 152, y: 133, width: 24, height: 24 },
    { x: 247, y: 133, width: 24, height: 24 },
    { x: 296, y: 133, width: 24, height: 24 },
    { x: 345, y: 133, width: 24, height: 24 },
];
const FIGMA_READY_BADGE_RECTS: FigmaRect[] = [
    { x: 58, y: 161, width: 82, height: 30 },
    { x: 251, y: 161, width: 82, height: 30 },
];
const FIGMA_READY_COUNTDOWN_RECTS: FigmaRect[] = [
    { x: 62, y: 184, width: 74, height: 7 },
    { x: 255, y: 184, width: 74, height: 7 },
];
const FIGMA_PRODUCT_CARDS: FigmaRect[] = [
    { x: 25, y: 555, width: 110, height: 91 },
    { x: 140, y: 555, width: 110, height: 91 },
    { x: 255, y: 555, width: 110, height: 91 },
    { x: 25, y: 651, width: 110, height: 91 },
    { x: 140, y: 651, width: 110, height: 91 },
    { x: 255, y: 651, width: 110, height: 91 },
];
const FIGMA_PRODUCT_ICON_RECTS: FigmaRect[] = [
    { x: 40, y: 560, width: 80, height: 80 },
    { x: 155, y: 560, width: 80, height: 80 },
    { x: 270, y: 560, width: 80, height: 80 },
    { x: 40, y: 656, width: 80, height: 80 },
    { x: 155, y: 656, width: 80, height: 80 },
    { x: 270, y: 656, width: 80, height: 80 },
];
const FIGMA_STOCK_BADGES: FigmaRect[] = [
    { x: 95, y: 620, width: 30, height: 16 },
    { x: 210, y: 620, width: 30, height: 16 },
    { x: 325, y: 620, width: 30, height: 16 },
    { x: 95, y: 716, width: 30, height: 16 },
    { x: 210, y: 716, width: 30, height: 16 },
    { x: 325, y: 716, width: 30, height: 16 },
];
const FIGMA_STOCK_TEXTS: FigmaRect[] = [
    { x: 100, y: 619, width: 21, height: 19 },
    { x: 215, y: 619, width: 20, height: 19 },
    { x: 331, y: 619, width: 18, height: 19 },
    { x: 100, y: 715, width: 20, height: 19 },
    { x: 215, y: 715, width: 20, height: 19 },
    { x: 330, y: 715, width: 20, height: 19 },
];
const FIGMA_NAV_RECTS: FigmaRect[] = [
    { x: 16, y: 770, width: 62, height: 62 },
    { x: 90, y: 770, width: 62, height: 62 },
    { x: 164, y: 770, width: 62, height: 62 },
    { x: 238, y: 770, width: 62, height: 62 },
    { x: 312, y: 770, width: 62, height: 62 },
];
const FIGMA_PRODUCT_CROP_TRANSFORMS: Partial<Record<ProductId, FigmaImageTransform>> = {
    'pudding-cup': {
        scaleX: 1.060437560081482,
        scaleY: 1.060437560081482,
        translateX: -0.03021874465048313,
        translateY: -0.03021874465048313,
    },
    'star-candy': {
        scaleX: 0.8500000238418579,
        scaleY: 0.8500000238418579,
        translateX: 0.07500000298023224,
        translateY: 0.07500000298023224,
    },
};
const FIGMA_HUD_ICON_CROP_TRANSFORMS = {
    coin: {
        scaleX: 0.676236093044281,
        scaleY: 0.676236093044281,
        translateX: 0.1618819683790207,
        translateY: 0.14752790331840515,
    },
    clock: {
        scaleX: 0.6762360334396362,
        scaleY: 0.6762360334396362,
        translateX: 0.16267943382263184,
        translateY: 0.13556618988513947,
    },
    pause: {
        scaleX: 0.6369426846504211,
        scaleY: 0.6369426846504211,
        translateX: 0.18152867257595062,
        translateY: 0.1656050980091095,
    },
};
const FIGMA_DIRECT_PRODUCT_IDS: ProductId[] = [
    'snack-bag',
    'lemon-drink',
    'rice-ball',
    'pudding-cup',
    'strawberry-milk',
    'star-candy',
];

const PRODUCT_COLORS: Record<ProductId, Color> = {
    'snack-bag': new Color(255, 98, 84),
    'lemon-drink': new Color(103, 199, 165),
    'rice-ball': new Color(255, 243, 214),
    'strawberry-milk': new Color(255, 158, 168),
    'pudding-cup': new Color(255, 194, 71),
    'star-candy': new Color(120, 89, 143),
};
const DRAG_START_THRESHOLD = 10;
const DRAG_GHOST_SIZE = 52;
const DRAG_GHOST_OFFSET_Y = 88;
const DRAG_GHOST_SIDE_OFFSET = 68;
const DRAG_TARGET_PADDING = 12;
const DRAG_CUSTOMER_TARGET_PADDING = 18;
const DRAG_MICROWAVE_TARGET_PADDING = 18;
const READY_COIN_COLLECTION_HINT = '订单完成，点击柜台金币收款';

const P0_PRODUCT_RESOURCE_PATHS: Partial<Record<ProductId, string>> = {
    'snack-bag': 'ui_p0/gameplay-first-pack/product_chips/spriteFrame',
    'lemon-drink': 'ui_p0/gameplay-first-pack/product_lemonade/spriteFrame',
    'strawberry-milk': 'ui_p0/gameplay-product-pack/product_strawberry_milk/spriteFrame',
    'pudding-cup': 'ui_p0/gameplay-product-pack/product_pudding/spriteFrame',
    'star-candy': 'ui_p0/gameplay-product-pack/product_star_candy/spriteFrame',
};
const PROBE_PRODUCT_RESOURCE_PATHS: Partial<Record<ProductId, string>> = {
    'snack-bag': 'ui_probe_gameplay_v1/products/snack_bag/spriteFrame',
    'lemon-drink': 'ui_probe_gameplay_v1/products/lemon_drink/spriteFrame',
    'rice-ball': 'ui_probe_gameplay_v1/products/rice_ball/spriteFrame',
    'strawberry-milk': 'ui_probe_gameplay_v1/products/strawberry_milk/spriteFrame',
    'pudding-cup': 'ui_probe_gameplay_v1/products/pudding_cup/spriteFrame',
    'star-candy': 'ui_probe_gameplay_v1/products/star_candy/spriteFrame',
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
    private customerBodyFrames = new Map<string, SpriteFrame>();
    private customerHandsFrames = new Map<string, SpriteFrame>();
    private customerFinalHandFrames = new Map<string, SpriteFrame>();
    private customerFaceFrames = new Map<string, SpriteFrame>();
    private storeBackgroundFrame?: SpriteFrame;
    private unifiedMicrowaveFrame?: SpriteFrame;
    private unifiedDeliveryPadFrame?: SpriteFrame;
    private unifiedCashierFrame?: SpriteFrame;
    private probeStoreBackgroundFrame?: SpriteFrame;
    private productCardProbeBaseFrame?: SpriteFrame;
    private productCardProbeAttentionFrame?: SpriteFrame;
    private productCardBaseFrame?: SpriteFrame;
    private productCardStockBadgeFrame?: SpriteFrame;
    private productCardSelectedFrame?: SpriteFrame;
    private productCardDisabledFrame?: SpriteFrame;
    private productCardBadgeFrames = new Map<ProductCardSkin, SpriteFrame>();
    private formalUiFrames = new Map<string, SpriteFrame>();
    private cashierIncomeBurstFrame?: SpriteFrame;
    private coreAssetsPending = CORE_ASSET_COUNT;
    private artReady = false;
    private refreshAccumulator = 0;
    private liveUiAccumulator = 0;
    private timerValueLabel?: Label;
    private coinValueLabel?: Label;
    private timerProgressFill?: Node;
    private microwaveProgressFill?: Node;
    private patienceFillNodes = new Map<number, Node>();
    private readyCountdownNodes = new Map<number, Node>();
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
    private dragState?: DragState;
    private dragGhostNode?: Node;
    private dragTargetNode?: Node;
    private dragInputCatcherNode?: Node;
    private suppressNextTapFallback = false;
    private readyCoinHintShown = false;
    private runtimeProbeState?: RuntimeProbeState;
    private qaPatiencePreset?: QaPatiencePreset;
    private qaFaceMoodPreset?: QaFaceMoodPreset;
    private qaFlowPreset?: QaFlowPreset;
    private qaInteractiveMode = false;

    start() {
        profiler.hideStats();
        if (START_DIRECTLY_IN_GAMEPLAY) {
            view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, ResolutionPolicy.EXACT_FIT);
            this.syncDirectGameplayCanvasToDesignSize();
        }
        this.loadEconomy();
        this.currentDay = this.economy.roundsCompleted + 1;
        this.home = !START_DIRECTLY_IN_GAMEPLAY;
        this.loadProductFrames();
        this.loadCharacterFrames();
        this.loadEnvironmentFrames();
        this.loadUiGeneratedFrames();
        if (START_DIRECTLY_IN_GAMEPLAY) {
            this.artReady = true;
            this.coreAssetsPending = 0;
            this.prepareGameplaySnapshotState();
            this.startDay(this.currentDay);
            this.runtimeProbeState = this.getRuntimeProbeState();
            this.qaPatiencePreset = this.getQaPatiencePreset();
            this.qaFaceMoodPreset = this.getQaFaceMoodPreset();
            this.qaFlowPreset = this.getQaFlowPreset();
            this.qaInteractiveMode = this.getQaInteractiveMode();
            this.applyRuntimeProbeState();
            this.applyQaPatiencePreset();
            this.applyQaFaceMoodPreset();
            this.applyQaFlowPreset();
        }
    }

    private syncDirectGameplayCanvasToDesignSize() {
        this.node.setPosition(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, 0);
        this.node.getComponent(UITransform)?.setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
        const cameraNode = this.node.parent?.getChildByName('Camera');
        if (!cameraNode) {
            return;
        }
        cameraNode.setPosition(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, 1000);
        const camera = cameraNode.getComponent(Camera);
        if (camera) {
            camera.orthoHeight = DESIGN_HEIGHT / 2;
        }
    }

    update(deltaTime: number) {
        if (this.runtimeProbeState && !this.qaInteractiveMode && this.getQaSnapshotMode()) {
            this.applyRuntimeProbeState(false);
            if (this.qaPatiencePreset) {
                this.applyQaPatiencePreset(false);
                this.updateLiveUi();
            }
            return;
        }
        if (this.qaPatiencePreset && !this.qaInteractiveMode) {
            this.applyQaPatiencePreset(false);
            this.applyQaFaceMoodPreset(false);
            this.updateLiveUi();
            return;
        }
        if (this.qaFaceMoodPreset && !this.qaInteractiveMode) {
            this.applyQaFaceMoodPreset(false);
            this.updateLiveUi();
            return;
        }
        if (this.qaFlowPreset && !this.qaInteractiveMode) {
            this.applyQaFlowPreset(false);
            this.updateLiveUi();
            return;
        }
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

        if (START_DIRECTLY_IN_GAMEPLAY && this.getQaSnapshotMode() && !this.paymentBurst && !this.qaInteractiveMode && !this.qaPatiencePreset) {
            this.maintainDirectGameplaySnapshotState();
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
                    if (!this.dragState) {
                        this.render();
                    }
                }
                continue;
            }

            const readyForCollection = this.isOrderBubbleReadyFor(customer);
            if (!readyForCollection) {
                customer.readyWindowRemaining = undefined;
            }

            customer.patience -= deltaTime;
            if (customer.patience <= 0) {
                if (readyForCollection) {
                    this.finishCustomerOrder(index, true);
                    continue;
                }
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
                if (!this.dragState) {
                    this.render();
                    this.playLowPatienceFx(customer.id);
                }
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
                this.setFeedback(
                    this.microwave.customerId === undefined
                        ? `${productName}好了，拖给顾客`
                        : `${productName}好了`,
                    'success',
                    -102,
                    106,
                    true,
                );
                if (!this.dragState) {
                    this.render();
                    this.playMicrowaveReadyFx();
                }
            }
        }

        this.liveUiAccumulator += deltaTime;
        if (this.liveUiAccumulator >= 0.2) {
            this.liveUiAccumulator = 0;
            this.updateLiveUi();
        }
        this.refreshAccumulator += deltaTime;
        const renderInterval = (this.paymentBurst || this.errorFx || this.hasReadyCoinStack())
            ? FEEDBACK_RENDER_INTERVAL
            : IDLE_RENDER_INTERVAL;
        if (this.refreshAccumulator >= renderInterval && !this.dragState) {
            this.refreshAccumulator = 0;
            this.render();
        }
    }

    private createCustomer(): CustomerState {
        const orderNumber = this.nextOrderIndex;
        this.nextOrderIndex += 1;
        const dayBalance = this.getDayBalanceConfig();
        const tutorialOrder = this.economy.lifetimeProfit === 0 && this.currentDay === 1 && orderNumber < 2;
        const kind = tutorialOrder ? 'normal' : this.pickCustomerKind(dayBalance, orderNumber);
        const order: OrderItem[] = [];
        const demandPool = this.getDemandPool();
        const fulfillablePool = this.getFulfillableDemandPool();
        const uniqueDemandCount = new Set(demandPool).size;
        const uniqueFulfillableCount = new Set(fulfillablePool).size;
        const microwaveCandidates = getProcessableProductIds('microwave')
            .filter((productId) => fulfillablePool.includes(productId));
        const forceFirstHotOrder = this.currentDay >= 3
            && orderNumber === 0
            && this.economy.microwaveLevel > 0
            && microwaveCandidates.length > 0;
        let orderKind = tutorialOrder
            ? 'normal-single'
            : forceFirstHotOrder
                ? 'heated-single'
                : this.pickOrderPlanKind(dayBalance, orderNumber);
        if (
            this.currentDay >= 7
            && (orderKind === 'heated-single' || orderKind === 'normal-heated')
            && this.customers.some((customer) => !customer.pendingOutcome && customer.order.some((item) => item.heated))
        ) {
            orderKind = 'normal-double';
        }
        const desiredItemCount = this.getDesiredItemCount(kind, orderKind, uniqueDemandCount);
        const riskSlotEnabled = !tutorialOrder && orderNumber >= 2 && desiredItemCount > 1 && orderNumber % 3 === 2;
        const itemCount = Math.min(
            desiredItemCount,
            uniqueFulfillableCount + (riskSlotEnabled ? 1 : 0),
        );

        if (tutorialOrder) {
            const productId = orderNumber === 0 ? 'snack-bag' : 'lemon-drink';
            if (fulfillablePool.includes(productId)) {
                order.push({ productId });
            }
        }
        const wantsHeated = orderKind === 'heated-single' || orderKind === 'normal-heated';
        if (this.economy.microwaveLevel > 0 && microwaveCandidates.length > 0 && wantsHeated) {
            const productId = this.pickUniqueDemandProduct(microwaveCandidates, order, orderNumber) ?? microwaveCandidates[0];
            order.push({ productId, heated: true });
        }
        while (order.length < itemCount) {
            const useIndependentDemand = riskSlotEnabled && order.length === itemCount - 1;
            const sourcePool = orderKind === 'premium-double'
                ? this.getPremiumDemandPool(useIndependentDemand ? demandPool : fulfillablePool)
                : useIndependentDemand ? demandPool : fulfillablePool;
            const productId = this.pickUniqueDemandProduct(sourcePool, order, orderNumber + order.length);
            if (!productId) {
                break;
            }
            order.push({ productId });
        }

        const maxPatience = dayBalance.patienceSeconds[kind];
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
            resources.load(FINAL_PRODUCT_RESOURCE_PATHS[productId], SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.productFrames.set(productId, frame);
                    this.renderGameplayIfReady();
                }
            });
            const probePath = PROBE_PRODUCT_RESOURCE_PATHS[productId];
            if (probePath) {
                resources.load(probePath, SpriteFrame, (error, frame) => {
                    if (!error && frame && !this.productFrames.has(productId)) {
                        this.productFrames.set(productId, frame);
                        this.renderGameplayIfReady();
                    }
                });
            }
            const p0Path = P0_PRODUCT_RESOURCE_PATHS[productId];
            if (p0Path) {
                resources.load(p0Path, SpriteFrame, (error, frame) => {
                    if (!error && frame && !this.productFrames.has(productId)) {
                        this.productFrames.set(productId, frame);
                    }
                });
            }
            resources.load(PRODUCT_CATALOG[productId].resourcePath, SpriteFrame, (error, frame) => {
                if (!error && frame && !this.productFrames.has(productId)) {
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
        this.loadLayeredCustomerFrames();
    }

    private loadLayeredCustomerFrames() {
        const finalCustomerFrames: Record<string, { body: string; face: string; hands: string }> = {
            'normal-waiting': {
                body: `${FINAL_UI_ROOT}/customers/blue_teal/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/blue_teal/face_neutral/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/blue_teal/left_hand/spriteFrame`,
            },
            'normal-happy': {
                body: `${FINAL_UI_ROOT}/customers/blue_teal/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/blue_teal/face_happy/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/blue_teal/right_hand/spriteFrame`,
            },
            'normal-urgent': {
                body: `${FINAL_UI_ROOT}/customers/blue_teal/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/blue_teal/face_impatient/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/blue_teal/left_hand/spriteFrame`,
            },
            'normal-angry': {
                body: `${FINAL_UI_ROOT}/customers/blue_teal/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/blue_teal/face_impatient/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/blue_teal/right_hand/spriteFrame`,
            },
            'impatient-waiting': {
                body: `${FINAL_UI_ROOT}/customers/purple_hoodie/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/purple_hoodie/face_neutral/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/purple_hoodie/left_hand/spriteFrame`,
            },
            'impatient-happy': {
                body: `${FINAL_UI_ROOT}/customers/purple_hoodie/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/purple_hoodie/face_happy/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/purple_hoodie/right_hand/spriteFrame`,
            },
            'impatient-urgent': {
                body: `${FINAL_UI_ROOT}/customers/purple_hoodie/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/purple_hoodie/face_impatient/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/purple_hoodie/left_hand/spriteFrame`,
            },
            'impatient-angry': {
                body: `${FINAL_UI_ROOT}/customers/purple_hoodie/body_base/spriteFrame`,
                face: `${FINAL_UI_ROOT}/customers/purple_hoodie/face_impatient/spriteFrame`,
                hands: `${FINAL_UI_ROOT}/customers/purple_hoodie/right_hand/spriteFrame`,
            },
        };
        const probeV2CustomerFrames: Record<string, { body: string; hands: string }> = {
            'normal-waiting': {
                body: 'ui_probe_gameplay_v2/customers/teal_regular/body_neutral/spriteFrame',
                hands: 'ui_probe_gameplay_v2/customers/teal_regular/hands_neutral/spriteFrame',
            },
            'impatient-waiting': {
                body: 'ui_probe_gameplay_v2/customers/purple_hoodie/body_neutral/spriteFrame',
                hands: 'ui_probe_gameplay_v2/customers/purple_hoodie/hands_neutral/spriteFrame',
            },
        };
        const probeV1CustomerFrames: Record<string, { body: string; hands: string }> = {
            'normal-waiting': {
                body: 'ui_probe_gameplay_v1/customers/teal_regular/body_neutral/spriteFrame',
                hands: 'ui_probe_gameplay_v1/customers/teal_regular/hands_neutral/spriteFrame',
            },
            'normal-urgent': {
                body: 'ui_probe_gameplay_v1/customers/teal_regular/body_impatient/spriteFrame',
                hands: 'ui_probe_gameplay_v1/customers/teal_regular/hands_impatient/spriteFrame',
            },
            'normal-happy': {
                body: 'ui_probe_gameplay_v1/customers/teal_regular/body_happy/spriteFrame',
                hands: 'ui_probe_gameplay_v1/customers/teal_regular/hands_happy/spriteFrame',
            },
        };
        const loadProbeCustomerFrames = (pathsByKey: Record<string, { body: string; hands: string }>, fallbackOnly: boolean) => {
            Object.entries(pathsByKey).forEach(([key, paths]) => {
                resources.load(paths.body, SpriteFrame, (error, frame) => {
                    if (!error && frame && (!fallbackOnly || !this.customerBodyFrames.has(key))) {
                        this.customerBodyFrames.set(key, frame);
                        this.renderGameplayIfReady();
                    }
                });
                resources.load(paths.hands, SpriteFrame, (error, frame) => {
                    if (!error && frame && (!fallbackOnly || !this.customerHandsFrames.has(key))) {
                        this.customerHandsFrames.set(key, frame);
                        this.renderGameplayIfReady();
                    }
                });
            });
        };
        Object.entries(finalCustomerFrames).forEach(([key, paths]) => {
            resources.load(paths.body, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.customerBodyFrames.set(key, frame);
                    this.renderGameplayIfReady();
                }
            });
            resources.load(paths.face, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.customerFaceFrames.set(key, frame);
                    this.renderGameplayIfReady();
                }
            });
            resources.load(paths.hands, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.customerHandsFrames.set(key, frame);
                    this.renderGameplayIfReady();
                }
            });
        });
        const finalCustomerHandFrames: Record<string, string> = {
            'normal-left': `${FINAL_UI_ROOT}/customers/blue_teal/left_hand/spriteFrame`,
            'normal-right': `${FINAL_UI_ROOT}/customers/blue_teal/right_hand/spriteFrame`,
            'impatient-left': `${FINAL_UI_ROOT}/customers/purple_hoodie/left_hand/spriteFrame`,
            'impatient-right': `${FINAL_UI_ROOT}/customers/purple_hoodie/right_hand/spriteFrame`,
        };
        Object.entries(finalCustomerHandFrames).forEach(([key, path]) => {
            resources.load(path, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    this.customerFinalHandFrames.set(key, frame);
                    this.renderGameplayIfReady();
                }
            });
        });
        loadProbeCustomerFrames(probeV1CustomerFrames, true);
        loadProbeCustomerFrames(probeV2CustomerFrames, true);
    }

    private renderGameplayIfReady() {
        if (this.artReady && !this.home && !this.preparing && !this.ended) {
            this.render();
        }
    }

    private loadEnvironmentFrames() {
        resources.load(`${FINAL_UI_ROOT}/background/store_background/spriteFrame`, SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.probeStoreBackgroundFrame = frame;
                this.renderGameplayIfReady();
            }
        });
        resources.load('ui_probe_gameplay_v1/background/store_background/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame && !this.probeStoreBackgroundFrame) {
                this.probeStoreBackgroundFrame = frame;
                this.renderGameplayIfReady();
            }
        });

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
        resources.load(`${FINAL_UI_ROOT}/product_card/card_base/spriteFrame`, SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.productCardProbeBaseFrame = frame;
                this.productCardBaseFrame = frame;
                if (this.artReady && !this.home && !this.preparing && !this.ended) {
                    this.render();
                }
            }
        });

        resources.load(`${FINAL_UI_ROOT}/product_card/stock_badge_base/spriteFrame`, SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.productCardStockBadgeFrame = frame;
                if (this.artReady && !this.home && !this.preparing && !this.ended) {
                    this.render();
                }
            }
        });

        resources.load('ui_layered/product_card_v1/product_card_base_slots/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame && !this.productCardBaseFrame) {
                this.productCardBaseFrame = frame;
                if (this.artReady && !this.home && !this.preparing && !this.ended) {
                    this.render();
                }
            }
        });

        resources.load('ui_layered/product_card_v1/state_selected_glow/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.productCardSelectedFrame = frame;
                if (this.artReady && !this.home && !this.preparing && !this.ended) {
                    this.render();
                }
            }
        });

        resources.load('ui_layered/product_card_v1/state_disabled_overlay/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) {
                this.productCardDisabledFrame = frame;
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
            'final-hud-top-frame': `${FINAL_UI_ROOT}/hud/top_frame_base/spriteFrame`,
            'final-hud-coin-base': `${FINAL_UI_ROOT}/hud/base_coin/spriteFrame`,
            'final-hud-time-base': `${FINAL_UI_ROOT}/hud/base_time/spriteFrame`,
            'final-coin': `${FINAL_UI_ROOT}/hud/coin_icon/spriteFrame`,
            'final-clock': `${FINAL_UI_ROOT}/hud/clock_icon/spriteFrame`,
            'final-pause': `${FINAL_UI_ROOT}/hud/pause_button/spriteFrame`,
            'final-nav-task': `${FINAL_UI_ROOT}/nav/icon_task/spriteFrame`,
            'final-nav-procurement': `${FINAL_UI_ROOT}/nav/icon_procurement/spriteFrame`,
            'final-nav-inventory': `${FINAL_UI_ROOT}/nav/icon_inventory/spriteFrame`,
            'final-nav-upgrade': `${FINAL_UI_ROOT}/nav/icon_upgrade/spriteFrame`,
            'final-nav-catalog': `${FINAL_UI_ROOT}/nav/icon_catalog/spriteFrame`,
            'final-bubble-selected': `${FINAL_UI_ROOT}/order/bubble_selected_base/spriteFrame`,
            'final-bubble-unselected': `${FINAL_UI_ROOT}/order/bubble_unselected_base/spriteFrame`,
            'final-order-slot': `${FINAL_UI_ROOT}/order/slot_base/spriteFrame`,
            'final-order-check': `${FINAL_UI_ROOT}/order/check/spriteFrame`,
            'final-ready-badge-baked': `${FINAL_UI_ROOT}/order/ready_badge_baked_ready/spriteFrame`,
            'final-microwave-idle': `${FINAL_UI_ROOT}/equipment/microwave_idle/spriteFrame`,
            'final-microwave-heating': `${FINAL_UI_ROOT}/equipment/microwave_heating/spriteFrame`,
            'final-microwave-ready': `${FINAL_UI_ROOT}/equipment/microwave_ready/spriteFrame`,
            'final-cashier-idle': `${FINAL_UI_ROOT}/equipment/cashier_idle/spriteFrame`,
            'final-cashier-pay': `${FINAL_UI_ROOT}/equipment/cashier_pay/spriteFrame`,
            'final-counter-foreground': `${FINAL_UI_ROOT}/equipment/counter_foreground/spriteFrame`,
            'final-counter-worktop': `${FINAL_UI_ROOT}/equipment/counter_worktop_midground/spriteFrame`,
            'panel-teal': 'ui_formal_v2/production/hud/hud_panel_teal/spriteFrame',
            'panel-timer': 'ui_formal_v2/production/hud/hud_panel_timer/spriteFrame',
            coin: 'ui_formal_v2/production/hud/icon_coin/spriteFrame',
            clock: 'ui_formal_v2/production/hud/icon_clock/spriteFrame',
            star: 'ui_formal_v2/production/hud/icon_star/spriteFrame',
            heart: 'ui_formal_v2/production/common/icon_heart/spriteFrame',
            pause: 'ui_formal_v2/production/common/icon_pause/spriteFrame',
            'bubble-selected': 'ui_formal_v2/production/order/order_bubble_selected/spriteFrame',
            'bubble-normal': 'ui_formal_v2/production/order/order_bubble_normal/spriteFrame',
            'p0-ready-badge': 'ui_p0/gameplay-fix-pack/ready_badge_compact/spriteFrame',
            'p0-bubble-active': 'ui_p0/gameplay-first-pack/order_bubble_active/spriteFrame',
            'p0-bubble-normal': 'ui_p0/gameplay-first-pack/order_bubble_normal/spriteFrame',
            'p0-bubble-partial': 'ui_p0/gameplay-first-pack/order_bubble_partial/spriteFrame',
            'p0-microwave-idle': 'ui_p0/gameplay-first-pack/microwave_idle/spriteFrame',
            'p0-microwave-heating': 'ui_p0/gameplay-first-pack/microwave_heating/spriteFrame',
            'p0-microwave-ready': 'ui_p0/gameplay-first-pack/microwave_ready/spriteFrame',
            'p0-cashier-income-burst-large': 'ui_p0/gameplay-feedback-pack/cashier_income_burst_large/spriteFrame',
            'p0-cashier-income-burst': 'ui_p0/gameplay-first-pack/cashier_income_burst/spriteFrame',
            'probe-bubble-current': 'ui_probe_gameplay_v1/order/bubble_current/spriteFrame',
            'probe-bubble-waiting': 'ui_probe_gameplay_v1/order/bubble_waiting/spriteFrame',
            'probe-ready-capsule': 'ui_probe_gameplay_v1/order/ready_capsule/spriteFrame',
            'probe-order-check': 'ui_probe_gameplay_v1/order/check/spriteFrame',
            'probe-v3-order-bubble-current': 'ui_probe_gameplay_v3/order_ready/order_bubble_current_base_v1/spriteFrame',
            'probe-v3-order-bubble-waiting': 'ui_probe_gameplay_v3/order_ready/order_bubble_waiting_base_v1/spriteFrame',
            'probe-v3-ready-badge-base': 'ui_probe_gameplay_v3/order_ready/ready_badge_base_empty_v1/spriteFrame',
            'probe-microwave-idle': 'ui_probe_gameplay_v1/equipment/microwave_idle/spriteFrame',
            'probe-microwave-heating': 'ui_probe_gameplay_v1/equipment/microwave_heating/spriteFrame',
            'probe-microwave-ready': 'ui_probe_gameplay_v1/equipment/microwave_ready/spriteFrame',
            'probe-cashier-idle': 'ui_probe_gameplay_v1/equipment/cashier_idle/spriteFrame',
            'probe-cashier-pay': 'ui_probe_gameplay_v1/equipment/cashier_pay/spriteFrame',
            'probe-product-card-base': 'ui_probe_gameplay_v1/product_card/base/spriteFrame',
            'probe-product-card-attention': 'ui_probe_gameplay_v1/product_card/attention_border/spriteFrame',
        };
        Object.entries(formalUiPaths).forEach(([key, path]) => {
            resources.load(path, SpriteFrame, (error, frame) => {
                if (!error && frame) {
                    if (key.startsWith('panel-')) {
                        frame.insetLeft = 64;
                        frame.insetRight = 28;
                        frame.insetTop = 20;
                        frame.insetBottom = 20;
                    } else if (key.startsWith('bubble-') || key.startsWith('p0-bubble-') || key.startsWith('probe-bubble-')) {
                        frame.insetLeft = 112;
                        frame.insetRight = 40;
                        frame.insetTop = 40;
                        frame.insetBottom = 62;
                    }
                    if (key === 'p0-cashier-income-burst-large' || (key === 'p0-cashier-income-burst' && !this.cashierIncomeBurstFrame)) {
                        this.cashierIncomeBurstFrame = frame;
                    } else if (key === 'probe-product-card-base' && !this.productCardProbeBaseFrame) {
                        this.productCardProbeBaseFrame = frame;
                    } else if (key === 'probe-product-card-attention' && !this.productCardProbeAttentionFrame) {
                        this.productCardProbeAttentionFrame = frame;
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
        if (this.dragState) {
            return;
        }
        this.clearDragState();
        this.node.destroyAllChildren();
        this.timerValueLabel = undefined;
        this.coinValueLabel = undefined;
        this.timerProgressFill = undefined;
        this.microwaveProgressFill = undefined;
        this.patienceFillNodes.clear();
        this.readyCountdownNodes.clear();
        if (START_DIRECTLY_IN_GAMEPLAY && !this.home && !this.preparing && !this.ended) {
            this.renderFinalGameplayCanvas();
            this.renderPaymentBurst();
            this.renderPauseMenu();
            this.renderToast();
            return;
        }
        const backgroundFrame = this.probeStoreBackgroundFrame ?? this.storeBackgroundFrame;
        if (backgroundFrame) {
            this.addArtwork(this.node, 'StoreBackground', backgroundFrame, DESIGN_WIDTH, DESIGN_HEIGHT);
        } else {
            this.addSurface(this.node, 'Background', DESIGN_WIDTH, DESIGN_HEIGHT, 0, this.color(255, 243, 214));
        }
        this.addSurface(this.node, 'HeaderBand', DESIGN_WIDTH, 116, 0, this.color(33, 24, 63, 250), 0, 609);
        this.addSurface(this.node, 'HeaderBandBottomShadow', DESIGN_WIDTH, 8, 0, this.color(18, 14, 38, 185), 0, 548);
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
        this.renderCustomerHandsForeground();
        this.renderProductAreaChrome();
        this.renderProducts();
        this.renderPaymentBurst();
        this.renderPauseMenu();
        this.renderToast();
    }

    private renderCounterForeground() {
        const finalCounterFrame = this.formalUiFrames.get('final-counter-foreground');
        if (finalCounterFrame) {
            this.addArtwork(this.node, 'CounterForegroundFinal', finalCounterFrame, DESIGN_WIDTH, 304, 0, 64);
            return;
        }
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
        this.renderHudChrome();
        this.renderHudCard('CoinHud', '营业额', `${this.revenue}`, '$', HUD_COIN_X, HUD_COIN_WIDTH, this.color(33, 24, 63), this.color(255, 194, 71));
        this.renderHudCard('TimerHud', '', this.formatShiftTime(this.shiftRemaining), '◷', HUD_TIMER_X, HUD_TIMER_WIDTH, this.color(255, 98, 84), this.color(255, 194, 71));
        this.renderHudCard('SatisfactionHud', '满意度', `${this.getLiveSatisfactionPercent()}%`, '★', HUD_SATISFACTION_X, HUD_SATISFACTION_WIDTH, this.color(33, 24, 63), this.color(255, 194, 71));
        this.renderPauseButton();
    }

    private renderHudChrome() {
        const topFrame = this.formalUiFrames.get('final-hud-top-frame');
        if (topFrame) {
            this.addArtwork(this.node, 'HudTopFrameFinal', topFrame, DESIGN_WIDTH, 147, 0, 610);
        }
        const timerDock = this.createNode('HudTimerDock', 316, 28, this.node);
        timerDock.setPosition(0, 556, 0);
        this.drawRect(timerDock, 316, 28, 14, this.color(33, 24, 63, 248), this.color(18, 14, 38), 5);
        this.addSurface(timerDock, 'HudTimerDockHighlight', 286, 5, 3, this.color(255, 255, 255, 28), 0, 7);
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
        const isTimer = name === 'TimerHud';
        const card = this.createNode(name, width, HUD_HEIGHT, this.node);
        card.setPosition(x, HUD_Y, 0);
        const panelFrame = isTimer
            ? this.formalUiFrames.get('final-hud-time-base') ?? this.formalUiFrames.get('panel-timer')
            : name === 'CoinHud'
                ? this.formalUiFrames.get('final-hud-coin-base') ?? this.formalUiFrames.get('panel-teal')
                : undefined;
        if (panelFrame) {
            this.addSlicedArtwork(card, `${name}PanelArt`, panelFrame, width, HUD_HEIGHT);
        } else {
            this.drawRect(
                card,
                width,
                HUD_HEIGHT,
                HUD_HEIGHT / 2,
                isTimer ? this.color(255, 80, 69, 245) : this.color(47, 40, 82, 246),
                isTimer ? this.color(80, 21, 44) : this.color(18, 14, 38),
                5,
            );
        }
        const gloss = this.createNode(`${name}Gloss`, width - 18, 18, card);
        gloss.setPosition(0, 15, 0);
        this.drawRect(gloss, width - 18, 18, 9, this.color(255, 255, 255, isTimer ? 42 : 28));

        const iconFrame = name === 'TimerHud'
            ? this.formalUiFrames.get('final-clock') ?? this.formalUiFrames.get('clock')
            : name === 'CoinHud'
                ? this.formalUiFrames.get('final-coin') ?? this.formalUiFrames.get('coin')
                : this.formalUiFrames.get('star');
        const iconX = -width / 2 + (isTimer ? 42 : 32);
        const iconSize = isTimer ? 54 : 44;
        if (iconFrame) {
            this.addArtwork(card, `${name}Icon`, iconFrame, iconSize, iconSize, iconX, isTimer ? 1 : 0);
        } else {
            const iconNode = this.createNode(`${name}Icon`, iconSize, iconSize, card);
            iconNode.setPosition(iconX, isTimer ? 1 : 0, 0);
            this.drawRect(iconNode, iconSize, iconSize, iconSize / 2, accent, this.color(18, 14, 38), 3);
            this.addLabel(iconNode, icon, 0, 1, isTimer ? 30 : 26, fill, true, iconSize - 6);
        }

        if (isTimer) {
            const valueNode = this.addLabel(card, value, 24, 2, 34, this.color(255, 255, 255), true, width - 90);
            this.timerValueLabel = valueNode.getChildByName('LabelText')?.getComponent(Label);
            const trackWidth = width - 84;
            const progressTrack = this.createNode('TimerProgressTrack', trackWidth, 8, card);
            progressTrack.setPosition(24, -24, 0);
            this.drawRect(progressTrack, trackWidth, 8, 4, this.color(80, 21, 44, 160));
            const progressWidth = trackWidth - 8;
            const fillRatio = this.getShiftProgressRatio();
            const progressFill = this.createNode('TimerProgressFill', progressWidth, 6, progressTrack);
            progressFill.setPosition(progressWidth * (fillRatio - 1) / 2, 0, 0);
            progressFill.setScale(new Vec3(fillRatio, 1, 1));
            this.drawRect(progressFill, progressWidth, 6, 3, this.color(255, 194, 71));
            this.timerProgressFill = progressFill;
            return;
        }

        this.addLabel(card, label, 18, 13, 15, this.color(236, 228, 214), true, width - 70);
        this.addLabel(card, value, 18, -12, 28, this.color(255, 255, 255), true, width - 70);
    }

    private renderPauseButton() {
        if (this.home || this.preparing || this.ended || !this.artReady) {
            return;
        }
        const button = this.createNode('PauseButton', HUD_PAUSE_SIZE, HUD_PAUSE_SIZE, this.node);
        button.setPosition(HUD_PAUSE_X, HUD_Y, 0);
        this.drawRect(
            button,
            HUD_PAUSE_SIZE,
            HUD_PAUSE_SIZE,
            HUD_PAUSE_SIZE / 2,
            this.pauseMenuOpen ? this.color(78, 66, 126) : this.color(47, 40, 82),
            this.color(18, 14, 38),
            5,
        );
        const highlight = this.createNode('PauseHighlight', 38, 14, button);
        highlight.setPosition(0, 10, 0);
        this.drawRect(highlight, 38, 14, 7, this.color(255, 255, 255, 24));
        const pauseFrame = this.formalUiFrames.get('final-pause') ?? this.formalUiFrames.get('pause');
        if (pauseFrame) {
            this.addArtwork(button, 'PauseIcon', pauseFrame, 30, 30, 0, 0);
        } else {
            this.addLabel(button, 'Ⅱ', 0, 1, 25, this.color(255, 255, 255), true, 38);
        }
        if (this.pauseMenuOpen) {
            button.setScale(new Vec3(1.06, 1.06, 1));
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

    private renderFinalGameplayCanvas() {
        this.renderFinalBackground();
        this.renderFinalCustomers();
        this.renderFinalPatienceBars();
        this.renderFinalHud();
        this.renderFinalOrders();
        this.renderFinalCounterAndEquipment();
        this.renderFinalBottomPanel();
        this.renderFinalSelectedHands(Math.min(this.activeCustomerIndex, 1));
        this.renderFinalProducts();
        this.renderFinalNav();
    }

    private renderFinalBackground() {
        const backgroundFrame = this.probeStoreBackgroundFrame ?? this.storeBackgroundFrame;
        if (backgroundFrame) {
            this.addFigmaArtwork(this.node, 'FinalStoreBackground', backgroundFrame, FIGMA_BACKGROUND);
        } else {
            this.addFigmaSurface(this.node, 'FinalStoreBackgroundFallback', FIGMA_BACKGROUND, 0, this.color(255, 243, 214));
        }
    }

    private renderFinalCustomers() {
        const customerRects = [FIGMA_LEFT_CUSTOMER, FIGMA_RIGHT_CUSTOMER];
        const faceRects = [FIGMA_LEFT_FACE, FIGMA_RIGHT_FACE];
        for (let index = 0; index < Math.min(2, this.customers.length); index += 1) {
            const customer = this.customers[index];
            const bodyFrame = this.customerBodyFrames.get(`${customer.kind}-${customer.mood}`)
                ?? this.customerBodyFrames.get(`${customer.kind}-waiting`);
            if (bodyFrame) {
                this.addFigmaArtwork(this.node, `FinalCustomerBody-${index}`, bodyFrame, customerRects[index]);
            }
            const faceFrame = this.customerFaceFrames.get(`${customer.kind}-${customer.mood}`)
                ?? this.customerFaceFrames.get(`${customer.kind}-waiting`);
            if (faceFrame) {
                this.addFinalFaceArtwork(
                    this.node,
                    `FinalCustomerFace-${index}`,
                    faceFrame,
                    faceRects[index],
                    customer.kind,
                    customer.mood,
                );
            }
        }
    }

    private renderFinalPatienceBars() {
        for (let side = 0; side < Math.min(2, this.customers.length); side += 1) {
            const customer = this.customers[side];
            const rect = FIGMA_FINAL_PATIENCE_TRACK_RECTS[side];
            const bar = this.createFigmaNode(`FinalPatienceFill-${customer.id}`, rect, this.node);
            this.patienceFillNodes.set(customer.id, bar);
            this.updateFinalPatienceFill(customer, bar);
        }
    }

    private renderFinalHud() {
        const topFrame = this.formalUiFrames.get('final-hud-top-frame');
        if (topFrame) {
            this.addFigmaArtwork(this.node, 'FinalHudTopFrame', topFrame, FIGMA_HEAD_BAR);
        }
        const coinBase = this.formalUiFrames.get('final-hud-coin-base');
        if (coinBase) {
            this.addFigmaArtwork(this.node, 'FinalHudCoinBase', coinBase, FIGMA_COIN_BASE);
        } else {
            this.addFigmaSurface(this.node, 'FinalHudCoinBaseFallback', FIGMA_COIN_BASE, 12, this.color(31, 24, 51));
        }
        const timeBase = this.formalUiFrames.get('final-hud-time-base');
        if (timeBase) {
            this.addFigmaArtwork(this.node, 'FinalHudTimeBase', timeBase, FIGMA_TIME_BASE);
        } else {
            this.addFigmaSurface(this.node, 'FinalHudTimeBaseFallback', FIGMA_TIME_BASE, 12, this.color(31, 24, 51));
        }
        const coinIcon = this.formalUiFrames.get('final-coin');
        if (coinIcon) {
            this.addFigmaArtwork(this.node, 'FinalHudCoinIcon', coinIcon, FIGMA_COIN_ICON);
        }
        const clockIcon = this.formalUiFrames.get('final-clock');
        if (clockIcon) {
            this.addFigmaArtwork(this.node, 'FinalHudClockIcon', clockIcon, FIGMA_CLOCK_ICON);
        }
        const coinLabel = this.addFigmaLabel(this.node, this.formatHudIncome(), FIGMA_COIN_TEXT, 24, this.color(255, 255, 255), true);
        this.coinValueLabel = coinLabel.getChildByName('LabelText')?.getComponent(Label);
        const timerLabel = this.addFigmaLabel(
            this.node,
            this.formatShiftTime(this.shiftRemaining),
            FIGMA_TIMER_TEXT,
            24,
            this.color(255, 255, 255),
            true,
        );
        this.timerValueLabel = timerLabel.getChildByName('LabelText')?.getComponent(Label);
        this.addFigmaSurface(this.node, 'FinalTimerTrack', FIGMA_TIMER_TRACK, 4, this.color(12, 9, 30));
        const fillRect = { ...FIGMA_TIMER_FILL };
        if (!this.runtimeProbeState) {
            fillRect.width = FIGMA_TIMER_FILL.width;
        }
        const fill = this.addFigmaSurface(this.node, 'FinalTimerFill', fillRect, 3, this.color(255, 194, 71));
        this.timerProgressFill = fill;
        const pauseFrame = this.formalUiFrames.get('final-pause');
        const pauseButton = pauseFrame
            ? this.addFigmaArtwork(this.node, 'FinalPauseButton', pauseFrame, FIGMA_PAUSE_ICON)
            : this.addFigmaSurface(this.node, 'FinalPauseButtonFallback', FIGMA_PAUSE_ICON, 9, this.color(120, 89, 143));
        pauseButton.on(Node.EventType.TOUCH_END, () => {
            this.pauseMenuOpen = !this.pauseMenuOpen;
            this.closeConfirmArmed = false;
            this.render();
        }, this);
    }

    private renderFinalBottomPanel() {
        this.addFigmaSurface(this.node, 'FinalBottomBand', FIGMA_BOTTOM_BAND, 0, this.color(59, 44, 79));
        this.addFigmaSurface(this.node, 'FinalBottomBandTopLip', { x: 0, y: 528, width: 390, height: 2 }, 0, this.color(33, 12, 32));
        this.addFigmaSurface(this.node, 'FinalProductPanelTopShadow', { x: 16, y: 538, width: 358, height: 4 }, 2, this.color(17, 13, 36));
        this.addFigmaSurface(
            this.node,
            'FinalProductPanel',
            FIGMA_PRODUCT_PANEL,
            9,
            this.color(86, 82, 124),
        );
    }

    private renderFinalOrders() {
        this.renderFinalOrderBubble(0, FIGMA_LEFT_BUBBLE_UNSELECTED, false);
        this.renderFinalOrderBubble(1, FIGMA_RIGHT_BUBBLE_UNSELECTED, false);
        for (let side = 0; side < 2; side += 1) {
            const customer = this.customers[side];
            if (!customer) {
                continue;
            }
            const offset = side * 3;
            customer.order.slice(0, 3).forEach((item, index) => {
                const slotRect = FIGMA_ORDER_SLOT_RECTS[offset + index];
                const iconRect = FIGMA_ORDER_ICON_RECTS[offset + index];
                const slotFrame = this.formalUiFrames.get('final-order-slot');
                if (slotFrame) {
                    this.addFigmaArtwork(this.node, `FinalOrderSlot-${side}-${index}`, slotFrame, slotRect);
                } else {
                    this.addFigmaSurface(
                        this.node,
                        `FinalOrderSlotFallback-${side}-${index}`,
                        slotRect,
                        6.5,
                        this.color(238, 215, 181),
                        this.color(200, 177, 148),
                        1,
                    );
                }
                const itemState = this.getOrderItemVisualState(customer, item);
                this.renderFinalOrderItemStateCue(side, index, customer, item, itemState, slotRect);
                this.addFigmaProductSprite(this.node, item.productId, iconRect, `FinalOrderProduct-${side}-${index}`, true);
                if (this.isItemPrepared(customer, item)) {
                    const checkFrame = this.formalUiFrames.get('final-order-check');
                    const checkRect = FIGMA_ORDER_CHECK_RECTS[offset + index];
                    if (checkFrame) {
                        this.addFigmaArtwork(this.node, `FinalOrderCheck-${side}-${index}`, checkFrame, checkRect);
                    } else {
                        this.addFigmaLabel(this.node, '✓', checkRect, 17, this.color(255, 255, 255), true, this.color(103, 199, 165));
                    }
                }
            });
        }
    }

    private renderFinalReadyCountdown(side: number, customer: CustomerState) {
        const rect = FIGMA_READY_COUNTDOWN_RECTS[side];
        const node = this.createFigmaNode(`FinalReadyCountdown-${customer.id}`, rect, this.node);
        this.readyCountdownNodes.set(customer.id, node);
        this.updateFinalReadyCountdown(customer, node);
    }

    private renderFinalOrderItemStateCue(
        side: number,
        index: number,
        customer: CustomerState,
        item: OrderItem,
        itemState: OrderItemVisualState,
        slotRect: FigmaRect,
    ) {
        const prefix = `FinalOrderItemCue-${side}-${index}`;
        const stateTintRect: FigmaRect = {
            x: slotRect.x + 3,
            y: slotRect.y + 3,
            width: slotRect.width - 6,
            height: slotRect.height - 6,
        };
        const microwaveReady = this.isMicrowaveProcessingOrderItem(customer, item, 'ready');

        if (item.heated && itemState === 'missing') {
            this.addFigmaSurface(this.node, `${prefix}-HeatNeedTint`, stateTintRect, 7, this.color(255, 194, 71, 22));
            this.addFigmaSurface(
                this.node,
                `${prefix}-HeatNeedCornerBadge`,
                {
                    x: slotRect.x + slotRect.width - 15,
                    y: slotRect.y + 5,
                    width: 13,
                    height: 13,
                },
                7,
                this.color(255, 98, 84, 232),
                this.color(255, 250, 239, 214),
                1,
            );
            this.addFigmaSurface(
                this.node,
                `${prefix}-HeatNeedSpark`,
                {
                    x: slotRect.x + slotRect.width - 11,
                    y: slotRect.y + 8,
                    width: 5,
                    height: 5,
                },
                3,
                this.color(255, 194, 71, 248),
            );
        }

        if (itemState === 'partial') {
            this.addFigmaSurface(this.node, `${prefix}-PartialTint`, stateTintRect, 7, this.color(103, 199, 165, 34));
            this.addFigmaSurface(
                this.node,
                `${prefix}-PartialCornerBadge`,
                {
                    x: slotRect.x + 5,
                    y: slotRect.y + 5,
                    width: 14,
                    height: 14,
                },
                7,
                this.color(103, 199, 165, 238),
                this.color(255, 250, 239, 220),
                1,
            );
            return;
        }

        if (itemState === 'heating') {
            this.addFigmaSurface(this.node, `${prefix}-HeatTint`, stateTintRect, 7, this.color(255, 98, 84, 36));
            this.addFigmaSurface(
                this.node,
                `${prefix}-HeatCornerBadge`,
                {
                    x: slotRect.x + 5,
                    y: slotRect.y + 5,
                    width: 18,
                    height: 16,
                },
                7,
                this.color(255, 98, 84, 248),
                this.color(255, 250, 239, 220),
                1,
            );
            this.addFigmaSurface(
                this.node,
                `${prefix}-HeatSpark`,
                {
                    x: slotRect.x + 13,
                    y: slotRect.y + 7,
                    width: 8,
                    height: 8,
                },
                4,
                this.color(255, 194, 71, 252),
            );
            this.addFigmaSurface(
                this.node,
                `${prefix}-HeatSteamA`,
                {
                    x: slotRect.x + 25,
                    y: slotRect.y + 4,
                    width: 7,
                    height: 7,
                },
                4,
                this.color(255, 228, 202, 200),
            );
            this.addFigmaSurface(
                this.node,
                `${prefix}-HeatSteamB`,
                {
                    x: slotRect.x + 31,
                    y: slotRect.y + 10,
                    width: 6,
                    height: 6,
                },
                3,
                this.color(255, 228, 202, 176),
            );
            return;
        }

        if (microwaveReady) {
            this.addFigmaSurface(this.node, `${prefix}-DeviceReadyTint`, stateTintRect, 7, this.color(255, 194, 71, 44));
            this.addFigmaSurface(
                this.node,
                `${prefix}-DeviceReadyRim`,
                {
                    x: slotRect.x - 2,
                    y: slotRect.y - 2,
                    width: slotRect.width + 4,
                    height: slotRect.height + 4,
                },
                8,
                this.color(255, 255, 255, 1),
                this.color(255, 194, 71, 236),
                3,
            );
            this.addFigmaSurface(
                this.node,
                `${prefix}-DeviceReadyDot`,
                {
                    x: slotRect.x + slotRect.width - 4,
                    y: slotRect.y - 4,
                    width: 12,
                    height: 12,
                },
                6,
                this.color(255, 194, 71, 246),
                this.color(255, 250, 239, 236),
                1,
            );
            return;
        }

        if (itemState === 'error') {
            this.addFigmaSurface(this.node, `${prefix}-ErrorTint`, stateTintRect, 7, this.color(216, 67, 67, 38));
            this.addFigmaSurface(
                this.node,
                `${prefix}-ErrorCornerBadge`,
                {
                    x: slotRect.x + 5,
                    y: slotRect.y + 5,
                    width: 14,
                    height: 14,
                },
                7,
                this.color(216, 67, 67, 238),
                this.color(255, 250, 239, 220),
                1,
            );
        }
    }

    private renderFinalOrderBubble(side: number, rect: FigmaRect, selected: boolean) {
        const frame = selected
            ? this.formalUiFrames.get('final-bubble-selected')
            : this.formalUiFrames.get('final-bubble-unselected');
        const node = frame
            ? this.addFigmaArtwork(this.node, `FinalOrderBubble-${side}`, frame, rect)
            : this.addFigmaSurface(this.node, `FinalOrderBubbleFallback-${side}`, rect, 14, this.color(255, 250, 239), this.color(255, 194, 71), selected ? 3 : 1);
        node.on(Node.EventType.TOUCH_END, (event?: { stopPropagation?: () => void; propagationStopped?: boolean }) => {
            this.stopTouchPropagation(event);
            const customer = this.customers[side];
            if (customer) {
                this.handleOrderBubbleTap(customer.id);
            }
        }, this);
    }

    private renderFinalSelectedHands(activeIndex: number) {
        const customer = this.customers[activeIndex];
        if (!customer) {
            return;
        }
        const rects = activeIndex === 0 ? FIGMA_LEFT_HANDS : FIGMA_RIGHT_HANDS;
        const leftFrame = this.customerFinalHandFrames.get(`${customer.kind}-left`);
        const rightFrame = this.customerFinalHandFrames.get(`${customer.kind}-right`);
        if (leftFrame) {
            this.addFigmaArtwork(this.node, `FinalCustomerLeftHand-${activeIndex}`, leftFrame, rects[0]);
        }
        if (rightFrame) {
            this.addFigmaArtwork(this.node, `FinalCustomerRightHand-${activeIndex}`, rightFrame, rects[1]);
        }
    }

    private renderFinalCounterAndEquipment() {
        const counterFrame = this.formalUiFrames.get('final-counter-foreground');
        if (counterFrame) {
            this.addFigmaArtwork(this.node, 'FinalCounterForeground', counterFrame, FIGMA_COUNTER_FOREGROUND);
        }
        const worktopFrame = this.formalUiFrames.get('final-counter-worktop');
        if (worktopFrame) {
            this.addFigmaArtwork(this.node, 'FinalCounterWorktop', worktopFrame, FIGMA_COUNTER_WORKTOP);
        }
        const microwaveFrame = this.getP0MicrowaveFrame(this.microwave.mode);
        const microwave = microwaveFrame
            ? this.addFigmaArtwork(this.node, 'FinalMicrowave', microwaveFrame, FIGMA_MICROWAVE)
            : this.addFigmaSurface(this.node, 'FinalMicrowaveFallback', FIGMA_MICROWAVE, 8, this.color(54, 158, 170));
        this.renderFinalMicrowaveReadyDragCue();
        this.bindMicrowaveDragInput(microwave);
        const cashierFrame = this.paymentBurst
            ? this.formalUiFrames.get('final-cashier-pay') ?? this.formalUiFrames.get('final-cashier-idle')
            : this.formalUiFrames.get('final-cashier-idle');
        if (cashierFrame) {
            this.addFigmaArtwork(this.node, 'FinalCashier', cashierFrame, FIGMA_CASHIER);
        }
        this.renderFinalReadyCoinStacks();
    }

    private renderFinalReadyCoinStacks() {
        for (let side = 0; side < Math.min(2, this.customers.length); side += 1) {
            const customer = this.customers[side];
            if (customer && this.isOrderBubbleReadyFor(customer)) {
                this.renderFinalReadyCoinStack(side, customer);
            }
        }
    }

    private hasReadyCoinStack() {
        return this.customers.some((customer) => this.isOrderBubbleReadyFor(customer));
    }

    private renderFinalReadyCoinStack(side: number, customer: CustomerState) {
        const rect = FIGMA_READY_COIN_STACK_RECTS[side];
        const hitRect = this.expandFigmaRect(rect, 8);
        const node = this.createFigmaNode(`FinalReadyCoinStack-${side}`, hitRect, this.node);
        const trigger = (event?: TouchLikeEvent) => {
            this.stopTouchPropagation(event);
            this.handleReadyCoinStackTap(customer.id, rect);
        };
        node.on(Node.EventType.TOUCH_END, trigger, this);
        const patienceRatio = Math.max(0, Math.min(1, customer.patience / customer.maxPatience));
        const urgency = 1 - patienceRatio;
        const pulse = patienceRatio < 0.3
            ? 0.5 + Math.sin(customer.patience * Math.PI * 5) * 0.5
            : 0;
        const glow = this.createNode(`FinalReadyCoinPulse-${side}`, hitRect.width + 12, hitRect.height + 10, node);
        this.drawRect(
            glow,
            hitRect.width + 12,
            hitRect.height + 10,
            18,
            this.color(255, 194, 71, Math.round(24 + urgency * 28 + pulse * 30)),
            this.color(255, 250, 239, Math.round(112 + urgency * 58 + pulse * 38)),
            2,
        );
        this.drawRect(node, hitRect.width, hitRect.height, 14, this.color(51, 33, 62, 36), this.color(255, 194, 71, 210), 1);

        const count = this.getReadyCoinStackCount(customer);
        const coinSize = 18;
        const columns = count <= 4 ? 2 : 4;
        const rows = Math.ceil(count / columns);
        for (let index = 0; index < count; index += 1) {
            const row = Math.floor(index / columns);
            const rowCount = Math.min(columns, count - row * columns);
            const column = index % columns;
            const coin = this.createNode(`FinalReadyCoin-${side}-${index}`, coinSize, coinSize, node);
            const x = (column - (rowCount - 1) / 2) * 14 + (row % 2 === 1 ? 3 : 0);
            const y = (row - (rows - 1) / 2) * 10 + (column % 2 === 1 ? 1 : -1);
            coin.setPosition(x, y, 0);
            this.drawRect(coin, coinSize, coinSize, coinSize / 2, this.color(255, 194, 71), this.color(255, 250, 239), 2);
            this.addLabel(coin, '$', 0, 0, 11, this.color(151, 102, 28), true, coinSize);
            coin.on(Node.EventType.TOUCH_END, trigger, this);
        }
    }

    private renderFinalProducts() {
        FIGMA_DIRECT_PRODUCT_IDS.forEach((productId, index) => {
            const cardRect = FIGMA_PRODUCT_CARDS[index];
            const iconRect = FIGMA_PRODUCT_ICON_RECTS[index];
            const stockBadgeRect = FIGMA_STOCK_BADGES[index];
            const stockTextRect = FIGMA_STOCK_TEXTS[index];
            if (this.productCardProbeBaseFrame) {
                this.addFigmaArtwork(this.node, `FinalProductCardArt-${productId}`, this.productCardProbeBaseFrame, cardRect);
            } else {
                this.addFigmaSurface(this.node, `FinalProductCardFallback-${productId}`, cardRect, 16, this.color(254, 247, 233), this.color(52, 25, 57), 2);
            }
            this.addFigmaProductSprite(this.node, productId, iconRect, `FinalProductIcon-${productId}`, true);
            if (this.productCardStockBadgeFrame) {
                this.addFigmaArtwork(this.node, `FinalStockBadge-${productId}`, this.productCardStockBadgeFrame, stockBadgeRect);
            } else {
                this.addFigmaSurface(this.node, `FinalStockBadgeFallback-${productId}`, stockBadgeRect, 6, this.color(102, 83, 86), this.color(74, 56, 64), 1);
            }
            const textRect = {
                ...stockTextRect,
                x: stockTextRect.x - 5,
                width: stockTextRect.width + 10,
            };
            this.addFigmaLabel(this.node, `x${this.stock[productId].toString().padStart(2, '0')}`, textRect, 12, this.color(255, 255, 255), true);
            if (this.stock[productId] <= 0) {
                const label = this.economy.warehouseStock[productId] > 0 ? '补货中' : '售罄';
                this.addFigmaLabel(
                    this.node,
                    label,
                    {
                        x: cardRect.x + 9,
                        y: cardRect.y + 7,
                        width: 50,
                        height: 18,
                    },
                    10,
                    this.color(255, 255, 255),
                    true,
                    this.economy.warehouseStock[productId] > 0
                        ? this.color(218, 139, 37, 206)
                        : this.color(216, 67, 67, 206),
                );
            }
            const hitArea = this.createFigmaNode(`FinalProductHit-${productId}`, cardRect, this.node);
            this.bindProductDragInput(hitArea, productId);
        });
    }

    private renderFinalNav() {
        const navFrameKeys = [
            'final-nav-task',
            'final-nav-procurement',
            'final-nav-inventory',
            'final-nav-upgrade',
            'final-nav-catalog',
        ];
        const navLabels = ['营业', '采购', '库存', '升级', '图鉴'];
        navFrameKeys.forEach((key, index) => {
            const frame = this.formalUiFrames.get(key);
            const rect = FIGMA_NAV_RECTS[index];
            const node = frame
                ? this.addFigmaArtwork(this.node, `FinalNav-${index}`, frame, rect)
                : this.addFigmaSurface(this.node, `FinalNavFallback-${index}`, rect, 10, this.color(78, 66, 126));
            const showFeedback = () => {
                this.setFeedback(
                    index === 0 ? '当前营业页' : `${navLabels[index]}即将开放`,
                    'info',
                    this.figmaCenterX(rect),
                    this.figmaCenterY(rect),
                );
                this.render();
            };
            if (index > 0) {
                this.addFigmaSurface(this.node, `FinalNavSoonShade-${index}`, rect, 10, this.color(17, 13, 36, 112));
                this.addFigmaLabel(
                    this.node,
                    '即将',
                    { x: rect.x + 11, y: rect.y + 38, width: 40, height: 16 },
                    11,
                    this.color(255, 255, 255),
                    true,
                    this.color(51, 33, 62, 210),
                );
            }
            const hitArea = this.createFigmaNode(`FinalNavHit-${index}`, rect, this.node);
            hitArea.on(Node.EventType.TOUCH_END, showFeedback, this);
            node.on(Node.EventType.TOUCH_END, showFeedback, this);
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
        const compact = Boolean(this.toast.compact);
        const height = compact ? 42 : 56;
        const width = Math.min(
            compact ? 252 : DESIGN_WIDTH - 32,
            Math.max(compact ? 136 : 220, this.toast.message.length * (compact ? 14 : 18) + (compact ? 58 : 76)),
        );
        const x = Math.max(-DESIGN_WIDTH / 2 + width / 2 + 12, Math.min(DESIGN_WIDTH / 2 - width / 2 - 12, this.toast.x));
        const y = Math.max(-DESIGN_HEIGHT / 2 + 54, Math.min(DESIGN_HEIGHT / 2 - 160, this.toast.y));
        const toast = this.createNode('Toast', width, height, this.node);
        toast.setPosition(x, y, 0);
        this.drawRect(toast, width, height, compact ? 17 : 22, toneColors[this.toast.tone], this.color(255, 255, 255), compact ? 2 : 3);

        const iconSize = compact ? 24 : 34;
        const icon = this.createNode('ToastIcon', iconSize, iconSize, toast);
        icon.setPosition(-width / 2 + (compact ? 22 : 32), 0, 0);
        this.drawRect(icon, iconSize, iconSize, iconSize / 2, this.color(255, 255, 255, 238));
        this.addLabel(icon, toneIcons[this.toast.tone], 0, 0, compact ? 14 : 20, toneColors[this.toast.tone], true, iconSize - 6);
        this.addLabel(toast, this.toast.message, compact ? 18 : 22, 0, compact ? 14 : 18, this.color(255, 255, 255), true, width - (compact ? 62 : 92));
    }

    private renderPaymentBurst() {
        if (!this.paymentBurst) {
            return;
        }
        const progress = 1 - this.paymentBurst.remaining / 0.95;
        const y = PAYMENT_BURST_Y + progress * PAYMENT_BURST_FLOAT_Y;
        const root = this.createNode('PaymentBurst', 138, 52, this.node);
        root.setPosition(PAYMENT_BURST_X, y, 0);
        const amount = this.createNode('PaymentAmount', 112, 36, root);
        amount.setPosition(0, 2, 0);
        this.drawRect(amount, 112, 36, 18, this.paymentBurst.lowReward ? this.color(218, 139, 37, 236) : this.color(255, 194, 71, 238), this.color(255, 255, 255), 2);
        this.addLabel(amount, `+${this.paymentBurst.amount}`, 8, 0, 21, this.color(51, 33, 62), true, 82);
        for (let index = 0; index < 3; index += 1) {
            const coin = this.createNode(`PaymentCoin-${index}`, 18, 18, root);
            coin.setPosition(-46 + index * 46, -22 + Math.sin(progress * Math.PI + index) * 5, 0);
            this.drawRect(coin, 18, 18, 9, this.color(255, 194, 71), this.color(255, 250, 239), 2);
            this.addLabel(coin, '$', 0, 0, 11, this.color(151, 102, 28), true, 14);
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
            const layout = this.getCustomerLayout(index, this.customers.length);
            const active = index === this.activeCustomerIndex;
            const card = this.createNode(`Customer-${customer.id}`, 356, 390, this.node);
            card.setPosition(layout.x, CUSTOMER_ROW_Y, 0);
            card.on(Node.EventType.TOUCH_END, () => {
                if (customer.pendingOutcome) {
                    this.pop(card);
                    return;
                }
                if (this.activeCustomerIndex === index) {
                    if (this.isOrderBubbleReadyFor(customer)) {
                        this.attemptDeliverPreparedOrder(customer.id);
                        return;
                    }
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

            this.drawMonster(card, 0, layout.monsterY, customer.kind, customer.mood, active, layout.monsterSize);
            this.renderOrderIcons(card, customer, layout.orderY, active, layout.orderX);
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

    private renderCustomerHandsForeground() {
        for (let index = 0; index < this.customers.length; index += 1) {
            const customer = this.customers[index];
            if (index !== this.activeCustomerIndex) {
                continue;
            }
            const frameKey = `${customer.kind}-${customer.mood}`;
            const handsFrame = this.customerHandsFrames.get(frameKey);
            if (!handsFrame || !this.customerBodyFrames.has(frameKey)) {
                continue;
            }
            const layout = this.getCustomerLayout(index, this.customers.length);
            const motion = this.getMonsterMotion(customer.mood, true);
            const handsWidth = layout.monsterSize * CUSTOMER_LAYERED_HANDS_WIDTH_SCALE;
            const hands = this.addArtwork(
                this.node,
                `CustomerHands-${customer.id}`,
                handsFrame,
                handsWidth,
                handsWidth * CUSTOMER_LAYERED_HANDS_HEIGHT_RATIO,
                layout.x + CUSTOMER_LAYERED_HANDS_X + motion.x,
                CUSTOMER_ROW_Y + CUSTOMER_LAYERED_HANDS_Y + motion.y,
            );
            hands.setScale(new Vec3(motion.scaleX, motion.scaleY, 1));
        }
    }

    private getCustomerLayout(index: number, total: number) {
        if (total < 2) {
            return CUSTOMER_SINGLE_LAYOUT;
        }
        return CUSTOMER_PAIR_LAYOUTS[Math.min(index, CUSTOMER_PAIR_LAYOUTS.length - 1)];
    }

    private drawMonster(parent: Node, x: number, y: number, kind: CustomerKind, mood: CustomerMood, active: boolean, size = 220) {
        const motion = this.getMonsterMotion(mood, active);
        const frameKey = `${kind}-${mood}`;
        const bodyFrame = this.customerBodyFrames.get(frameKey);
        if (bodyFrame) {
            const bodyWidth = size * CUSTOMER_LAYERED_BODY_SIZE_SCALE;
            const body = this.addArtwork(
                parent,
                'MonsterLayeredBodyArt',
                bodyFrame,
                bodyWidth,
                bodyWidth * CUSTOMER_LAYERED_BODY_HEIGHT_RATIO,
                x + motion.x,
                y + CUSTOMER_LAYERED_BODY_Y_OFFSET + motion.y,
            );
            body.setScale(new Vec3(motion.scaleX, motion.scaleY, 1));
            const faceFrame = this.customerFaceFrames.get(frameKey);
            if (faceFrame) {
                const faceWidth = size * CUSTOMER_LAYERED_FACE_WIDTH_SCALE;
                const faceRect = faceFrame.rect;
                const faceHeight = faceWidth * Math.max(1, faceRect?.height ?? faceWidth) / Math.max(1, faceRect?.width ?? faceWidth);
                const face = this.addArtwork(
                    parent,
                    'MonsterLayeredFaceArt',
                    faceFrame,
                    faceWidth,
                    faceHeight,
                    x + motion.x,
                    y + CUSTOMER_LAYERED_FACE_Y_OFFSET + motion.y,
                );
                face.setScale(new Vec3(motion.scaleX, motion.scaleY, 1));
            }
            this.renderMonsterMoodMark(parent, x, y, mood);
            return;
        }

        const frame = this.characterFrames.get(frameKey);
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
            scaleX: 1,
            scaleY: 1,
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

    private renderOrderIcons(parent: Node, customer: CustomerState, y: number, active: boolean, x = 0) {
        const visualState = this.getOrderBubbleVisualState(customer);
        const errorActive = visualState === 'error';
        const readyActive = visualState === 'ready';
        const partialActive = visualState === 'partial';
        const useProbeV3Bubble = Boolean(this.formalUiFrames.get(this.getProbeV3OrderBubbleKey(visualState, active)));
        const width = useProbeV3Bubble
            ? this.getProbeV3OrderBubbleWidth(visualState, active)
            : readyActive ? READY_ORDER_BUBBLE_WIDTH : ORDER_BUBBLE_WIDTH;
        const height = useProbeV3Bubble
            ? this.getProbeV3OrderBubbleHeight(visualState, active, width)
            : readyActive ? READY_ORDER_BUBBLE_HEIGHT : ORDER_BUBBLE_HEIGHT;
        if (readyActive && !useProbeV3Bubble) {
            const halo = this.createNode('OrderReadyOuterHalo', width + 54, height + 54, parent);
            halo.setPosition(x, y - 4, 0);
            this.drawRect(halo, width + 54, height + 54, ORDER_BUBBLE_RADIUS + 16, this.color(255, 194, 71, 46));
            const glow = this.createNode('OrderReadyGlow', width + 30, height + 30, parent);
            glow.setPosition(x, y, 0);
            this.drawRect(glow, width + 30, height + 30, ORDER_BUBBLE_RADIUS + 10, this.color(255, 216, 87, 74));
            const rim = this.createNode('OrderReadyGoldRim', width + 14, height + 14, parent);
            rim.setPosition(x, y, 0);
            this.drawRect(rim, width + 14, height + 14, ORDER_BUBBLE_RADIUS + 6, this.color(255, 255, 255, 1), this.color(255, 216, 87, 236), 5);
        } else if (partialActive && !useProbeV3Bubble) {
            const glow = this.createNode('OrderPartialGlow', width + 18, height + 18, parent);
            glow.setPosition(x, y, 0);
            this.drawRect(glow, width + 18, height + 18, ORDER_BUBBLE_RADIUS + 6, this.color(255, 194, 71, 44));
        }
        if (errorActive && !useProbeV3Bubble) {
            const glow = this.createNode('OrderGlow', width + 20, height + 20, parent);
            glow.setPosition(x, y, 0);
            this.drawRect(glow, width + 20, height + 20, ORDER_BUBBLE_RADIUS + 6, this.color(216, 67, 67, 78));
        }

        const bubbleFrame = this.getOrderBubbleFrame(visualState, active);
        let order: Node;
        if (bubbleFrame) {
            order = this.addArtwork(parent, 'Order', bubbleFrame, width, height, x, y);
            const bubbleSprite = order.getComponent(Sprite);
            if (bubbleSprite) {
                bubbleSprite.type = useProbeV3Bubble ? Sprite.Type.SIMPLE : Sprite.Type.SLICED;
            }
        } else {
            const kindColor = customer.kind === 'normal'
                ? this.color(255, 98, 84)
                : customer.kind === 'impatient'
                    ? this.color(120, 89, 143)
                    : this.color(54, 158, 170);
            const borderColor = errorActive
                ? this.color(216, 67, 67)
                : readyActive
                    ? this.color(103, 199, 165)
                    : partialActive
                        ? this.color(255, 194, 71)
                        : active ? this.color(255, 98, 84) : kindColor;
            const shadow = this.createNode('OrderBubbleShadow', width, height, parent);
            shadow.setPosition(x, y - 5, 0);
            this.drawRect(shadow, width, height, ORDER_BUBBLE_RADIUS, this.color(51, 33, 62, 32));

            const tail = this.createNode('OrderTail', 32, 32, parent);
            tail.setPosition(x + ORDER_TAIL_X, y + ORDER_TAIL_Y, 0);
            this.drawSpeechTail(tail, 28, this.color(255, 250, 239, 250), borderColor, active ? 5 : 4);

            order = this.createNode('Order', width, height, parent);
            order.setPosition(x, y, 0);
            this.drawRect(order, width, height, ORDER_BUBBLE_RADIUS, this.color(255, 250, 239, 250), borderColor, active ? 6 : 4);
        }
        order.on(Node.EventType.TOUCH_END, (event?: { stopPropagation?: () => void; propagationStopped?: boolean }) => {
            this.stopTouchPropagation(event);
            this.handleOrderBubbleTap(customer.id);
        }, this);

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
            const itemState = this.getOrderItemVisualState(customer, item);
            const prepared = this.isItemPrepared(customer, item);
            const icon = this.createNode(`Order-${item.productId}`, ORDER_ITEM_NODE_SIZE, ORDER_ITEM_NODE_SIZE, order);
            icon.setPosition(startX + index * spacing, ORDER_ITEM_Y, 0);
            const itemError = itemState === 'error';
            const slotFrame = this.formalUiFrames.get('final-order-slot');
            if (slotFrame) {
                this.addArtwork(icon, `OrderSlotArt-${item.productId}`, slotFrame, ORDER_ITEM_SLOT_SIZE, ORDER_ITEM_SLOT_SIZE);
            } else if (!useProbeV3Bubble) {
                const itemFill = itemError
                    ? this.color(255, 232, 232, 240)
                        : prepared
                            ? this.color(229, 251, 222, 238)
                        : itemState === 'ready'
                            ? this.color(255, 246, 213, 238)
                            : itemState === 'partial'
                                ? this.color(229, 246, 238, 224)
                                : itemState === 'heating'
                                    ? this.color(255, 238, 235, 232)
                                    : itemState === 'done'
                                        ? this.color(236, 228, 214, 170)
                                        : this.color(255, 255, 255, 220);
                const itemStroke = itemError
                    ? this.color(216, 67, 67)
                        : prepared
                            ? this.color(103, 199, 165, 230)
                        : itemState === 'ready'
                            ? this.color(255, 194, 71, 230)
                            : itemState === 'partial'
                                ? this.color(103, 199, 165, 190)
                                : itemState === 'heating'
                                    ? this.color(255, 98, 84, 190)
                                    : this.color(120, 89, 143, prepared ? 90 : 210);
                this.drawRect(
                    icon,
                    ORDER_ITEM_SLOT_SIZE,
                    ORDER_ITEM_SLOT_SIZE,
                    14,
                    itemFill,
                    itemStroke,
                    itemError || prepared || itemState === 'ready' ? 5 : 3,
                );
            }
            this.addProductSprite(icon, item.productId, prepared ? 34 : 40);
            if (item.heated && !prepared) {
                const heatBadge = this.createNode(`OrderHeat-${item.productId}`, 28, 28, order);
                heatBadge.setPosition(startX + index * spacing + 31, ORDER_ITEM_Y + 31, 0);
                this.drawRect(
                    heatBadge,
                    28,
                    28,
                    14,
                    itemState === 'heating'
                        ? this.color(255, 158, 168)
                        : itemState === 'ready'
                            ? this.color(255, 194, 71)
                            : this.color(120, 89, 143),
                    this.color(255, 255, 255),
                    3,
                );
                this.addLabel(heatBadge, itemState === 'ready' ? '✓' : '火', 0, 0, 16, this.color(255, 255, 255), true, 22);
            }
            if (prepared) {
                const checkFrame = this.formalUiFrames.get('final-order-check');
                if (checkFrame) {
                    this.addArtwork(order, `OrderServed-${item.productId}`, checkFrame, 32, 32, startX + index * spacing + 25, ORDER_ITEM_Y - 25);
                } else {
                    const check = this.createNode(`OrderServed-${item.productId}`, 32, 32, order);
                    check.setPosition(startX + index * spacing + 25, ORDER_ITEM_Y - 25, 0);
                    this.drawRect(
                        check,
                        28,
                        28,
                        14,
                        this.color(103, 199, 165),
                        this.color(255, 255, 255),
                        3,
                    );
                    this.addLabel(check, '✓', 1, 0, 18, this.color(255, 255, 255), true, 22);
                }
            }
        });

        if (readyActive || partialActive || errorActive) {
            const probeV3ReadyBadgeFrame = readyActive
                ? this.formalUiFrames.get('probe-v3-ready-badge-base')
                : undefined;
            const finalReadyBadgeFrame = readyActive ? this.formalUiFrames.get('final-ready-badge-baked') : undefined;
            const statusWidth = readyActive && finalReadyBadgeFrame
                ? READY_BADGE_WIDTH
                : readyActive && probeV3ReadyBadgeFrame
                ? PROBE_V3_READY_BADGE_WIDTH
                : readyActive ? READY_BADGE_WIDTH : 112;
            const statusHeight = readyActive && finalReadyBadgeFrame
                ? READY_BADGE_HEIGHT
                : readyActive && probeV3ReadyBadgeFrame
                ? PROBE_V3_READY_BADGE_WIDTH * PROBE_V3_READY_BADGE_HEIGHT_RATIO
                : readyActive ? READY_BADGE_HEIGHT : 38;
            const probeReadyBadgeFrame = this.formalUiFrames.get('probe-ready-capsule');
            const readyBadgeFrame = readyActive
                ? finalReadyBadgeFrame ?? probeV3ReadyBadgeFrame ?? probeReadyBadgeFrame ?? this.formalUiFrames.get('p0-ready-badge')
                : undefined;
            const readyBadgeNeedsRuntimeText = readyActive && !finalReadyBadgeFrame && Boolean(probeV3ReadyBadgeFrame ?? probeReadyBadgeFrame);
            const status = readyBadgeFrame
                ? this.addArtwork(
                    order,
                    'OrderStatusBadge',
                    readyBadgeFrame,
                    statusWidth,
                    statusHeight,
                    probeV3ReadyBadgeFrame && !finalReadyBadgeFrame ? PROBE_V3_READY_BADGE_X : READY_BADGE_X,
                    probeV3ReadyBadgeFrame && !finalReadyBadgeFrame ? PROBE_V3_READY_BADGE_Y : READY_BADGE_Y,
                )
                : this.createNode('OrderStatusBadge', statusWidth, statusHeight, order);
            if (!readyBadgeFrame) {
                status.setPosition(readyActive ? READY_BADGE_X : 78, readyActive ? READY_BADGE_Y : 84, 0);
                const statusFill = readyActive
                    ? this.color(103, 199, 165, 240)
                    : errorActive
                        ? this.color(216, 67, 67, 238)
                        : this.color(255, 194, 71, 238);
                this.drawRect(status, statusWidth, statusHeight, 17, statusFill, this.color(255, 255, 255), 3);
            }
            const preparedCount = this.getPreparedOrderItemCount(customer);
            const statusText = readyActive
                ? 'READY'
                : errorActive
                    ? '缺少'
                    : `${preparedCount}/${customer.order.length}`;
            if (!readyActive || !readyBadgeFrame || readyBadgeNeedsRuntimeText) {
                this.addLabel(
                    status,
                    statusText,
                    0,
                    0,
                    readyActive && probeV3ReadyBadgeFrame ? PROBE_V3_READY_BADGE_FONT_SIZE : readyActive ? 18 : 19,
                    this.color(255, 255, 255),
                    true,
                    statusWidth - 20,
                );
            }
            if (readyActive) {
                status.on(Node.EventType.TOUCH_END, (event?: { stopPropagation?: () => void; propagationStopped?: boolean }) => {
                    this.stopTouchPropagation(event);
                    this.handleOrderBubbleTap(customer.id);
                }, this);
            }
        }
        if (readyActive) {
            const tapSurface = this.createNode('OrderReadyTapSurface', width + 88, height + 96, order);
            tapSurface.setPosition(0, -26, 0);
            this.drawRect(tapSurface, width + 88, height + 96, ORDER_BUBBLE_RADIUS + 16, this.color(255, 255, 255, 1));
            tapSurface.on(Node.EventType.TOUCH_END, (event?: { stopPropagation?: () => void; propagationStopped?: boolean }) => {
                this.stopTouchPropagation(event);
                this.handleOrderBubbleTap(customer.id);
            }, this);
        }
    }

    private renderWorkstation() {
        const workstationBand = this.createNode('WorkstationBand', DESIGN_WIDTH, WORKSTATION_HEIGHT, this.node);
        workstationBand.setPosition(0, WORKSTATION_Y, 0);
        this.drawRect(workstationBand, DESIGN_WIDTH, WORKSTATION_HEIGHT, 0, this.color(255, 224, 178, 248));
        this.addSurface(workstationBand, 'WorkstationBackWall', DESIGN_WIDTH, 106, 0, this.color(255, 250, 239, 196), 0, 85);
        this.addSurface(workstationBand, 'CounterShadow', DESIGN_WIDTH, 26, 0, this.color(51, 33, 62, 100), 0, 108);
        this.addSurface(workstationBand, 'CounterTop', DESIGN_WIDTH, 26, 0, this.color(51, 33, 62), 0, 95);
        this.addSurface(workstationBand, 'CounterTrim', DESIGN_WIDTH, 16, 0, this.color(54, 158, 170), 0, 76);
        this.addSurface(workstationBand, 'PrepCounterFace', DESIGN_WIDTH, 58, 0, this.color(224, 147, 94, 138), 0, -118);
        this.addSurface(workstationBand, 'PrepCounterHighlight', DESIGN_WIDTH - 34, 7, 3, this.color(255, 255, 255, 72), 0, -92);
        this.addSurface(workstationBand, 'ServiceFlowRail', 590, 8, 4, this.color(255, 194, 71, 120), -10, 36);
        const finalWorktopFrame = this.formalUiFrames.get('final-counter-worktop');
        if (finalWorktopFrame) {
            this.addArtwork(workstationBand, 'CounterWorktopFinal', finalWorktopFrame, DESIGN_WIDTH, 238, 0, -10);
        }

        this.addSurface(workstationBand, 'MicrowaveGroundShadow', 268, 16, 8, this.color(51, 33, 62, 42), MICROWAVE_X, EQUIPMENT_BASELINE_Y + 8);
        this.addSurface(workstationBand, 'CashierGroundShadow', 246, 16, 8, this.color(51, 33, 62, 40), CASHIER_X, EQUIPMENT_BASELINE_Y + 8);
        this.renderWorkstationDecor(workstationBand);

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
        this.bindMicrowaveDragInput(microwave);

        const cashier = this.drawCashier(workstationBand, CASHIER_X, this.getScaledEquipmentBaseY(169, CASHIER_SCALE));
        cashier.setScale(new Vec3(CASHIER_SCALE, CASHIER_SCALE, 1));
    }

    private renderWorkstationDecor(parent: Node) {
        const cup = this.createNode('ReceiptCup', 48, 72, parent);
        cup.setPosition(-8, -44, 0);
        this.drawRect(cup, 42, 56, 8, this.color(236, 190, 142), this.color(120, 89, 143, 160), 3);
        this.addSurface(cup, 'ReceiptStickA', 8, 58, 3, this.color(255, 250, 239), -9, 22);
        this.addSurface(cup, 'ReceiptStickB', 8, 52, 3, this.color(255, 250, 239), 8, 24);

        const sign = this.createNode('CounterPromoSign', 58, 96, parent);
        sign.setPosition(58, -28, 0);
        this.drawRect(sign, 58, 88, 8, this.color(255, 250, 239), this.color(120, 89, 143, 150), 3);
        this.drawRect(this.createNode('CounterPromoIcon', 34, 34, sign), 34, 34, 17, this.color(103, 199, 165, 220));
        this.addSurface(sign, 'CounterPromoLineA', 34, 5, 2, this.color(120, 89, 143, 100), 0, -16);
        this.addSurface(sign, 'CounterPromoLineB', 26, 5, 2, this.color(120, 89, 143, 72), 0, -30);
    }

    private getScaledEquipmentBaseY(height: number, scale: number) {
        return EQUIPMENT_BASELINE_Y + height * (scale - 1) / 2;
    }

    private drawMicrowaveFace(parent: Node, locked: boolean, y = -16, mode: MicrowaveState['mode'] = 'idle') {
        const p0Frame = this.getP0MicrowaveFrame(mode);
        if (p0Frame) {
            this.addArtwork(parent, 'MicrowaveP0Art', p0Frame, 206, 166, 0, y);
            return;
        }
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

    private getP0MicrowaveFrame(mode: MicrowaveState['mode']): SpriteFrame | undefined {
        if (mode === 'ready') {
            return this.formalUiFrames.get('final-microwave-ready')
                ?? this.formalUiFrames.get('probe-microwave-ready')
                ?? this.formalUiFrames.get('p0-microwave-ready');
        }
        if (mode === 'heating') {
            return this.formalUiFrames.get('final-microwave-heating')
                ?? this.formalUiFrames.get('probe-microwave-heating')
                ?? this.formalUiFrames.get('p0-microwave-heating');
        }
        return this.formalUiFrames.get('final-microwave-idle')
            ?? this.formalUiFrames.get('probe-microwave-idle')
            ?? this.formalUiFrames.get('p0-microwave-idle');
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
        const pad = this.createNode('DeliveryPadDecor', 170, 46, tray);
        pad.setPosition(0, 30, 0);
        this.drawRect(pad, 170, 46, 18, this.color(255, 250, 239, 236), this.color(51, 33, 62, 78), 2);
        this.addLabel(pad, '备餐台', 0, 5, 16, this.color(120, 89, 143, 220), true, 112);
        this.addLabel(pad, '仅暂存', 0, -12, 12, this.color(120, 89, 143, 150), true, 100);
    }

    private drawCashier(parent: Node, x: number, baseY: number): Node {
        const collecting = Boolean(this.paymentBurst);
        const screenLabel = '营业额';
        const screenValue = `${this.revenue}`;
        const screenFill = collecting
            ? this.color(77, 154, 70, 235)
            : this.color(53, 116, 54, 226);
        const cashierFrame = collecting
            ? this.formalUiFrames.get('final-cashier-pay') ?? this.formalUiFrames.get('probe-cashier-pay') ?? this.unifiedCashierFrame
            : this.formalUiFrames.get('final-cashier-idle') ?? this.formalUiFrames.get('probe-cashier-idle') ?? this.unifiedCashierFrame;
        if (cashierFrame) {
            const cashier = this.addArtwork(parent, 'CashierUnifiedArt', cashierFrame, 218, 169, x, baseY + 169 / 2);
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
        const productIds = START_DIRECTLY_IN_GAMEPLAY
            ? [
                ...DIRECT_GAMEPLAY_ORDER.map((item) => item.productId),
                ...PRODUCT_IDS.filter((productId) => !DIRECT_GAMEPLAY_ORDER.some((item) => item.productId === productId)),
            ]
            : PRODUCT_IDS;
        productIds.forEach((productId, index) => {
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
            const hasFormalCard = this.hasFinalProductCard() || this.hasLayeredProductCard(productId);
            this.renderProductCardBackground(card, productId, Boolean(highlightNeeded), locked || empty);
            const iconMount = this.createNode(`ProductIconMount-${productId}`, PRODUCT_ICON_PANEL_WIDTH, PRODUCT_ICON_PANEL_HEIGHT, card);
            iconMount.setPosition(0, PRODUCT_ICON_MOUNT_Y, 0);
            const iconSize = hasFormalCard
                ? productId === 'rice-ball' ? 82 : 76
                : productId === 'rice-ball' ? 116 : 110;
            this.addProductSprite(iconMount, productId, locked ? 98 : iconSize);
            this.addLabel(
                card,
                PRODUCT_CATALOG[productId].displayName,
                0,
                hasFormalCard ? -34 : PRODUCT_NAME_Y,
                hasFormalCard ? 16 : 19,
                this.color(51, 33, 62),
                true,
                168,
            );

            const shelfTag = this.createNode(`ShelfStock-${productId}`, 126, 36, card);
            shelfTag.setPosition(PRODUCT_STOCK_LABEL_X, hasFormalCard ? -60 : PRODUCT_STOCK_LABEL_Y, 0);
            if (this.productCardStockBadgeFrame) {
                this.addArtwork(shelfTag, `ShelfStockBadgeArt-${productId}`, this.productCardStockBadgeFrame, 60, 32);
            } else {
                this.drawRect(shelfTag, 82, 34, 13, this.color(51, 48, 55, 232), this.color(255, 250, 239, 210), 2);
            }
            this.addLabel(shelfTag, `x${this.stock[productId]}`, 5, 0, 21, this.color(255, 255, 255), true, 54);

            if (empty && !isRestocking && !locked) {
                this.addLabel(
                    card,
                    this.economy.warehouseStock[productId] > 0 ? '补货中' : '售罄',
                    -50,
                    52,
                    13,
                    this.color(255, 255, 255),
                    true,
                    58,
                    this.economy.warehouseStock[productId] > 0 ? this.color(218, 139, 37, 210) : this.color(216, 67, 67, 210),
                );
            }
            if (locked) {
                this.addLabel(card, '营业后解锁', 0, 0, 20, this.color(255, 255, 255), true, 132, this.color(160, 150, 145));
            }

            this.bindProductDragInput(card, productId);
        });
    }

    private renderProductAreaChrome() {
        const panel = this.createNode('ProductInventoryPanel', 696, 406, this.node);
        panel.setPosition(0, -362, 0);
        this.drawRect(panel, 696, 406, 34, this.color(47, 40, 82, 245), this.color(28, 22, 54), 6);
        this.addSurface(panel, 'ProductInventoryPanelInner', 660, 372, 28, this.color(65, 53, 100, 210), 0, 4);
        this.addSurface(panel, 'ProductInventoryPanelHighlight', 640, 10, 5, this.color(255, 255, 255, 24), 0, 178);
        this.addSurface(panel, 'ProductInventoryPanelFootShadow', 612, 12, 6, this.color(18, 14, 38, 88), 0, -178);
        const shelfXs = [-PRODUCT_GRID_COLUMN_SPACING, 0, PRODUCT_GRID_COLUMN_SPACING];
        const shelfYs = [
            PRODUCT_GRID_START_Y - (-362),
            PRODUCT_GRID_START_Y - PRODUCT_GRID_ROW_GAP - (-362),
        ];
        shelfYs.forEach((shelfY, row) => {
            shelfXs.forEach((shelfX, column) => {
                const slot = this.createNode(`ProductShelfSlot-${row}-${column}`, PRODUCT_CARD_WIDTH + 22, PRODUCT_CARD_HEIGHT + 18, panel);
                slot.setPosition(shelfX, shelfY, 0);
                this.drawRect(
                    slot,
                    PRODUCT_CARD_WIDTH + 22,
                    PRODUCT_CARD_HEIGHT + 18,
                    26,
                    this.color(33, 28, 64, 122),
                    this.color(115, 104, 166, 118),
                    3,
                );
                this.addSurface(slot, `ProductShelfSlotGlow-${row}-${column}`, PRODUCT_CARD_WIDTH - 10, 7, 3, this.color(255, 255, 255, 26), 0, 70);
            });
        });

        const dock = this.createNode('BottomNavDock', DESIGN_WIDTH, 92, this.node);
        dock.setPosition(0, -621, 0);
        this.drawRect(dock, DESIGN_WIDTH, 92, 34, this.color(28, 22, 54, 252), this.color(20, 16, 40), 5);
        this.addSurface(dock, 'BottomNavDockTopHighlight', DESIGN_WIDTH - 36, 7, 3, this.color(255, 255, 255, 28), 0, 42);
        this.addSurface(dock, 'BottomNavDockInnerShadow', DESIGN_WIDTH - 18, 10, 5, this.color(18, 14, 38, 140), 0, -39);
        const slotXs = [-292, -146, 0, 146, 292];
        const slotIcons = ['!', '▤', '▦', '↑', '★'];
        const navFrameKeys = [
            'final-nav-task',
            'final-nav-procurement',
            'final-nav-inventory',
            'final-nav-upgrade',
            'final-nav-catalog',
        ];
        slotXs.forEach((slotX, index) => {
            const slot = this.createNode(`BottomNavSlot-${index}`, 96, 70, dock);
            slot.setPosition(slotX, 8, 0);
            this.drawRect(
                slot,
                96,
                70,
                24,
                index === 0 ? this.color(78, 66, 126, 245) : this.color(52, 43, 92, 232),
                this.color(115, 104, 166, 170),
                3,
            );
            this.addSurface(slot, `BottomNavSlotHighlight-${index}`, 68, 8, 4, this.color(255, 255, 255, index === 0 ? 34 : 20), 0, 20);
            const navIconFrame = this.formalUiFrames.get(navFrameKeys[index]) ?? (index === 4 ? this.formalUiFrames.get('star') : undefined);
            if (navIconFrame) {
                this.addArtwork(slot, `BottomNavIconArt-${index}`, navIconFrame, 46, 46, 0, -1);
            } else {
                this.addLabel(
                    slot,
                    slotIcons[index],
                    0,
                    -1,
                    index === 0 ? 34 : 30,
                    index === 0 ? this.color(255, 194, 71) : this.color(236, 228, 214),
                    true,
                    56,
                );
            }
        });

        const alert = this.createNode('BottomNavAlertDot', 28, 28, dock);
        alert.setPosition(-258, 34, 0);
        this.drawRect(alert, 28, 28, 14, this.color(255, 98, 84), this.color(255, 250, 239), 3);
        this.addLabel(alert, '!', 0, 0, 19, this.color(255, 255, 255), true, 20);
    }

    private renderProductCardBackground(card: Node, productId: ProductId, highlighted: boolean, muted: boolean) {
        const skin = this.getProductCardSkin(productId);
        if (this.productCardProbeBaseFrame) {
            this.addArtwork(
                card,
                `ProductCardProbeBaseArt-${productId}`,
                this.productCardProbeBaseFrame,
                PRODUCT_CARD_WIDTH,
                PRODUCT_CARD_HEIGHT,
            );
            if (highlighted && this.productCardProbeAttentionFrame) {
                this.addArtwork(
                    card,
                    `ProductCardProbeAttentionArt-${productId}`,
                    this.productCardProbeAttentionFrame,
                    PRODUCT_CARD_WIDTH,
                    PRODUCT_CARD_HEIGHT,
                );
            }
            this.renderProductCardBadge(card, productId, skin);
            if (muted) {
                const overlay = this.createNode(`ProductMutedOverlay-${productId}`, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, card);
                this.drawRect(overlay, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, 26, this.color(255, 255, 255, 110));
            }
            return;
        }

        const hasFormalCard = this.productCardBaseFrame && this.productCardBadgeFrames.has(skin);
        if (highlighted && (!hasFormalCard || !this.productCardSelectedFrame)) {
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
            if (highlighted && this.productCardSelectedFrame) {
                this.addArtwork(
                    card,
                    `ProductSelectedArt-${productId}`,
                    this.productCardSelectedFrame,
                    PRODUCT_CARD_WIDTH,
                    PRODUCT_CARD_HEIGHT,
                );
            }
            if (muted) {
                if (this.productCardDisabledFrame) {
                    this.addArtwork(
                        card,
                        `ProductDisabledArt-${productId}`,
                        this.productCardDisabledFrame,
                        PRODUCT_CARD_WIDTH,
                        PRODUCT_CARD_HEIGHT,
                    );
                } else {
                    const overlay = this.createNode(`ProductMutedOverlay-${productId}`, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, card);
                    this.drawRect(overlay, PRODUCT_CARD_WIDTH - 24, PRODUCT_CARD_HEIGHT - 24, 26, this.color(255, 255, 255, 110));
                }
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
        badge.setPosition(-52, 70, 0);
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

    private hasFinalProductCard() {
        return Boolean(this.productCardProbeBaseFrame);
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
        this.addSurface(this.node, 'HomeOverlay', DESIGN_WIDTH, DESIGN_HEIGHT, 0, this.color(255, 250, 239, 248));
        this.addLabel(this.node, '怪兽便利店', 0, 384, 30, this.color(51, 33, 62), true, 360);
        this.addLabel(this.node, `第 ${this.currentDay} 轮经营中心`, 0, 344, 18, this.color(120, 89, 143), true, 330);

        const trend = this.createNode('HomeTrend', 172, 82, this.node);
        trend.setPosition(-92, 286, 0);
        this.drawRect(trend, 172, 82, 14, this.color(255, 255, 255), this.color(255, 98, 84), 4);
        this.addLabel(trend, '明日热门', 0, 22, 15, this.color(255, 98, 84), true, 140);
        this.addLabel(trend, CATEGORY_NAMES[this.economy.nextTrendCategory], 0, -14, 22, this.color(51, 33, 62), true, 142);

        const strategy = this.createNode('HomeStrategy', 172, 82, this.node);
        strategy.setPosition(92, 286, 0);
        const strategyReady = Boolean(this.economy.nextStrategy) || this.isTrialRound();
        this.drawRect(
            strategy,
            172,
            82,
            14,
            this.color(255, 255, 255),
            strategyReady ? this.color(54, 158, 170) : this.color(255, 98, 84),
            4,
        );
        this.addLabel(strategy, '经营策略', 0, 22, 15, strategyReady ? this.color(54, 158, 170) : this.color(255, 98, 84), true, 140);
        this.addLabel(
            strategy,
            this.economy.nextStrategy
                ? STRATEGY_NAMES[this.economy.nextStrategy]
                : this.isTrialRound() ? '新店试营业' : '待选择',
            0,
            -14,
            21,
            this.color(51, 33, 62),
            true,
            142,
        );

        this.addLabel(this.node, `仓库 ${warehouseUnits}/${capacity}`, -118, 224, 17, this.color(51, 33, 62), true, 118);
        this.addLabel(this.node, `利润 ${this.economy.lifetimeProfit}`, 0, 224, 17, this.color(51, 33, 62), true, 118);
        this.addLabel(
            this.node,
            this.isTrialRound() ? this.getDayTargetLabel() : `上轮 ${this.economy.lastRating.toFixed(1)} 星`,
            118,
            224,
            17,
            this.color(51, 33, 62),
            true,
            118,
        );

        PRODUCT_IDS.forEach((productId, index) => {
            const column = index % 2;
            const row = Math.floor(index / 2);
            this.renderHomeInventoryCard(productId, -92 + column * 184, 150 - row * 116);
        });

        if (!strategyReady) {
            this.renderStrategyChoices(-210, -294, true);
            this.addLabel(
                this.node,
                '选择任意经营策略后，即可进入经营前准备',
                0,
                -374,
                15,
                this.color(255, 255, 255),
                true,
                340,
                this.color(255, 98, 84),
            );
            return;
        }

        this.addLabel(
            this.node,
            `设备：货架 Lv.${this.economy.shelfLevel} · 微波炉 Lv.${this.economy.microwaveLevel} · 仓库容量 ${capacity}`,
            0,
            -224,
            15,
            this.color(120, 89, 143),
            true,
            340,
        );
        this.addButton(this.node, '经营前准备', 0, -292, 340, 64, this.color(54, 158, 170), () => this.enterPreparation());
        this.addLabel(
            this.node,
            this.economy.nextStrategy
                ? `已选择${STRATEGY_NAMES[this.economy.nextStrategy]}，确认库存后开始营业`
                : this.getDayTargetDetail(),
            0,
            -358,
            15,
            this.color(255, 255, 255),
            true,
            340,
            this.color(54, 158, 170),
        );
    }

    private renderHomeInventoryCard(productId: ProductId, x: number, y: number) {
        const unlocked = this.economy.unlockedProductIds.includes(productId);
        const card = this.createNode(`HomeInventory-${productId}`, 170, 100, this.node);
        card.setPosition(x, y, 0);
        const trend = PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory;
        this.drawRect(
            card,
            170,
            100,
            14,
            unlocked ? this.color(255, 255, 255) : this.color(235, 225, 215),
            trend && unlocked ? this.color(255, 98, 84) : unlocked ? PRODUCT_COLORS[productId] : this.color(160, 150, 145),
            trend && unlocked ? 7 : 4,
        );
        this.addProductSprite(card, productId, 52);
        this.addLabel(card, PRODUCT_CATALOG[productId].displayName, 0, 33, 16, this.color(51, 33, 62), true, 138);
        this.addLabel(
            card,
            unlocked ? `库存 ${this.economy.warehouseStock[productId]} · 上轮 ${this.economy.lastSales[productId]}` : '尚未解锁',
            0,
            -35,
            13,
            unlocked ? this.color(120, 89, 143) : this.color(160, 150, 145),
            true,
            146,
        );
        if (trend && unlocked) {
            this.addLabel(card, '热门', -53, 30, 12, this.color(255, 255, 255), true, 54, this.color(255, 98, 84));
        }
    }

    private renderPreparationPanel() {
        const cartUnits = this.getPurchaseCartUnits();
        const cartCost = this.getPurchaseCartCost();
        const warehouseUnits = this.getWarehouseUnits();
        const capacity = getWarehouseCapacity(this.economy.storeLevel);

        this.addSurface(this.node, 'PreparationOverlay', DESIGN_WIDTH, DESIGN_HEIGHT, 0, this.color(255, 250, 239, 250));
        this.addLabel(this.node, '经营前准备', 0, 384, 30, this.color(51, 33, 62), true, 360);
        this.addLabel(
            this.node,
            `明日热门：${CATEGORY_NAMES[this.economy.nextTrendCategory]}`,
            0,
            338,
            17,
            this.color(255, 255, 255),
            true,
            340,
            this.color(255, 98, 84),
        );
        this.addLabel(this.node, `资金 ${this.economy.wallet}`, -118, 292, 17, this.color(51, 33, 62), true, 116);
        this.addLabel(this.node, `仓库 ${warehouseUnits + cartUnits}/${capacity}`, 0, 292, 17, this.color(51, 33, 62), true, 118);
        this.addLabel(this.node, `支出 ${cartCost}`, 118, 292, 17, this.color(255, 98, 84), true, 116);

        PRODUCT_IDS.forEach((productId, index) => {
            const column = index % 2;
            const row = Math.floor(index / 2);
            const x = -92 + column * 184;
            const y = 210 - row * 132;
            this.renderPurchaseCard(productId, x, y);
        });

        this.addButton(this.node, '补至基础库存', -92, -222, 172, 50, this.color(120, 89, 143), () => this.fillBasicPurchase());
        this.addButton(this.node, '确认采购并营业', 92, -222, 172, 50, this.color(54, 158, 170), () => this.confirmPurchase());
        this.addButton(this.node, '返回经营中心', -100, -288, 156, 46, this.color(51, 33, 62), () => this.leavePreparation());
        this.addLabel(this.node, this.shopMessage, 76, -288, 15, this.color(51, 33, 62), true, 196);
    }

    private renderPurchaseCard(productId: ProductId, x: number, y: number) {
        const unlocked = this.economy.unlockedProductIds.includes(productId);
        const economy = PRODUCT_ECONOMY[productId];
        const card = this.createNode(`Purchase-${productId}`, 170, 118, this.node);
        card.setPosition(x, y, 0);
        const trend = economy.category === this.economy.nextTrendCategory;
        this.drawRect(
            card,
            170,
            118,
            14,
            unlocked ? this.color(255, 255, 255) : this.color(235, 225, 215),
            trend ? this.color(255, 98, 84) : unlocked ? PRODUCT_COLORS[productId] : this.color(160, 150, 145),
            trend ? 8 : 4,
        );
        const productIcon = this.createNode(`PurchaseIcon-${productId}`, 40, 40, card);
        productIcon.setPosition(0, 3, 0);
        this.addProductSprite(productIcon, productId, 40);
        this.addLabel(card, PRODUCT_CATALOG[productId].displayName, 0, 41, 15, this.color(51, 33, 62), true, 132);
        this.addLabel(
            card,
            unlocked ? `库存 ${this.economy.warehouseStock[productId]}` : '尚未解锁',
            0,
            -23,
            13,
            this.color(120, 89, 143),
            true,
            118,
        );
        if (trend && unlocked) {
            this.addLabel(card, '热门', 50, 22, 12, this.color(255, 255, 255), true, 54, this.color(255, 98, 84));
        }
        if (!unlocked) {
            return;
        }

        const guidance = this.getPurchaseGuidance(productId);
        this.addLabel(
            card,
            this.getPurchaseGuidanceLabel(guidance),
            -50,
            22,
            12,
            this.color(255, 255, 255),
            true,
            54,
            this.getPurchaseGuidanceColor(guidance),
        );
        this.addButton(card, '−', -55, -42, 44, 36, this.color(120, 89, 143), () => this.adjustPurchase(productId, -1));
        this.addLabel(card, `+${this.purchaseCart[productId]}`, 0, -42, 16, this.color(51, 33, 62), true, 50);
        this.addButton(card, '+', 55, -42, 44, 36, this.color(54, 158, 170), () => this.adjustPurchase(productId, 1));
    }

    private renderEndPanel() {
        const profit = this.revenue - this.goodsCost;
        this.addSurface(this.node, 'SettlementOverlay', DESIGN_WIDTH, DESIGN_HEIGHT, 0, this.color(255, 250, 239, 248));
        this.addLabel(this.node, `第 ${this.currentDay} 轮营业结算`, 0, 382, 28, this.color(51, 33, 62), true, 350);
        this.addLabel(this.node, `完成 ${this.completed} 单 · 流失 ${this.missed} 位`, 0, 346, 16, this.color(120, 89, 143), true, 330);
        this.addPill(this.node, `营业额 ${this.revenue}`, -118, 302, 110, 38, this.color(54, 158, 170));
        this.addPill(this.node, `成本 ${this.goodsCost}`, 0, 302, 104, 38, this.color(255, 98, 84));
        this.addPill(this.node, `净利 ${profit}`, 118, 302, 110, 38, profit >= 0 ? this.color(54, 158, 170) : this.color(255, 98, 84));
        this.addPill(this.node, `资金 ${this.economy.wallet}`, -92, 250, 160, 38, this.color(54, 158, 170));
        this.addPill(this.node, `${this.roundRating.toFixed(1)} 星 · 口碑 ${this.economy.reputation}`, 92, 250, 176, 38, this.color(255, 194, 71));
        this.addLabel(this.node, '经营升级', 0, 204, 22, this.color(51, 33, 62), true, 300);

        const nextProduct = PRODUCT_IDS.find((productId) => !this.economy.unlockedProductIds.includes(productId));
        if (nextProduct) {
            const economy = PRODUCT_ECONOMY[nextProduct];
            this.renderUpgradeCard(
                `解锁 ${PRODUCT_CATALOG[nextProduct].displayName}`,
                `售价 ${economy.sellPrice} · 成本 ${economy.buyCost}`,
                economy.unlockCost,
                -92,
                142,
                () => this.unlockNextProduct(),
            );
        } else {
            this.renderUpgradeCard('商品图鉴', '全部商品已解锁', undefined, -92, 142, () => undefined);
        }

        this.renderSystemUpgradeCard('shelf', 92, 142);
        this.renderSystemUpgradeCard('store', -92, 36);
        this.renderSystemUpgradeCard('microwave', 92, 36);

        this.addLabel(this.node, this.shopMessage, 0, -48, 15, this.color(255, 255, 255), true, 336, profit >= 0 ? this.color(54, 158, 170) : this.color(255, 98, 84));
        this.renderStrategyChoices(-104, -174, true);
        this.addButton(this.node, '返回经营中心', 0, -332, 340, 62, this.color(54, 158, 170), () => this.returnToHome());
    }

    private renderStrategyChoices(titleY = -300, cardY = -405, compact = false) {
        const tier = this.getStrategyTier();
        this.addLabel(this.node, `选择下一轮经营策略 · 好评加成 Lv.${tier}`, 0, titleY, compact ? 17 : 24, this.color(51, 33, 62), true, compact ? 340 : 620);
        const details: Record<OperationStrategy, string> = {
            traffic: `售价 +${tier * 6}% · 顾客耐心缩短`,
            tips: `快速服务额外小费 +${tier * 3}`,
            hours: `营业时间 +${tier * 8} 秒`,
        };
        const strategies: OperationStrategy[] = ['traffic', 'tips', 'hours'];
        strategies.forEach((strategy, index) => {
            const selected = this.economy.nextStrategy === strategy;
            const cardWidth = compact ? 112 : 220;
            const cardHeight = compact ? 86 : 120;
            const card = this.createNode(`Strategy-${strategy}`, cardWidth, cardHeight, this.node);
            card.setPosition((compact ? -124 : -240) + index * (compact ? 124 : 240), cardY, 0);
            this.drawRect(
                card,
                cardWidth,
                cardHeight,
                compact ? 14 : 18,
                selected ? this.color(255, 250, 239) : this.color(255, 255, 255),
                selected ? this.color(255, 98, 84) : this.color(120, 89, 143),
                selected ? 8 : 4,
            );
            this.addLabel(card, selected ? `已选 ${STRATEGY_NAMES[strategy]}` : STRATEGY_NAMES[strategy], 0, compact ? 20 : 28, compact ? 15 : 20, this.color(51, 33, 62), true, compact ? 96 : 200);
            this.addLabel(card, details[strategy], 0, compact ? -22 : -24, compact ? 11 : 15, this.color(120, 89, 143), true, compact ? 96 : 200);
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
        const cardWidth = 172;
        const cardHeight = 94;
        const card = this.createNode(`Upgrade-${title}`, cardWidth, cardHeight, this.node);
        card.setPosition(x, y, 0);
        const affordable = cost === undefined || this.economy.wallet >= cost;
        const border = cost === undefined
            ? this.color(160, 150, 145)
            : affordable ? this.color(54, 158, 170) : this.color(255, 98, 84);
        this.drawRect(card, cardWidth, cardHeight, 14, this.color(255, 255, 255), border, 4);
        this.addLabel(card, title, 0, 28, 16, this.color(51, 33, 62), true, 150);
        this.addLabel(card, detail, 0, 2, 12, this.color(120, 89, 143), true, 150);
        this.addLabel(
            card,
            cost === undefined ? '已满级' : `${cost} 金币`,
            0,
            -28,
            14,
            this.color(255, 255, 255),
            true,
            112,
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

    private getPreparedOrderItemCount(customer: CustomerState): number {
        return customer.order.filter((item) => this.isItemPrepared(customer, item)).length;
    }

    private getDayBalanceConfig(): DayBalanceConfig {
        return getDayBalance(this.currentDay);
    }

    private pickCustomerKind(dayBalance: DayBalanceConfig, seed: number): CustomerKind {
        if (this.shiftRules.bulkShopperEnabled && seed % 4 === 2) {
            return 'bulk-shopper';
        }
        if (this.shiftRules.impatientEnabled && seed % 3 === 1) {
            if (this.currentDay >= 7 && this.customers.some((customer) => !customer.pendingOutcome && customer.kind === 'impatient')) {
                return 'normal';
            }
            return 'impatient';
        }
        const picked = this.pickWeighted(dayBalance.customerWeights, seed);
        if (picked === 'bulk-shopper' && !this.shiftRules.bulkShopperEnabled) {
            return 'normal';
        }
        if (
            picked === 'impatient'
            && (
                !this.shiftRules.impatientEnabled
                || (this.currentDay >= 7 && this.customers.some((customer) => !customer.pendingOutcome && customer.kind === 'impatient'))
            )
        ) {
            return 'normal';
        }
        return picked;
    }

    private pickOrderPlanKind(dayBalance: DayBalanceConfig, seed: number): OrderPlanKind {
        const picked = this.pickWeighted(dayBalance.orderWeights, seed);
        if ((picked === 'heated-single' || picked === 'normal-heated') && this.economy.microwaveLevel <= 0) {
            return 'normal-single';
        }
        return picked;
    }

    private pickWeighted<T extends string>(weights: WeightedOption<T>, seed: number): T {
        const entries = (Object.entries(weights) as [T, number | undefined][])
            .filter((entry): entry is [T, number] => (entry[1] ?? 0) > 0);
        const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
        let cursor = total > 0 ? seed % total : 0;
        for (const [key, weight] of entries) {
            if (cursor < weight) {
                return key;
            }
            cursor -= weight;
        }
        return entries[0]?.[0] ?? 'normal-single' as T;
    }

    private getDesiredItemCount(kind: CustomerKind, orderKind: OrderPlanKind, uniqueDemandCount: number): number {
        if (kind === 'bulk-shopper' || orderKind === 'normal-double' || orderKind === 'normal-heated' || orderKind === 'premium-double') {
            return Math.min(2, uniqueDemandCount);
        }
        return Math.min(1, uniqueDemandCount);
    }

    private getOrderBubbleVisualState(customer: CustomerState): OrderBubbleVisualState {
        if (customer.pendingOutcome === 'completed' || customer.pendingOutcome === 'partial') {
            return 'done';
        }
        if (this.isErrorFxFor(customer.id, 'order')) {
            return 'error';
        }
        if (this.isOrderBubbleReadyFor(customer)) {
            return 'ready';
        }
        return this.getPreparedOrderItemCount(customer) > 0 ? 'partial' : 'missing';
    }

    private getOrderBubbleFrame(visualState: OrderBubbleVisualState, active: boolean): SpriteFrame | undefined {
        const finalKey = active || visualState === 'ready'
            ? 'final-bubble-selected'
            : 'final-bubble-unselected';
        const probeV3Key = this.getProbeV3OrderBubbleKey(visualState, active);
        const probeKey = active || visualState === 'ready'
                ? 'probe-bubble-current'
                : 'probe-bubble-waiting';
        const p0Key = visualState === 'ready'
                ? 'p0-bubble-active'
                : visualState === 'partial'
                ? 'p0-bubble-partial'
                : active ? 'p0-bubble-active' : 'p0-bubble-normal';
        return this.formalUiFrames.get(finalKey)
            ?? this.formalUiFrames.get(probeV3Key)
            ?? this.formalUiFrames.get(probeKey)
            ?? this.formalUiFrames.get(p0Key)
            ?? this.formalUiFrames.get(active || visualState === 'ready' ? 'bubble-selected' : 'bubble-normal');
    }

    private getProbeV3OrderBubbleKey(visualState: OrderBubbleVisualState, active: boolean): string {
        return active || visualState === 'ready'
            ? 'probe-v3-order-bubble-current'
            : 'probe-v3-order-bubble-waiting';
    }

    private getProbeV3OrderBubbleWidth(visualState: OrderBubbleVisualState, active: boolean): number {
        if (visualState === 'ready') {
            return PROBE_V3_READY_ORDER_BUBBLE_WIDTH;
        }
        return active
            ? PROBE_V3_ORDER_BUBBLE_CURRENT_WIDTH
            : PROBE_V3_ORDER_BUBBLE_WAITING_WIDTH;
    }

    private getProbeV3OrderBubbleHeight(visualState: OrderBubbleVisualState, active: boolean, width: number): number {
        const ratio = active || visualState === 'ready'
            ? PROBE_V3_ORDER_BUBBLE_CURRENT_HEIGHT_RATIO
            : PROBE_V3_ORDER_BUBBLE_WAITING_HEIGHT_RATIO;
        return width * ratio;
    }

    private getOrderItemVisualState(customer: CustomerState, item: OrderItem): OrderItemVisualState {
        if (this.isErrorFxFor(customer.id, 'order') && this.errorFx?.productId === item.productId) {
            return 'error';
        }
        const prepared = this.isItemPrepared(customer, item);
        if (customer.pendingOutcome === 'completed' || customer.pendingOutcome === 'partial') {
            return prepared ? 'done' : 'missing';
        }
        if (prepared) {
            return this.isOrderBubbleReadyFor(customer) ? 'ready' : 'partial';
        }
        if (this.isMicrowaveProcessingOrderItem(customer, item, 'heating')) {
            return 'heating';
        }
        if (this.isMicrowaveProcessingOrderItem(customer, item, 'ready')) {
            return 'ready';
        }
        return 'missing';
    }

    private isMicrowaveProcessingOrderItem(
        customer: CustomerState,
        item: OrderItem,
        mode: MicrowaveState['mode'],
    ): boolean {
        return this.canMicrowaveServeOrderItem(customer, item, mode);
    }

    private canMicrowaveServeOrderItem(
        customer: CustomerState,
        item: OrderItem,
        mode?: MicrowaveState['mode'],
    ): boolean {
        return Boolean(
            item.heated
            && getProcessingRuleForOrderItem(item)?.deviceId === 'microwave'
            && this.microwave.productId === item.productId
            && this.microwave.mode !== 'idle'
            && (mode === undefined || this.microwave.mode === mode)
            && (this.microwave.customerId === undefined || this.microwave.customerId === customer.id),
        );
    }

    private isOrderBubbleReadyFor(customer: CustomerState): boolean {
        if (customer.pendingOutcome) {
            return false;
        }
        const prepared = this.getPreparedItems(customer);
        if (prepared.length === 0) {
            return false;
        }
        return customer.order.every((item) => prepared.some((candidate) => this.sameItem(candidate, item)));
    }

    private isTrayLockedForOtherCustomer(customer: CustomerState): boolean {
        return this.tray.customerId !== undefined && this.tray.customerId !== customer.id;
    }

    private ensureTrayForCustomer(customer: CustomerState, productId: ProductId | undefined, x: number, y: number): boolean {
        if (this.isTrayLockedForOtherCustomer(customer)) {
            this.setFeedback('先交付已备订单', 'warning', x, y, true);
            this.setErrorFx(this.tray.customerId, productId, 'order');
            this.render();
            this.shakeOrderBubble(this.tray.customerId);
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

    private commitTrayItemsForCustomer(customer: CustomerState) {
        if (this.tray.customerId !== customer.id || this.tray.items.length === 0) {
            return;
        }
        for (const item of this.tray.items) {
            if (!customer.served.some((served) => this.sameItem(served, item))) {
                customer.served.push(item);
            }
        }
        this.clearTray();
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
        return this.isOrderBubbleReadyFor(customer);
    }

    private getMissingTrayItemNames(customer: CustomerState): string[] {
        return this.getMissingOrderItemNames(customer);
    }

    private getMissingOrderItemNames(customer: CustomerState): string[] {
        return customer.order
            .filter((item) => !this.isItemPrepared(customer, item))
            .map((item) => PRODUCT_CATALOG[item.productId].displayName);
    }

    private bindProductDragInput(node: Node, productId: ProductId) {
        node.on(Node.EventType.TOUCH_START, (event: TouchLikeEvent) => this.handleProductTouchStart(productId, event), this);
        node.on(Node.EventType.TOUCH_MOVE, (event: TouchLikeEvent) => this.handleProductTouchMove(event), this);
        node.on(Node.EventType.TOUCH_END, (event: TouchLikeEvent) => this.handleProductTouchEnd(productId, node, event), this);
        node.on(Node.EventType.TOUCH_CANCEL, (event: TouchLikeEvent) => this.handleProductTouchCancel(event), this);
    }

    private bindMicrowaveDragInput(node: Node) {
        node.on(Node.EventType.TOUCH_START, (event: TouchLikeEvent) => this.handleMicrowaveTouchStart(event), this);
        node.on(Node.EventType.TOUCH_MOVE, (event: TouchLikeEvent) => this.handleMicrowaveTouchMove(event), this);
        node.on(Node.EventType.TOUCH_END, (event: TouchLikeEvent) => this.handleMicrowaveTouchEnd(event), this);
        node.on(Node.EventType.TOUCH_CANCEL, (event: TouchLikeEvent) => this.handleMicrowaveTouchCancel(event), this);
    }

    private handleProductTouchStart(productId: ProductId, event: TouchLikeEvent) {
        const point = this.getTouchFigmaPoint(event);
        if (!point) {
            return;
        }
        this.suppressNextTapFallback = false;
        this.stopTouchPropagation(event);
        this.dragState = {
            kind: 'product',
            productId,
            prepared: 'cold',
            startX: point.x,
            startY: point.y,
            currentX: point.x,
            currentY: point.y,
            hasMovedPastTapThreshold: false,
        };
    }

    private handleProductTouchMove(event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        this.updateDragFromTouch('product', event);
    }

    private handleProductTouchEnd(productId: ProductId, sourceNode: Node, event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        const drag = this.dragState?.kind === 'product' ? this.dragState : undefined;
        if (!drag) {
            this.suppressNextTapFallback = false;
            return;
        }
        if (!drag.hasMovedPastTapThreshold) {
            this.clearDragState();
            this.handleProductTap(productId, sourceNode);
            return;
        }
        const completedDrag = { ...drag };
        this.clearDragState();
        this.resolveProductDragDrop(completedDrag);
    }

    private handleProductTouchCancel(event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        const drag = this.dragState?.kind === 'product' ? this.dragState : undefined;
        if (drag?.hasMovedPastTapThreshold) {
            const completedDrag = { ...drag };
            if (completedDrag.hoverTarget?.accepts) {
                this.suppressNextTapFallback = true;
                this.clearDragState();
                this.resolveProductDragDrop(completedDrag);
            }
            return;
        }
        this.clearDragState();
    }

    private handleMicrowaveTouchStart(event: TouchLikeEvent) {
        const point = this.getTouchFigmaPoint(event);
        if (!point) {
            return;
        }
        this.suppressNextTapFallback = false;
        if (this.microwave.mode !== 'ready' || !this.microwave.productId) {
            return;
        }
        this.stopTouchPropagation(event);
        this.dragState = {
            kind: 'microwave-ready',
            productId: this.microwave.productId,
            prepared: 'heated',
            startX: point.x,
            startY: point.y,
            currentX: point.x,
            currentY: point.y,
            hasMovedPastTapThreshold: false,
        };
    }

    private handleMicrowaveTouchMove(event: TouchLikeEvent) {
        if (this.dragState?.kind === 'product') {
            this.stopTouchPropagation(event);
            this.updateDragFromTouch('product', event);
            return;
        }
        this.stopTouchPropagation(event);
        this.updateDragFromTouch('microwave-ready', event);
    }

    private handleMicrowaveTouchEnd(event: TouchLikeEvent) {
        if (this.suppressNextTapFallback && !this.dragState) {
            this.stopTouchPropagation(event);
            this.suppressNextTapFallback = false;
            return;
        }
        const productDrag = this.dragState?.kind === 'product' ? this.dragState : undefined;
        if (productDrag?.hasMovedPastTapThreshold) {
            this.stopTouchPropagation(event);
            const completedDrag = { ...productDrag };
            this.clearDragState();
            this.resolveProductDragDrop(completedDrag);
            return;
        }
        this.stopTouchPropagation(event);
        const drag = this.dragState?.kind === 'microwave-ready' ? this.dragState : undefined;
        if (!drag || !drag.hasMovedPastTapThreshold) {
            this.clearDragState();
            this.handleMicrowaveTap();
            return;
        }
        const completedDrag = { ...drag };
        this.clearDragState();
        this.resolveMicrowaveReadyDragDrop(completedDrag);
    }

    private handleMicrowaveTouchCancel(event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        const productDrag = this.dragState?.kind === 'product' ? this.dragState : undefined;
        if (productDrag?.hasMovedPastTapThreshold) {
            const completedDrag = { ...productDrag };
            if (completedDrag.hoverTarget?.accepts) {
                this.suppressNextTapFallback = true;
                this.clearDragState();
                this.resolveProductDragDrop(completedDrag);
            }
            return;
        }
        const drag = this.dragState?.kind === 'microwave-ready' ? this.dragState : undefined;
        if (drag?.hasMovedPastTapThreshold) {
            const completedDrag = { ...drag };
            if (completedDrag.hoverTarget?.accepts) {
                this.suppressNextTapFallback = true;
                this.clearDragState();
                this.resolveMicrowaveReadyDragDrop(completedDrag);
            }
            return;
        }
        this.clearDragState();
    }

    private updateDragFromTouch(expectedKind: DragSourceKind, event: TouchLikeEvent): DragState | undefined {
        const drag = this.dragState;
        if (!drag || drag.kind !== expectedKind) {
            return undefined;
        }
        const point = this.getTouchFigmaPoint(event);
        if (point) {
            drag.currentX = point.x;
            drag.currentY = point.y;
        }
        const distance = Math.hypot(drag.currentX - drag.startX, drag.currentY - drag.startY);
        if (!drag.hasMovedPastTapThreshold && distance >= DRAG_START_THRESHOLD) {
            drag.hasMovedPastTapThreshold = true;
            this.toast = undefined;
            this.node.getChildByName('Toast')?.destroy();
        }
        if (drag.hasMovedPastTapThreshold) {
            drag.hoverTarget = this.getDragDropTarget(drag);
            this.updateDragFeedbackNodes();
        }
        return drag;
    }

    private resolveProductDragDrop(drag: DragState): boolean {
        const target = drag.hoverTarget;
        const feedbackPoint = this.figmaPointToScene(drag.currentX, drag.currentY);
        if (!target) {
            return false;
        }
        if (!target.accepts) {
            return this.handleInvalidDragTarget(drag, target);
        }
        if (target.kind === 'microwave') {
            return this.attemptStartMicrowaveProduct(drag.productId, feedbackPoint.x, feedbackPoint.y);
        }
        if (target.customerId === undefined) {
            return false;
        }
        const customer = this.customers.find((candidate) => candidate.id === target.customerId);
        if (!customer) {
            return false;
        }
        return this.attemptAddProductToCustomer(customer, drag.productId, feedbackPoint.x, feedbackPoint.y);
    }

    private resolveMicrowaveReadyDragDrop(drag: DragState): boolean {
        const target = drag.hoverTarget;
        const feedbackPoint = this.figmaPointToScene(drag.currentX, drag.currentY);
        if (!target) {
            return false;
        }
        if (!target.accepts) {
            return this.handleInvalidDragTarget(drag, target);
        }
        if (target.customerId === undefined) {
            return false;
        }
        const customer = this.customers.find((candidate) => candidate.id === target.customerId);
        if (!customer) {
            return false;
        }
        return this.attemptAddMicrowaveReadyToCustomer(customer, feedbackPoint.x, feedbackPoint.y);
    }

    private handleInvalidDragTarget(drag: DragState, target: DragDropTarget): boolean {
        const feedbackPoint = this.figmaPointToScene(drag.currentX, drag.currentY);
        if (target.customerId !== undefined) {
            const customer = this.customers.find((candidate) => candidate.id === target.customerId);
            if (customer) {
                return this.rejectWrongProductForCustomer(
                    customer,
                    drag.productId,
                    feedbackPoint.x,
                    feedbackPoint.y,
                    this.getInvalidOrderDropMessage(drag, customer),
                );
            }
        }
        if (target.kind === 'microwave') {
            if (this.microwave.mode !== 'idle') {
                this.setStatusMessage('微波炉占用中', 'warning');
            } else {
                this.setFeedback(this.getMicrowaveDropBlockerMessage(drag.productId), 'warning', feedbackPoint.x, feedbackPoint.y, true);
            }
            this.render();
            const microwave = this.getMicrowaveNode();
            if (microwave) {
                this.shake(microwave);
            }
            return false;
        }
        this.setStatusMessage('放错了', 'warning');
        this.render();
        return false;
    }

    private attemptAddProductToCustomer(customer: CustomerState, productId: ProductId, feedbackX: number, feedbackY: number): boolean {
        const customerIndex = this.customers.findIndex((candidate) => candidate.id === customer.id);
        if (customerIndex < 0 || customer.pendingOutcome) {
            this.render();
            return false;
        }
        this.activeCustomerIndex = customerIndex;
        if (!this.economy.unlockedProductIds.includes(productId)) {
            this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 尚未取得销售许可`, 'info', feedbackX, feedbackY);
            this.render();
            return false;
        }
        if (this.restocking.has(productId)) {
            this.setStockFeedback(`${PRODUCT_CATALOG[productId].displayName} 正在补上货架`);
            this.render();
            return false;
        }
        if (this.stock[productId] <= 0) {
            if (this.economy.warehouseStock[productId] > 0) {
                this.queueShelfRefill(productId);
                this.setStockFeedback(`${PRODUCT_CATALOG[productId].displayName} 正在补货`);
            } else {
                this.handleSoldOut(productId);
            }
            this.render();
            return false;
        }

        const needed = this.findNeededItemForPreparation(customer, productId, 'cold');
        if (!needed) {
            const alreadyPrepared = customer.order.some((item) => (
                item.productId === productId
                && !item.heated
                && this.isItemPrepared(customer, item)
            ));
            if (alreadyPrepared) {
                this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 已经在订单气泡里`, 'info', feedbackX, feedbackY);
                this.render();
                return false;
            }
            return this.rejectWrongProductForCustomer(
                customer,
                productId,
                feedbackX,
                feedbackY,
                this.getInvalidOrderDropMessage({ kind: 'product', productId, prepared: 'cold' }, customer),
            );
        }

        if (!this.ensureTrayForCustomer(customer, productId, feedbackX, feedbackY)) {
            return false;
        }
        this.consumeStock(productId);
        this.addTrayItem(customer, { productId });
        this.commitTrayItemsForCustomer(customer);
        const ready = this.isOrderBubbleReadyFor(customer);
        if (ready) {
            this.showReadyCoinCollectionHint(customer, feedbackX, feedbackY);
        } else {
            this.toast = undefined;
        }
        this.render();
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
        this.playProductCorrectFx(productId, customer.id);
        this.playOrderItemCompleteFx(customer.id, productId);
        return true;
    }

    private attemptStartMicrowaveProduct(productId: ProductId, feedbackX: number, feedbackY: number): boolean {
        const productName = PRODUCT_CATALOG[productId].displayName;
        const processingRule = getProcessingRuleForOrderItem({ productId, heated: true });
        if (!processingRule || !isProductProcessable(productId, 'microwave')) {
            this.setFeedback(`${productName}不需要微波炉处理`, 'warning', feedbackX, feedbackY);
            this.render();
            return false;
        }
        if (!this.economy.unlockedProductIds.includes(productId)) {
            this.setFeedback(`${productName} 尚未取得销售许可`, 'info', feedbackX, feedbackY);
            this.render();
            return false;
        }
        if (this.restocking.has(productId)) {
            this.setStockFeedback(`${productName} 正在补上货架`);
            this.render();
            return false;
        }
        if (this.stock[productId] <= 0) {
            if (this.economy.warehouseStock[productId] > 0) {
                this.queueShelfRefill(productId);
                this.setStockFeedback(`${productName} 正在补货`);
            } else {
                this.handleSoldOut(productId);
            }
            this.render();
            return false;
        }
        const deviceLevel = this.getProcessingDeviceLevel(processingRule.deviceId);
        if (deviceLevel < processingRule.requiredDeviceLevel) {
            this.setFeedback(`${PROCESSING_DEVICE_NAMES[processingRule.deviceId]}尚未解锁，暂时不能处理${productName}`, 'warning', feedbackX, feedbackY);
            this.render();
            return false;
        }
        if (this.microwave.mode !== 'idle') {
            this.setFeedback(`${PROCESSING_DEVICE_NAMES[processingRule.deviceId]}被占用，先取走里面的商品`, 'warning', feedbackX, feedbackY);
            this.render();
            const microwave = this.getMicrowaveNode();
            if (microwave) {
                this.shake(microwave);
            }
            return false;
        }
        this.consumeStock(productId);
        this.microwave = {
            mode: 'heating',
            remaining: getProcessingSeconds(processingRule.deviceId, deviceLevel),
            productId,
        };
        this.setFeedback(`${productName}已放入${PROCESSING_DEVICE_NAMES[processingRule.deviceId]}，完成后拖给顾客`, 'heat', feedbackX, feedbackY);
        this.render();
        this.playMicrowaveStartFx(productId);
        return true;
    }

    private attemptAddMicrowaveReadyToCustomer(customer: CustomerState, feedbackX: number, feedbackY: number): boolean {
        const customerIndex = this.customers.findIndex((candidate) => candidate.id === customer.id);
        if (customerIndex < 0 || customer.pendingOutcome) {
            this.render();
            return false;
        }
        this.activeCustomerIndex = customerIndex;
        const productId = this.microwave.productId;
        if (this.microwave.mode !== 'ready' || !productId) {
            this.setFeedback('微波炉里没有可拖出的热食', 'warning', feedbackX, feedbackY);
            this.render();
            return false;
        }
        const needed = this.findNeededItemForPreparation(customer, productId, 'heated');
        if (!needed) {
            return this.rejectWrongProductForCustomer(
                customer,
                productId,
                feedbackX,
                feedbackY,
                this.getInvalidOrderDropMessage({ kind: 'microwave-ready', productId, prepared: 'heated' }, customer),
            );
        }
        if (!this.ensureTrayForCustomer(customer, productId, feedbackX, feedbackY)) {
            return false;
        }
        const preparedRule = getProcessingRuleForOrderItem(needed);
        this.addTrayItem(customer, {
            productId,
            heated: toLegacyHeated(preparedRule?.outputPreparation ?? 'heated'),
        });
        this.commitTrayItemsForCustomer(customer);
        this.microwave = { mode: 'idle', remaining: 0 };
        const ready = this.isOrderBubbleReadyFor(customer);
        if (ready) {
            this.showReadyCoinCollectionHint(customer, feedbackX, feedbackY);
        } else {
            this.toast = undefined;
        }
        this.render();
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
        this.playMicrowaveToTrayFx(productId, customer.id);
        return true;
    }

    private rejectWrongProductForCustomer(customer: CustomerState, productId: ProductId, feedbackX: number, feedbackY: number, message?: string): boolean {
        this.combo = 0;
        customer.patience = Math.max(0, customer.patience - 2);
        this.setStatusMessage(message ?? `拖错了：${PRODUCT_CATALOG[productId].displayName}不是这个顾客要的`, 'error');
        this.setErrorFx(customer.id, productId, 'both');
        this.triggerCustomerReaction(customer.id, 'angry');
        this.render();
        this.playWrongProductFx(productId, customer.id);
        this.shakeOrderBubble(customer.id);
        return false;
    }

    private findNeededItemForPreparation(customer: CustomerState, productId: ProductId, prepared: DragPreparedState): OrderItem | undefined {
        const needsHeated = prepared === 'heated';
        return customer.order.find((item) => (
            item.productId === productId
            && Boolean(item.heated) === needsHeated
            && !this.isItemPrepared(customer, item)
        ));
    }

    private getDragDropTarget(drag: DragState): DragDropTarget | undefined {
        const point = { x: drag.currentX, y: drag.currentY };
        const sides = point.x < DESIGN_WIDTH / 2 ? [0, 1] : [1, 0];
        for (const side of sides) {
            if (side >= this.customers.length) {
                continue;
            }
            const customer = this.customers[side];
            if (!customer) {
                continue;
            }
            const customerDropRect = this.getFinalCustomerDropRect(side);
            if (!this.isPointInFigmaRect(point, customerDropRect)) {
                continue;
            }
            const orderIndex = this.findOrderDropIndex(customer, drag);
            return {
                kind: 'order-bubble',
                accepts: orderIndex !== undefined,
                rect: customerDropRect,
                customerId: customer.id,
                customerIndex: side,
                orderIndex,
            };
        }

        for (const side of sides) {
            if (side >= this.customers.length) {
                continue;
            }
            const customer = this.customers[side];
            if (!customer) {
                continue;
            }
            const offset = side * 3;
            for (let orderIndex = 0; orderIndex < Math.min(3, customer.order.length); orderIndex += 1) {
                const slotRect = this.expandFigmaRect(FIGMA_ORDER_SLOT_RECTS[offset + orderIndex], DRAG_TARGET_PADDING);
                if (!this.isPointInFigmaRect(point, slotRect)) {
                    continue;
                }
                const item = customer.order[orderIndex];
                return {
                    kind: 'order-item',
                    accepts: this.doesOrderItemAcceptDrag(customer, item, drag),
                    rect: slotRect,
                    customerId: customer.id,
                    customerIndex: side,
                    orderIndex,
                };
            }
        }

        for (let side = 0; side < Math.min(2, this.customers.length); side += 1) {
            const customer = this.customers[side];
            if (!customer) {
                continue;
            }
            const bubbleRect = this.expandFigmaRect(this.getFinalOrderBubbleRect(side), 4);
            if (!this.isPointInFigmaRect(point, bubbleRect)) {
                continue;
            }
            const orderIndex = this.findOrderDropIndex(customer, drag);
            return {
                kind: 'order-bubble',
                accepts: orderIndex !== undefined,
                rect: bubbleRect,
                customerId: customer.id,
                customerIndex: side,
                orderIndex,
            };
        }

        const microwaveRect = this.expandFigmaRect(FIGMA_MICROWAVE, DRAG_MICROWAVE_TARGET_PADDING);
        if (this.isPointInFigmaRect(point, microwaveRect) && drag.kind === 'product') {
            if (!isProductProcessable(drag.productId, 'microwave')) {
                return undefined;
            }
            return {
                kind: 'microwave',
                accepts: this.canDropProductOnMicrowave(drag.productId),
                rect: microwaveRect,
            };
        }
        return undefined;
    }

    private doesOrderItemAcceptDrag(customer: CustomerState, item: OrderItem, drag: DragState): boolean {
        return Boolean(
            item.productId === drag.productId
            && Boolean(item.heated) === (drag.prepared === 'heated')
            && !this.isItemPrepared(customer, item)
        );
    }

    private findOrderDropIndex(customer: CustomerState, drag: DragState): number | undefined {
        const index = customer.order.findIndex((item) => this.doesOrderItemAcceptDrag(customer, item, drag));
        return index >= 0 ? index : undefined;
    }

    private canDropProductOnMicrowave(productId: ProductId): boolean {
        const processingRule = getProcessingRuleForOrderItem({ productId, heated: true });
        if (!processingRule || !isProductProcessable(productId, 'microwave')) {
            return false;
        }
        return Boolean(
            this.economy.unlockedProductIds.includes(productId)
            && !this.restocking.has(productId)
            && this.stock[productId] > 0
            && this.getProcessingDeviceLevel(processingRule.deviceId) >= processingRule.requiredDeviceLevel
            && this.microwave.mode === 'idle'
        );
    }

    private getInvalidOrderDropMessage(drag: Pick<DragState, 'productId' | 'prepared' | 'kind'>, customer: CustomerState): string {
        const productName = PRODUCT_CATALOG[drag.productId].displayName;
        const matchingUnprepared = customer.order.find((item) => (
            item.productId === drag.productId
            && !this.isItemPrepared(customer, item)
        ));
        if (drag.prepared === 'cold' && matchingUnprepared?.heated) {
            return `${productName}要先拖到微波炉加热`;
        }
        if (drag.prepared === 'heated' && matchingUnprepared && !matchingUnprepared.heated) {
            return `这是热${productName}，不能给冷食需求`;
        }
        if (drag.kind === 'microwave-ready') {
            return `这份热${productName}不是这个顾客要的`;
        }
        return `拖错了：${productName}不是这个顾客要的`;
    }

    private getMicrowaveDropBlockerMessage(productId: ProductId): string {
        const productName = PRODUCT_CATALOG[productId].displayName;
        const processingRule = getProcessingRuleForOrderItem({ productId, heated: true });
        if (!processingRule || !isProductProcessable(productId, 'microwave')) {
            return `${productName}不需要放进微波炉`;
        }
        if (this.microwave.mode !== 'idle') {
            return '微波炉被占用，先取走里面的商品';
        }
        if (this.stock[productId] <= 0) {
            return `${productName}货架没有库存`;
        }
        return `${productName}暂时不能放进微波炉`;
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
            this.setStockFeedback(`${PRODUCT_CATALOG[productId].displayName} 正在补上货架`);
            this.render();
            return;
        }

        if (this.stock[productId] <= 0) {
            if (this.economy.warehouseStock[productId] > 0) {
                this.queueShelfRefill(productId);
                this.setStockFeedback(`${PRODUCT_CATALOG[productId].displayName} 正在补货`);
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
                this.setFeedback(`${PRODUCT_CATALOG[productId].displayName} 已经在订单气泡里`, 'info', feedbackX, feedbackY);
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
            this.setFeedback(`${PRODUCT_CATALOG[productId].displayName}已放入${deviceName}，完成后点击设备送回订单气泡`, 'heat', -220, 210);
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
        this.commitTrayItemsForCustomer(customer);
        const ready = this.isOrderBubbleReadyFor(customer);
        if (ready) {
            this.showReadyCoinCollectionHint(customer, feedbackX, feedbackY);
        } else {
            this.setFeedback(`已加入订单气泡：${PRODUCT_CATALOG[productId].displayName}`, 'info', feedbackX, feedbackY);
        }
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
        if (!productId) {
            this.setFeedback('设备里没有可交付商品', 'warning', -220, 210);
            this.render();
            return;
        }
        if (this.microwave.customerId !== undefined && this.microwave.customerId !== customer.id) {
            this.setFeedback(`这份${productName}属于${this.getCustomerSide(this.microwave.customerId)}顾客订单气泡，请先切换`, 'warning', -220, 210);
            this.render();
            return;
        }
        if (this.microwave.customerId === undefined && !this.findNeededItemForPreparation(customer, productId, 'heated')) {
            this.setFeedback(`${productName}已加热，拖到需要热食的订单格`, 'heat', -220, 210);
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
        this.commitTrayItemsForCustomer(customer);
        this.microwave = { mode: 'idle', remaining: 0 };
        const ready = this.isOrderBubbleReadyFor(customer);
        if (ready) {
            this.showReadyCoinCollectionHint(customer, -220, 210);
        } else {
            this.setFeedback(`${productName}已送回订单气泡`, 'info', -220, 210);
        }
        this.render();
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
        this.playProductCorrectFx(productId, customerId);
        this.playMicrowaveToTrayFx(productId, customerId);
    }

    private handleOrderBubbleTap(customerId: number) {
        const customerIndex = this.customers.findIndex((customer) => customer.id === customerId);
        const customer = this.customers[customerIndex];
        if (customerIndex < 0 || !customer) {
            return;
        }

        const customerNode = this.getRenderedCustomerNode(customerId);
        const customerLayout = this.getCustomerLayout(customerIndex, this.customers.length);
        const feedbackX = customerNode?.position.x ?? 0;
        const feedbackY = customerNode ? customerNode.position.y + customerLayout.orderY + 78 : 210;
        this.activeCustomerIndex = customerIndex;

        if (customer.pendingOutcome) {
            this.render();
            return;
        }

        if (this.isOrderBubbleReadyFor(customer)) {
            this.attemptDeliverPreparedOrder(customerId, feedbackX, feedbackY);
            return;
        }

        const missing = this.getMissingOrderItemNames(customer);
        const firstMissing = customer.order.find((item) => !this.isItemPrepared(customer, item));
        const preparedCount = this.getPreparedOrderItemCount(customer);
        this.setFeedback(
            missing.length > 0
                ? `订单气泡还缺：${missing.join('、')}`
                : preparedCount > 0 ? '订单还没完成' : '订单气泡还是空的，先选择订单商品',
            'warning',
            feedbackX,
            feedbackY,
        );
        this.setErrorFx(customer.id, firstMissing?.productId, 'order');
        this.render();
        this.shakeOrderBubble(customer.id);
    }

    private handleReadyCoinStackTap(customerId: number, rect: FigmaRect) {
        const customerIndex = this.customers.findIndex((customer) => customer.id === customerId);
        const customer = this.customers[customerIndex];
        if (customerIndex < 0 || !customer) {
            return;
        }
        this.activeCustomerIndex = customerIndex;
        const feedbackPoint = this.figmaPointToScene(rect.x + rect.width / 2, rect.y);
        if (customer.pendingOutcome) {
            this.render();
            return;
        }
        if (this.isOrderBubbleReadyFor(customer)) {
            this.attemptDeliverPreparedOrder(customerId, feedbackPoint.x, feedbackPoint.y);
            return;
        }
        this.handleOrderBubbleTap(customerId);
    }

    private showReadyCoinCollectionHint(customer: CustomerState, fallbackX: number, fallbackY: number) {
        this.message = READY_COIN_COLLECTION_HINT;
        this.feedbackTone = 'success';
        if (this.readyCoinHintShown || this.dragState) {
            this.toast = undefined;
            return;
        }
        this.readyCoinHintShown = true;
        const side = this.customers.findIndex((candidate) => candidate.id === customer.id);
        const rect = FIGMA_READY_COIN_STACK_RECTS[side];
        const point = rect
            ? this.figmaPointToScene(rect.x + rect.width / 2, rect.y)
            : { x: fallbackX, y: fallbackY };
        this.setFeedback('点金币收款', 'success', point.x, point.y + 42, true);
    }

    private attemptDeliverPreparedOrder(customerId: number, feedbackX = 0, feedbackY = 210): boolean {
        const customerIndex = this.customers.findIndex((customer) => customer.id === customerId);
        const customer = this.customers[customerIndex];
        if (customerIndex < 0 || !customer || customer.pendingOutcome) {
            this.clearTrayForCustomer(customerId);
            this.render();
            return false;
        }

        if (!this.isOrderBubbleReadyFor(customer)) {
            const missing = this.getMissingOrderItemNames(customer);
            const firstMissing = customer.order.find((item) => !this.isItemPrepared(customer, item));
            this.activeCustomerIndex = customerIndex;
            this.setFeedback(
                missing.length > 0 ? `订单气泡还缺：${missing.join('、')}` : '订单还没完成',
                'warning',
                feedbackX,
                feedbackY,
            );
            this.setErrorFx(customer.id, firstMissing?.productId, 'order');
            this.render();
            this.shakeOrderBubble(customer.id);
            return false;
        }

        for (const item of this.tray.items) {
            if (!customer.served.some((served) => this.sameItem(served, item))) {
                customer.served.push(item);
            }
        }
        this.clearTray();
        this.activeCustomerIndex = customerIndex;
        this.setFeedback('订单气泡交付成功', 'success', feedbackX, feedbackY);
        this.checkCompletionForIndex(customerIndex);
        this.resolveUnfulfillableCustomers();
        this.checkAutoCloseWhenSoldOut();
        return true;
    }

    private handleTrayTap() {
        if (this.tray.items.length === 0 || this.tray.customerId === undefined) {
            const customer = this.customers[this.activeCustomerIndex];
            this.setFeedback('订单气泡还是空的，先选择订单商品', 'info', 0, 210);
            if (customer) {
                this.setErrorFx(customer.id, undefined, 'order');
            }
            this.render();
            this.shakeOrderBubble(customer?.id);
            return;
        }

        this.attemptDeliverPreparedOrder(this.tray.customerId, 0, 210);
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

        this.finishCustomerOrder(index, false);
    }

    private finishCustomerOrder(index: number, forceLowReward = false) {
        const customer = this.customers[index];
        for (const item of this.tray.items) {
            if (!customer.served.some((served) => this.sameItem(served, item))) {
                customer.served.push(item);
            }
        }
        this.clearTrayForCustomer(customer.id);
        const patienceRatio = customer.patience / customer.maxPatience;
        const lowReward = forceLowReward || patienceRatio <= 0.3;
        if (lowReward) {
            this.combo = 0;
        } else {
            this.combo += 1;
        }
        this.completed += 1;
        const sale = this.getOrderSale(customer.order);
        const strategyTip = !lowReward && this.activeStrategy === 'tips' && patienceRatio > 0.6
            ? this.activeStrategyTier * 3
            : 0;
        const tip = lowReward
            ? 0
            : Math.min(this.combo, 5) + (patienceRatio > 0.6 ? 4 : 0) + strategyTip;
        const income = sale + tip;
        this.revenue += income;
        this.paymentBurst = { amount: income, remaining: 0.95, lowReward };
        this.recordReview(lowReward ? 3 : patienceRatio > 0.6 ? 5 : patienceRatio > 0.3 ? 4 : 3);
        for (const item of customer.order) {
            this.salesThisShift[item.productId] += 1;
        }
        this.setStatusMessage(
            lowReward
                ? `慢收 +${income}`
                : patienceRatio > 0.6
                ? `完美 +${income}`
                : `收款 +${income}`,
            lowReward ? 'warning' : 'success',
        );
        customer.mood = 'happy';
        customer.paymentAmount = income;
        customer.transitionRemaining = 0.85;
        customer.pendingOutcome = 'completed';
        customer.readyWindowRemaining = undefined;
        this.activeCustomerIndex = this.chooseNextCustomerIndex(index);
        this.render();
        this.playOrderCompleteFx(customer.id, income);
    }

    private getReadyCoinStackCount(customer: CustomerState) {
        const sale = this.getOrderSale(customer.order);
        if (sale < 15) {
            return 2;
        }
        if (sale < 30) {
            return 4;
        }
        return 8;
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
            const nextTime = this.formatShiftTime(this.shiftRemaining);
            if (this.timerValueLabel.string !== nextTime) {
                this.timerValueLabel.string = nextTime;
            }
        }
        if (this.coinValueLabel) {
            const nextIncome = this.formatHudIncome();
            if (this.coinValueLabel.string !== nextIncome) {
                this.coinValueLabel.string = nextIncome;
            }
        }
        if (this.timerProgressFill?.parent) {
            const progressWidth = HUD_TIMER_WIDTH - 92;
            const fillRatio = this.getShiftProgressRatio();
            this.timerProgressFill.setPosition(progressWidth * (fillRatio - 1) / 2, 0, 0);
            this.timerProgressFill.setScale(new Vec3(fillRatio, 1, 1));
        }

        for (const customer of this.customers) {
            const fill = this.patienceFillNodes.get(customer.id);
            if (fill?.parent) {
                const ratio = Math.max(0, customer.patience / customer.maxPatience);
                if (fill.name.startsWith('FinalPatienceFill-')) {
                    this.updateFinalPatienceFill(customer, fill);
                } else {
                    const fillRatio = Math.max(8 / 186, ratio);
                    fill.setPosition(93 * (fillRatio - 1), 0, 0);
                    fill.setScale(new Vec3(fillRatio, 1, 1));
                }
            }
            const countdown = this.readyCountdownNodes.get(customer.id);
            if (countdown?.parent) {
                this.updateFinalReadyCountdown(customer, countdown);
            }
        }

        if (this.microwave.mode === 'heating' && this.microwaveProgressFill?.parent) {
            const progressWidth = 194 * Math.max(0, 1 - this.microwave.remaining / getProcessingSeconds('microwave', this.economy.microwaveLevel));
            const fillWidth = Math.max(8, progressWidth);
            this.microwaveProgressFill.getComponent(UITransform)?.setContentSize(fillWidth, 10);
            this.microwaveProgressFill.setPosition((fillWidth - 194) / 2, 0, 0);
            this.drawRect(this.microwaveProgressFill, fillWidth, 10, 5, this.color(255, 98, 84));
        }
    }

    private updateFinalPatienceFill(customer: CustomerState, bar: Node) {
        const rawRatio = customer.maxPatience > 0 ? customer.patience / customer.maxPatience : 0;
        const ratio = Math.max(0, Math.min(1, rawRatio));
        const fillRatio = ratio <= 0 ? 0 : Math.max(FINAL_PATIENCE_SAFE_MIN_RATIO, ratio);
        const fillHeight = FINAL_PATIENCE_FILL_HEIGHT * fillRatio;
        const side = this.customers.findIndex((candidate) => candidate.id === customer.id);
        const rect = FIGMA_FINAL_PATIENCE_TRACK_RECTS[side];
        const barWidth = rect?.width ?? 10;
        const barHeight = rect?.height ?? (FINAL_PATIENCE_FILL_HEIGHT + 10);
        const insetY = (barHeight - FINAL_PATIENCE_FILL_HEIGHT) / 2;
        bar.active = true;
        bar.setScale(new Vec3(1, 1, 1));
        bar.getComponent(UITransform)?.setContentSize(barWidth, barHeight);
        if (rect && bar.parent === this.node) {
            bar.setPosition(
                this.figmaCenterX(rect),
                this.figmaCenterY(rect),
                0,
            );
        }
        const nextGraphics = bar.getComponent(Graphics) ?? bar.addComponent(Graphics);
        nextGraphics.clear();
        nextGraphics.fillColor = this.color(34, 28, 48, 188);
        nextGraphics.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, 5);
        nextGraphics.fill();
        nextGraphics.lineWidth = 1;
        nextGraphics.strokeColor = this.color(255, 250, 239, 188);
        nextGraphics.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, 5);
        nextGraphics.stroke();
        if (fillHeight <= 0) {
            return;
        }
        nextGraphics.fillColor = this.getFinalPatienceColor(ratio);
        nextGraphics.roundRect(
            -FINAL_PATIENCE_FILL_WIDTH / 2,
            -barHeight / 2 + insetY,
            FINAL_PATIENCE_FILL_WIDTH,
            fillHeight,
            FINAL_PATIENCE_FILL_WIDTH / 2,
        );
        nextGraphics.fill();
    }

    private getFinalPatienceColor(ratio: number) {
        if (ratio > 0.6) {
            return this.color(91, 198, 142, 236);
        }
        if (ratio > 0.3) {
            return this.color(246, 202, 76, 240);
        }
        return this.color(224, 72, 78, 244);
    }

    private updateFinalReadyCountdown(customer: CustomerState, node: Node) {
        const remaining = customer.readyWindowRemaining ?? READY_REWARD_WINDOW_SECONDS;
        const ratio = Math.max(0, Math.min(1, remaining / READY_REWARD_WINDOW_SECONDS));
        const rect = FIGMA_READY_COUNTDOWN_RECTS[0];
        const width = Math.max(4, rect.width * ratio);
        const graphics = node.getComponent(Graphics);
        graphics?.destroy();
        const nextGraphics = node.addComponent(Graphics);
        nextGraphics.fillColor = this.color(255, 248, 217, 210);
        nextGraphics.roundRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height, rect.height / 2);
        nextGraphics.fill();
        nextGraphics.fillColor = remaining <= READY_REWARD_WARNING_SECONDS
            ? this.color(246, 202, 76, 248)
            : this.color(103, 199, 165, 238);
        nextGraphics.roundRect(-rect.width / 2, -rect.height / 2, width, rect.height, rect.height / 2);
        nextGraphics.fill();
    }

    private formatShiftTime(seconds: number) {
        const totalSeconds = Math.max(0, Math.ceil(seconds));
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    private formatHudIncome() {
        return this.revenue.toLocaleString('en-US');
    }

    private getShiftProgressRatio() {
        const totalSeconds = Math.max(1, this.shiftRules.shiftSeconds);
        return Math.max(0.04, Math.min(1, this.shiftRemaining / totalSeconds));
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
        this.readyCoinHintShown = false;
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
                ? '先点高亮商品卡；订单完成后点击柜台金币'
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
        if (START_DIRECTLY_IN_GAMEPLAY && this.getQaSnapshotMode()) {
            this.prepareDirectGameplayReadyOrder();
        }
        this.checkAutoCloseWhenSoldOut();
        if (!START_DIRECTLY_IN_GAMEPLAY) {
            this.saveEconomy();
        }
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
        const suggestedStock = this.getDayBalanceConfig().suggestedStock;
        for (const productId of this.economy.unlockedProductIds) {
            const target = suggestedStock[productId] || 4;
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
        const matchingMissing = customer.order.some((item) => (
            item.productId === productId
            && !this.isItemPrepared(customer, item)
        ));
        if (!matchingMissing) {
            this.combo = 0;
            customer.patience = Math.max(0, customer.patience - 2);
            this.setStockFeedback(`${PRODUCT_CATALOG[productId].displayName} 已售罄`, 'error');
            this.setErrorFx(customer.id, productId, 'order');
            this.triggerCustomerReaction(customer.id, 'angry');
            return;
        }

        const unfulfillableMissing = customer.order.some((item) => (
            item.productId === productId
            && !this.isItemPrepared(customer, item)
            && !this.canStillFulfillItem(customer, item)
        ));
        if (!unfulfillableMissing) {
            this.setStockFeedback(`${PRODUCT_CATALOG[productId].displayName}货架售罄，先用设备里的热食`, 'warning');
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
        this.setStockFeedback('库存售空，服务店内顾客后结算');
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
        return this.canMicrowaveServeOrderItem(customer, item);
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
        this.setStockFeedback(
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
        const target = this.getDayBalanceConfig().target;
        if (this.completed >= target.excellentOrders || this.revenue >= target.excellentRevenue) {
            return ' · 本轮优秀';
        }
        if (this.completed >= target.passOrders || this.revenue >= target.passRevenue) {
            return ' · 本轮达标';
        }
        return ' · 本轮未达标';
    }

    private getDayTargetLabel(): string {
        const target = this.getDayBalanceConfig().target;
        return `目标 ${target.passOrders}单/${target.passRevenue}营业额`;
    }

    private getDayTargetDetail(): string {
        const target = this.getDayBalanceConfig().target;
        return `目标 ${target.passOrders}单/${target.passRevenue}营业额，优秀 ${target.excellentOrders}单/${target.excellentRevenue}`;
    }

    private getDemandPool(): ProductId[] {
        return this.buildWeightedDemandPool(this.economy.unlockedProductIds);
    }

    private getFulfillableDemandPool(): ProductId[] {
        const availableProducts: ProductId[] = [];
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
            if (available > 0) {
                availableProducts.push(productId);
            }
        }
        return this.buildWeightedDemandPool(availableProducts);
    }

    private buildWeightedDemandPool(productIds: ProductId[]): ProductId[] {
        const weights = this.getDayBalanceConfig().productWeights;
        const pool: ProductId[] = [];
        for (const productId of productIds) {
            const balanceWeight = weights[productId];
            const weight = balanceWeight ?? (PRODUCT_ECONOMY[productId].category === this.economy.nextTrendCategory ? 3 : 1);
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

    private getPremiumDemandPool(pool: ProductId[]): ProductId[] {
        const premium = pool.filter((productId) => PRODUCT_ECONOMY[productId].sellPrice >= 20);
        return premium.length >= 2 ? premium : pool;
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
        const suggestedStock = this.getDayBalanceConfig().suggestedStock[productId];
        const referenceDemand = lastSales > 0 ? lastSales : suggestedStock || 4;
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

    private renderFinalMicrowaveReadyDragCue() {
        if (this.microwave.mode !== 'ready' || !this.microwave.productId) {
            return;
        }
        this.addFigmaSurface(
            this.node,
            'FinalMicrowaveReadyDragRim',
            this.expandFigmaRect(FIGMA_MICROWAVE, 5),
            13,
            this.color(255, 255, 255, 1),
            this.color(255, 194, 71, 238),
            4,
        );
    }

    private clearDragState() {
        this.dragState = undefined;
        this.clearDragOverlayNodes();
    }

    private clearDragOverlayNodes() {
        if (this.dragGhostNode?.isValid) {
            this.dragGhostNode.destroy();
        }
        if (this.dragTargetNode?.isValid) {
            this.dragTargetNode.destroy();
        }
        if (this.dragInputCatcherNode?.isValid) {
            this.dragInputCatcherNode.destroy();
        }
        this.dragGhostNode = undefined;
        this.dragTargetNode = undefined;
        this.dragInputCatcherNode = undefined;
    }

    private updateDragFeedbackNodes() {
        const drag = this.dragState;
        if (!drag || !drag.hasMovedPastTapThreshold) {
            return;
        }
        this.ensureDragInputCatcherNode();

        const target = drag.hoverTarget;
        if (target) {
            const targetKey = this.getDragTargetKey(target);
            if (drag.overlayTargetKey !== targetKey) {
                if (this.dragTargetNode?.isValid) {
                    this.dragTargetNode.destroy();
                }
                drag.overlayTargetKey = targetKey;
                const accepted = target.accepts;
                const warmTarget = target.kind === 'microwave' || drag.prepared === 'heated';
                const stroke = accepted
                    ? warmTarget ? this.color(255, 194, 71, 240) : this.color(103, 199, 165, 240)
                    : this.color(216, 67, 67, 235);
                const fill = accepted
                    ? warmTarget ? this.color(255, 194, 71, 30) : this.color(103, 199, 165, 30)
                    : this.color(216, 67, 67, 28);
                const visualRect = this.getDragTargetVisualRect(target);
                this.dragTargetNode = this.addFigmaSurface(
                    this.node,
                    'DragTargetRim',
                    this.expandFigmaRect(visualRect, target.kind === 'order-bubble' ? 1 : 2),
                    target.kind === 'microwave' ? 14 : 10,
                    fill,
                    stroke,
                    accepted ? 3 : 2,
                );
                this.bindDragOverlayPassthrough(this.dragTargetNode);
            }
        } else {
            drag.overlayTargetKey = undefined;
            if (this.dragTargetNode?.isValid) {
                this.dragTargetNode.destroy();
            }
            this.dragTargetNode = undefined;
        }

        const ghostRect = this.getDragGhostRect(drag);
        if (this.dragGhostNode?.isValid) {
            this.dragGhostNode.setPosition(this.figmaCenterX(ghostRect), this.figmaCenterY(ghostRect), 0);
        } else {
            const ghost = this.addFigmaSurface(
                this.node,
                'DragGhost',
                ghostRect,
                15,
                this.color(255, 250, 239, 232),
                this.color(51, 33, 62, 170),
                2,
            );
            this.addProductSprite(ghost, drag.productId, 44);
            this.bindDragOverlayPassthrough(ghost);
            this.dragGhostNode = ghost;
        }
    }

    private ensureDragInputCatcherNode() {
        if (this.dragInputCatcherNode?.isValid) {
            return;
        }
        const catcher = this.addFigmaSurface(this.node, 'DragInputCatcher', FIGMA_BACKGROUND, 0, this.color(255, 255, 255, 1));
        this.bindDragOverlayPassthrough(catcher);
        this.dragInputCatcherNode = catcher;
    }

    private getDragTargetKey(target: DragDropTarget): string {
        return [
            target.kind,
            target.accepts ? 'ok' : 'no',
            target.customerId ?? 'device',
            target.orderIndex ?? 'any',
        ].join(':');
    }

    private getDragTargetVisualRect(target: DragDropTarget): FigmaRect {
        if (target.kind === 'order-bubble' && target.customerIndex !== undefined) {
            const customerRect = target.customerIndex === 0 ? FIGMA_LEFT_CUSTOMER : FIGMA_RIGHT_CUSTOMER;
            return this.expandFigmaRect(customerRect, 6);
        }
        return target.rect;
    }

    private bindDragOverlayPassthrough(node: Node) {
        node.on(Node.EventType.TOUCH_MOVE, (event: TouchLikeEvent) => this.handleActiveDragOverlayMove(event), this);
        node.on(Node.EventType.TOUCH_END, (event: TouchLikeEvent) => this.handleActiveDragOverlayRelease(event), this);
        node.on(Node.EventType.TOUCH_CANCEL, (event: TouchLikeEvent) => this.handleActiveDragOverlayCancel(event), this);
    }

    private handleActiveDragOverlayMove(event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        const drag = this.dragState;
        if (!drag) {
            return;
        }
        this.updateDragFromTouch(drag.kind, event);
    }

    private handleActiveDragOverlayRelease(event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        const drag = this.dragState;
        if (!drag) {
            return;
        }
        if (!drag.hasMovedPastTapThreshold) {
            this.clearDragState();
            return;
        }
        const completedDrag = { ...drag };
        this.clearDragState();
        if (completedDrag.kind === 'microwave-ready') {
            this.resolveMicrowaveReadyDragDrop(completedDrag);
        } else {
            this.resolveProductDragDrop(completedDrag);
        }
    }

    private handleActiveDragOverlayCancel(event: TouchLikeEvent) {
        this.stopTouchPropagation(event);
        const drag = this.dragState;
        if (!drag?.hasMovedPastTapThreshold) {
            this.clearDragState();
            return;
        }
        const completedDrag = { ...drag };
        if (completedDrag.hoverTarget?.accepts) {
            this.suppressNextTapFallback = true;
            this.clearDragState();
            if (completedDrag.kind === 'microwave-ready') {
                this.resolveMicrowaveReadyDragDrop(completedDrag);
            } else {
                this.resolveProductDragDrop(completedDrag);
            }
            return;
        }
        this.clearDragState();
    }

    private getDragGhostRect(drag: DragState): FigmaRect {
        const sideOffset = drag.currentX < DESIGN_WIDTH / 2 ? DRAG_GHOST_SIDE_OFFSET : -DRAG_GHOST_SIDE_OFFSET;
        return {
            x: this.clamp(drag.currentX - DRAG_GHOST_SIZE / 2 + sideOffset, 4, DESIGN_WIDTH - DRAG_GHOST_SIZE - 4),
            y: this.clamp(drag.currentY - DRAG_GHOST_OFFSET_Y - DRAG_GHOST_SIZE / 2, 8, DESIGN_HEIGHT - DRAG_GHOST_SIZE - 8),
            width: DRAG_GHOST_SIZE,
            height: DRAG_GHOST_SIZE,
        };
    }

    private getTouchFigmaPoint(event: TouchLikeEvent | undefined): { x: number; y: number } | undefined {
        const location = event?.getUILocation?.() ?? event?.getLocation?.();
        if (!location) {
            return undefined;
        }
        const visibleSize = view.getVisibleSize();
        const visibleWidth = Math.max(1, visibleSize.width);
        const visibleHeight = Math.max(1, visibleSize.height);
        return {
            x: this.clamp(location.x * DESIGN_WIDTH / visibleWidth, 0, DESIGN_WIDTH),
            y: this.clamp(DESIGN_HEIGHT - location.y * DESIGN_HEIGHT / visibleHeight, 0, DESIGN_HEIGHT),
        };
    }

    private figmaPointToScene(x: number, y: number) {
        return {
            x: x - DESIGN_WIDTH / 2,
            y: DESIGN_HEIGHT / 2 - y,
        };
    }

    private getFinalOrderBubbleRect(side: number): FigmaRect {
        return side === 0 ? FIGMA_LEFT_BUBBLE_SELECTED : FIGMA_RIGHT_BUBBLE_SELECTED;
    }

    private getFinalCustomerDropRect(side: number): FigmaRect {
        const customerRect = side === 0 ? FIGMA_LEFT_CUSTOMER : FIGMA_RIGHT_CUSTOMER;
        return this.expandFigmaRect(
            this.unionFigmaRects(customerRect, this.getFinalOrderBubbleRect(side)),
            DRAG_CUSTOMER_TARGET_PADDING,
        );
    }

    private unionFigmaRects(first: FigmaRect, second: FigmaRect): FigmaRect {
        const left = Math.min(first.x, second.x);
        const top = Math.min(first.y, second.y);
        const right = Math.max(first.x + first.width, second.x + second.width);
        const bottom = Math.max(first.y + first.height, second.y + second.height);
        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
        };
    }

    private expandFigmaRect(rect: FigmaRect, padding: number): FigmaRect {
        const left = this.clamp(rect.x - padding, 0, DESIGN_WIDTH);
        const top = this.clamp(rect.y - padding, 0, DESIGN_HEIGHT);
        const right = this.clamp(rect.x + rect.width + padding, 0, DESIGN_WIDTH);
        const bottom = this.clamp(rect.y + rect.height + padding, 0, DESIGN_HEIGHT);
        return {
            x: left,
            y: top,
            width: Math.max(1, right - left),
            height: Math.max(1, bottom - top),
        };
    }

    private isPointInFigmaRect(point: { x: number; y: number }, rect: FigmaRect): boolean {
        return point.x >= rect.x
            && point.x <= rect.x + rect.width
            && point.y >= rect.y
            && point.y <= rect.y + rect.height;
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
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

    private addFigmaProductSprite(parent: Node, productId: ProductId, rect: FigmaRect, name: string, usePlacedScale = false) {
        const frame = this.productFrames.get(productId);
        if (!frame) {
            return this.addFigmaSurface(parent, `${name}Placeholder`, rect, rect.width * 0.22, PRODUCT_COLORS[productId]);
        }
        const imageTransform = FIGMA_PRODUCT_CROP_TRANSFORMS[productId];
        if (usePlacedScale) {
            return this.addFigmaArtwork(parent, name, frame, rect);
        }
        return this.addFigmaArtwork(parent, name, frame, rect, imageTransform
            ? { fit: 'crop', imageTransform }
            : { fit: 'fill' });
    }

    private addFinalFaceArtwork(
        parent: Node,
        name: string,
        frame: SpriteFrame,
        targetRect: FigmaRect,
        kind: CustomerKind,
        mood: CustomerMood,
    ) {
        const sourceRect = frame.rect;
        const sourceWidth = Math.max(1, sourceRect?.width ?? targetRect.width);
        const sourceHeight = Math.max(1, sourceRect?.height ?? targetRect.height);
        const neutralHeight = FINAL_FACE_NEUTRAL_SOURCE_HEIGHT[kind] ?? sourceHeight;
        const scale = targetRect.height / neutralHeight;
        const width = sourceWidth * scale;
        const height = sourceHeight * scale;
        const sourceEyeXRatio = FINAL_FACE_SOURCE_EYE_X_RATIO[`${kind}-${mood}`] ?? FINAL_FACE_TARGET_EYE_X_RATIO;
        const targetEyeX = targetRect.x + targetRect.width * FINAL_FACE_TARGET_EYE_X_RATIO;
        const targetEyeY = targetRect.y + targetRect.height * FINAL_FACE_TARGET_EYE_Y_RATIO;
        const rect = {
            x: targetEyeX - width * sourceEyeXRatio,
            y: targetEyeY - height * FINAL_FACE_SOURCE_EYE_Y_RATIO,
            width,
            height,
        };
        return this.addFigmaArtwork(parent, name, frame, rect);
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

    private addFigmaArtwork(
        parent: Node,
        name: string,
        frame: SpriteFrame,
        rect: FigmaRect,
        options: FigmaArtworkOptions = {},
    ) {
        const fit = options.fit ?? 'stretch';
        if (fit === 'stretch') {
            const artwork = this.addArtwork(parent, name, frame, rect.width, rect.height, this.figmaCenterX(rect), this.figmaCenterY(rect));
            const sprite = artwork.getComponent(Sprite);
            if (sprite) {
                sprite.trim = false;
            }
            return artwork;
        }
        const viewport = this.createFigmaNode(name, rect, parent);
        const mask = viewport.addComponent(Mask);
        mask.type = Mask.Type.GRAPHICS_RECT;

        const spriteRect = frame.rect;
        const sourceWidth = Math.max(1, spriteRect?.width ?? rect.width);
        const sourceHeight = Math.max(1, spriteRect?.height ?? rect.height);
        const sourceAspect = sourceWidth / sourceHeight;
        const targetAspect = rect.width / rect.height;
        let spriteWidth = rect.width;
        let spriteHeight = rect.height;
        let spriteX = 0;
        let spriteY = 0;

        if (fit === 'fill') {
            if (sourceAspect >= targetAspect) {
                spriteHeight = rect.height;
                spriteWidth = rect.height * sourceAspect;
            } else {
                spriteWidth = rect.width;
                spriteHeight = rect.width / sourceAspect;
            }
        } else if (options.imageTransform) {
            const transform = options.imageTransform;
            spriteWidth = rect.width / Math.max(0.0001, transform.scaleX);
            spriteHeight = rect.height / Math.max(0.0001, transform.scaleY);
            spriteX = rect.width * ((0.5 - transform.translateX) / Math.max(0.0001, transform.scaleX) - 0.5);
            spriteY = rect.height * (0.5 - (0.5 - transform.translateY) / Math.max(0.0001, transform.scaleY));
        }

        const spriteNode = this.addArtwork(viewport, `${name}Sprite`, frame, spriteWidth, spriteHeight, spriteX, spriteY);
        const sprite = spriteNode.getComponent(Sprite);
        if (sprite) {
            sprite.trim = false;
        }
        spriteNode.layer = viewport.layer;
        return viewport;
    }

    private addSlicedArtwork(
        parent: Node,
        name: string,
        frame: SpriteFrame,
        width: number,
        height: number,
        x = 0,
        y = 0,
    ) {
        const artwork = this.addArtwork(parent, name, frame, width, height, x, y);
        const sprite = artwork.getComponent(Sprite);
        if (sprite) {
            sprite.type = Sprite.Type.SLICED;
        }
        return artwork;
    }

    private addPill(parent: Node, text: string, x: number, y: number, width: number, height: number, fill: Color) {
        const pill = this.createNode(text, width, height, parent);
        pill.setPosition(x, y, 0);
        this.drawRect(pill, width, height, height / 2, fill);
        this.addLabel(pill, text, 0, 0, 24, this.color(255, 255, 255), true, width - 20);
    }

    private addFigmaLabel(
        parent: Node,
        text: string,
        rect: FigmaRect,
        fontSize: number,
        color: Color,
        bold = false,
        background?: Color,
    ) {
        return this.addLabel(
            parent,
            text,
            this.figmaCenterX(rect),
            this.figmaCenterY(rect),
            fontSize,
            color,
            bold,
            rect.width,
            background,
        );
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

    private setStockFeedback(message: string, tone: FeedbackTone = 'warning') {
        this.setFeedback(message, tone, 0, -74, true);
    }

    private setFeedback(message: string, tone: FeedbackTone, x = 0, y = 260, compact = false) {
        this.message = message;
        this.feedbackTone = tone;
        this.toast = {
            message,
            tone,
            remaining: compact ? 0.75 : tone === 'error' ? 1.4 : 1.1,
            x,
            y,
            compact,
        };
    }

    private setStatusMessage(message: string, tone: FeedbackTone) {
        this.message = message;
        this.feedbackTone = tone;
        this.toast = undefined;
    }

    private markCoreAssetLoaded() {
        if (START_DIRECTLY_IN_GAMEPLAY && this.artReady) {
            if (!this.home && !this.preparing && !this.ended) {
                this.render();
            }
            return;
        }
        this.coreAssetsPending = Math.max(0, this.coreAssetsPending - 1);
        if (this.coreAssetsPending === 0) {
            this.artReady = true;
            this.render();
        }
    }

    private prepareGameplaySnapshotState() {
        const stockCap = getStockCap(this.economy.shelfLevel);
        for (const item of DIRECT_GAMEPLAY_ORDER) {
            if (!this.economy.unlockedProductIds.includes(item.productId)) {
                this.economy.unlockedProductIds.push(item.productId);
            }
        }
        for (const productId of this.economy.unlockedProductIds) {
            this.economy.warehouseStock[productId] = Math.max(this.economy.warehouseStock[productId], stockCap);
        }
    }

    private maintainDirectGameplaySnapshotState() {
        const needsReset = !this.hasDirectGameplaySnapshotState();
        if (needsReset) {
            this.prepareDirectGameplayReadyOrder();
        }
        this.shiftRemaining = DIRECT_GAMEPLAY_SHIFT_REMAINING;
        for (const customer of this.customers) {
            customer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
            customer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
            customer.mood = 'waiting';
            customer.reactionRemaining = 0;
            customer.transitionRemaining = 0;
        }
        if (needsReset) {
            this.render();
        }
    }

    private hasDirectGameplaySnapshotState() {
        if (this.customers.length !== 2 || this.activeCustomerIndex !== 0) {
            return false;
        }
        const left = this.customers[0];
        const right = this.customers[1];
        if (!left || !right || left.pendingOutcome || right.pendingOutcome) {
            return false;
        }
        return (
            this.hasSameOrderItems(left.order, DIRECT_GAMEPLAY_ORDER)
            && this.hasSameOrderItems(right.order, DIRECT_GAMEPLAY_PREVIEW_ORDER)
            && this.tray.customerId === left.id
            && this.hasSameOrderItems(this.tray.items, DIRECT_GAMEPLAY_ORDER)
            && this.isOrderBubbleReadyFor(left)
            && this.getPreparedOrderItemCount(right) === 0
        );
    }

    private hasSameOrderItems(actual: OrderItem[], expected: OrderItem[]) {
        return (
            actual.length === expected.length
            && expected.every((item, index) => this.sameItem(actual[index], item))
        );
    }

    private createDirectGameplayCustomer(
        id: number,
        order: OrderItem[],
        showHint: boolean,
        kind: CustomerKind = 'normal',
    ): CustomerState {
        return {
            id,
            kind,
            order: order.map((item) => ({ ...item })),
            served: [],
            patience: DIRECT_GAMEPLAY_PATIENCE_SECONDS,
            maxPatience: DIRECT_GAMEPLAY_PATIENCE_SECONDS,
            mood: 'waiting',
            transitionRemaining: 0,
            reactionRemaining: 0,
            showHint,
            lowPatienceFxPlayed: false,
        };
    }

    private prepareDirectGameplayReadyOrder() {
        this.customers = [
            this.createDirectGameplayCustomer(1, DIRECT_GAMEPLAY_ORDER, true),
            this.createDirectGameplayCustomer(2, DIRECT_GAMEPLAY_PREVIEW_ORDER, false, 'impatient'),
        ];
        this.nextCustomerId = 3;
        this.nextOrderIndex = 2;
        this.activeCustomerIndex = 0;
        this.shiftRemaining = DIRECT_GAMEPLAY_SHIFT_REMAINING;
        this.revenue = 0;
        this.goodsCost = 0;
        this.combo = 0;
        this.completed = 0;
        this.missed = 0;
        this.reviewPoints = 0;
        this.reviewCount = 0;
        this.paymentBurst = undefined;
        this.errorFx = undefined;
        this.toast = undefined;
        for (const targetCustomer of this.customers) {
            targetCustomer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
            targetCustomer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        }
        this.tray = {
            customerId: 1,
            items: DIRECT_GAMEPLAY_ORDER.map((item) => ({ ...item })),
        };
    }

    private getRuntimeProbeState(): RuntimeProbeState | undefined {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const state = new URLSearchParams(window.location.search).get('probeState');
        if (
            state === 'partial'
            || state === 'heating'
            || state === 'microwave-ready'
            || state === 'payment'
            || state === 'waiting-switch'
        ) {
            return state;
        }
        return undefined;
    }

    private getQaInteractiveMode(): boolean {
        if (typeof window === 'undefined') {
            return false;
        }
        const params = new URLSearchParams(window.location.search);
        return this.hasUrlFlag(params, 'qaInteractive') || this.hasUrlFlag(params, 'qaDisableSnapshotReset');
    }

    private getQaSnapshotMode(): boolean {
        if (typeof window === 'undefined') {
            return false;
        }
        const params = new URLSearchParams(window.location.search);
        return this.hasUrlFlag(params, 'qaSnapshot') || this.hasUrlFlag(params, 'qaStatic');
    }

    private getQaPatiencePreset(): QaPatiencePreset | undefined {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const preset = new URLSearchParams(window.location.search).get('qaPatience');
        return this.isQaPatiencePreset(preset) ? preset : undefined;
    }

    private getQaFaceMoodPreset(): QaFaceMoodPreset | undefined {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const preset = new URLSearchParams(window.location.search).get('qaFaceMood');
        return this.isCustomerMood(preset) ? preset : undefined;
    }

    private getQaFlowPreset(): QaFlowPreset | undefined {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const preset = new URLSearchParams(window.location.search).get('qaFlow');
        return this.isQaFlowPreset(preset) ? preset : undefined;
    }

    private isQaPatiencePreset(value: string | null): value is QaPatiencePreset {
        return value === 'green'
            || value === 'yellow'
            || value === 'red'
            || value === 'empty'
            || value === 'mixed';
    }

    private isQaFlowPreset(value: string | null): value is QaFlowPreset {
        return value === 'ready-left'
            || value === 'right-current-empty'
            || value === 'heating'
            || value === 'microwave-ready'
            || value === 'low-stock'
            || value === 'red-patience'
            || value === 'first-test-live'
            || value === 'hot-food-natural'
            || value === 'sold-out-needed'
            || value === 'hot-ready-sold-out'
            || value === 'stock-noise'
            || value === 'ready-window-mixed'
            || value === 'ready-window-timeout'
            || value === 'ready-coin-small'
            || value === 'ready-coin-medium'
            || value === 'ready-coin-large'
            || value === 'ready-coin-timeout'
            || value === 'ready-patience-timeout'
            || value === 'post-shift-upgrade';
    }

    private isCustomerMood(value: string | null): value is CustomerMood {
        return value === 'waiting'
            || value === 'happy'
            || value === 'urgent'
            || value === 'angry';
    }

    private hasUrlFlag(params: URLSearchParams, key: string): boolean {
        const value = params.get(key);
        return value === '1' || value === 'true' || value === 'yes';
    }

    private applyRuntimeProbeState(shouldRender = true) {
        if (!this.runtimeProbeState) {
            return;
        }
        this.prepareRuntimeProbeBase();
        if (this.runtimeProbeState === 'partial') {
            this.prepareRuntimeProbePartial();
        } else if (this.runtimeProbeState === 'heating') {
            this.prepareRuntimeProbeHeating();
        } else if (this.runtimeProbeState === 'microwave-ready') {
            this.prepareRuntimeProbeMicrowaveReady();
        } else if (this.runtimeProbeState === 'payment') {
            this.prepareRuntimeProbePayment();
        } else if (this.runtimeProbeState === 'waiting-switch') {
            this.prepareRuntimeProbeWaitingSwitch();
        }
        if (shouldRender) {
            this.render();
        }
    }

    private applyQaPatiencePreset(shouldRender = true) {
        if (!this.qaPatiencePreset || this.customers.length < 2) {
            return;
        }
        const ratios: Record<QaPatiencePreset, [number, number]> = {
            green: [1, 0.85],
            yellow: [0.55, 0.42],
            red: [0.22, 0.16],
            empty: [0, 0],
            mixed: [0.9, 0.18],
        };
        const pair = ratios[this.qaPatiencePreset];
        this.customers.slice(0, 2).forEach((customer, index) => {
            customer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
            customer.patience = Math.max(0, DIRECT_GAMEPLAY_PATIENCE_SECONDS * pair[index]);
            customer.mood = pair[index] < 0.3 ? 'urgent' : 'waiting';
            customer.lowPatienceFxPlayed = pair[index] < 0.3;
        });
        if (this.qaPatiencePreset === 'mixed') {
            this.customers[0].served = DIRECT_GAMEPLAY_ORDER.map((item) => ({ ...item }));
        }
        if (shouldRender) {
            this.render();
        }
    }

    private applyQaFaceMoodPreset(shouldRender = true) {
        if (!this.qaFaceMoodPreset || this.customers.length < 2) {
            return;
        }
        this.customers.slice(0, 2).forEach((customer) => {
            customer.mood = this.qaFaceMoodPreset!;
            customer.reactionRemaining = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
            customer.transitionRemaining = 0;
        });
        if (shouldRender) {
            this.render();
        }
    }

    private applyQaFlowPreset(shouldRender = true) {
        if (!this.qaFlowPreset) {
            return;
        }
        this.prepareRuntimeProbeBase();
        if (this.qaFlowPreset === 'ready-left') {
            this.prepareQaFlowReadyLeft();
        } else if (this.qaFlowPreset === 'right-current-empty') {
            this.prepareQaFlowRightCurrentEmpty();
        } else if (this.qaFlowPreset === 'heating') {
            this.prepareRuntimeProbeHeating();
        } else if (this.qaFlowPreset === 'microwave-ready') {
            this.prepareRuntimeProbeMicrowaveReady();
        } else if (this.qaFlowPreset === 'low-stock') {
            this.prepareQaFlowLowStock();
        } else if (this.qaFlowPreset === 'red-patience') {
            this.prepareQaFlowRedPatience();
        } else if (this.qaFlowPreset === 'first-test-live') {
            this.prepareQaFlowFirstTestLive();
        } else if (this.qaFlowPreset === 'hot-food-natural') {
            this.prepareQaFlowHotFoodNatural();
        } else if (this.qaFlowPreset === 'sold-out-needed') {
            this.prepareQaFlowSoldOutNeeded();
        } else if (this.qaFlowPreset === 'hot-ready-sold-out') {
            this.prepareQaFlowHotReadySoldOut();
        } else if (this.qaFlowPreset === 'stock-noise') {
            this.prepareQaFlowStockNoise();
        } else if (this.qaFlowPreset === 'ready-window-mixed') {
            this.prepareQaFlowReadyWindowMixed();
        } else if (this.qaFlowPreset === 'ready-window-timeout') {
            this.prepareQaFlowReadyWindowTimeout();
        } else if (this.qaFlowPreset === 'ready-coin-small') {
            this.prepareQaFlowReadyCoin([{ productId: 'snack-bag' }], 'QA ready-coin-small：小额订单 2 枚金币');
        } else if (this.qaFlowPreset === 'ready-coin-medium') {
            this.prepareQaFlowReadyCoin([{ productId: 'rice-ball' }], 'QA ready-coin-medium：中额订单 4 枚金币');
        } else if (this.qaFlowPreset === 'ready-coin-large') {
            this.prepareQaFlowReadyCoin(DIRECT_GAMEPLAY_ORDER, 'QA ready-coin-large：大额订单 8 枚金币');
        } else if (this.qaFlowPreset === 'ready-coin-timeout') {
            this.prepareQaFlowReadyPatienceTimeout();
        } else if (this.qaFlowPreset === 'ready-patience-timeout') {
            this.prepareQaFlowReadyPatienceTimeout();
        } else if (this.qaFlowPreset === 'post-shift-upgrade') {
            this.prepareQaFlowPostShiftUpgrade();
        }
        this.qaInteractiveMode = true;
        if (shouldRender) {
            this.render();
        }
    }

    private prepareQaFlowReadyLeft() {
        const customer = this.customers[0];
        this.activeCustomerIndex = 0;
        this.tray = {
            customerId: customer.id,
            items: customer.order.map((item) => ({ ...item })),
        };
        customer.served = customer.order.map((item) => ({ ...item }));
        customer.readyWindowRemaining = undefined;
        this.revenue = 0;
        this.setStatusMessage('QA ready-left：左侧订单 READY，验证交付和收入变化', 'success');
    }

    private prepareQaFlowRightCurrentEmpty() {
        this.activeCustomerIndex = 1;
        this.tray = { items: [] };
        this.customers[0].served = DIRECT_GAMEPLAY_ORDER.map((item) => ({ ...item }));
        this.customers[0].pendingOutcome = 'completed';
        this.customers[0].transitionRemaining = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        this.customers[0].mood = 'happy';
        this.setStatusMessage('QA right-current-empty：右侧为当前顾客，验证切换与空订单', 'info');
    }

    private prepareQaFlowLowStock() {
        this.activeCustomerIndex = 0;
        const productId = this.customers[0].order[0]?.productId ?? 'snack-bag';
        this.stock[productId] = 0;
        this.economy.warehouseStock[productId] = Math.max(1, this.economy.warehouseStock[productId]);
        this.tray = { items: [] };
        this.setStatusMessage(`QA low-stock：${PRODUCT_CATALOG[productId].displayName}货架为 0，验证补货反馈`, 'warning');
    }

    private prepareQaFlowRedPatience() {
        this.customers.slice(0, 2).forEach((customer, index) => {
            customer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
            customer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS * (index === 0 ? 0.18 : 0.52);
            customer.mood = index === 0 ? 'urgent' : 'waiting';
            customer.lowPatienceFxPlayed = index === 0;
        });
        this.setStatusMessage('QA red-patience：左侧红耐心，验证顾客风险优先级', 'warning');
    }

    private prepareQaFlowFirstTestLive() {
        const liveOrders: OrderItem[][] = [
            [{ productId: 'rice-ball', heated: true }],
            [{ productId: 'snack-bag' }, { productId: 'lemon-drink' }],
        ];
        this.shiftRemaining = 120;
        this.activeCustomerIndex = 0;
        this.tray = { items: [] };
        this.microwave = { mode: 'idle', remaining: 0 };
        this.revenue = 0;
        this.goodsCost = 0;
        this.combo = 0;
        this.completed = 0;
        this.missed = 0;
        this.reviewPoints = 0;
        this.reviewCount = 0;
        this.paymentBurst = undefined;
        this.errorFx = undefined;
        this.toast = undefined;
        this.stock['rice-ball'] = Math.max(this.stock['rice-ball'], 3);
        this.economy.warehouseStock['rice-ball'] = Math.max(this.economy.warehouseStock['rice-ball'], 3);
        this.customers.slice(0, 2).forEach((customer, index) => {
            customer.order = liveOrders[index].map((item) => ({ ...item }));
            customer.served = [];
            customer.pendingOutcome = undefined;
            customer.paymentAmount = undefined;
            customer.readyWindowRemaining = undefined;
            customer.transitionRemaining = 0;
            customer.reactionRemaining = 0;
            customer.mood = 'waiting';
            customer.showHint = false;
            customer.lowPatienceFxPlayed = false;
            customer.maxPatience = index === 0 ? 90 : 75;
            customer.patience = customer.maxPatience;
        });
        this.setStatusMessage('首测 live：拖饭团进微波炉，订单完成后点柜台金币收款', 'heat');
    }

    private prepareQaFlowHotFoodNatural() {
        const customer = this.customers[0];
        this.activeCustomerIndex = 0;
        this.shiftRemaining = 180;
        customer.order = [{ productId: 'rice-ball', heated: true }];
        customer.served = [];
        customer.pendingOutcome = undefined;
        customer.transitionRemaining = 0;
        customer.mood = 'waiting';
        customer.patience = 180;
        customer.maxPatience = 180;
        this.stock['rice-ball'] = Math.max(this.stock['rice-ball'], 3);
        this.economy.warehouseStock['rice-ball'] = Math.max(this.economy.warehouseStock['rice-ball'], 3);
        this.tray = { items: [] };
        this.microwave = { mode: 'idle', remaining: 0 };
        this.revenue = 0;
        this.setStatusMessage('QA hot-food-natural：点击饭团 -> 微波炉 -> 完成订单 -> 收款', 'heat');
    }

    private prepareQaFlowSoldOutNeeded() {
        const customer = this.customers[0];
        this.activeCustomerIndex = 0;
        customer.order = [{ productId: 'snack-bag' }];
        customer.served = [];
        customer.pendingOutcome = undefined;
        customer.transitionRemaining = 0;
        customer.mood = 'waiting';
        customer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        customer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        this.stock['snack-bag'] = 0;
        this.economy.warehouseStock['snack-bag'] = 0;
        this.tray = { items: [] };
        this.microwave = { mode: 'idle', remaining: 0 };
        this.revenue = 0;
        this.setStatusMessage('QA sold-out-needed：当前订单商品售罄，验证库存后果', 'warning');
    }

    private prepareQaFlowHotReadySoldOut() {
        const customer = this.customers[0];
        this.activeCustomerIndex = 0;
        customer.order = [{ productId: 'rice-ball', heated: true }];
        customer.served = [];
        customer.pendingOutcome = undefined;
        customer.paymentAmount = undefined;
        customer.readyWindowRemaining = undefined;
        customer.transitionRemaining = 0;
        customer.reactionRemaining = 0;
        customer.mood = 'waiting';
        customer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        customer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        this.stock['rice-ball'] = 0;
        this.economy.warehouseStock['rice-ball'] = 0;
        this.tray = { items: [] };
        this.microwave = { mode: 'ready', remaining: 0, productId: 'rice-ball' };
        this.revenue = 0;
        this.missed = 0;
        this.soldOutMissed = 0;
        this.resolveUnfulfillableCustomers();
        this.setStatusMessage('QA hot-ready-sold-out：货架售罄但炉内热饭团可交付', 'heat');
    }

    private prepareQaFlowStockNoise() {
        this.prepareQaFlowFirstTestLive();
        this.stock['snack-bag'] = 0;
        this.stock['lemon-drink'] = 0;
        this.stock['strawberry-milk'] = 0;
        this.stock['star-candy'] = 0;
        this.economy.warehouseStock['snack-bag'] = 0;
        this.economy.warehouseStock['lemon-drink'] = 2;
        this.economy.warehouseStock['strawberry-milk'] = 0;
        this.economy.warehouseStock['star-candy'] = 2;
        this.setStatusMessage('QA stock-noise：多商品售罄 / 补货降噪视觉检查', 'warning');
    }

    private prepareQaFlowReadyWindowMixed() {
        const readyCustomer = this.customers[0];
        const dangerCustomer = this.customers[1];
        this.activeCustomerIndex = 0;
        this.tray = {
            customerId: readyCustomer.id,
            items: readyCustomer.order.map((item) => ({ ...item })),
        };
        readyCustomer.served = [];
        readyCustomer.pendingOutcome = undefined;
        readyCustomer.transitionRemaining = 0;
        readyCustomer.mood = 'waiting';
        readyCustomer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        readyCustomer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS * 0.72;
        readyCustomer.readyWindowRemaining = undefined;

        dangerCustomer.served = [];
        dangerCustomer.pendingOutcome = undefined;
        dangerCustomer.transitionRemaining = 0;
        dangerCustomer.mood = 'urgent';
        dangerCustomer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        dangerCustomer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS * 0.18;
        dangerCustomer.readyWindowRemaining = undefined;
        dangerCustomer.lowPatienceFxPlayed = true;
        this.revenue = 0;
        this.setStatusMessage('QA ready-window-mixed：左侧金币待收，右侧红耐心', 'warning');
    }

    private prepareQaFlowReadyWindowTimeout() {
        this.prepareQaFlowReadyPatienceTimeout();
    }

    private prepareQaFlowReadyPatienceTimeout() {
        const customer = this.customers[0];
        this.activeCustomerIndex = 0;
        const order: OrderItem[] = [{ productId: 'rice-ball' }];
        customer.order = order.map((item) => ({ ...item }));
        this.tray = {
            customerId: customer.id,
            items: order.map((item) => ({ ...item })),
        };
        customer.served = [];
        customer.pendingOutcome = undefined;
        customer.transitionRemaining = 0;
        customer.mood = 'urgent';
        customer.maxPatience = 20;
        customer.patience = 5;
        customer.readyWindowRemaining = undefined;
        customer.lowPatienceFxPlayed = true;
        this.revenue = 0;
        this.combo = 2;
        this.completed = 0;
        this.setStatusMessage('QA ready-patience-timeout：金币待收，耐心归零后自动慢收', 'warning');
    }

    private prepareQaFlowReadyCoin(order: OrderItem[], message: string, patienceRatio = 0.78) {
        const customer = this.customers[0];
        this.activeCustomerIndex = 0;
        customer.order = order.map((item) => ({ ...item }));
        customer.served = [];
        customer.pendingOutcome = undefined;
        customer.transitionRemaining = 0;
        customer.mood = 'waiting';
        customer.maxPatience = DIRECT_GAMEPLAY_PATIENCE_SECONDS;
        customer.patience = DIRECT_GAMEPLAY_PATIENCE_SECONDS * patienceRatio;
        customer.readyWindowRemaining = undefined;
        this.tray = {
            customerId: customer.id,
            items: order.map((item) => ({ ...item })),
        };
        this.revenue = 0;
        this.combo = 1;
        this.completed = 0;
        this.setStatusMessage(message, patienceRatio <= 0.3 ? 'warning' : 'success');
    }

    private prepareQaFlowPostShiftUpgrade() {
        this.home = false;
        this.preparing = false;
        this.ended = true;
        this.currentDay = 1;
        this.revenue = 561;
        this.goodsCost = 120;
        this.completed = 9;
        this.missed = 1;
        this.soldOutMissed = 0;
        this.roundRating = 4.3;
        this.reviewPoints = 34;
        this.reviewCount = 8;
        this.economy.wallet = Math.max(this.economy.wallet, 680);
        this.economy.lifetimeProfit = Math.max(this.economy.lifetimeProfit, 441);
        this.economy.reputation = Math.max(this.economy.reputation, 78);
        this.economy.nextStrategy = undefined;
        this.shopMessage = '本轮净利润 441 · 本轮达标';
        this.paymentBurst = undefined;
        this.toast = undefined;
    }

    private prepareRuntimeProbeBase() {
        const stockCap = getStockCap(Math.max(this.economy.shelfLevel, 1));
        this.home = false;
        this.preparing = false;
        this.ended = false;
        this.pauseMenuOpen = false;
        this.shiftRemaining = DIRECT_GAMEPLAY_SHIFT_REMAINING;
        this.economy.microwaveLevel = Math.max(this.economy.microwaveLevel, 1);
        for (const productId of PRODUCT_IDS) {
            if (!this.economy.unlockedProductIds.includes(productId)) {
                this.economy.unlockedProductIds.push(productId);
            }
            this.stock[productId] = Math.max(this.stock[productId], stockCap);
            this.economy.warehouseStock[productId] = Math.max(this.economy.warehouseStock[productId], stockCap);
        }
        this.customers = [
            this.createDirectGameplayCustomer(1, DIRECT_GAMEPLAY_ORDER, true),
            this.createDirectGameplayCustomer(2, DIRECT_GAMEPLAY_PREVIEW_ORDER, false, 'impatient'),
        ];
        this.nextCustomerId = 3;
        this.nextOrderIndex = 2;
        this.activeCustomerIndex = 0;
        this.revenue = 0;
        this.goodsCost = 0;
        this.combo = 0;
        this.completed = 0;
        this.missed = 0;
        this.reviewPoints = 0;
        this.reviewCount = 0;
        this.paymentBurst = undefined;
        this.errorFx = undefined;
        this.toast = undefined;
        this.microwave = { mode: 'idle', remaining: 0 };
        this.tray = { items: [] };
    }

    private prepareRuntimeProbePartial() {
        this.tray = {
            customerId: 1,
            items: [{ productId: 'rice-ball' }],
        };
        this.setStatusMessage('QA partial：订单气泡已有 1/3 商品，验证部分完成态层级', 'info');
    }

    private prepareRuntimeProbeHeating() {
        this.customers[0].order = [
            { productId: 'rice-ball', heated: true },
            { productId: 'snack-bag' },
        ];
        this.tray = {
            customerId: 1,
            items: [{ productId: 'snack-bag' }],
        };
        this.microwave = {
            mode: 'heating',
            remaining: this.qaFlowPreset === 'heating'
                ? 30
                : getProcessingSeconds('microwave', this.economy.microwaveLevel) * 0.58,
            customerId: 1,
            productId: 'rice-ball',
        };
        this.setStatusMessage('QA heating：饭团在微波炉加工，验证热食路径', 'heat');
    }

    private prepareRuntimeProbeMicrowaveReady() {
        this.customers[0].order = [
            { productId: 'rice-ball', heated: true },
            { productId: 'snack-bag' },
        ];
        this.tray = {
            customerId: 1,
            items: [{ productId: 'snack-bag' }],
        };
        this.microwave = {
            mode: 'ready',
            remaining: 0,
            customerId: 1,
            productId: 'rice-ball',
        };
        this.setStatusMessage('QA microwave-ready：微波炉完成，验证设备回填入口', 'success');
    }

    private prepareRuntimeProbePayment() {
        this.tray = {
            customerId: 1,
            items: DIRECT_GAMEPLAY_ORDER.map((item) => ({ ...item })),
        };
        const customer = this.customers[0];
        customer.served = DIRECT_GAMEPLAY_ORDER.map((item) => ({ ...item }));
        customer.mood = 'happy';
        customer.paymentAmount = 45;
        customer.pendingOutcome = 'completed';
        customer.transitionRemaining = this.getQaSnapshotMode() ? 999 : 0.85;
        this.revenue = 45;
        this.paymentBurst = { amount: 45, remaining: 0.72 };
        this.activeCustomerIndex = 1;
        this.setStatusMessage('QA payment：交付成功后收银反馈与 happy 顾客', 'success');
    }

    private prepareRuntimeProbeWaitingSwitch() {
        this.customers[0].showHint = false;
        this.customers[1].showHint = true;
        this.activeCustomerIndex = 1;
        this.tray = { items: [] };
        this.setStatusMessage('QA waiting-switch：右侧顾客为 current，验证 hands 跟随当前对象', 'info');
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

    private addFigmaSurface(
        parent: Node,
        name: string,
        rect: FigmaRect,
        radius: number,
        fill: Color,
        stroke?: Color,
        lineWidth = 0,
    ) {
        const surface = this.createFigmaNode(name, rect, parent);
        this.drawRect(surface, rect.width, rect.height, radius, fill, stroke, lineWidth);
        return surface;
    }

    private createFigmaNode(name: string, rect: FigmaRect, parent: Node) {
        const node = this.createNode(name, rect.width, rect.height, parent);
        node.setPosition(this.figmaCenterX(rect), this.figmaCenterY(rect), 0);
        return node;
    }

    private figmaCenterX(rect: FigmaRect) {
        return rect.x + rect.width / 2 - DESIGN_WIDTH / 2;
    }

    private figmaCenterY(rect: FigmaRect) {
        return DESIGN_HEIGHT / 2 - rect.y - rect.height / 2;
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
        const side = this.customers.findIndex((customer) => customer.id === customerId);
        return this.node.getChildByName(`Customer-${customerId}`)
            ?? (side >= 0 ? this.node.getChildByName(`FinalCustomerBody-${side}`) : undefined)
            ?? undefined;
    }

    private getRenderedOrderBubbleNode(customerId: number | undefined): Node | undefined {
        const side = this.customers.findIndex((customer) => customer.id === customerId);
        return (side >= 0 ? this.node.getChildByName(`FinalOrderBubble-${side}`) : undefined)
            ?? this.getRenderedCustomerNode(customerId)?.getChildByName('Order')
            ?? undefined;
    }

    private getRenderedOrderItemNode(customerId: number | undefined, productId: ProductId): Node | undefined {
        const side = this.customers.findIndex((customer) => customer.id === customerId);
        const customer = side >= 0 ? this.customers[side] : undefined;
        const orderIndex = customer?.order.findIndex((item) => item.productId === productId) ?? -1;
        return (side >= 0 && orderIndex >= 0
            ? this.node.getChildByName(`FinalOrderProduct-${side}-${orderIndex}`)
                ?? this.node.getChildByName(`FinalOrderSlot-${side}-${orderIndex}`)
            : undefined)
            ?? this.getRenderedOrderBubbleNode(customerId)?.getChildByName(`Order-${productId}`)
            ?? undefined;
    }

    private getRenderedProductNode(productId: ProductId): Node | undefined {
        return this.node.getChildByName(`Product-${productId}`)
            ?? this.node.getChildByName(`FinalProductHit-${productId}`)
            ?? this.node.getChildByName(`FinalProductCardArt-${productId}`)
            ?? this.node.getChildByName(`FinalProductCardFallback-${productId}`)
            ?? undefined;
    }

    private getMicrowaveNode(): Node | undefined {
        return this.node.getChildByName('FinalMicrowave')
            ?? this.node.getChildByName('FinalMicrowaveFallback')
            ?? this.node.getChildByName('WorkstationBand')?.getChildByName('Microwave')
            ?? undefined;
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
        const bubble = this.getRenderedOrderBubbleNode(customerId);
        if (bubble) {
            GameTweenFx.pulse(bubble, 0.035);
        }
        const product = this.getRenderedProductNode(productId);
        const target = item ?? bubble;
        if (product && target) {
            this.playProductFlyFx(productId, product, target);
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
        const finalPatience = customerId === undefined
            ? undefined
            : this.node.getChildByName(`FinalPatienceTrack-${customerId}`)
                ?? this.node.getChildByName(`FinalPatienceFill-${customerId}`);
        const patience = finalPatience ?? customer?.getChildByName('Order')?.getChildByName('Patience');
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
        const bubble = this.getRenderedOrderBubbleNode(this.microwave.customerId);
        if (bubble) {
            GameTweenFx.pulse(bubble, 0.035);
        }
        const item = this.microwave.productId
            ? this.getRenderedOrderItemNode(this.microwave.customerId, this.microwave.productId)
            : undefined;
        if (item) {
            GameTweenFx.flash(item);
        }
    }

    private playMicrowaveToTrayFx(productId: ProductId, customerId: number | undefined) {
        const microwave = this.getMicrowaveNode();
        const item = this.getRenderedOrderItemNode(customerId, productId);
        const bubble = this.getRenderedOrderBubbleNode(customerId);
        const target = item ?? bubble;
        if (microwave) {
            GameTweenFx.pop(microwave, 0.04);
        }
        if (target) {
            GameTweenFx.pulse(target, 0.035);
        }
        if (microwave && target) {
            this.playProductFlyFx(productId, microwave, target);
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

    private shakeOrderBubble(customerId: number | undefined) {
        const bubble = this.getRenderedOrderBubbleNode(customerId);
        if (bubble) {
            this.shake(bubble);
        }
    }

    private stopTouchPropagation(event: { stopPropagation?: () => void; propagationStopped?: boolean } | undefined) {
        if (event) {
            event.stopPropagation?.();
            event.propagationStopped = true;
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
