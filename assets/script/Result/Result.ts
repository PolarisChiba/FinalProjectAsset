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
    Email: cc.Label = null;

    @property(cc.Label)
    KillNum: cc.Label = null;

    @property(cc.Label)
    Result: cc.Label = null;

    @property(cc.Button)
    Back: cc.Button = null;

    /*
    @property(cc.Sprite)
    Aim: cc.Sprite = null;

    @property(cc.Sprite)
    Break: cc.Sprite = null;
    */

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {
        let user = firebase.auth().currentUser;

        this.Email.string = user.email;
        firebase.database().ref("Account/" + user.uid).once("value", data => {
            this.KillNum.string = data.val().result.num;
            this.Result.string = (data.val().result.end == true ? "Win" : "Lose"); 

            firebase.database().ref("Account/" + user.uid + "/killnum").set(data.val().result.num + data.val().killnum);
            if (data.val().result.end == true)
                firebase.database().ref("Account/" + user.uid + "/win").set(1 + data.val().win);
            else
                firebase.database().ref("Account/" + user.uid + "/lose").set(1 + data.val().lose);
        })
        /*
        this.scheduleOnce(() => {
            this.Aim.node.runAction(cc.moveTo(1, 0, 0));
        }, 1);
        this.scheduleOnce(() => {
            this.Aim.node.opacity = 0;
            this.Break.node.opacity = 255;
        }, 2.3);
        */
        this.scheduleOnce(() => {
            this.Email.node.runAction(cc.fadeIn(1));
        }, 3);
        this.scheduleOnce(() => {
            this.KillNum.node.runAction(cc.fadeIn(1));
        }, 4);
        this.scheduleOnce(() => {
            this.Result.node.runAction(cc.fadeIn(1));
        }, 5);
        this.Back.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            firebase.database().ref("Player/" + user.uid).once("value", data => {
                firebase.database().ref("Room/" + data.val()).remove();
            });
            this.node.runAction(cc.fadeOut(3));
            this.scheduleOnce(() => {
                cc.director.loadScene("Room");
            }, 4);
        }, this);
    }

    // update (dt) {}
}
