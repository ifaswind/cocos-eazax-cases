import ImageUtil from "../../../eazax-ccc/utils/ImageUtil";
import NodeUtil from "../../../eazax-ccc/utils/NodeUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Case_RuntimeTrimming extends cc.Component {

    @property(cc.Node)
    protected reference: cc.Node = null;

    @property(cc.Node)
    protected target: cc.Node = null;

    @property(cc.Texture2D)
    protected texture: cc.Texture2D = null;

    @property(cc.Label)
    protected label: cc.Label = null;

    protected onLoad() {
        this.registerEvent();
    }

    protected start() {
        this.test();
    }

    /**
     * 订阅事件
     */
    protected registerEvent() {
        this.target.on(cc.Node.EventType.TOUCH_END, this.onTargetClick, this);
    }

    /**
     * 点击回调
     * @param event 
     */
    protected onTargetClick(event: cc.Event.EventTouch) {
        this.trim(event.target);
    }

    /**
     * 初始化
     */
    protected init() {
        this.label.string = `点击上方右侧图像进行剪裁 👆`;
    }

    /**
     * 剪裁
     * @param node 
     */
    protected trim(node: cc.Node) {
        // 获取剪裁信息
        const pixelsData = NodeUtil.getPixelsData(node),
            trimInfo = ImageUtil.getTrim(pixelsData, node.width, node.height);

        // 精灵组件
        const sprite = node.getComponent(cc.Sprite);
        cc.log(sprite.spriteFrame);
        cc.log(sprite.spriteFrame.getOriginalSize());
        cc.log(sprite.spriteFrame.getRect());

        // 展示剪裁信息
        const originalSize = sprite.spriteFrame.getOriginalSize();
        this.label.string = `裁剪信息：\n`;
        this.label.string += `    - 左：${trimInfo.minX}\n`;
        this.label.string += `    - 右：${originalSize.width - trimInfo.maxX}\n`;
        this.label.string += `    - 上：${trimInfo.minY}\n`;
        this.label.string += `    - 下：${originalSize.height - trimInfo.maxY}\n`;
        this.label.string += `裁剪后宽度：${trimInfo.maxX - trimInfo.minX}\n`;
        this.label.string += `裁剪后高度：${trimInfo.maxY - trimInfo.minY}`;

        // 组装 rect
        const min = cc.v2(trimInfo.minX, trimInfo.minY),
            max = cc.v2(trimInfo.maxX, trimInfo.maxY),
            newRect = cc.Rect.fromMinMax(min, max);

        console.log(`原 rect：${sprite.spriteFrame.getRect()}`);
        console.log(`新 rect：${newRect}`);

        console.log(`新 rect：${newRect}`);

        // 设置精灵镇
        sprite.spriteFrame.setRect(newRect);
        sprite.trim = true;
        sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
    }

    protected test() {
        console.log('');

        console.log('---------- NodeUtil.getPixelsData() ----------');
        console.time('NodeUtil.getPixelsData()');
        const data1 = NodeUtil.getPixelsData(this.target);
        console.timeEnd('NodeUtil.getPixelsData()');
        const trim1 = ImageUtil.getTrim(data1, this.target.width, this.target.height);
        console.log(trim1);
        console.log(`裁剪信息：`);
        console.log(`    - 左：${trim1.minX}`);
        console.log(`    - 右：${this.target.width - trim1.maxX}`);
        console.log(`    - 上：${trim1.minY}`);
        console.log(`    - 下：${this.target.height - trim1.maxY}`);
        console.log(`裁剪后宽度：${trim1.maxX - trim1.minX}`);
        console.log(`裁剪后高度：${trim1.maxY - trim1.minY}`);

        console.log('');

        console.log('---------- ImageUtil.getPixelsData() ----------');
        console.time('ImageUtil.getPixelsData()');
        const data2 = ImageUtil.getPixelsData(this.texture);
        console.timeEnd('ImageUtil.getPixelsData()');
        const trim2 = ImageUtil.getTrim(data2, this.texture.width, this.texture.height);
        console.log(this.texture);
        console.log(trim2);
        console.log(`裁剪信息：`);
        console.log(`    - 左：${trim2.minX}`);
        console.log(`    - 右：${this.texture.width - trim2.maxX}`);
        console.log(`    - 上：${trim2.minY}`);
        console.log(`    - 下：${this.texture.height - trim2.maxY}`);
        console.log(`裁剪后宽度：${trim2.maxX - trim2.minX}`);
        console.log(`裁剪后高度：${trim2.maxY - trim2.minY}`);

        console.log('');
    }

}
