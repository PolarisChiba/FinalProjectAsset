// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
const BadgeFadeTime = 2;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    Badge: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Badge.node.runAction(cc.fadeOut(BadgeFadeTime));
    }

    start () {
        this.scheduleOnce(() => {
            this.node.opacity = 255;
        }, BadgeFadeTime);
    }

    // update (dt) {}
}
