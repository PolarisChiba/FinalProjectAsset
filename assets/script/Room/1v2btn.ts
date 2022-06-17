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

    @property
    MapName: any = null;

    @property(cc.Label)
    error: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.MapName = "Fall";
        // this map has not been created yet
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.Pushed, this);
    }

    // update (dt: number) {}

    Pushed (event: any) {
        if (this.WaitingBtn.node.active == false) {
            this.WaitingBtn.node.active = true;
            this.Apply();
        }
    }

    Apply() {
        let user = firebase.auth().currentUser;
        let room = null;
        let room_id = null;
        let players = null;
        

        firebase.database().ref("Room/").orderByChild('state').equalTo("wait").once("value", data => {
            room = data.val();
            
            let ok = false;
            if (room != null) {
                for (let i = 0; i < Object.keys(room).length; i ++ ) {
                    if (room[Object.keys(room)[i]].mapname == this.MapName) {
                        ok = true;
                        room_id = Object.keys(room)[i];
                    }
                }
            }

            if (room == null || ok == false) {
                room_id = firebase.database().ref("Room/").push().getKey();
                firebase.database().ref("Room/" + room_id + "/").set({
                    mapname: this.MapName,
                    state: "wait"
                });
                let res = {}
                res[user.uid] = user.email;
                firebase.database().ref("Room/" + room_id + "/player/").set(res);
            } else {
                let res = {}
                res[user.uid] = user.email;

                firebase.database().ref("Room/" + room_id + "/player/").update(res);
                firebase.database().ref("Map/" + this.MapName + "/number").once("value", (data) => {
                    if (data.val() == null) {
                        this.error.string = "This map is not created yet";
                    } else {
                        players = room[room_id].player;
                        if (Object.keys(players).length == data.val() - 1) {
                            let tmp = [];
                            for (let i in Object.keys(players)) {
                                tmp.push(Object.keys(players)[i]);
                            }
                            tmp.push(user.uid);
                            for (let i = 0; i < tmp.length; ++ i) {
                                console.log(tmp[i], i);
                                firebase.database().ref("Room/" + room_id + "/authority/" + tmp[i]).set(i);
                            }
                            firebase.database().ref("Room/" + room_id + "/server/").set(user.email);
                            firebase.database().ref("Room/" + room_id + "/turn/").set(0);
                            firebase.database().ref("Map/" + this.MapName).once("value", data => {
                                firebase.database().ref("Room/" + room_id + "/map/").set(data.val());
                            })
                            firebase.database().ref("Room/" + room_id + "/state/").set("battle");
                        }
                    }
                })
                
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