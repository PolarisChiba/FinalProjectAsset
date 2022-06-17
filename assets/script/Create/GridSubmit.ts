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
    NowGrid: cc.Label = null;

    @property(cc.EditBox)
    Name: cc.EditBox = null;

    @property(cc.EditBox)
    Authority: cc.EditBox = null;

    @property(cc.EditBox)
    Soldier: cc.EditBox = null;

    @property(cc.EditBox)
    Equip: cc.EditBox = null;

    @property(cc.EditBox)
    Food: cc.EditBox = null;

    @property(cc.EditBox)
    CityLevel: cc.EditBox = null;

    @property(cc.EditBox)
    IndustryLevel: cc.EditBox = null;

    @property(cc.EditBox)
    FarmLevel: cc.EditBox = null;

    @property(cc.Toggle)
    Airport: cc.Toggle = null;

    @property(cc.Toggle)
    Missile: cc.Toggle = null;

    @property(cc.Toggle)
    Trench: cc.Toggle = null;

    @property(cc.Toggle)
    Nature: cc.Toggle = null;

    @property
    r: number = null;

    @property
    c: number = null;

    @property(cc.EditBox)
    MapName: cc.EditBox = null;

    @property(cc.EditBox)
    MapWidth: cc.EditBox = null;

    @property(cc.EditBox)
    MapHeight: cc.EditBox = null;

    @property(cc.Toggle)
    Fort: cc.Toggle = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.r = 0;
        this.c = 0;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.Submit, this);
    }

    // update (dt) {}

    Submit() {
        firebase.database().ref("Map/" + this.MapName.string + "/" + this.r.toString() + "/" + this.c.toString() + "/").set({
            name: this.Name.string,
            authority: Number(this.Authority.string),
            soldier: Number(this.Soldier.string),
            equip: Number(this.Equip.string),
            food: Number(this.Food.string),
            city: Number(this.CityLevel.string),
            industry: Number(this.IndustryLevel.string),
            farm: Number(this.FarmLevel.string),
            airport: this.Airport.isChecked,
            missile: this.Missile.isChecked,
            trench: this.Trench.isChecked,
            nature: this.Nature.isChecked,
            fort: this.Fort.isChecked
        });

        if (this.r == Number(this.MapHeight.string) - 1 && this.c == Number(this.MapWidth.string) - 1) {
            cc.director.loadScene("Room");
        } else if (this.c == Number(this.MapWidth.string) - 1) {
            this.r += 1;
            this.c = 0;
        } else {
            this.c += 1;
        }

        this.NowGrid.string = "(" + this.r + "," + this.c + ")";
        this.Name.string = "";
        this.Authority.string = "0";
        this.Soldier.string = "0";
        this.Equip.string = "0";
        this.Food.string = "0";
        this.CityLevel.string = "0";
        this.IndustryLevel.string = "0";
        this.FarmLevel.string = "0";
        this.Airport.isChecked = false;
        this.Missile.isChecked = false;
        this.Trench.isChecked = false;
        this.Nature.isChecked = false;
    }
}
