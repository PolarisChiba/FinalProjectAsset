// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

const GridSize = 140;
const TurnInterval = 2;

@ccclass
export default class NewClass extends cc.Component {

    @property
    user: any = null;

    @property
    room_id: String = null;

    @property(cc.Prefab)
    GridPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    LinePrefab: cc.Prefab = null;

    @property(cc.Node)
    Background: cc.Node = null;

    @property()
    MapGrid: any = null;

    @property
    NumberTop: any = null;

    @property
    NumberCenter: any = null;

    @property
    NumberBottom: any = null;

    @property
    Fog: any = null;

    @property
    Identity: any = null;

    @property(cc.Node)
    Camera: cc.Node = null;

    @property(cc.Node)
    InforBar: cc.Node = null;

    @property(cc.Node)
    NameToggle: cc.Node = null;

    @property(cc.Node)
    ArmyToggle: cc.Node = null;

    @property(cc.Node)
    LevelToggle: cc.Node = null;

    @property
    GameInfo: any = null;

    @property
    ServerTurn: number = null;

    @property
    ServerMap: any = null;

    @property(cc.Label)
    SoldierNumber: cc.Label = null;

    @property(cc.Slider)
    SoldierSlider: cc.Slider = null;

    @property(cc.Label)
    EquipNumber: cc.Label = null;

    @property(cc.Slider)
    EquipSlider: cc.Slider = null;

    @property(cc.Label)
    FoodNumber: cc.Label = null;

    @property(cc.Slider)
    FoodSlider: cc.Slider = null;

    @property(cc.Label)
    CityLevelText: cc.Label = null;

    @property(cc.Button)
    CityUpgradeBtn: cc.Button = null;

    @property(cc.Label)
    CityUpgradeText: cc.Label = null;

    @property(cc.Label)
    IndustryLevelText: cc.Label = null;

    @property(cc.Button)
    IndustryUpgradeBtn: cc.Button = null;

    @property(cc.Label)
    IndustryUpgradeText: cc.Label = null;

    @property(cc.Label)
    FarmLevelText: cc.Label = null;

    @property(cc.Button)
    FarmUpgradeBtn: cc.Button = null;

    @property(cc.Label)
    FarmUpgradeText: cc.Label = null;

    @property(cc.Toggle)
    AirportToggle: cc.Toggle = null;

    @property(cc.Toggle)
    MissileToggle: cc.Toggle = null;

    @property(cc.Toggle)
    TrenchToggle: cc.Toggle = null;

    @property(cc.Toggle)
    FortToggle: cc.Toggle = null;

    @property(cc.Toggle)
    RiverToggle: cc.Toggle = null;

    @property(cc.Toggle)
    MountainToggle: cc.Toggle = null;

    @property(cc.Button)
    AirportMoveBtn: cc.Button = null;

    @property(cc.Button)
    MissileLaunchBtn: cc.Button = null;

    @property(cc.Label)
    AirportPrice: cc.Label = null;

    @property(cc.Label)
    MissilePrice: cc.Label = null;

    @property(cc.Label)
    TrenchPrice: cc.Label = null;

    @property(cc.Label)
    FortPrice: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.user = firebase.auth().currentUser;
        firebase.database().ref("Player/" + this.user.uid + "/room_id").once("value", data => {
            this.room_id = data.val();
        }).then(() => {
            firebase.database().ref("Room/" + this.room_id).once("value", data => {
                this.GameInfo = data.val();
            
                this.AdjustSize();
                this.InitGridArrays();
                this.InitInfoBar();
                this.ShowName();
            });
        })
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.RegisterKeyBoardEvent, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.UnregisterKeyBoardEvent, this);
        this.NameToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowName, this);
        this.ArmyToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowArmy, this);
        this.LevelToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowLevel, this);

        this.ServerDesuWa();
    }

    // update (dt) {}

    ServerDesuWa() {
        /*
        if (this.GameInfo.server == this.user.email) {
            this.ServerMap = this.GameInfo.map;
            this.ServerTurn = 0;
        }
        */
        
    }

    RegisterKeyBoardEvent(event: any) {
        if (event.keyCode == 16) {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.GetPos, this);
            this.node.on(cc.Node.EventType.MOUSE_UP, this.RemoveMove, this);
        }
    }

    UnregisterKeyBoardEvent(event: any) {
        if (event.keyCode == 16) {
            this.node.off(cc.Node.EventType.MOUSE_DOWN, this.GetPos, this);
            this.node.off(cc.Node.EventType.MOUSE_UP, this.RemoveMove, this);
            this.node.off(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
        }
    }

    AdjustSize() {
        this.node.width = this.GameInfo.map.width * GridSize;
        this.node.height = this.GameInfo.map.height * GridSize;
        this.Background.width = Math.max(1200, this.node.width);
        this.Background.height = Math.max(700, this.node.height);
    }
    InitGridArrays() {
        this.MapGrid = new Array(this.GameInfo.map.height);
        this.NumberTop = new Array(this.GameInfo.map.height);
        this.NumberCenter = new Array(this.GameInfo.map.height);
        this.NumberBottom = new Array(this.GameInfo.map.height);
        this.Fog = new Array(this.GameInfo.map.height);
        this.Identity = new Array(this.GameInfo.map.height);
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            this.MapGrid[i] = new Array(this.GameInfo.map.width);
            this.NumberTop[i] = new Array(this.GameInfo.map.width);
            this.NumberCenter[i] = new Array(this.GameInfo.map.width);
            this.NumberBottom[i] = new Array(this.GameInfo.map.width);
            this.Fog[i] = new Array(this.GameInfo.map.width);
            this.Identity[i] = new Array(this.GameInfo.map.width);
        }
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++) {
                this.MapGrid[i][j] = cc.instantiate(this.GridPrefab);
                this.MapGrid[i][j].parent = this.node;
                this.MapGrid[i][j].setPosition(j * GridSize + 70, -i * GridSize - 70);
                this.MapGrid[i][j].on(cc.Node.EventType.MOUSE_DOWN, this.ShowGridInformation, {TmpNode: this, i: i, j: j});

                this.NumberTop[i][j] = cc.find("Text/NumberTop", this.MapGrid[i][j]).getComponent(cc.Label);
                this.NumberCenter[i][j] = cc.find("Text/NumberCenter", this.MapGrid[i][j]).getComponent(cc.Label)
                this.NumberBottom[i][j] = cc.find("Text/NumberBottom", this.MapGrid[i][j]).getComponent(cc.Label)
                
                this.Fog[i][j] = cc.find("Fog", this.MapGrid[i][j]);
                this.Identity[i][j] = cc.find("Identity", this.MapGrid[i][j]);
            }
        }
        for (let i = -1; i < this.GameInfo.map.height; i ++) {
            let horizontal = cc.instantiate(this.LinePrefab);
            horizontal.parent = this.node;
            horizontal.color = new cc.Color(0, 0, 0);
            horizontal.width = this.node.width;
            horizontal.height = 3;
            horizontal.setPosition(this.node.width / 2, -i * GridSize, 0);
        }
        for (let i = 0; i <= this.GameInfo.map.width; i ++) {
            let vertical = cc.instantiate(this.LinePrefab);
            vertical.parent = this.node;
            vertical.color = new cc.Color(0, 0, 0);
            vertical.width = 3;
            vertical.height = this.node.height;
            vertical.setPosition(i * GridSize, -this.node.height / 2, 0);
        }
    }
    InitInfoBar() {
        this.SoldierSlider.node.on("slide", this.SoliderNumberSlide, this);
        this.EquipSlider.node.on("slide", this.EquipNumberSlide, this);
        this.FoodSlider.node.on("slide", this.FoodNumberSlide, this);
        // 只要不是在起始位置，點擊時，判定位置會有問題
    }

    @property
    GridX: number = null;
    @property
    GridY: number = null;
    ShowGridInformation(event: any) {
        console.log(event)
        if (event.getLocationX() <= 1200) {

            let ok = (this["TmpNode"].GameInfo.map[this["TmpNode"].GridX][this["TmpNode"].GridY].authority == this["TmpNode"].GameInfo.authority[this["TmpNode"].user.uid]);
            for (let k = 0; k < 4; k ++ ) {
                let tx = this["TmpNode"].GridX + this["TmpNode"].dx[k], ty = this["TmpNode"].GridY + this["TmpNode"].dy[k];
                if (0 <= tx && tx < this["TmpNode"].GameInfo.map.height && 0 <= ty && ty < this["TmpNode"].GameInfo.map.width) {
                    ok ||= (this["TmpNode"].GameInfo.map[tx][ty].authority == this["TmpNode"].GameInfo.authority[this["TmpNode"].user.uid]);
                }
            }
            if (ok)
                this["TmpNode"].Fog[this["TmpNode"].GridX][this["TmpNode"].GridY].opacity = 0;
            else
                this["TmpNode"].Fog[this["TmpNode"].GridX][this["TmpNode"].GridY].opacity = 255;

            if (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].authority == this["TmpNode"].GameInfo.authority[this["TmpNode"].user.uid]) {
                this["TmpNode"].Fog[this["i"]][this["j"]].opacity = 150;

                this["TmpNode"].SoldierNumber.string = "Soldier: " + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].soldier + "/" + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].soldier;
                this["TmpNode"].EquipNumber.string = "Equip: " + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].equip + "/" + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].equip;
                this["TmpNode"].FoodNumber.string = "Food: " + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food + "/" + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food;
                
                this["TmpNode"].CityLevelText.string = "City: " + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].city;
                this["TmpNode"].IndustryLevelText.string = "Industry: " + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].industry;
                this["TmpNode"].FarmLevelText.string = "Farm: " + this["TmpNode"].GameInfo.map[this["i"]][this["j"]].farm;

                this["TmpNode"].CityUpgradeText.string = "+ " + String((Number(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].city) + 1) * 8000);
                this["TmpNode"].IndustryUpgradeText.string = "+ " + String((Number(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].industry) + 1) * 5000);
                this["TmpNode"].FarmUpgradeText.string = "+ " + String((Number(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].farm) + 1) * 5000);

                this["TmpNode"].CityUpgradeBtn.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].city == "5" || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < (Number(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].city) + 1) * 8000);
                this["TmpNode"].IndustryUpgradeBtn.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].industry == "5" || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < (Number(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].industry) + 1) * 5000);
                this["TmpNode"].FarmUpgradeBtn.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].farm == "5" || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < (Number(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].farm) + 1) * 5000);

                this["TmpNode"].AirportToggle.isChecked = (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].airport == true);
                this["TmpNode"].MissileToggle.isChecked = (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].missile == true);
                this["TmpNode"].TrenchToggle.isChecked = (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].trench == true);
                this["TmpNode"].FortToggle.isChecked = (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].fort == true);
                this["TmpNode"].RiverToggle.isChecked = (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].river == true);
                this["TmpNode"].MountainToggle.isChecked = (this["TmpNode"].GameInfo.map[this["i"]][this["j"]].mountain == true);

                this["TmpNode"].AirportMoveBtn.node.active = this["TmpNode"].AirportToggle.isChecked;
                this["TmpNode"].MissileLaunchBtn.node.active = this["TmpNode"].MissileToggle.isChecked;
                this["TmpNode"].AirportPrice.node.active = !this["TmpNode"].AirportToggle.isChecked;
                this["TmpNode"].MissilePrice.node.active = !this["TmpNode"].MissileToggle.isChecked;
                this["TmpNode"].TrenchPrice.node.active = !this["TmpNode"].TrenchToggle.isChecked;
                this["TmpNode"].FortPrice.node.active = !this["TmpNode"].FortToggle.isChecked;

                this["TmpNode"].AirportToggle.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].airport == true || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < 10000);
                this["TmpNode"].MissileToggle.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].missile == true || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < 10000);
                this["TmpNode"].TrenchToggle.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].trench == true || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < 10000);
                this["TmpNode"].FortToggle.interactable = !(this["TmpNode"].GameInfo.map[this["i"]][this["j"]].fort == true || this["TmpNode"].GameInfo.map[this["i"]][this["j"]].food < 20000);
                
            } else {
                this["TmpNode"].SoldierNumber.string = "Soldier: 0/0";
                this["TmpNode"].EquipNumber.string = "Equip: 0/0";
                this["TmpNode"].FoodNumber.string = "Food: 0/0";
                
                this["TmpNode"].CityLevelText.string = "City: ";
                this["TmpNode"].IndustryLevelText.string = "Industry: ";
                this["TmpNode"].FarmLevelText.string = "Farm: ";

                this["TmpNode"].CityUpgradeText.string = "+ ";
                this["TmpNode"].IndustryUpgradeText.string = "+ ";
                this["TmpNode"].FarmUpgradeText.string = "+ ";

                this["TmpNode"].CityUpgradeBtn.interactable = false;
                this["TmpNode"].IndustryUpgradeBtn.interactable = false;
                this["TmpNode"].FarmUpgradeBtn.interactable = false;

                this["TmpNode"].AirportToggle.isChecked = false;
                this["TmpNode"].MissileToggle.isChecked = false;
                this["TmpNode"].TrenchToggle.isChecked = false;
                this["TmpNode"].FortToggle.isChecked = false;
                this["TmpNode"].RiverToggle.isChecked = false;
                this["TmpNode"].MountainToggle.isChecked = false;

                this["TmpNode"].AirportMoveBtn.node.active = false;
                this["TmpNode"].MissileLaunchBtn.node.active = false;
                this["TmpNode"].AirportPrice.node.active = false;
                this["TmpNode"].MissilePrice.node.active = false;
                this["TmpNode"].TrenchPrice.node.active = false;
                this["TmpNode"].FortPrice.node.active = false;

                this["TmpNode"].AirportToggle.interactable = false;
                this["TmpNode"].MissileToggle.interactable = false;
                this["TmpNode"].TrenchToggle.interactable = false;
                this["TmpNode"].FortToggle.interactable = false;
            }

            this["TmpNode"].GridX = this["i"];
            this["TmpNode"].GridY = this["j"];
            this["TmpNode"].SoldierSlider.progress = 1;
            this["TmpNode"].EquipSlider.progress = 1;
            this["TmpNode"].FoodSlider.progress = 1;
        }
    }
    SoliderNumberSlide() {
        let num = Number(this.GameInfo.map[this.GridX][this.GridY].soldier);
        num = Math.round(this.SoldierSlider.progress * num);
        this.SoldierNumber.string = "Soldier: " + String(num) + "/" + this.GameInfo.map[this.GridX][this.GridY].soldier;
    }
    EquipNumberSlide() {
        let num = Number(this.GameInfo.map[this.GridX][this.GridY].equip);
        num = Math.round(this.EquipSlider.progress * num);
        this.EquipNumber.string = "Equip: " + String(num) + "/" + this.GameInfo.map[this.GridX][this.GridY].equip;
    }
    FoodNumberSlide() {
        let num = Number(this.GameInfo.map[this.GridX][this.GridY].food);
        num = Math.round(this.FoodSlider.progress * num);
        this.FoodNumber.string = "Food: " + String(num) + "/" + this.GameInfo.map[this.GridX][this.GridY].food;
    }
    

    ShowName() {
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                this.NumberTop[i][j].string = "";
                this.NumberCenter[i][j].string = this.GameInfo.map[i][j].name;
                this.NumberBottom[i][j].string = "";
            }
        }
        this.ShowVisible();
    }
    ShowArmy() {
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                this.NumberTop[i][j].string = (this.GameInfo.map[i][j].soldier == "0" ? "" : "S:" + this.GameInfo.map[i][j].soldier);
                this.NumberCenter[i][j].string = (this.GameInfo.map[i][j].equip == "0" ? "" : "E:" + this.GameInfo.map[i][j].equip);
                this.NumberBottom[i][j].string = (this.GameInfo.map[i][j].food == "0" ? "" : "F:" + this.GameInfo.map[i][j].food);
            }
        }
        this.ShowVisible();
    }
    ShowLevel() {
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                this.NumberTop[i][j].string = (this.GameInfo.map[i][j].city == "0" ? "" : "C:" + this.GameInfo.map[i][j].city);
                this.NumberCenter[i][j].string = (this.GameInfo.map[i][j].industry == "0" ? "" : "I:" + this.GameInfo.map[i][j].industry);
                this.NumberBottom[i][j].string = (this.GameInfo.map[i][j].farm == "0" ? "" : "F:" + this.GameInfo.map[i][j].farm);
            }
        }
        this.ShowVisible();
    }
    @property
    dx: number[] = [0, 1, 0, -1];
    @property
    dy: number[] = [1, 0, -1, 0];
    ShowVisible() {
        for (let i = 0; i < this.GameInfo.map.height; i ++ ) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                let ok = (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]);
                for (let k = 0; k < 4; k ++ ) {
                    let tx = i + this.dx[k], ty = j + this.dy[k];
                    if (0 <= tx && tx < this.GameInfo.map.height && 0 <= ty && ty < this.GameInfo.map.width) {
                        ok ||= (this.GameInfo.map[tx][ty].authority == this.GameInfo.authority[this.user.uid]);
                    }
                }
                if (ok)
                    this.Fog[i][j].opacity = 0;
                else
                    this.Fog[i][j].opacity = 255;
                
                if (i == this.GridX && j == this.GridY && this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid])
                    this.Fog[i][j].opacity = 150;
                
                if (this.GameInfo.map[i][j].authority == "0") this.Identity[i][j].color = new cc.Color(255, 0, 0);
                else if (this.GameInfo.map[i][j].authority == "1") this.Identity[i][j].color = new cc.Color(0, 255, 0);
            }
        }
    }

    @property
    mouseX: number = null;
    @property
    mouseY: number = null;
    GetPos(event: any) {
        this.mouseX = event.getLocationX() + this.Camera.x;
        this.mouseY = event.getLocationY() + this.Camera.y;
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
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
        this.InforBar.x = this.Camera.x + 600;
        this.InforBar.y = this.Camera.y + 0;
        console.log(this.InforBar.x)
    }
    RemoveMove() {
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
    }
}
