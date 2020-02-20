export class properties{

    //singleton instance

    private appUrl : string;
    private static _instance : properties;
    private appToken: string;
    private cb:any;

    private logoutAction:any;

    private constructor(){
        this.appUrl = 'http://192.168.0.21:3000/api';
    }

    public getAppUrl(){
        return this.appUrl;
    }

    public getAppToken(){
        return this.appToken;
    }

    public getCb(){
        return this.cb;
    }

    public getLogoutAction(){
        return this.logoutAction
    }

    public static getInstance(){        
        if(!this._instance)
        {
            this._instance = new this();
            return this._instance;
        }
        return this._instance;
    }    

    public static setToken(tokenValue){
        this.getInstance().appToken = tokenValue;
    }

    public static addCb(cb){
        this.getInstance().cb = cb;
    }

    public static setLogoutAction(logoutAction){
        this.getInstance().logoutAction = logoutAction;
    }

}

