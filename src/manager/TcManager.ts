class TcManager{
    public constructor(){
        //(0)装备表 (1)升星配置表 (2)升级配置表
        let str_list:Array<string> = ["TcEquip_json","TcEquipStarUp_json","TcEquipUp_json", "TcTalentUp_json"];
        this.tc_list = [];
        for(let i:number = 0; i < str_list.length; i++){
            this.tc_list[i] = RES.getRes(str_list[i]);
        }
    }

    public static Instance:TcManager;
    public static GetInstance():TcManager{
        if(this.Instance == null){
            this.Instance = new TcManager();
        }
        return this.Instance;
    }

    public GetTcEquipData(id:number):any{
        let list = this.tc_list[0];
        for(let i:number = 0; i < list.length; i++){
            if(id == list[i].id) return list[i];
        }

        return null;
    }

    public GetTcEquipStarUpData(grade:number,star:number):any{
        let list = this.tc_list[1];
        for(let i in list){
            if(list[i].stage == grade && list[i].star == star){
                return list[i];
            }
        }
        return null;
    }

    /** 根据等级来获得对应的数据 (2)装备升级配置 (3)天赋升级配置 */
    public GetDataFromLv(index:number, lv:number):any{
         let list = this.tc_list[index];
          for(let i:number = 0; i < list.length; i++){
            if(lv == list[i].lv){
                return list[i];
            }
        }
        return null;
    }

    private tc_list:any;
}