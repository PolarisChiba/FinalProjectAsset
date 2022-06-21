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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.SignUp, this);
    }

    // update (dt : number) {}

    SignUp (event: any) {
        firebase.auth().createUserWithEmailAndPassword(this.email.string, this.password.string)
        .then((e : any) => {
            firebase.database().ref("Account/" + e.user.uid).set({
                win: 0,
                lose: 0,
                killnum: 0,
                photo: null
            });
            cc.director.loadScene("Room");
        })
        .catch((e: any) => {
            this.error.string = e.message;
            this.email.string = "";
            this.password.string = "";
        });
    }
}

