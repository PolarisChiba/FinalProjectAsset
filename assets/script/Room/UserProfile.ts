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
    user: any = null;

    @property(cc.Label)
    email: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Label)
    lose: cc.Label = null;

    @property(cc.Label)
    killnum: cc.Label = null;

    @property(cc.Label)
    error: cc.Label = null;

    @property(cc.Sprite)
    photo: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.user = firebase.auth().currentUser;
        firebase.database().ref("Account/" + this.user.uid).once("value", data => {
            this.email.string = this.user.email;
            this.win.string = data.val().win;
            this.lose.string = data.val().lose;
            this.killnum.string = data.val().killnum;
        })
        .catch((e: any) => {
            this.error.string = e.message;
        })

        this.photo.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            // I can't...
        }, this)
    }

    // update (dt) {}
}
