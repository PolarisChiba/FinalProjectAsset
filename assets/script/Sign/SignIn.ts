// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    email: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    @property(cc.Label)
    error: cc.Label = null;

    @property
    BGM: any = null;

    @property(cc.AudioClip)
    overture: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.BGM = cc.audioEngine.play(this.overture, true, 1);
    }

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.SignIn, this);
    }

    // update (dt : number) {}

    SignIn (event: any) {
        firebase.auth().signInWithEmailAndPassword(this.email.string, this.password.string)
        .then((e : any) => {
            cc.director.loadScene("Room");
        })
        .catch((e: any) => {
            this.error.string = e.message;
            this.email.string = "";
            this.password.string = "";
        });
    }
}

