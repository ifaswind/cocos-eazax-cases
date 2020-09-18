import PopupManager from "../eazax-ccc/core/PopupManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClickToShowRes extends cc.Component {

    @property({ type: [cc.String] })
    private names: string[] = [];

    @property({ type: [cc.String] })
    public urls: string[] = [];

    protected onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        let options = { items: [] };
        for (let i = 0; i < this.urls.length; i++) {
            options.items.push({ name: this.names[i], url: this.urls[i] });
        }
        PopupManager.show('prefabs/resPopup', options);
    }

}