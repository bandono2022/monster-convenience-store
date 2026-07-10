# P1 Drag Service Interaction Brief

Date: 2026-07-03

Target page: Cocos runtime gameplay page matching
`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`.

## Owner / Brief / Review / Record

- Owner: Product owns the player-facing drag service rules and acceptance criteria.
- Owner: Development/testing owns the smallest Cocos runtime probe path, touch safety, screenshots, and regression risk.
- Owner: Art/UI owns low-fi drag feedback direction and later final asset brief quality.
- Brief: freeze P1-003 current customer selection cue while drag-to-serve is explored. Define the smallest drag service loop before code.
- Review: Product checks whether drag improves the "busy but readable" service loop; Art/UI checks whether feedback protects orders, products, and equipment; Development/testing checks whether implementation can reuse existing state rules without broad rewrite.
- Record: this file, `docs/LOCAL_TASK_BOARD.md`, and `docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`.

## Product Hypothesis

Dragging should make the service verb more physical:

- The player drags a product toward the exact order item that needs it.
- The target customer is inferred from the drop target, not from a current selection mode.
- Heated food is a product preparation state, not a customer-owned process.
- The player can preheat a rice ball first, then give the heated rice ball to whichever customer needs the heated version.
- Cold rice ball and heated rice ball are distinct demand states. A customer may ask for cold rice ball or heated rice ball.
- The player should always know: what am I holding, where can it go, and why did it fail?

This is a probe, not a final direction. Existing tap controls should remain available until drag is proven.

## Minimal Player Verbs

### 1. Drag Normal Product To Matching Order

Player action:

- Drag a product card, such as snack bag or cold rice ball, onto a matching order item slot or that customer's order bubble.

Expected result:

- Stock is consumed only on valid drop.
- The item is added to that customer's prepared order state.
- The order item shows the existing partial / ready cue.
- `activeCustomerIndex` may be updated for compatibility, but drop target, not selection, decides the customer.

### 2. Drag Wrong Product To Order

Player action:

- Drag a product that the target customer does not need, or drag to the wrong customer's order.

Expected result:

- No stock is consumed.
- No item is added to tray / served state.
- The target order slot / bubble shows low-fi error feedback.
- Customer patience and combo penalty should reuse the existing wrong-product rule unless Product later changes it.

### 3. Drag Heat-Capable Product To Microwave

Player action:

- Drag rice ball or another heat-capable product onto the microwave.

Expected result:

- If microwave is unlocked and idle, stock is consumed and microwave starts processing that product.
- The microwave owns the in-progress / ready prepared item, not a customer order.
- The player may preheat before deciding which customer receives it.
- Microwave receives visual attention.
- If microwave is busy, no stock is consumed and the microwave shows occupied feedback.

Rejected old assumption:

- Do not require dragging heat food to a customer order first. Dragging to the microwave is the intended mental model.

### 4. Drag Microwave Ready Item Back To Matching Order

Player action:

- When microwave is ready, drag the heated item from the microwave to a matching heated order slot / bubble.

Expected result:

- The heated item is added to that customer's prepared order state.
- Microwave returns to idle.
- If the order is complete, READY window behavior stays as P1-001 defined.
- Dropping heated rice ball onto a cold rice ball request is invalid.
- Dropping heated rice ball onto a customer who does not need it is invalid.
- Invalid drops do not clear the microwave.

### 5. Complete Order

Probe recommendation:

- Keep current READY bubble tap-to-deliver for the first drag probe.
- Do not add drag READY-to-cashier in the first implementation round unless Product explicitly asks.

Reason:

- The first question is whether product / microwave drag improves service clarity. Dragging completed orders to cashier is a second interaction question.

## Low-Fi Art/UI Direction

No final art and no image generation in the probe.

Use runtime cues only:

- Drag ghost: duplicate product icon, slightly above the finger so the finger does not cover it.
- Valid order target: soft green / gold rim around the matching order slot or bubble.
- Heat route target: warm rim on the microwave when dragging a heat-capable product.
- Heated-ready target: warm / gold rim only on order slots that request the heated version.
- Microwave ready source: small gold glow around microwave while it contains a ready heated item.
- Invalid target: red shake / rim, no text inside the slot.
- Drop success: reuse existing fly / pop / flash feedback where possible.

Do not:

- Add a current-customer glow for P1-003.
- Add final art assets.
- Add permanent instructional text over the playfield.
- Cover product icons, READY badge, order check badge, or patience bars.

## Development / Testing Implementation Shape

Smallest safe path:

- Keep current tap handlers as fallback.
- Add drag input as an adapter around existing rules.
- Extract target-aware helpers instead of rewriting gameplay rules.

Likely helper split:

- `attemptAddProductToCustomer(customer, productId, feedbackX, feedbackY)`
- `attemptStartMicrowaveProduct(productId, feedbackX, feedbackY)`
- `attemptAddMicrowaveReadyToCustomer(customer, feedbackX, feedbackY)`
- `attemptDeliverPreparedOrder(customerId, feedbackX, feedbackY)` already exists and can stay.

Likely drag state:

- `kind`: `product` or `microwave-ready`
- `productId`
- `prepared`: `cold` or `heated`
- `sourceNode`
- `startPoint`
- `currentPoint`
- `hoverTarget`
- `hasMovedPastTapThreshold`

Input rules:

- Use `TOUCH_START`, `TOUCH_MOVE`, `TOUCH_END`, and `TOUCH_CANCEL`.
- Keep an 8-12 px movement threshold so simple taps still work.
- Hit-test order item slots before whole order bubbles.
- Hit-test microwave as source only when mode is `ready`.
- Hit-test microwave as target when dragging a heat-capable cold product.
- Clear drag state on cancel, scene rerender, customer completion, or pause.

State safety:

- Consume stock only after a valid drop.
- The first probe may keep one microwave slot. It does not need stacked preheat inventory.
- Microwave ready state should store prepared product identity, but not customer ownership.
- Do not change revenue, combo, READY window, or patience rules in the first probe.
- Do not change final art namespace.
- Do not remove existing QA presets.

## Acceptance For First Probe

Must have 390x844 screenshot / QA evidence for:

- Drag normal product to correct order target.
- Drag wrong product to order target.
- Drag heat-capable product to microwave and start heating.
- Drag microwave-ready heated product to matching heated order target.
- Drag microwave-ready heated product to cold / wrong order target and keep microwave ready.

Must verify:

- Tap fallback still works.
- Existing P1-001 READY low-reward window still works.
- Existing P1-002.1 order item state cues still appear.
- No visible UI overlap from the drag ghost on 390x844.

## Open Product Questions

- Should wrong drag penalize patience exactly like wrong tap, or should it be softer during early tutorial days?
- Should completed READY orders eventually be dragged to cashier / customer, or is tap-to-deliver acceptable?
- How should UI distinguish cold rice ball request from heated rice ball request before final art exists?
- Should a heated-ready product dropped on a whole order bubble auto-pick the matching heated slot, or require precise slot drop?
- Should later versions allow multiple preheated items / a holding tray, or keep one microwave output slot for P1?
- Should dragging be mandatory, or remain a parallel advanced input with tap fallback?

## Recommendation

Next implementation round should be a probe, not a full system:

- Add target-aware helper methods.
- Add drag state and ghost for product cards.
- Support product-to-order, product-to-microwave, and microwave-ready-to-order only.
- Keep READY delivery as tap.
- Capture the five acceptance states above.
