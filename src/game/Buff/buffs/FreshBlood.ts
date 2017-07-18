/**
 * 新鲜血液
 * 对第一个攻击到的敌人造成额外伤害，对BOSS效果减半，冷却时间45秒。
 */
class FreshBlood extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "FreshBlood";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this._isFirst = false;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        let newBuff = ObjectPool.pop(this.buffData.className);
        newBuff.buffInit(this.options);
        this.target.addBuff(newBuff);
        this._isFirst = false;
        TimerManager.getInstance().remove(this.buffEnd, this);
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        let value:number = this.getTalentValue();
        if (!this._isFirst) {
            this._isFirst = true;
            let hurtValue:number = Math.floor(this.target.attr.atk * (value/100+1));
            Common.log("FreshBlood", hurtValue);
            target.gotoHurt(hurtValue);
            let index = this.target.buff.indexOf(this);
            this.target.buff.splice(index, 1);
            ObjectPool.push(this);
            let duration = this.buffData.cd * 1000;
            TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
        }
        if (callBack) {
            callBack();
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        // this.ShowEffect();
    }

    /**显示特效 */
    public ShowEffect() {
        // this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        // this.target.skillArmature.visible = false;
    }

    private _isFirst:boolean;
    private target:any;
}