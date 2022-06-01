// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

const GridSize = 140;

@ccclass
export default class NewClass extends cc.Component {

    @property
    user: any = null;

    @property
    room_id: String = null;

    @property
    isServer: Boolean = false;

    @property
    MapName: String = null;

    @property
    Map: any = null;

    @property(cc.Prefab)
    GridPrefab: cc.Prefab = null;

    @property()
    MapGrid: any = null;

    @property(cc.Node)
    Background: cc.Node = null;

    @property
    NumberTop: any = null;

    @property
    NumberCenter: any = null;

    @property
    NumberBottom: any = null;

    @property(cc.Node)
    Camera: cc.Node = null;

    @property
    mouseX: number = null;

    @property
    mouseY: number = null;

    @property(cc.Node)
    InforBar: cc.Node = null;

    @property(cc.Node)
    NameToggle: cc.Node = null;

    @property(cc.Node)
    ArmyToggle: cc.Node = null;

    @property(cc.Node)
    LevelToggle: cc.Node = null;

    @property(cc.Prefab)
    LinePrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.user = firebase.auth().currentUser;
        firebase.database().ref("Player/" + this.user.uid + "/room_id").once("value", data => {
            this.room_id = data.val();
        }).then(() => {
            firebase.database().ref("Room/" + this.room_id + "/server").once("value", data => {
                if (data.val() == this.user.email)
                    this.isServer = true;
            });

            firebase.database().ref("Room/" + this.room_id + "/map").once("value", data => {
                this.MapName = data.val();

                firebase.database().ref("Map/" + this.MapName).once("value", data => {
                    console.log(data.val());
                    this.Map = data.val();
                    this.node.width = this.Map.width * GridSize;
                    this.node.height = this.Map.height * GridSize;
                    this.Background.width = Math.max(1200, this.node.width);
                    this.Background.height = Math.max(700, this.node.height);
                    
                    this.MapGrid = new Array(this.Map.height);
                    this.NumberTop = new Array(this.Map.height);
                    this.NumberCenter = new Array(this.Map.height);;
                    this.NumberBottom = new Array(this.Map.height);
                    for (let i = 0; i < this.Map.height; i ++) {
                        this.MapGrid[i] = new Array(this.Map.width);
                        this.NumberTop[i] = new Array(this.Map.width);
                        this.NumberCenter[i] = new Array(this.Map.width);
                        this.NumberBottom[i] = new Array(this.Map.width);
                    }
                    for (let i = 0; i < this.Map.height; i ++) {
                        for (let j = 0; j < this.Map.width; j ++) {
                            this.MapGrid[i][j] = cc.instantiate(this.GridPrefab);
                            this.MapGrid[i][j].parent = this.node;
                            this.MapGrid[i][j].setPosition(j * GridSize + 70, -i * GridSize - 70);
                            console.log();

                            this.NumberTop[i][j] = cc.find("Text/NumberTop", this.MapGrid[i][j]).getComponent(cc.Label);
                            this.NumberCenter[i][j] = cc.find("Text/NumberCenter", this.MapGrid[i][j]).getComponent(cc.Label)
                            this.NumberBottom[i][j] = cc.find("Text/NumberBottom", this.MapGrid[i][j]).getComponent(cc.Label)
                        }
                    }
                    for (let i = -1; i < this.Map.height; i ++) {
                        let horizontal = cc.instantiate(this.LinePrefab);
                        horizontal.parent = this.node;
                        horizontal.color = new cc.Color(0, 0, 0);
                        horizontal.width = this.node.width;
                        horizontal.height = 3;
                        horizontal.setPosition(this.node.width / 2, -i * GridSize, 0);
                    }
                    for (let i = 0; i <= this.Map.width; i ++) {
                        let vertical = cc.instantiate(this.LinePrefab);
                        vertical.parent = this.node;
                        vertical.color = new cc.Color(0, 0, 0);
                        vertical.width = 3;
                        vertical.height = this.node.height;
                        vertical.setPosition(i * GridSize, -this.node.height / 2, 0);
                    }

                    this.ShowName();
                });
            });
        })
        
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.GetPos, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.RemoveMove, this);
        this.NameToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowName, this);
        this.ArmyToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowArmy, this);
        this.LevelToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowLevel, this);
    }

    // update (dt) {}

    ShowName() {
        console.log("OK")
        for (let i = 0; i < this.Map.height; i ++) {
            for (let j = 0; j < this.Map.width; j ++ ) {
                this.NumberTop[i][j].string = "";
                this.NumberCenter[i][j].string = this.Map[i][j].name;
                this.NumberBottom[i][j].string = "";
            }
        }
    }
    ShowArmy() {
        for (let i = 0; i < this.Map.height; i ++) {
            for (let j = 0; j < this.Map.width; j ++ ) {
                this.NumberTop[i][j].string = (this.Map[i][j].soldier == "0" ? "" : "S:" + this.Map[i][j].soldier);
                this.NumberCenter[i][j].string = (this.Map[i][j].equip == "0" ? "" : "E:" + this.Map[i][j].equip);
                this.NumberBottom[i][j].string = (this.Map[i][j].food == "0" ? "" : "F:" + this.Map[i][j].food);
            }
        }
    }
    ShowLevel() {
        for (let i = 0; i < this.Map.height; i ++) {
            for (let j = 0; j < this.Map.width; j ++ ) {
                this.NumberTop[i][j].string = (this.Map[i][j].city == "0" ? "" : "C:" + this.Map[i][j].city);
                this.NumberCenter[i][j].string = (this.Map[i][j].industry == "0" ? "" : "I:" + this.Map[i][j].industry);
                this.NumberBottom[i][j].string = (this.Map[i][j].farm == "0" ? "" : "F:" + this.Map[i][j].farm);
            }
        }
    }

    GetPos(event: any) {
        if (event.getButton() == cc.Event.EventMouse.BUTTON_MIDDLE) {
            this.mouseX = event.getLocationX() + this.Camera.x;
            this.mouseY = event.getLocationY() + this.Camera.y;
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
        }
    }

    MoveView(event: any) {
        this.Camera.setPosition(this.mouseX - event.getLocationX(), this.mouseY - event.getLocationY());
        if (this.Camera.x > this.Background.width - 1200)
            this.Camera.x = this.Background.width - 1200;
        if (this.Camera.x < 0)
            this.Camera.x = 0;
        if (this.Camera.y > this.Background.height - 700)
            this.Camera.y = this.Background.height - 700;
        if (this.Camera.y < 0)
            this.Camera.y = 0;
        this.InforBar.x = this.Camera.x + 1350;
        this.InforBar.y = this.Camera.y + 350;
    }

    RemoveMove() {
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
    }
}
