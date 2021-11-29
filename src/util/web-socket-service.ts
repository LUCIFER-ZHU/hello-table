import { AppWebSocketHooks } from '../ui-core/hooks'

/**
 * webSocketService
 *
 */
export class webSocketService {

  /**
   * @description 服务实例对象
   * @private
   * @static
   * @type {webSocketService}
   * @memberof webSocketService
   */
  private static instance: webSocketService;

  /**
   * @description webSocket引用集合
   * @type {Map<string, any>}
   * @memberof webSocketService
   */
  public webSocketMap: Map<string, any> = new Map();

  /**
   * Creates an instance of webSocket.
   * @memberof webSocketService
   */
  constructor() {

  }

  /**
   * @description 获取webSocket服务(单例模式)
   * @static
   * @return {webSocketService}
   * @memberof webSocketService
   */
  public static getInstance(): webSocketService {
    if (!this.instance) {
      this.instance = new webSocketService();
    }
    return this.instance;
  }

  /**
   * @description 获取websocket对象
   * @param {string} url 地址
   * @memberof AppComponentService
   */
  public getWebSocketObj(url: string): any {
    if (this.webSocketMap.get(url)) {
      return this.webSocketMap.get(url);
    } else {
      let socketObj = new webSocketObj(url);
      this.webSocketMap.set(url,socketObj);
      return socketObj;
    }
  }

}

export class webSocketObj {

  /**
   * Creates an instance of webSocketObj.
   * @memberof webSocketObj
   */
  constructor(url: string) {
    this.initWebSocket(url);
  }

  /**
   * @description 钩子
   * @memberof webSocketObj
   */    
  public hooks = new AppWebSocketHooks();

  /**
   * @description socket
   * @memberof webSocketObj
   */    
  public socket:any;

  /**
   * @description 初始化
   * @memberof webSocketObj
   */  
  public initWebSocket(url: string) {
    this.socket = new WebSocket("wss://" + url);
    this.socket.onopen = (event: any) => {
      console.log('websocket连接成功', event);
      this.hooks.onOpenEvent.callSync({
        event
      });
    };
    this.socket.onmessage = (event: any) => {
      console.log("messageinfo", event);
      this.hooks.onMessageEvent.callSync({
        event
      });      
    };
    this.socket.onerror = (event: any) => {
      console.log("WebSocket连接打开失败", event);
      this.hooks.onErrorEvent.callSync({
        event
      });        
    };
    this.socket.onclose = (event: any) => {
      console.log("WebSocket 已关闭！", event);
      this.hooks.onCloseEvent.callSync({
        event
      });       
    };
  }

  /**
   * @description 连接成功
   * @memberof webSocketObj
   */   
  public onWebSocketOpen(fn:any){
    this.hooks.onOpenEvent.tap(fn);
  }

  /**
   * @description 接收服务器消息
   * @memberof webSocketObj
   */   
  public onWebSocketMessage(fn:any){
    this.hooks.onMessageEvent.tap(fn);
  }

  /**
   * @description 连接失败
   * @memberof webSocketObj
   */   
  public onWebSocketError(fn:any){
    this.hooks.onErrorEvent.tap(fn);
  }

  /**
   * @description 连接关闭
   * @memberof webSocketObj
   */   
  public onWebSocketClose(fn:any){
    this.hooks.onCloseEvent.tap(fn);
  }


}