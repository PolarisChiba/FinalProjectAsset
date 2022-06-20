// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:


    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.SignOut, this);
    }

    // update (dt : number) {}

    SignOut (event: any) {
        firebase.auth().signOut()
        .then((e : any) => {
            cc.director.loadScene("Sign");
        })
        .catch((e: any) => {
        });
    }
}

