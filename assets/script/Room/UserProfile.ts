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

    @property(cc.EditBox)
    PhotoUrl: cc.EditBox = null;

    @property(cc.Button)
    okBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.PhotoUrl.node.active = false;
        this.okBtn.node.active = false;

        this.user = firebase.auth().currentUser;
        firebase.database().ref("Account/" + this.user.uid).once("value", data => {
            this.email.string = this.user.email;
            this.win.string = data.val().win;
            this.lose.string = data.val().lose;
            this.killnum.string = data.val().killnum;
            if(data.val().photo != null){
                this.PhotoUrl.string = data.val().photo['url'];
                this.UploadPhoto();
            }
        })
        .catch((e: any) => {
            this.error.string = e.message;
        })

        this.photo.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            // I can't...
            //this.PhotoUrl.active = true;
            this.PhotoUrl.node.active = true;
            this.okBtn.node.active = true;
            console.log(this.PhotoUrl);
            this.okBtn.node.on("click", this.UploadPhoto, this);
        }, this)
    }

    UploadPhoto(event: any){
        console.log(this.PhotoUrl.string);
        var remoteUrl= "https://i.ibb.co/RcMbYfs/image.jpg"
        var url = this.PhotoUrl.string;
        console.log(url);
        cc.assetManager.loadRemote(url,(err, texture)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(texture);
            var spriteFrame=new cc.SpriteFrame(texture);
            this.photo.spriteFrame = spriteFrame;
            this.photo.active = true;
            this.PhotoUrl.node.active = false;
            this.okBtn.node.active = false;
            this.user = firebase.auth().currentUser;
            firebase.database().ref("Account/" + this.user.uid + '/photo').set({
                url: url
            });
        });
    }

    // update (dt) {}
}
