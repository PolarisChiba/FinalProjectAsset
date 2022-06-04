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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.Pushed, this);
    }

    // update (dt: number) {}

    Pushed (event: any) {
        if (this.WaitingBtn.node.active == false) {
            this.WaitingBtn.node.active = true;
            this.Apply1v1();
        }
    }

    Apply1v1() {
        let user = firebase.auth().currentUser;
        let room = null;
        let room_id = null;
        let players = null;
        firebase.database().ref("Room/").orderByChild('state').equalTo("wait").once("value", data => {
            room = data.val();
        }).then(() => {
            if (room == null) {
                room_id = firebase.database().ref("Room/").push().getKey();
                firebase.database().ref("Room/" + room_id + "/").set({
                    type: "1v1",
                    mapname: "Rwar",
                    state: "wait"
                });
                let res = {}
                res[user.uid] = user.email;
                firebase.database().ref("Room/" + room_id + "/player/").set(res);
            } else {
                room_id = Object.keys(room)[0];
                let res = {}
                res[user.uid] = user.email;

                firebase.database().ref("Room/" + room_id + "/player/").update(res).then(() => {
                    players = room[room_id].player;
                    if (Object.keys(players).length == 1) {
                        let tmp = [];
                        for (let i in Object.keys(players)) {
                            tmp.push(Object.keys(players)[i]);
                        }
                        tmp.push(Object.keys(res)[0]);
                        for (let i = 0; i < 2; ++ i) {
                            firebase.database().ref("Room/" + room_id + "/authority/" + tmp[i]).set(i);
                        }
                        firebase.database().ref("Room/" + room_id + "/server/").set(user.email);
                        firebase.database().ref("Room/" + room_id + "/turn/").set(0);
                        firebase.database().ref("Map/" + "Rwar/").once("value", data => {
                            firebase.database().ref("Room/" + room_id + "/map/").set(data.val());
                        })
                    }
                }).then(() => {
                    firebase.database().ref("Room/" + room_id + "/state/").set("battle");
                });
            }

            firebase.database().ref("Room/" + room_id + "/state/").on("value", (data: any) => {
                if (data.val() == "battle") {
                    firebase.database().ref("Player/" + user.uid + "/room_id/").set(room_id).then(() => {
                        cc.director.loadScene("Game");
                    });
                }
            })
        })
    }
}

// The room stored in firebase won't be removed after player just close the window.