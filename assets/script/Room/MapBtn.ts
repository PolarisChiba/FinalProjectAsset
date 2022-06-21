// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    WaitingBtn: cc.Button = null;

    @property(cc.Node)
    MapNameEditBox: cc.Node = null;

    @property(cc.Label)
    MapNameBox: cc.Label = null;

    @property
    MapName: any = null;

    @property(cc.Button)
    okBtn: cc.Button = null;

    @property(cc.Label)
    error: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:


    start () {
        this.MapNameEditBox.active = false;
        this.okBtn.node.active = false;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.Pushed, this);
        this.okBtn.node.on("click", this.LoadMaps, this);
    }

    // update (dt : number) {}
    Pushed (event: any) {
        if (this.WaitingBtn.node.active == false) {
            this.MapNameEditBox.active = true;
            this.okBtn.node.active = true;
        }
    }

    LoadMaps (event: any) {
        this.MapName = this.MapNameBox.string;
        firebase.database().ref("Map/" + this.MapName).once("value", data => {
            if (data.val() != null) {
                firebase.database().ref('loadmaps/').set({
                    map: this.MapName
                });
                cc.director.loadScene("Maps");
            } else {
                this.error.string = "Can't find this map";
            }
            this.MapNameEditBox.active = false;
            this.okBtn.node.active = false;
        })
        
    }
}