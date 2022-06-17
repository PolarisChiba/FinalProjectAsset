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
    waiting_time: cc.Label = null;

    @property
    time: number = 0;

    @property
    Counter: any = null;

    @property
    flag: boolean = false;

    @property(cc.Button)
    Btn1v1: cc.Button = null;

    @property(cc.Button)
    Btn1v2: cc.Button = null;

    @property(cc.Button)
    BtnPrivate: cc.Button = null;

    @property(cc.Button)
    BtnCreate: cc.Button = null;

    @property(cc.Button)
    BtnResetAll: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.flag = false;
        this.node.active = false;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.CancelWaiting, this);
        this.BtnResetAll.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.time = 0;
            this.flag = false;
            this.Btn1v1.interactable = true;
            this.Btn1v2.interactable = true;
            this.BtnPrivate.interactable = true;
            this.BtnCreate.interactable = true;
            this.waiting_time.string = "Waiting...";
            this.node.active = false;
            firebase.database().ref("Room/").orderByChild("state").equalTo("wait").once("value", data => {
                if (data.val() != null) {
                    for (let i = 0; i < Object.keys(data.val()).length; i ++ ) {
                        let room_id = Object.keys(data.val())[i];
                        console.log(room_id)
                        firebase.database().ref("Room/" + room_id).remove();
                    }
                }
            })
        }, this);
        this.Counter = () => {
            if (this.node.active == false) {
                this.unschedule(this.Counter);
            }
            this.time = this.time + 1;
            this.waiting_time.string = "Waiting..." + this.time.toString();
        }
    }

    update (dt: number) {
        if (this.node.active == true && this.flag == false) {
            this.Btn1v1.interactable = false;
            this.Btn1v2.interactable = false;
            this.BtnPrivate.interactable = false;
            this.BtnCreate.interactable = false;
            this.flag = true;
            this.schedule(this.Counter, 1);
        }
    }

    CancelWaiting() {
        this.time = 0;
        this.flag = false;
        this.Btn1v1.interactable = true;
        this.Btn1v2.interactable = true;
        this.BtnPrivate.interactable = true;
        this.BtnCreate.interactable = true;
        this.waiting_time.string = "Waiting...";
        this.node.active = false;

        let user = firebase.auth().currentUser;
        let res = {};
        res[user.uid] = user.email;
        let room_id = null;
        let players = null;
        firebase.database().ref("Room/").orderByChild("player/" + user.uid).equalTo(user.email).once("value", data => {
            room_id = Object.keys(data.val())[0];
            players = data.val()[room_id].player;
        }).then(() => {
            if (Object.keys(players).length > 1) {
                firebase.database().ref("Room/" + room_id + "/player/" + user.uid).remove();
            } else {
                firebase.database().ref("Room/" + room_id).remove();
            }
            firebase.database().ref("Room/" + room_id).off();
        })
    }

}
