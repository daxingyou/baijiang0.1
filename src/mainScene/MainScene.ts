/**
 * 主界面
 */
class MainScene extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/mainSceneSkin.exml"
    }

    private uiCompleteHandler():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)

        this.onListener();
        this.createMainScene();
        this.show_label_text();      
    }

    /** 事件监听 */
    private onListener():void{
        let event_list:any = [this.btn_ready,this.btn_equip,this.btn_talent,this.btn_setting,this.btn_shop,this.btn_applicate,this.btn_close,this.btn_pvp];
        for(let i in event_list) event_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        let img_list:any = [this.img_power,this.img_exp, this.img_soul, this.img_diamond];
        for(let i in img_list){
            img_list[i].name = i;
            img_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchImg, this);
        }
        GameLayerManager.gameLayer().addEventListener(UserData.CHANGEDATA, this.onChangeData, this);
    }

    /** 对象渐变效果 */
    private objFadeEffect(obj:any):void{
        let randTime:number = Math.floor((Math.random() % 10) * 1000);
        randTime = randTime < 100 ? 100 : randTime;
        egret.Tween.get(obj).to({alpha:0.5},randTime).call(()=>{
            egret.Tween.get(obj).to({alpha:1},randTime).call(()=>{
                egret.Tween.removeTweens(obj);
                this.objFadeEffect(obj);
            },this)
        },this);
    }

    /** 创建精灵 */
    private createMovie(name:string,x:number,y:number,index:number = -1):MovieClipManager{
        let movie = new MovieClipManager(name);
        Common.SetXY(movie, x, y);
        if(index != -1){
            this.addChildAt(movie, index);
        }
        else this.addChild(movie);
        return movie;
    }

    /***  创建主场景的精灵动画 包含人物动作 火光 猩猩 */
    private createMainScene():void{
        //星星列表
        this.star_list = [];                                                                                                        
        let starPosition = [[54,174],[75,42],[242,39],[622,80],[738,69],[958,110],[550,170],[1060,122],[1058,335],[1072,412]];
        let star_scale_list = [3, 2, 3, 2, 1, 2, 3, 2, 1, 1];
        for(let i:number = 0; i < 10; i++){
            this.star_list[i] = new egret.Bitmap(RES.getRes("0_0000_yinghuochongda01_png"));
            this.addChild(this.star_list[i]);
            Common.SetXY(this.star_list[i], starPosition[i][0], starPosition[i][1]);
            this.star_list[i].scaleX = star_scale_list[i];
            this.star_list[i].scaleY = star_scale_list[i];
            this.objFadeEffect(this.star_list[i]);
        }
        
        //精灵列表
        let fire = this.createMovie("fire", 382, 384, 2);
        let zhaoyun = this.createMovie("zhaoyun", 424, 207, 1); 
        let hair = this.createMovie("hair", 593, 133); 
        let buxiaomang = this.createMovie("buxiaoman", 605, 118);
        let diaochan = this.createMovie("diaochan", 688, 275);
        let long = this.createMovie("long", 231, 20); 
        let guanyu = this.createMovie("guanyu", 185, 9);
        let sunluban = this.createMovie("sunluban", 11, 242);
        
        //精灵动作
        fire.Action("fire", -1);
        zhaoyun.Wait();
        hair.Action("hair", -1);
        buxiaomang.Wait();
        diaochan.Action("action", -1);
        long.Action("long",-1);
        guanyu.Wait();
        sunluban.MoreAction("action11", 2, 1)

        this._shape = Common.CreateShape(0, 0, this.width, this.height);
        this.setChildIndex(this.img_light, 100);

        //定时器
        let timeNum = 100, lightNum = 0, scaleNum = 0.1;
        let time = new egret.Timer(100);
        this.img_light.scaleX = 3.6, this.img_light.scaleY = 3.6;
        time.addEventListener(egret.TimerEvent.TIMER, ()=>{

            if(timeNum == 0) sunluban.MoreAction("action11", 2, 1) ;
            if(timeNum == 1500) buxiaomang.Action("action", 2);
            else if(timeNum == 3000) guanyu.Action();
            else if(timeNum == 4000)  sunluban.MoreAction("action21", 1, 2);
            else if(timeNum == 4500) zhaoyun.Action();
            timeNum += 50;
            if(timeNum > 6000) timeNum = 0;
           
            this.img_light.scaleX += scaleNum;
            this.img_light.scaleY += scaleNum;

            lightNum++;
            if(lightNum == 4){
                lightNum = 0;
                scaleNum = -scaleNum;
            }
        }, this);
        time.start();        
    }

    private onTouchImg(event:egret.TouchEvent):void{
        let target = event.target;
        let type:number = parseInt(target.name);

        let group = GoodsTipWindow.GetInstance();
        group.Show(this, type);
        Common.SetXY(group, target.x - 120, target.y + target.height + 10);
    }

    /**
     * 按钮处理
     */
    private onButtonHandler(event:egret.TouchEvent):void {
        this._btnFocus = event.currentTarget;

		switch (this._btnFocus) {
			case this.btn_ready:
                SceneManager.nextScene = "battleScene";
                this.ShowPop("ReadyDialog");
				break;
			case this.btn_equip:
                this.ShowPop("EquipDialog");
				break;
            case this.btn_pvp:
                this.ShowPop("PVPWindow");
                break;
			case this.btn_talent:
                this.ShowPop("TalentDialog");
				break;
			case this.btn_setting:
				this.popupGroup.visible = true;
				break;
            case this.btn_shop:
                this.ShowPop("ShopDialog")
                break;
            case this.btn_applicate:
                this.popupGroup.visible = false;
                break;
			default:
                this.popupGroup.visible = false;
				break;
		}
    }

    private ShowPop(clsName:string):void{
        let pop = WindowManager.GetInstance().GetWindow(clsName);
        pop.Show();
        Animations.fadeOut(pop);
    }

     private onChangeData():void{
       GameLayerManager.gameLayer().panelLayer.removeChildren();
       this.addChild(this._shape);
       Animations.fadeIn(this._shape, 350, ()=>{
           this.removeChild(this._shape);
       });

       LeanCloud.GetInstance().SaveRoleBasicData();
       this.show_label_text();
    }

    private show_label_text():void{
        this.lab_exp.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("exp"));
        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("soul"));
        this.lab_diamond.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        this.lab_power.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("power"));
    }

    private _btnFocus:eui.Button;
    /**准备出战 */
    private btn_ready:eui.Button;
    public readyDialog:ReadyDialog;
    /**装备 */
    private btn_equip:eui.Button;
    public equipDialog:EquipDialog;
    /**天赋 */
    private btn_talent:eui.Button;
    public talentDialog:TalentDialog;
    /**设置 */
    private btn_setting:eui.Button;
    /**应用 */
    private btn_applicate:eui.Button;
    /**商城 */
    private btn_shop:eui.Button;
    private shopDialog:ShopDialog;
    /**退出弹窗 */
    private btn_close:eui.Button;

    private btn_pvp:eui.Button;

    private img_light:eui.Image;
    private star_list:Array<egret.Bitmap>;

    private lab_exp:eui.Label;
    private lab_soul:eui.Label;
    private lab_diamond:eui.Label;
    private lab_power:eui.Label;

    private img_exp:eui.Image;
    private img_soul:eui.Image;
    private img_diamond:eui.Image;
    private img_power:eui.Image;

    /**设置弹出 */
    private popupGroup:eui.Group;
    private _shape:egret.Shape;
}