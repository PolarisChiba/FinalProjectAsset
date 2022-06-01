// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    X: number = 0;

    @property
    Y: number = 0;

    @property(cc.Node)
    Background: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.GetPos, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.RemoveMove, this);
    }

    // update (dt) {}

    GetPos(event: any) {
        console.log(event.getButton())
        if (event.getButton() == cc.Event.EventMouse.BUTTON_MIDDLE) {
            this.X = event.getLocationX() + this.node.x;
            this.Y = event.getLocationY() + this.node.y;
            console.log(this.X, this.Y)
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
        }
    }

    MoveView(event: any) {
        this.node.setPosition(this.X - event.getLocationX(), this.Y - event.getLocationY());
        if (this.node.x > this.Background.width - 1200)
            this.node.x = this.Background.width - 1200;
        if (this.node.x < 0)
            this.node.x = 0;
        if (this.node.y > this.Background.height - 700)
            this.node.y = this.Background.height - 700;
        if (this.node.y < 0)
            this.node.y = 0;
    }

    RemoveMove() {
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
    }
}
