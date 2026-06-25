import {
    Color,
    Graphics,
    Label,
    Node,
    Tween,
    tween,
    UIOpacity,
    UITransform,
    Vec3,
} from 'cc';

const WHITE = new Color(255, 255, 255);
const GOLD = new Color(255, 194, 71);
const DARK = new Color(51, 33, 62);
const GREEN = new Color(103, 199, 165);
const RED = new Color(255, 98, 84);

export class GameTweenFx {
    static pop(node: Node, amount = 0.1) {
        if (!node?.isValid) {
            return;
        }
        Tween.stopAllByTarget(node);
        const baseScale = node.scale.clone();
        const peak = new Vec3(baseScale.x * (1 + amount), baseScale.y * (1 + amount), baseScale.z);
        tween(node)
            .to(0.08, { scale: peak }, { easing: 'backOut' })
            .to(0.12, { scale: baseScale }, { easing: 'sineOut' })
            .start();
    }

    static shake(node: Node, distance = 10) {
        if (!node?.isValid) {
            return;
        }
        Tween.stopAllByTarget(node);
        const start = node.position.clone();
        tween(node)
            .to(0.045, { position: new Vec3(start.x - distance, start.y, start.z) })
            .to(0.045, { position: new Vec3(start.x + distance, start.y, start.z) })
            .to(0.045, { position: new Vec3(start.x - distance * 0.45, start.y, start.z) })
            .to(0.06, { position: start }, { easing: 'sineOut' })
            .start();
    }

    static pulse(node: Node, amount = 0.06) {
        if (!node?.isValid) {
            return;
        }
        const baseScale = node.scale.clone();
        const high = new Vec3(baseScale.x * (1 + amount), baseScale.y * (1 + amount), baseScale.z);
        tween(node)
            .to(0.16, { scale: high }, { easing: 'sineOut' })
            .to(0.18, { scale: baseScale }, { easing: 'sineInOut' })
            .start();
    }

    static flash(node: Node) {
        if (!node?.isValid) {
            return;
        }
        const opacity = this.ensureOpacity(node);
        Tween.stopAllByTarget(opacity);
        opacity.opacity = 255;
        tween(opacity)
            .to(0.08, { opacity: 150 })
            .to(0.12, { opacity: 255 })
            .start();
    }

    static flyTo(node: Node, targetWorldPos: Vec3, duration = 0.36) {
        if (!node?.isValid) {
            return;
        }
        const start = node.worldPosition.clone();
        const state = { progress: 0 };
        Tween.stopAllByTarget(node);
        tween(state)
            .to(duration, { progress: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    if (!node.isValid) {
                        return;
                    }
                    const next = Vec3.lerp(new Vec3(), start, targetWorldPos, state.progress);
                    const arc = Math.sin(state.progress * Math.PI) * 44;
                    next.y += arc;
                    node.setWorldPosition(next);
                },
            })
            .call(() => {
                if (node.isValid) {
                    node.setWorldPosition(targetWorldPos);
                }
            })
            .start();
    }

    static floatText(parent: Node, text: string, position: Vec3, color = GOLD) {
        if (!parent?.isValid) {
            return undefined;
        }
        const root = this.createFxNode(parent, 'FloatTextFx', 150, 52);
        root.setPosition(position);
        const label = root.addComponent(Label);
        label.string = text;
        label.fontSize = 28;
        label.lineHeight = 34;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.isBold = true;
        const opacity = root.addComponent(UIOpacity);
        opacity.opacity = 255;
        const end = new Vec3(position.x, position.y + 58, position.z);
        tween(root)
            .to(0.52, { position: end }, { easing: 'quadOut' })
            .start();
        tween(opacity)
            .delay(0.18)
            .to(0.34, { opacity: 0 })
            .call(() => root.isValid && root.destroy())
            .start();
        return root;
    }

    static coinFly(startWorldPos: Vec3, endWorldPos: Vec3, parent?: Node) {
        if (!parent?.isValid) {
            return undefined;
        }
        const coin = this.createFxNode(parent, 'CoinFlyFx', 34, 34);
        coin.setWorldPosition(startWorldPos);
        this.drawDisc(coin, 17, GOLD, WHITE, 3);
        const label = this.createFxNode(coin, 'CoinFlyFxLabel', 28, 28);
        const text = label.addComponent(Label);
        text.string = '$';
        text.fontSize = 21;
        text.lineHeight = 26;
        text.color = DARK;
        text.horizontalAlign = Label.HorizontalAlign.CENTER;
        text.verticalAlign = Label.VerticalAlign.CENTER;
        text.isBold = true;
        const opacity = coin.addComponent(UIOpacity);
        opacity.opacity = 255;
        this.flyTo(coin, endWorldPos, 0.42);
        tween(coin)
            .to(0.42, { scale: new Vec3(0.72, 0.72, 1) }, { easing: 'quadOut' })
            .call(() => coin.isValid && coin.destroy())
            .start();
        tween(opacity)
            .delay(0.22)
            .to(0.2, { opacity: 0 })
            .start();
        return coin;
    }

    static progressPulse(node: Node) {
        if (!node?.isValid) {
            return;
        }
        const baseScale = node.scale.clone();
        const high = new Vec3(baseScale.x * 1.04, baseScale.y * 1.16, baseScale.z);
        tween(node)
            .to(0.14, { scale: high }, { easing: 'sineOut' })
            .to(0.18, { scale: baseScale }, { easing: 'sineInOut' })
            .start();
        this.flash(node);
    }

    static customerHappy(node: Node) {
        if (!node?.isValid) {
            return;
        }
        const basePosition = node.position.clone();
        const baseScale = node.scale.clone();
        const highScale = new Vec3(baseScale.x * 1.08, baseScale.y * 1.08, baseScale.z);
        Tween.stopAllByTarget(node);
        tween(node)
            .to(0.08, {
                position: new Vec3(basePosition.x, basePosition.y + 14, basePosition.z),
                scale: highScale,
            }, { easing: 'backOut' })
            .to(0.16, {
                position: basePosition,
                scale: baseScale,
            }, { easing: 'bounceOut' })
            .start();
    }

    static customerAngry(node: Node) {
        if (!node?.isValid) {
            return;
        }
        this.shake(node, 8);
        this.flash(node);
    }

    private static ensureOpacity(node: Node) {
        return node.getComponent(UIOpacity) ?? node.addComponent(UIOpacity);
    }

    private static createFxNode(parent: Node, name: string, width: number, height: number) {
        const node = new Node(name);
        node.layer = parent.layer;
        node.addComponent(UITransform).setContentSize(width, height);
        parent.addChild(node);
        return node;
    }

    private static drawDisc(node: Node, radius: number, fill: Color, stroke?: Color, lineWidth = 0) {
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = fill;
        graphics.circle(0, 0, radius);
        graphics.fill();
        if (stroke && lineWidth > 0) {
            graphics.lineWidth = lineWidth;
            graphics.strokeColor = stroke;
            graphics.circle(0, 0, radius);
            graphics.stroke();
        }
    }
}
