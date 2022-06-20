// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

const GridSize = 140;
const TurnInterval = 30;

const CityUpgradeCost = 8000;
const IndustryUpgradeCost = 5000;
const FarmUpgradeCost = 5000;

const AirportConstructCost = 10000;
const MissileConstructCost = 10000;
const TrenchConstructCost = 10000;
const FortConstructCost = 200000;

const AirportMoveCost = 40;
const MissileLaunchCost = 40;
const MissileDamage = 1500;

const CityDefend = 0.05;
const IndustryDefend = 0.005;
const TrenchDefend = 0.8;
const FortAttack = 1.1;
const NatureDefend = 0.9;

const DamageToEquip = 500;
const AttackFoodConsume = 5;
const EquipSoldierDamage = 2;
const NotEquipSoldierDamage = 10;
const EquipToSoldier = 100;
const ArmyDamageWithoutFood = 0.5;

const CitySoldierIncrease = 1000;
const CityFoodIncrease = 1000;
const IndustryEquipIncrease = 10;
const FarmFoodIncrease = 2000;

const SoldierConsumeFood = 10;
const SoldierAway = 0.6;

const ColorAuthority = [new cc.Color(255, 0, 0), new cc.Color(0, 255, 0), new cc.Color(0, 0, 255)]
const BadgeFadeTime = 3;


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

    @property
    CityLv0: any = null;

    @property
    CityLv1: any = null;

    @property
    CityLv2: any = null;

    @property
    CityLv3: any = null;

    @property
    CityLv4: any = null;

    @property
    Soldier: any = null;

    @property
    Equip: any = null;

    @property
    Food: any = null;

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
    FogPic: any = null;

    @property
    Identity: any = null;

    @property
    SelfFloor: any = null;

    @property
    EnemyFloor: any = null;

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
    NatureToggle: cc.Toggle = null;

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

    @property(cc.EditBox)
    MapName: cc.EditBox = null;

    @property(cc.Label)
    GameTurn: cc.Label = null;

    @property
    hasMissileLaunched: any = null;

    @property
    KillCounter: any = null;

    @property(cc.Button)
    Back: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    start () {

        this.user = firebase.auth().currentUser;

        firebase.database().ref("Map/Rwar").once("value", data => {
            this.GameInfo = data.val();
            this.scheduleOnce(() => {
                this.AdjustSize();
                this.InitGridArrays();
                this.InitInfoBar();
                this.ShowName();
                this.ShowGridInformation(0, 0);
            }, BadgeFadeTime);
        }).then(() => {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.RegisterKeyBoardEvent, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.UnregisterKeyBoardEvent, this);
            this.NameToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowName, this);
            this.ArmyToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowArmy, this);
            this.LevelToggle.on(cc.Node.EventType.MOUSE_DOWN, this.ShowLevel, this);
            this.AirportToggle.node.on("toggle", this.AirportToggleCheck, this);
            this.MissileToggle.node.on("toggle", this.MissileToggleCheck, this);
            this.TrenchToggle.node.on("toggle", this.TrenchToggleCheck, this);
            this.FortToggle.node.on("toggle", this.FortToggleCheck, this);
            this.CityUpgradeBtn.node.on("click", this.CityLevelUpgradeClick, this);
            this.IndustryUpgradeBtn.node.on("click", this.IndustryLevelUpgradeClick, this);
            this.FarmUpgradeBtn.node.on("click", this.FarmLevelUpgradeClick, this);
            this.AirportMoveBtn.node.on("click", this.AirportMoveClick, this);
            this.MissileLaunchBtn.node.on("click", this.MissileLaunchClick, this);
            this.Back.node.on("click", () => {
                firebase.database().ref("Room/" + this.room_id).remove();
                cc.director.loadScene("Room");
            }, this);
        })
    }

    // update(dt) {}

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
        this.node.width = this.GameInfo.width * GridSize;
        this.node.height = this.GameInfo.height * GridSize;
    }
    InitGridArrays() {
        this.MapGrid = new Array(this.GameInfo.height);
        this.NumberTop = new Array(this.GameInfo.height);
        this.NumberCenter = new Array(this.GameInfo.height);
        this.NumberBottom = new Array(this.GameInfo.height);
        this.Soldier = new Array(this.GameInfo.height);
        this.Equip = new Array(this.GameInfo.height);
        this.Food = new Array(this.GameInfo.height);
        this.Fog = new Array(this.GameInfo.height);
        this.FogPic = new Array(this.GameInfo.height);
        this.Identity = new Array(this.GameInfo.height);
        this.SelfFloor = new Array(this.GameInfo.height);
        this.EnemyFloor = new Array(this.GameInfo.height);
        this.CityLv0 = new Array(this.GameInfo.height);
        this.CityLv1 = new Array(this.GameInfo.height);
        this.CityLv2 = new Array(this.GameInfo.height);
        this.CityLv3 = new Array(this.GameInfo.height);
        this.CityLv4 = new Array(this.GameInfo.height);
        this.hasMissileLaunched = new Array(this.GameInfo.height);
        for (let i = 0; i < this.GameInfo.height; i ++) {
            this.MapGrid[i] = new Array(this.GameInfo.width);
            this.NumberTop[i] = new Array(this.GameInfo.width);
            this.NumberCenter[i] = new Array(this.GameInfo.width);
            this.NumberBottom[i] = new Array(this.GameInfo.width);
            this.Soldier[i] = new Array(this.GameInfo.width);
            this.Equip[i] = new Array(this.GameInfo.width);
            this.Food[i] = new Array(this.GameInfo.width);
            this.Fog[i] = new Array(this.GameInfo.width);
            this.FogPic[i] = new Array(this.GameInfo.width);
            this.Identity[i] = new Array(this.GameInfo.width);
            this.SelfFloor[i] = new Array(this.GameInfo.width);
            this.EnemyFloor[i] = new Array(this.GameInfo.width);
            this.CityLv0[i] = new Array(this.GameInfo.width);
            this.CityLv1[i] = new Array(this.GameInfo.width);
            this.CityLv2[i] = new Array(this.GameInfo.width);
            this.CityLv3[i] = new Array(this.GameInfo.width);
            this.CityLv4[i] = new Array(this.GameInfo.width);
            this.hasMissileLaunched[i] = new Array(this.GameInfo.width);
        }
        for (let i = 0; i < this.GameInfo.height; i ++) {
            for (let j = 0; j < this.GameInfo.width; j ++) {
                this.MapGrid[i][j] = cc.instantiate(this.GridPrefab);
                this.MapGrid[i][j].parent = this.node;
                this.MapGrid[i][j].setPosition(j * GridSize + 70, -i * GridSize - 70);
                this.MapGrid[i][j].on(cc.Node.EventType.MOUSE_DOWN, this.MapGridClick, {TmpNode: this, i: i, j: j});

                this.NumberTop[i][j] = cc.find("Text/NumberTop", this.MapGrid[i][j]).getComponent(cc.Label);
                this.NumberCenter[i][j] = cc.find("Text/NumberCenter", this.MapGrid[i][j]).getComponent(cc.Label)
                this.NumberBottom[i][j] = cc.find("Text/NumberBottom", this.MapGrid[i][j]).getComponent(cc.Label)
                this.Soldier[i][j] = cc.find("soldier", this.MapGrid[i][j]);
                this.Equip[i][j] = cc.find("equip", this.MapGrid[i][j]);
                this.Food[i][j] = cc.find("food", this.MapGrid[i][j]);
                
                this.Fog[i][j] = cc.find("Fog", this.MapGrid[i][j]);
                this.FogPic[i][j] = cc.find("FogPic", this.MapGrid[i][j]);
                this.SelfFloor[i][j] = cc.find("SelfFloor", this.MapGrid[i][j]);
                this.EnemyFloor[i][j] = cc.find("EnemyFloor", this.MapGrid[i][j]);
                this.Identity[i][j] = cc.find("Identity", this.MapGrid[i][j]);
                this.CityLv0[i][j] = cc.find("CityLv0", this.MapGrid[i][j]);
                this.CityLv1[i][j] = cc.find("CityLv1", this.MapGrid[i][j]);
                this.CityLv2[i][j] = cc.find("CityLv2", this.MapGrid[i][j]);
                this.CityLv3[i][j] = cc.find("CityLv3", this.MapGrid[i][j]);
                this.CityLv4[i][j] = cc.find("CityLv4", this.MapGrid[i][j]);
                this.hasMissileLaunched[i][j] = false;
            }
        }
        /*for (let i = -1; i < this.GameInfo.height; i ++) {
            let horizontal = cc.instantiate(this.LinePrefab);
            horizontal.parent = this.node;
            horizontal.color = new cc.Color(0, 0, 0);
            horizontal.width = this.node.width;
            horizontal.height = 3;
            horizontal.opacity = 0;
            horizontal.setPosition(this.node.width / 2, -i * GridSize, 0);
        }
        for (let i = 0; i <= this.GameInfo.width; i ++) {
            let vertical = cc.instantiate(this.LinePrefab);
            vertical.parent = this.node;
            vertical.color = new cc.Color(0, 0, 0);
            vertical.width = 3;
            vertical.height = this.node.height;
            vertical.opacity = 0;
            vertical.setPosition(i * GridSize, -this.node.height / 2, 0);
        }*/
    }
    InitInfoBar() {
        this.InforBar.opacity = 255;
        this.SoldierSlider.node.on("slide", this.SoliderNumberSlide, this);
        this.EquipSlider.node.on("slide", this.EquipNumberSlide, this);
        this.FoodSlider.node.on("slide", this.FoodNumberSlide, this);
        // 只要不是在起始位置，點擊時，判定位置會有問題
    }

    CityLevelUpgradeClick() {
        this.GameInfo[this.GridX][this.GridY].food -= (this.GameInfo[this.GridX][this.GridY].city + 1) * CityUpgradeCost;
        this.GameInfo[this.GridX][this.GridY].city += 1;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/upgrade/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            upgrade: "city"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
        if (this.ShowState == "Level") {
            this.NumberTop[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].city == 0 ? "" : "C:" + this.GameInfo[this.GridX][this.GridY].city);
            this.NumberCenter[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].industry == 0 ? "" : "I:" + this.GameInfo[this.GridX][this.GridY].industry);
            this.NumberBottom[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].farm == 0 ? "" : "F:" + this.GameInfo[this.GridX][this.GridY].farm);
        }
    }
    IndustryLevelUpgradeClick() {
        this.GameInfo[this.GridX][this.GridY].food -= (this.GameInfo[this.GridX][this.GridY].industry + 1) * IndustryUpgradeCost;
        this.GameInfo[this.GridX][this.GridY].industry += 1;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/upgrade/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            upgrade: "industry"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
        if (this.ShowState == "Level") {
            this.NumberTop[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].city == 0 ? "" : "C:" + this.GameInfo[this.GridX][this.GridY].city);
            this.NumberCenter[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].industry == 0 ? "" : "I:" + this.GameInfo[this.GridX][this.GridY].industry);
            this.NumberBottom[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].farm == 0 ? "" : "F:" + this.GameInfo[this.GridX][this.GridY].farm);
        }
    }
    FarmLevelUpgradeClick() {
        this.GameInfo[this.GridX][this.GridY].food -= (this.GameInfo[this.GridX][this.GridY].farm + 1) * FarmUpgradeCost;
        this.GameInfo[this.GridX][this.GridY].farm += 1;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/upgrade/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            upgrade: "farm"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string =  this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
        if (this.ShowState == "Level") {
            this.NumberTop[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].city == 0 ? "" : "C:" + this.GameInfo[this.GridX][this.GridY].city);
            this.NumberCenter[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].industry == 0 ? "" : "I:" + this.GameInfo[this.GridX][this.GridY].industry);
            this.NumberBottom[this.GridX][this.GridY].string = (this.GameInfo[this.GridX][this.GridY].farm == 0 ? "" : "F:" + this.GameInfo[this.GridX][this.GridY].farm);
        }
    }

    @property
    isAirportMoving: boolean = false;
    isMissileLaunching: boolean = false;
    AirportMoveClick() {
        this.isAirportMoving = true;
        this.ShowGridInformation(this.GridX, this.GridY);
    }
    MissileLaunchClick() {
        if (this.hasMissileLaunched[this.GridX][this.GridY] == false) {
            this.isMissileLaunching = true;
        }
        this.ShowGridInformation(this.GridX, this.GridY);
    }

    AirportToggleCheck() {
        this.GameInfo[this.GridX][this.GridY].food -= AirportConstructCost;
        this.GameInfo[this.GridX][this.GridY].airport = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Airport"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
    }
    MissileToggleCheck() {
        this.GameInfo[this.GridX][this.GridY].food -= MissileConstructCost;
        this.GameInfo[this.GridX][this.GridY].missile = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Missile"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
    }
    TrenchToggleCheck() {
        this.GameInfo[this.GridX][this.GridY].food -= TrenchConstructCost;
        this.GameInfo[this.GridX][this.GridY].trench = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Trench"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
    }
    FortToggleCheck() {
        this.GameInfo[this.GridX][this.GridY].food -= FortConstructCost;
        this.GameInfo[this.GridX][this.GridY].fort = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Fort"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
        }
    }
    // 移動畫面時會觸發按鍵的點擊
    AirportGridMoving(event: any, i: number, j: number) {
        if (event.getLocationX() <= 1200) {
            if (Math.abs(i - this.GridX) + Math.abs(j - this.GridY) <= 2 && this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] && this.GameInfo[this.GridX][this.GridY].equip >= AirportMoveCost) {
                let SoldierMoved = Math.round(this.GameInfo[this.GridX][this.GridY].soldier * this.SoldierSlider.progress);
                let EquipMoved = Math.round(this.GameInfo[this.GridX][this.GridY].equip * this.EquipSlider.progress);
                let FoodMoved = Math.round(this.GameInfo[this.GridX][this.GridY].food * this.FoodSlider.progress);
                this.GameInfo[this.GridX][this.GridY].equip -= AirportMoveCost;
                EquipMoved = Math.min(EquipMoved, this.GameInfo[this.GridX][this.GridY].equip)

                this.GameInfo[this.GridX][this.GridY].soldier = this.GameInfo[this.GridX][this.GridY].soldier - SoldierMoved;
                this.GameInfo[this.GridX][this.GridY].equip = this.GameInfo[this.GridX][this.GridY].equip - EquipMoved;
                this.GameInfo[this.GridX][this.GridY].food = this.GameInfo[this.GridX][this.GridY].food - FoodMoved;

                if (this.ShowState == "Army") {
                    this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
                    this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
                    this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
                }
                
                this.ShowGridInformation(this.GridX, this.GridY, 1);

                firebase.database().ref("Room/" + this.room_id + "/action/special/").push({
                    I: this.GridX,
                    J: this.GridY,
                    authority: this.GameInfo.authority[this.user.uid],
                    soldier: SoldierMoved,
                    equip: EquipMoved,
                    food: FoodMoved,
                    destI: i,
                    destJ: j,
                    special: "airport"
                })
            }
        }
        this.isAirportMoving = false;
        this.ShowGridInformation(this.GridX, this.GridY);
    }
    MissileGridLaunching(event: any, i: number, j: number) {
        if (event.getLocationX() <= 1200 && this.hasMissileLaunched[this.GridX][this.GridY] == false) {
            if (Math.abs(i - this.GridX) + Math.abs(j - this.GridY) <= 3 && this.GameInfo[i][j].authority != this.GameInfo.authority[this.user.uid] && this.GameInfo[this.GridX][this.GridY].equip >= MissileLaunchCost) {
                this.GameInfo[this.GridX][this.GridY].equip -= MissileLaunchCost;
                this.hasMissileLaunched[this.GridX][this.GridY] = true;

                if (this.ShowState == "Army") {
                    this.NumberTop[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].soldier;
                    this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].equip;
                    this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo[this.GridX][this.GridY].food;
                }

                firebase.database().ref("Room/" + this.room_id + "/action/special/").push({
                    I: this.GridX,
                    J: this.GridY,
                    authority: this.GameInfo.authority[this.user.uid],
                    destI: i,
                    destJ: j,
                    special: "missile"
                })
            }
        }
        this.isMissileLaunching = false;
        this.ShowGridInformation(this.GridX, this.GridY);
    }

    @property
    GridX: number = null;
    @property
    GridY: number = null;
    MapGridClick(event: any) {
        if (this["TmpNode"].isAirportMoving == true) {
            this["TmpNode"].AirportGridMoving(event, this["i"], this["j"]);
        } else if (this["TmpNode"].isMissileLaunching == true) {
            this["TmpNode"].MissileGridLaunching(event, this["i"], this["j"]);
        } else if (event.getLocationX() <= 1200) {
            this["TmpNode"].ShowGridInformation(this["i"], this["j"], 1);
        }
    }
    ShowGridInformation(i: number, j: number, ratio: any = null) {
        this.GameTurn.string = '(' + i + ', ' + j + ')';
        this.SoldierNumber.string = "Soldier: " + this.GameInfo[i][j].soldier + "/" + this.GameInfo[i][j].soldier;
            this.EquipNumber.string = "Equip: " + this.GameInfo[i][j].equip + "/" + this.GameInfo[i][j].equip;
            this.FoodNumber.string = "Food: " + this.GameInfo[i][j].food + "/" + this.GameInfo[i][j].food;
            
            this.CityLevelText.string = "City: " + this.GameInfo[i][j].city;
            this.IndustryLevelText.string = "Industry: " + this.GameInfo[i][j].industry;
            this.FarmLevelText.string = "Farm: " + this.GameInfo[i][j].farm;

            this.CityUpgradeText.string = "+ " + (this.GameInfo[i][j].city + 1) * CityUpgradeCost;
            this.IndustryUpgradeText.string = "+ " + (this.GameInfo[i][j].industry + 1) * IndustryUpgradeCost;
            this.FarmUpgradeText.string = "+ " + (this.GameInfo[i][j].farm + 1) * FarmUpgradeCost;

            this.CityUpgradeBtn.interactable = !(this.GameInfo[i][j].city == "5" || this.GameInfo[i][j].food < (this.GameInfo[i][j].city + 1) * CityUpgradeCost);
            this.IndustryUpgradeBtn.interactable = !(this.GameInfo[i][j].industry == "5" || this.GameInfo[i][j].food < (this.GameInfo[i][j].industry + 1) * IndustryUpgradeCost);
            this.FarmUpgradeBtn.interactable = !(this.GameInfo[i][j].farm == "5" || this.GameInfo[i][j].food < (this.GameInfo[i][j].farm + 1) * FarmUpgradeCost);

            this.AirportToggle.isChecked = (this.GameInfo[i][j].airport == true);
            this.MissileToggle.isChecked = (this.GameInfo[i][j].missile == true);
            this.TrenchToggle.isChecked = (this.GameInfo[i][j].trench == true);
            this.FortToggle.isChecked = (this.GameInfo[i][j].fort == true);
            this.NatureToggle.isChecked = (this.GameInfo[i][j].nature == true);

            this.AirportMoveBtn.interactable = (this.isAirportMoving == false);
            this.AirportMoveBtn.node.active = (this.AirportToggle.isChecked && this.GameInfo[i][j].equip >= AirportMoveCost && this.isMissileLaunching == false);
            this.MissileLaunchBtn.interactable = (this.isMissileLaunching == false);
            this.MissileLaunchBtn.node.active = (this.MissileToggle.isChecked && this.GameInfo[i][j].equip >= MissileLaunchCost && this.isAirportMoving == false && this.hasMissileLaunched[i][j] == false);
            
            this.AirportPrice.node.active = !this.AirportToggle.isChecked;
            this.MissilePrice.node.active = !this.MissileToggle.isChecked;
            this.TrenchPrice.node.active = !this.TrenchToggle.isChecked;
            this.FortPrice.node.active = !this.FortToggle.isChecked;

            this.AirportToggle.interactable = !(this.GameInfo[i][j].airport == true || this.GameInfo[i][j].food < AirportConstructCost);
            this.MissileToggle.interactable = !(this.GameInfo[i][j].missile == true || this.GameInfo[i][j].food < MissileConstructCost);
            this.TrenchToggle.interactable = !(this.GameInfo[i][j].trench == true || this.GameInfo[i][j].food < TrenchConstructCost);
            this.FortToggle.interactable = !(this.GameInfo[i][j].fort == true || this.GameInfo[i][j].food < FortConstructCost);
    }
    SoliderNumberSlide() {
        let num = Math.round(this.GameInfo[this.GridX][this.GridY].soldier);
        this.SoldierNumber.string = "Soldier: " + num + "/" + this.GameInfo[this.GridX][this.GridY].soldier;
    }
    EquipNumberSlide() {
        let num = Math.round(this.EquipSlider.progress * this.GameInfo[this.GridX][this.GridY].equip);
        this.EquipNumber.string = "Equip: " + num + "/" + this.GameInfo[this.GridX][this.GridY].equip;
    }
    FoodNumberSlide() {
        let num = Math.round(this.FoodSlider.progress * this.GameInfo[this.GridX][this.GridY].food);
        this.FoodNumber.string = "Food: " + num + "/" + this.GameInfo[this.GridX][this.GridY].food;
    }
    
    @property
    ShowState: String = "Name";
    ShowName() {
        this.ShowState = "Name";
        for (let i = 0; i < this.GameInfo.height; i ++) {
            for (let j = 0; j < this.GameInfo.width; j ++ ) {
                this.NumberTop[i][j].string = "";
                this.NumberCenter[i][j].string = this.GameInfo[i][j].name;
                this.NumberBottom[i][j].string = "";
                this.Soldier[i][j].opacity = 0;
                this.Equip[i][j].opacity = 0;
                this.Food[i][j].opacity = 0;
            }
        }
        this.ShowVisible();
    }
    ShowArmy() {
        this.ShowState = "Army";
        for (let i = 0; i < this.GameInfo.height; i ++) {
            for (let j = 0; j < this.GameInfo.width; j ++ ) {
                this.NumberTop[i][j].string = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? this.GameInfo[i][j].soldier : "");
                this.NumberCenter[i][j].string = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? this.GameInfo[i][j].equip : "??");
                this.NumberBottom[i][j].string = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? this.GameInfo[i][j].food : "");
                this.Soldier[i][j].opacity = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? 255 : 0);
                this.Equip[i][j].opacity = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? 255 : 0);
                this.Food[i][j].opacity = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? 255 : 0);
            }
        }
        this.ShowVisible();
    }
    ShowLevel() {
        this.ShowState = "Level";
        for (let i = 0; i < this.GameInfo.height; i ++) {
            for (let j = 0; j < this.GameInfo.width; j ++ ) {
                this.NumberTop[i][j].string = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? "C: " + this.GameInfo[i][j].city : "");
                this.NumberCenter[i][j].string = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? "I: " + this.GameInfo[i][j].industry : "??");
                this.NumberBottom[i][j].string = (this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid] ? "F: " + this.GameInfo[i][j].food : "");
                this.Soldier[i][j].opacity = 0;
                this.Equip[i][j].opacity = 0;
                this.Food[i][j].opacity = 0;
            }
        }
        this.ShowVisible();
    }
    @property
    dx: number[] = [0, 1, 0, -1];
    @property
    dy: number[] = [1, 0, -1, 0];
    ShowVisible() {
        for (let i = 0; i < this.GameInfo.height; i ++ ) {
            for (let j = 0; j < this.GameInfo.width; j ++ ) {


                {
                    this.Fog[i][j].opacity = 0;
                    this.FogPic[i][j].opacity = 0;
                    if (this.GameInfo[i][j].city == "0" && this.GameInfo[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 255;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    } else if (this.GameInfo[i][j].city == "1" && this.GameInfo[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 255;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    } else if (this.GameInfo[i][j].city == "2" && this.GameInfo[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 255;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    } else if (this.GameInfo[i][j].city == "3" && this.GameInfo[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 255;
                        this.CityLv4[i][j].opacity = 0;
                    } else if ((this.GameInfo[i][j].city == "4" || this.GameInfo[i][j].city == "5") && this.GameInfo[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 255;
                    } else {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    }
                }

                /*if (i == this.GridX && j == this.GridY && this.GameInfo[i][j].authority == this.GameInfo.authority[this.user.uid]) {
                    this.Fog[i][j].opacity = 150;
                    this.FogPic[i][j].opacity = 0;
                }*/

                // this.Identity[i][j].color = ColorAuthority[this.GameInfo[i][j].authority];
            
                {
                    this.SelfFloor[i][j].opacity = 255;
                    this.EnemyFloor[i][j].opacity = 0;
                }
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
        if (this.Camera.x > this.node.width - 1200)
            this.Camera.x = this.node.width - 1200;
        if (this.Camera.x < 0)
            this.Camera.x = 0;
        if (this.Camera.y > 0)
            this.Camera.y = 0;
        if (this.Camera.y < 700 - this.node.height)
            this.Camera.y = 700 - this.node.height;
        this.InforBar.x = this.Camera.x + 600;
        this.InforBar.y = this.Camera.y + 0;
    }
    RemoveMove() {
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.MoveView, this);
    }
}
