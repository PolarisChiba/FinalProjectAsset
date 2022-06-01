// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    email: cc.Label = null;

    @property(cc.Label)
    password: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.SignUp, this);
    }

    // update (dt : number) {}

    SignUp (event: any) {
        firebase.auth().createUserWithEmailAndPassword(this.email.string, this.password.string)
        .then((e : any) => {
            cc.director.loadScene("Room");
        });
    }
}

