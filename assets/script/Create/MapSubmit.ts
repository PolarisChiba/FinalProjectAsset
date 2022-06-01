// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Layout)
    GridForm: cc.Layout = null;

    @property(cc.EditBox)
    MapName: cc.EditBox = null;

    @property(cc.EditBox)
    MapWidth: cc.EditBox = null;

    @property(cc.EditBox)
    MapHeight: cc.EditBox = null;

    @property(cc.EditBox)
    PlayerNumber: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.Submit, this);
    }

    // update (dt) {}

    Submit(event: any) {
        this.MapName.enabled = false;
        this.MapWidth.enabled = false;
        this.MapHeight.enabled = false;
        this.PlayerNumber.enabled = false;
        this.node.active = false;
        this.GridForm.node.active = true;
        
        firebase.database().ref("Map/" + this.MapName.string + "/").set({
            width: this.MapWidth.string,
            height: this.MapHeight.string,
            number: this.PlayerNumber.string
        });
    }
}
