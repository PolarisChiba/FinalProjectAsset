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

    @property(cc.Label)
    GameTurn: cc.Label = null;

    @property
    hasMissileLaunched: any = null;

    @property
    KillCounter: any = null;

    @property(cc.Sprite)
    Badge: cc.Sprite = null;

    @property(cc.Button)
    Back: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Badge.node.runAction(cc.fadeOut(BadgeFadeTime));
    }

    start () {

        this.user = firebase.auth().currentUser;
        firebase.database().ref("Player/" + this.user.uid + "/room_id").once("value", data => {
            this.room_id = data.val();
        }).then(() => {
            firebase.database().ref("Room/" + this.room_id).once("value", data => {
                this.GameInfo = data.val();
                
                this.scheduleOnce(() => {
                    this.AdjustSize();
                    this.InitGridArrays();
                    this.InitInfoBar();
                    this.ShowName();
                    this.ServerDesuWa();
                    this.ClientDesuWa();
                    this.ShowGridInformation(0, 0);
                }, BadgeFadeTime);
            });
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

    ClientDesuWa() {
        firebase.database().ref("Room/" + this.room_id + "/turn").on("value", (data) => {
            this.GameTurn.string = "Turn: " + data.val();
            firebase.database().ref("Room/" + this.room_id).once("value", (data) => {
                this.GameInfo = data.val();

                if (this.GameInfo == null) {
                    cc.director.loadScene("Room");
                }

                if (this.ShowState == "Name") this.ShowName();
                else if (this.ShowState == "Army") this.ShowArmy();
                else if (this.ShowState == "Level") this.ShowLevel();
                for (let i = 0; i < this.GameInfo.map.height; i ++) {
                    for (let j = 0; j < this.GameInfo.map.width; j ++) {
                        this.hasMissileLaunched[i][j] = false;
                    }
                }
                this.ShowGridInformation(this.GridX, this.GridY);

                if (this.GameInfo.state == "Result") {
                    firebase.database().ref("Account/" + this.user.uid + "/result").set({
                        num: this.GameInfo.counter[this.GameInfo.authority[this.user.uid]],
                        end: (this.GameInfo.winner == this.GameInfo.authority[this.user.uid])
                    }).then(() => {
                        this.node.runAction(cc.fadeOut(3));
                        this.scheduleOnce(() => {
                            cc.director.loadScene("Result");
                        }, 3);
                    })
                }
            })
        });
    }

    ServerDesuWa() {
        if (this.GameInfo.server == this.user.email) {
            this.ServerMap = this.GameInfo.map;
            this.ServerTurn = 0;
            this.schedule(this.ServerIntervalWork, TurnInterval);
            firebase.database().ref("Room/" + this.room_id + "/action/advance/").on("child_added", (data) => {
                let res = data.val();
                if (this.ServerMap[res.I][res.J].authority == this.ServerMap[res.destI][res.destJ].authority && this.ServerMap[res.I][res.J].authority == res.authority) {
                    res.soldier = Math.min(res.soldier, this.ServerMap[res.I][res.J].soldier);
                    res.equip = Math.min(res.equip, this.ServerMap[res.I][res.J].equip);
                    res.food = Math.min(res.food, this.ServerMap[res.I][res.J].food);
                    this.ServerMap[res.destI][res.destJ].soldier += res.soldier;
                    this.ServerMap[res.destI][res.destJ].equip += res.equip;
                    this.ServerMap[res.destI][res.destJ].food += res.food;
                    this.ServerMap[res.I][res.J].soldier -= res.soldier;
                    this.ServerMap[res.I][res.J].equip -= res.equip;
                    this.ServerMap[res.I][res.J].food -= res.food;
                } else if (this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].authority != this.ServerMap[res.destI][res.destJ].authority) {
                    res.food -= res.soldier / AttackFoodConsume; // attack punishment
                    res.soldier = Math.min(res.soldier, this.ServerMap[res.I][res.J].soldier);
                    res.equip = Math.min(res.equip, this.ServerMap[res.I][res.J].equip);
                    res.food = Math.min(res.food, this.ServerMap[res.I][res.J].food);

                    let damage = (res.equip * EquipToSoldier >= res.soldier ? Math.round(res.soldier / EquipSoldierDamage) : Math.round((res.soldier - res.equip * EquipToSoldier) / NotEquipSoldierDamage) + res.equip * EquipToSoldier / EquipSoldierDamage);
                    damage = Math.round(damage * (1.0 - CityDefend * this.ServerMap[res.destI][res.destJ].city) * (1.0 - IndustryDefend * this.ServerMap[res.destI][res.destJ].industry));
                    if (res.soldier > res.food)
                        damage = Math.round(ArmyDamageWithoutFood * damage + (1 - ArmyDamageWithoutFood) * damage * res.food / res.soldier);
                    if (this.ServerMap[res.destI][res.destJ].trench)
                        damage = Math.round(damage * TrenchDefend);
                    if (this.ServerMap[res.destI][res.destJ].nature)
                        damage = Math.round(damage * NatureDefend);
                    if (this.ServerMap[res.I][res.J].fort)
                        damage = Math.round(damage * FortAttack);
                    
                    let counterdamage = (this.ServerMap[res.destI][res.destJ].equip * EquipToSoldier >= this.ServerMap[res.destI][res.destJ].soldier ? Math.round(this.ServerMap[res.destI][res.destJ].soldier / EquipSoldierDamage) : Math.round((this.ServerMap[res.destI][res.destJ].soldier - this.ServerMap[res.destI][res.destJ].equip * EquipToSoldier) / NotEquipSoldierDamage) + this.ServerMap[res.destI][res.destJ].equip * EquipToSoldier / EquipSoldierDamage);
                    if (this.ServerMap[res.destI][res.destJ].fort)
                        counterdamage = Math.round(counterdamage * FortAttack);
                    if (this.ServerMap[res.destI][res.destJ].soldier > this.ServerMap[res.destI][res.destJ].food) {
                        counterdamage = Math.round(ArmyDamageWithoutFood * counterdamage + (1 - ArmyDamageWithoutFood) * counterdamage * this.ServerMap[res.destI][res.destJ].food / this.ServerMap[res.destI][res.destJ].soldier);
                    }

                    this.KillCounter[this.ServerMap[res.I][res.J].authority] += Math.min(this.ServerMap[res.destI][res.destJ].soldier, damage);
                    this.ServerMap[res.destI][res.destJ].soldier -= Math.min(this.ServerMap[res.destI][res.destJ].soldier, damage);
                    this.ServerMap[res.destI][res.destJ].equip -= Math.min(this.ServerMap[res.destI][res.destJ].equip, Math.round(damage / DamageToEquip));
                    
                    if (this.ServerMap[res.destI][res.destJ].soldier == 0 && counterdamage < res.soldier) {
                        this.ServerMap[res.I][res.J].soldier -= res.soldier;
                        this.ServerMap[res.I][res.J].equip -= res.equip;
                        this.ServerMap[res.I][res.J].food -= res.food;

                        this.KillCounter[this.ServerMap[res.destI][res.destJ].authority] += counterdamage;
                        this.ServerMap[res.destI][res.destJ].authority = res.authority;
                        this.ServerMap[res.destI][res.destJ].soldier = res.soldier - counterdamage;
                        this.ServerMap[res.destI][res.destJ].equip += Math.max(0, res.equip - Math.round(damage / DamageToEquip));
                        this.ServerMap[res.destI][res.destJ].food += res.food;
                    } else {
                        this.KillCounter[this.ServerMap[res.destI][res.destJ].authority] += Math.min(res.soldier, counterdamage);
                        this.ServerMap[res.I][res.J].soldier -= Math.min(res.soldier, counterdamage);
                        this.ServerMap[res.I][res.J].equip -= Math.min(res.equip, Math.round(counterdamage / DamageToEquip));
                    }
                }
            });
            firebase.database().ref("Room/" + this.room_id + "/action/construct").on("child_added", (data) => {
                let res = data.val();
                if (res.construction == "Airport" && this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].food >= AirportConstructCost) {
                    this.ServerMap[res.I][res.J].airport = true;
                    this.ServerMap[res.I][res.J].food -= AirportConstructCost;
                } else if (res.construction == "Missile" && this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].food >= MissileConstructCost) {
                    this.ServerMap[res.I][res.J].missile = true;
                    this.ServerMap[res.I][res.J].food -= MissileConstructCost;
                } else if (res.construction == "Trench" && this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].food >= TrenchConstructCost) {
                    this.ServerMap[res.I][res.J].trench = true;
                    this.ServerMap[res.I][res.J].food -= TrenchConstructCost;
                } else if (res.construction == "Fort" && this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].food >= FortConstructCost) {
                    this.ServerMap[res.I][res.J].fort = true;
                    this.ServerMap[res.I][res.J].food -= FortConstructCost;
                }
            });
            firebase.database().ref("Room/" + this.room_id + "/action/upgrade").on("child_added", (data) => {
                let res = data.val();
                if (this.ServerMap[res.I][res.J].authority == res.authority && res.upgrade == "city" && this.ServerMap[res.I][res.J].food >= (this.ServerMap[res.I][res.J].city + 1) * CityUpgradeCost && this.ServerMap[res.I][res.J].city < 5) {
                    this.ServerMap[res.I][res.J].food -= (this.ServerMap[res.I][res.J].city + 1) * CityUpgradeCost;
                    this.ServerMap[res.I][res.J].city += 1;
                } else if (this.ServerMap[res.I][res.J].authority == res.authority && res.upgrade == "industry" && this.ServerMap[res.I][res.J].food >= (this.ServerMap[res.I][res.J].industry + 1) * IndustryUpgradeCost && this.ServerMap[res.I][res.J].industry < 5) {
                    this.ServerMap[res.I][res.J].food -= (this.ServerMap[res.I][res.J].industry + 1) * IndustryUpgradeCost;
                    this.ServerMap[res.I][res.J].industry += 1;
                } else if (this.ServerMap[res.I][res.J].authority == res.authority && res.upgrade == "farm" && this.ServerMap[res.I][res.J].food >= (this.ServerMap[res.I][res.J].farm + 1) * FarmUpgradeCost && this.ServerMap[res.I][res.J].farm < 5) {
                    this.ServerMap[res.I][res.J].food -= (this.ServerMap[res.I][res.J].farm + 1) * FarmUpgradeCost;
                    this.ServerMap[res.I][res.J].farm += 1;
                }
            });
            firebase.database().ref("Room/" + this.room_id + "/action/special").on("child_added", (data) => {
                let res = data.val();
                if (res.special == "airport" && this.ServerMap[res.I][res.J].authority == this.ServerMap[res.destI][res.destJ].authority && this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].equip >= AirportMoveCost) {
                    this.ServerMap[res.I][res.J].equip -= AirportMoveCost;
                    res.soldier = Math.min(res.soldier, this.ServerMap[res.I][res.J].soldier);
                    res.equip = Math.min(res.equip, this.ServerMap[res.I][res.J].equip);
                    res.food = Math.min(res.food, this.ServerMap[res.I][res.J].food);
                    this.ServerMap[res.destI][res.destJ].soldier += res.soldier;
                    this.ServerMap[res.destI][res.destJ].equip += res.equip;
                    this.ServerMap[res.destI][res.destJ].food += res.food;
                    this.ServerMap[res.I][res.J].soldier -= res.soldier;
                    this.ServerMap[res.I][res.J].equip -= res.equip;
                    this.ServerMap[res.I][res.J].food -= res.food;
                } else if (res.special == "missile" && this.ServerMap[res.I][res.J].authority != this.ServerMap[res.destI][res.destJ].authority && this.ServerMap[res.I][res.J].authority == res.authority && this.ServerMap[res.I][res.J].equip >= MissileLaunchCost) {
                    this.ServerMap[res.I][res.J].equip -= MissileLaunchCost;
                    this.ServerMap[res.destI][res.destJ].soldier = Math.max(0, this.ServerMap[res.destI][res.destJ].soldier - MissileDamage);
                } 
            })
        }
    }
    ServerIntervalWork() {
        firebase.database().ref("Room/" + this.room_id + "/action").remove();
        this.ServerTurn += 1;
        for (let i = 0; i < this.ServerMap.height; i ++ ) {
            for (let j = 0; j < this.ServerMap.width; j ++ ) {
                if (this.ServerMap[i][j].food == 0) {
                    this.ServerMap[i][j].soldier = Math.round(SoldierAway * this.ServerMap[i][j].soldier);
                }
                this.ServerMap[i][j].food += FarmFoodIncrease * this.ServerMap[i][j].farm + this.ServerMap[i][j].city * CityFoodIncrease;
                this.ServerMap[i][j].food -= this.ServerMap[i][j].soldier / SoldierConsumeFood;
                this.ServerMap[i][j].food = Math.max(0, this.ServerMap[i][j].food);
                this.ServerMap[i][j].soldier += CitySoldierIncrease * this.ServerMap[i][j].city;
                this.ServerMap[i][j].equip += IndustryEquipIncrease * this.ServerMap[i][j].industry;

                this.ServerMap[i][j].soldier = Math.round(this.ServerMap[i][j].soldier);
                this.ServerMap[i][j].equip = Math.round(this.ServerMap[i][j].equip);
                this.ServerMap[i][j].food = Math.round(this.ServerMap[i][j].food);
            }
        }
        firebase.database().ref("Room/" + this.room_id + "/map").set(this.ServerMap);
        firebase.database().ref("Room/" + this.room_id + "/turn").set(this.ServerTurn);

        let Over = true;
        for (let i = 0; i < this.ServerMap.height; i ++ ) {
            for (let j = 0; j < this.ServerMap.width; j ++ ) {
                Over &&= (this.ServerMap[0][0].authority == this.ServerMap[i][j].authority);
            }
        }
        if (Over) {
            console.log("Over")
            for (let i = 0; i < this.GameInfo.map.number; i ++ ) 
                firebase.database().ref("Room/" + this.room_id + "/counter/" + i).set(this.KillCounter[i]);
            firebase.database().ref("Room/" + this.room_id + "/winner/").set(this.ServerMap[0][0].authority);
            firebase.database().ref("Room/" + this.room_id + "/state/").set("Result");
            this.scheduleOnce(() => {
                firebase.database().ref("Room/" + this.room_id).remove();
            }, 10);
        }
    }

    RegisterKeyBoardEvent(event: any) {
        if (event.keyCode == 16) {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.GetPos, this);
            this.node.on(cc.Node.EventType.MOUSE_UP, this.RemoveMove, this);

        } else if (event.keyCode == 65) { // A
            if (this.GridX != null && this.GridY - 1 >= 0) {
                if (this.GameInfo.map[this.GridX][this.GridY].authority == this.GameInfo.authority[this.user.uid]) {
                    let SoldierMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].soldier * this.SoldierSlider.progress);
                    let EquipMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].equip * this.EquipSlider.progress);
                    let FoodMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].food * this.FoodSlider.progress);

                    this.GameInfo.map[this.GridX][this.GridY].soldier = this.GameInfo.map[this.GridX][this.GridY].soldier - SoldierMoved;
                    this.GameInfo.map[this.GridX][this.GridY].equip = this.GameInfo.map[this.GridX][this.GridY].equip - EquipMoved;
                    this.GameInfo.map[this.GridX][this.GridY].food = this.GameInfo.map[this.GridX][this.GridY].food - FoodMoved;

                    if (this.ShowState == "Army") {
                        this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
                        this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
                        this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
                    }
                    
                    this.ShowGridInformation(this.GridX, this.GridY, 1);

                    firebase.database().ref("Room/" + this.room_id + "/action/advance/").push({
                        I: this.GridX,
                        J: this.GridY,
                        authority: this.GameInfo.authority[this.user.uid],
                        soldier: SoldierMoved,
                        equip: EquipMoved,
                        food: FoodMoved,
                        destI: this.GridX,
                        destJ: this.GridY - 1
                    })
                }
            }
        } else if (event.keyCode == 83) { // S
            if (this.GridX != null && this.GridX + 1 < this.GameInfo.map.height) {
                if (this.GameInfo.map[this.GridX][this.GridY].authority == this.GameInfo.authority[this.user.uid]) {
                    let SoldierMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].soldier * this.SoldierSlider.progress);
                    let EquipMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].equip * this.EquipSlider.progress);
                    let FoodMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].food * this.FoodSlider.progress);

                    this.GameInfo.map[this.GridX][this.GridY].soldier = this.GameInfo.map[this.GridX][this.GridY].soldier - SoldierMoved;
                    this.GameInfo.map[this.GridX][this.GridY].equip = this.GameInfo.map[this.GridX][this.GridY].equip - EquipMoved;
                    this.GameInfo.map[this.GridX][this.GridY].food = this.GameInfo.map[this.GridX][this.GridY].food - FoodMoved;

                    if (this.ShowState == "Army") {
                        this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
                        this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
                        this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
                    }
                    
                    this.ShowGridInformation(this.GridX, this.GridY, 1);

                    firebase.database().ref("Room/" + this.room_id + "/action/advance/").push({
                        I: this.GridX,
                        J: this.GridY,
                        authority: this.GameInfo.authority[this.user.uid],
                        soldier: SoldierMoved,
                        equip: EquipMoved,
                        food: FoodMoved,
                        destI: this.GridX + 1,
                        destJ: this.GridY
                    })
                }
            }
        } else if (event.keyCode == 68) { // D
            if (this.GridX != null && this.GridY + 1 < this.GameInfo.map.width) {
                if (this.GameInfo.map[this.GridX][this.GridY].authority == this.GameInfo.authority[this.user.uid]) {
                    let SoldierMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].soldier * this.SoldierSlider.progress);
                    let EquipMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].equip * this.EquipSlider.progress);
                    let FoodMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].food * this.FoodSlider.progress);

                    this.GameInfo.map[this.GridX][this.GridY].soldier = this.GameInfo.map[this.GridX][this.GridY].soldier - SoldierMoved;
                    this.GameInfo.map[this.GridX][this.GridY].equip = this.GameInfo.map[this.GridX][this.GridY].equip - EquipMoved;
                    this.GameInfo.map[this.GridX][this.GridY].food = this.GameInfo.map[this.GridX][this.GridY].food - FoodMoved;

                    if (this.ShowState == "Army") {
                        this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
                        this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
                        this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
                    }

                    this.ShowGridInformation(this.GridX, this.GridY, 1);

                    firebase.database().ref("Room/" + this.room_id + "/action/advance/").push({
                        I: this.GridX,
                        J: this.GridY,
                        authority: this.GameInfo.authority[this.user.uid],
                        soldier: SoldierMoved,
                        equip: EquipMoved,
                        food: FoodMoved,
                        destI: this.GridX,
                        destJ: this.GridY + 1
                    })
                }
            }
        } else if (event.keyCode == 87) { // W
            if (this.GridX != null && this.GridX - 1 >= 0) {
                if (this.GameInfo.map[this.GridX][this.GridY].authority == this.GameInfo.authority[this.user.uid]) {
                    let SoldierMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].soldier * this.SoldierSlider.progress);
                    let EquipMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].equip * this.EquipSlider.progress);
                    let FoodMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].food * this.FoodSlider.progress);

                    this.GameInfo.map[this.GridX][this.GridY].soldier = this.GameInfo.map[this.GridX][this.GridY].soldier - SoldierMoved;
                    this.GameInfo.map[this.GridX][this.GridY].equip = this.GameInfo.map[this.GridX][this.GridY].equip - EquipMoved;
                    this.GameInfo.map[this.GridX][this.GridY].food = this.GameInfo.map[this.GridX][this.GridY].food - FoodMoved;

                    if (this.ShowState == "Army") {
                        this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
                        this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
                        this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
                    }
                    
                    this.ShowGridInformation(this.GridX, this.GridY, 1);

                    firebase.database().ref("Room/" + this.room_id + "/action/advance/").push({
                        I: this.GridX,
                        J: this.GridY,
                        authority: this.GameInfo.authority[this.user.uid],
                        soldier: SoldierMoved,
                        equip: EquipMoved,
                        food: FoodMoved,
                        destI: this.GridX - 1,
                        destJ: this.GridY
                    })
                }
            }
        } else if (event.keyCode == 81) { // Q
            this.ShowGridInformation(this.GridX, this.GridY, 0.5);
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
    }
    InitGridArrays() {
        this.KillCounter = new Array(this.GameInfo.map.number);
        for (let i = 0; i < this.GameInfo.map.number; ++ i) 
            this.KillCounter[i] = 0;

        this.MapGrid = new Array(this.GameInfo.map.height);
        this.NumberTop = new Array(this.GameInfo.map.height);
        this.NumberCenter = new Array(this.GameInfo.map.height);
        this.NumberBottom = new Array(this.GameInfo.map.height);
        this.Soldier = new Array(this.GameInfo.map.height);
        this.Equip = new Array(this.GameInfo.map.height);
        this.Food = new Array(this.GameInfo.map.height);
        this.Fog = new Array(this.GameInfo.map.height);
        this.FogPic = new Array(this.GameInfo.map.height);
        this.Identity = new Array(this.GameInfo.map.height);
        this.SelfFloor = new Array(this.GameInfo.map.height);
        this.EnemyFloor = new Array(this.GameInfo.map.height);
        this.CityLv0 = new Array(this.GameInfo.map.height);
        this.CityLv1 = new Array(this.GameInfo.map.height);
        this.CityLv2 = new Array(this.GameInfo.map.height);
        this.CityLv3 = new Array(this.GameInfo.map.height);
        this.CityLv4 = new Array(this.GameInfo.map.height);
        this.hasMissileLaunched = new Array(this.GameInfo.map.height);
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            this.MapGrid[i] = new Array(this.GameInfo.map.width);
            this.NumberTop[i] = new Array(this.GameInfo.map.width);
            this.NumberCenter[i] = new Array(this.GameInfo.map.width);
            this.NumberBottom[i] = new Array(this.GameInfo.map.width);
            this.Soldier[i] = new Array(this.GameInfo.map.width);
            this.Equip[i] = new Array(this.GameInfo.map.width);
            this.Food[i] = new Array(this.GameInfo.map.width);
            this.Fog[i] = new Array(this.GameInfo.map.width);
            this.FogPic[i] = new Array(this.GameInfo.map.width);
            this.Identity[i] = new Array(this.GameInfo.map.width);
            this.SelfFloor[i] = new Array(this.GameInfo.map.width);
            this.EnemyFloor[i] = new Array(this.GameInfo.map.width);
            this.CityLv0[i] = new Array(this.GameInfo.map.width);
            this.CityLv1[i] = new Array(this.GameInfo.map.width);
            this.CityLv2[i] = new Array(this.GameInfo.map.width);
            this.CityLv3[i] = new Array(this.GameInfo.map.width);
            this.CityLv4[i] = new Array(this.GameInfo.map.width);
            this.hasMissileLaunched[i] = new Array(this.GameInfo.map.width);
        }
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++) {
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
        /*for (let i = -1; i < this.GameInfo.map.height; i ++) {
            let horizontal = cc.instantiate(this.LinePrefab);
            horizontal.parent = this.node;
            horizontal.color = new cc.Color(0, 0, 0);
            horizontal.width = this.node.width;
            horizontal.height = 3;
            horizontal.opacity = 0;
            horizontal.setPosition(this.node.width / 2, -i * GridSize, 0);
        }
        for (let i = 0; i <= this.GameInfo.map.width; i ++) {
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
        this.GameInfo.map[this.GridX][this.GridY].food -= (this.GameInfo.map[this.GridX][this.GridY].city + 1) * CityUpgradeCost;
        this.GameInfo.map[this.GridX][this.GridY].city += 1;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/upgrade/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            upgrade: "city"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
        if (this.ShowState == "Level") {
            this.NumberTop[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].city == 0 ? "" : "C:" + this.GameInfo.map[this.GridX][this.GridY].city);
            this.NumberCenter[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].industry == 0 ? "" : "I:" + this.GameInfo.map[this.GridX][this.GridY].industry);
            this.NumberBottom[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].farm == 0 ? "" : "F:" + this.GameInfo.map[this.GridX][this.GridY].farm);
        }
    }
    IndustryLevelUpgradeClick() {
        this.GameInfo.map[this.GridX][this.GridY].food -= (this.GameInfo.map[this.GridX][this.GridY].industry + 1) * IndustryUpgradeCost;
        this.GameInfo.map[this.GridX][this.GridY].industry += 1;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/upgrade/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            upgrade: "industry"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
        if (this.ShowState == "Level") {
            this.NumberTop[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].city == 0 ? "" : "C:" + this.GameInfo.map[this.GridX][this.GridY].city);
            this.NumberCenter[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].industry == 0 ? "" : "I:" + this.GameInfo.map[this.GridX][this.GridY].industry);
            this.NumberBottom[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].farm == 0 ? "" : "F:" + this.GameInfo.map[this.GridX][this.GridY].farm);
        }
    }
    FarmLevelUpgradeClick() {
        this.GameInfo.map[this.GridX][this.GridY].food -= (this.GameInfo.map[this.GridX][this.GridY].farm + 1) * FarmUpgradeCost;
        this.GameInfo.map[this.GridX][this.GridY].farm += 1;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/upgrade/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            upgrade: "farm"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string =  this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
        if (this.ShowState == "Level") {
            this.NumberTop[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].city == 0 ? "" : "C:" + this.GameInfo.map[this.GridX][this.GridY].city);
            this.NumberCenter[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].industry == 0 ? "" : "I:" + this.GameInfo.map[this.GridX][this.GridY].industry);
            this.NumberBottom[this.GridX][this.GridY].string = (this.GameInfo.map[this.GridX][this.GridY].farm == 0 ? "" : "F:" + this.GameInfo.map[this.GridX][this.GridY].farm);
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
        this.GameInfo.map[this.GridX][this.GridY].food -= AirportConstructCost;
        this.GameInfo.map[this.GridX][this.GridY].airport = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Airport"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
    }
    MissileToggleCheck() {
        this.GameInfo.map[this.GridX][this.GridY].food -= MissileConstructCost;
        this.GameInfo.map[this.GridX][this.GridY].missile = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Missile"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
    }
    TrenchToggleCheck() {
        this.GameInfo.map[this.GridX][this.GridY].food -= TrenchConstructCost;
        this.GameInfo.map[this.GridX][this.GridY].trench = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Trench"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
    }
    FortToggleCheck() {
        this.GameInfo.map[this.GridX][this.GridY].food -= FortConstructCost;
        this.GameInfo.map[this.GridX][this.GridY].fort = true;
        this.ShowGridInformation(this.GridX, this.GridY);
        firebase.database().ref("Room/" + this.room_id + "/action/construct/").push({
            I: this.GridX,
            J: this.GridY,
            authority: this.GameInfo.authority[this.user.uid],
            construction: "Fort"
        });
        if (this.ShowState == "Army") {
            this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
            this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
            this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
        }
    }
    // 移動畫面時會觸發按鍵的點擊
    AirportGridMoving(event: any, i: number, j: number) {
        if (event.getLocationX() <= 1200) {
            if (Math.abs(i - this.GridX) + Math.abs(j - this.GridY) <= 2 && this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid] && this.GameInfo.map[this.GridX][this.GridY].equip >= AirportMoveCost) {
                let SoldierMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].soldier * this.SoldierSlider.progress);
                let EquipMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].equip * this.EquipSlider.progress);
                let FoodMoved = Math.round(this.GameInfo.map[this.GridX][this.GridY].food * this.FoodSlider.progress);
                this.GameInfo.map[this.GridX][this.GridY].equip -= AirportMoveCost;
                EquipMoved = Math.min(EquipMoved, this.GameInfo.map[this.GridX][this.GridY].equip)

                this.GameInfo.map[this.GridX][this.GridY].soldier = this.GameInfo.map[this.GridX][this.GridY].soldier - SoldierMoved;
                this.GameInfo.map[this.GridX][this.GridY].equip = this.GameInfo.map[this.GridX][this.GridY].equip - EquipMoved;
                this.GameInfo.map[this.GridX][this.GridY].food = this.GameInfo.map[this.GridX][this.GridY].food - FoodMoved;

                if (this.ShowState == "Army") {
                    this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
                    this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
                    this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
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
            if (Math.abs(i - this.GridX) + Math.abs(j - this.GridY) <= 3 && this.GameInfo.map[i][j].authority != this.GameInfo.authority[this.user.uid] && this.GameInfo.map[this.GridX][this.GridY].equip >= MissileLaunchCost) {
                this.GameInfo.map[this.GridX][this.GridY].equip -= MissileLaunchCost;
                this.hasMissileLaunched[this.GridX][this.GridY] = true;

                if (this.ShowState == "Army") {
                    this.NumberTop[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].soldier;
                    this.NumberCenter[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].equip;
                    this.NumberBottom[this.GridX][this.GridY].string = this.GameInfo.map[this.GridX][this.GridY].food;
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
        let ok = (this.GameInfo.map[this.GridX][this.GridY].authority == this.GameInfo.authority[this.user.uid]);
        for (let k = 0; k < 4; k ++ ) {
            let tx = this.GridX + this.dx[k], ty = this.GridY + this.dy[k];
            if (0 <= tx && tx < this.GameInfo.map.height && 0 <= ty && ty < this.GameInfo.map.width) {
                ok ||= (this.GameInfo.map[tx][ty].authority == this.GameInfo.authority[this.user.uid]);
            }
        }
        
        if (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]) {
            /*this.Fog[i][j].opacity = 150;
            this.FogPic[i][j].opacity = 0;*/

            this.SoldierNumber.string = "Soldier: " + this.GameInfo.map[i][j].soldier + "/" + this.GameInfo.map[i][j].soldier;
            this.EquipNumber.string = "Equip: " + this.GameInfo.map[i][j].equip + "/" + this.GameInfo.map[i][j].equip;
            this.FoodNumber.string = "Food: " + this.GameInfo.map[i][j].food + "/" + this.GameInfo.map[i][j].food;
            
            this.CityLevelText.string = "City: " + this.GameInfo.map[i][j].city;
            this.IndustryLevelText.string = "Industry: " + this.GameInfo.map[i][j].industry;
            this.FarmLevelText.string = "Farm: " + this.GameInfo.map[i][j].farm;

            this.CityUpgradeText.string = "+ " + (this.GameInfo.map[i][j].city + 1) * CityUpgradeCost;
            this.IndustryUpgradeText.string = "+ " + (this.GameInfo.map[i][j].industry + 1) * IndustryUpgradeCost;
            this.FarmUpgradeText.string = "+ " + (this.GameInfo.map[i][j].farm + 1) * FarmUpgradeCost;

            this.CityUpgradeBtn.interactable = !(this.GameInfo.map[i][j].city == "5" || this.GameInfo.map[i][j].food < (this.GameInfo.map[i][j].city + 1) * CityUpgradeCost);
            this.IndustryUpgradeBtn.interactable = !(this.GameInfo.map[i][j].industry == "5" || this.GameInfo.map[i][j].food < (this.GameInfo.map[i][j].industry + 1) * IndustryUpgradeCost);
            this.FarmUpgradeBtn.interactable = !(this.GameInfo.map[i][j].farm == "5" || this.GameInfo.map[i][j].food < (this.GameInfo.map[i][j].farm + 1) * FarmUpgradeCost);

            this.AirportToggle.isChecked = (this.GameInfo.map[i][j].airport == true);
            this.MissileToggle.isChecked = (this.GameInfo.map[i][j].missile == true);
            this.TrenchToggle.isChecked = (this.GameInfo.map[i][j].trench == true);
            this.FortToggle.isChecked = (this.GameInfo.map[i][j].fort == true);
            this.NatureToggle.isChecked = (this.GameInfo.map[i][j].nature == true);

            this.AirportMoveBtn.interactable = (this.isAirportMoving == false);
            this.AirportMoveBtn.node.active = (this.AirportToggle.isChecked && this.GameInfo.map[i][j].equip >= AirportMoveCost && this.isMissileLaunching == false);
            this.MissileLaunchBtn.interactable = (this.isMissileLaunching == false);
            this.MissileLaunchBtn.node.active = (this.MissileToggle.isChecked && this.GameInfo.map[i][j].equip >= MissileLaunchCost && this.isAirportMoving == false && this.hasMissileLaunched[i][j] == false);
            
            this.AirportPrice.node.active = !this.AirportToggle.isChecked;
            this.MissilePrice.node.active = !this.MissileToggle.isChecked;
            this.TrenchPrice.node.active = !this.TrenchToggle.isChecked;
            this.FortPrice.node.active = !this.FortToggle.isChecked;

            this.AirportToggle.interactable = !(this.GameInfo.map[i][j].airport == true || this.GameInfo.map[i][j].food < AirportConstructCost);
            this.MissileToggle.interactable = !(this.GameInfo.map[i][j].missile == true || this.GameInfo.map[i][j].food < MissileConstructCost);
            this.TrenchToggle.interactable = !(this.GameInfo.map[i][j].trench == true || this.GameInfo.map[i][j].food < TrenchConstructCost);
            this.FortToggle.interactable = !(this.GameInfo.map[i][j].fort == true || this.GameInfo.map[i][j].food < FortConstructCost);
            
        } else {
            this.SoldierNumber.string = "Soldier: 0/0";
            this.EquipNumber.string = "Equip: 0/0";
            this.FoodNumber.string = "Food: 0/0";
            
            this.CityLevelText.string = "City: ";
            this.IndustryLevelText.string = "Industry: ";
            this.FarmLevelText.string = "Farm: ";

            this.CityUpgradeText.string = "+ ";
            this.IndustryUpgradeText.string = "+ ";
            this.FarmUpgradeText.string = "+ ";

            this.CityUpgradeBtn.interactable = false;
            this.IndustryUpgradeBtn.interactable = false;
            this.FarmUpgradeBtn.interactable = false;

            this.AirportToggle.isChecked = false;
            this.MissileToggle.isChecked = false;
            this.TrenchToggle.isChecked = false;
            this.FortToggle.isChecked = false;
            this.NatureToggle.isChecked = false;

            this.AirportMoveBtn.node.active = false;
            this.MissileLaunchBtn.node.active = false;
            this.AirportPrice.node.active = false;
            this.MissilePrice.node.active = false;
            this.TrenchPrice.node.active = false;
            this.FortPrice.node.active = false;

            this.AirportToggle.interactable = false;
            this.MissileToggle.interactable = false;
            this.TrenchToggle.interactable = false;
            this.FortToggle.interactable = false;
        }

        this.GridX = i;
        this.GridY = j;
        if (ratio != null) {
            this.SoldierSlider.progress = ratio;
            this.EquipSlider.progress = ratio;
            this.FoodSlider.progress = ratio;
        }
        if (ok)
            this.SlideNumberUpdatingAll();
    }
    SlideNumberUpdatingAll() {
        this.SoliderNumberSlide();
        this.EquipNumberSlide();
        this.FoodNumberSlide();
    }
    SoliderNumberSlide() {
        let num = Math.round(this.SoldierSlider.progress * this.GameInfo.map[this.GridX][this.GridY].soldier);
        this.SoldierNumber.string = "Soldier: " + num + "/" + this.GameInfo.map[this.GridX][this.GridY].soldier;
    }
    EquipNumberSlide() {
        let num = Math.round(this.EquipSlider.progress * this.GameInfo.map[this.GridX][this.GridY].equip);
        this.EquipNumber.string = "Equip: " + num + "/" + this.GameInfo.map[this.GridX][this.GridY].equip;
    }
    FoodNumberSlide() {
        let num = Math.round(this.FoodSlider.progress * this.GameInfo.map[this.GridX][this.GridY].food);
        this.FoodNumber.string = "Food: " + num + "/" + this.GameInfo.map[this.GridX][this.GridY].food;
    }
    
    @property
    ShowState: String = "Name";
    ShowName() {
        this.ShowState = "Name";
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                let ok = (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]);
                for (let k = 0; k < 4; k ++ ) {
                    let tx = i + this.dx[k], ty = j + this.dy[k];
                    if (0 <= tx && tx < this.GameInfo.map.height && 0 <= ty && ty < this.GameInfo.map.width) {
                        ok ||= (this.GameInfo.map[tx][ty].authority == this.GameInfo.authority[this.user.uid]);
                    }
                }

                this.NumberTop[i][j].string = "";
                this.NumberCenter[i][j].string = (ok ? this.GameInfo.map[i][j].name : "");
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
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                let ok = (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]);
                for (let k = 0; k < 4; k ++ ) {
                    let tx = i + this.dx[k], ty = j + this.dy[k];
                    if (0 <= tx && tx < this.GameInfo.map.height && 0 <= ty && ty < this.GameInfo.map.width) {
                        ok ||= (this.GameInfo.map[tx][ty].authority == this.GameInfo.authority[this.user.uid]);
                    }
                }

                this.NumberTop[i][j].string = (ok ? this.GameInfo.map[i][j].soldier : "");
                this.NumberCenter[i][j].string = (ok ? this.GameInfo.map[i][j].equip : "??");
                this.NumberBottom[i][j].string = (ok ? this.GameInfo.map[i][j].food : "");
                this.Soldier[i][j].opacity = (ok ? 255 : 0);
                this.Equip[i][j].opacity = (ok ? 255 : 0);
                this.Food[i][j].opacity = (ok ? 255 : 0);
            }
        }
        this.ShowVisible();
    }
    ShowLevel() {
        this.ShowState = "Level";
        for (let i = 0; i < this.GameInfo.map.height; i ++) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                let ok = (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]);
                for (let k = 0; k < 4; k ++ ) {
                    let tx = i + this.dx[k], ty = j + this.dy[k];
                    if (0 <= tx && tx < this.GameInfo.map.height && 0 <= ty && ty < this.GameInfo.map.width) {
                        ok ||= (this.GameInfo.map[tx][ty].authority == this.GameInfo.authority[this.user.uid]);
                    }
                }

                this.NumberTop[i][j].string = (ok ? "City: Lv" + this.GameInfo.map[i][j].city : "");
                this.NumberCenter[i][j].string = (ok ? "Ind.: Lv" + this.GameInfo.map[i][j].industry : "??");
                this.NumberBottom[i][j].string = (ok ? "Farm: Lv" + this.GameInfo.map[i][j].farm : "");
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
        for (let i = 0; i < this.GameInfo.map.height; i ++ ) {
            for (let j = 0; j < this.GameInfo.map.width; j ++ ) {
                let ok = (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]);
                for (let k = 0; k < 4; k ++ ) {
                    let tx = i + this.dx[k], ty = j + this.dy[k];
                    if (0 <= tx && tx < this.GameInfo.map.height && 0 <= ty && ty < this.GameInfo.map.width) {
                        ok ||= (this.GameInfo.map[tx][ty].authority == this.GameInfo.authority[this.user.uid]);
                    }
                }

                if (this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]) {
                    this.Fog[i][j].opacity = 0;
                    this.FogPic[i][j].opacity = 0;
                    if (this.GameInfo.map[i][j].city == "0" && this.GameInfo.map[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 255;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    } else if (this.GameInfo.map[i][j].city == "1" && this.GameInfo.map[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 255;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    } else if (this.GameInfo.map[i][j].city == "2" && this.GameInfo.map[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 255;
                        this.CityLv3[i][j].opacity = 0;
                        this.CityLv4[i][j].opacity = 0;
                    } else if (this.GameInfo.map[i][j].city == "3" && this.GameInfo.map[i][j].soldier > 0) {
                        this.CityLv0[i][j].opacity = 0;
                        this.CityLv1[i][j].opacity = 0;
                        this.CityLv2[i][j].opacity = 0;
                        this.CityLv3[i][j].opacity = 255;
                        this.CityLv4[i][j].opacity = 0;
                    } else if ((this.GameInfo.map[i][j].city == "4" || this.GameInfo.map[i][j].city == "5") && this.GameInfo.map[i][j].soldier > 0) {
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
                } else if (ok) {
                    this.Fog[i][j].opacity = 0;
                    this.FogPic[i][j].opacity = 0;
                    this.CityLv0[i][j].opacity = 0;
                    this.CityLv1[i][j].opacity = 0;
                    this.CityLv2[i][j].opacity = 0;
                    this.CityLv3[i][j].opacity = 0;
                    this.CityLv4[i][j].opacity = 0;
                } else {
                    this.Fog[i][j].opacity = 255;
                    this.FogPic[i][j].opacity = 255;
                    this.CityLv0[i][j].opacity = 0;
                    this.CityLv1[i][j].opacity = 0;
                    this.CityLv2[i][j].opacity = 0;
                    this.CityLv3[i][j].opacity = 0;
                    this.CityLv4[i][j].opacity = 0;
                    
                }

                this.Identity[i][j].color = ColorAuthority[this.GameInfo.map[i][j].authority];
            
                if (ok && this.GameInfo.map[i][j].authority == this.GameInfo.authority[this.user.uid]) {
                    this.SelfFloor[i][j].opacity = 255;
                    this.EnemyFloor[i][j].opacity = 0;
                } else if (ok) {
                    this.SelfFloor[i][j].opacity = 0;
                    this.EnemyFloor[i][j].opacity = 255;
                } else {
                    this.SelfFloor[i][j].opacity = 0;
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
