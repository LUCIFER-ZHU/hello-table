import qs from 'qs';
import { Subject } from 'rxjs';
import {
  IPSAppViewLogic,
  IPSAppUIOpenDataLogic,
  IPSAppUILogicRefView,
  IPSNavigateContext,
  IPSNavigateParam,
  IPSAppView,
  IPSAppDEView,
  IPSAppDataEntity,
  IPSAppDERedirectView,
  IPSAppViewRef,
  IPSAppUINewDataLogic,
  IPSAppDERS,
} from '@ibiz/dynamic-model-api';
import { IUIService } from '../interface';
import { ModelTool, LogUtil } from '.';
import { Util } from './util';

export class ViewTool {
  /**
   * 解析参数，返回viewdata
   *
   * @static
   * @param {any[]} [args] 多项数据
   * @param {*} [viewParam] 视图参数
   * @param {any[]} [deResParameters] 关系实体参数对象
   * @param {any[]} [parameters] 当前应用视图参数对象
   * @param {*} [data] 行为参数
   * @returns
   * @memberof ViewTool
   */
  public static getViewdata(
    viewParam: any = {},
    deResParameters: any[],
    parameters: any[],
    args: any[],
    data: any = {},
  ): any {
    const viewdata: any = {};

    let [arg] = args;
    arg = arg ? arg : {};

    // 首页视图参数
    const indexViewParam: any = ViewTool.getIndexViewParam();
    Object.assign(viewdata, indexViewParam);

    // 关系应用实体参数
    deResParameters.forEach(({ pathName, parameterName }: { pathName: string; parameterName: string }) => {
      if (viewParam[parameterName] && !Object.is(viewParam[parameterName], '')) {
        Object.assign(viewdata, { [parameterName]: viewParam[parameterName] });
      } else if (arg[parameterName] && !Object.is(arg[parameterName], '')) {
        Object.assign(viewdata, { [parameterName]: arg[parameterName] });
      }
    });

    // 当前视图参数（应用实体视图）
    parameters.forEach(({ pathName, parameterName }: { pathName: string; parameterName: string }) => {
      if (arg[parameterName] && !Object.is(arg[parameterName], '')) {
        Object.assign(viewdata, { [parameterName]: arg[parameterName] });
      }
    });

    // 视图常规参数
    Object.assign(viewdata, data);
    // 传入父视图的srfsessionid
    Object.assign(viewdata, { srfsessionid: viewParam['srfsessionid'] });
    return viewdata;
  }

  /**
   * 处理路由路径
   *
   * @static
   * @param {*} [context={}] 上下文
   * @param {any[]} deResParameters 关系实体参数对象
   * @param {any[]} parameters 当前应用视图参数对象
   * @param {any[]} args 多项数据
   * @param {*} data 行为参数
   * @param {*} isGlobal 是否为全局
   * @returns {string}
   * @memberof ViewTool
   */
  public static buildUpRoutePath(
    context: any = {},
    deResParameters: any[],
    parameters: any[],
    args: any[],
    data: any,
    isGlobal?: boolean,
  ): string {
    const indexRoutePath = this.getIndexRoutePath(isGlobal);
    const deResRoutePath = this.getDeResRoutePath(context, deResParameters, args);
    const deRoutePath = this.getActiveRoutePath(parameters, args, data, context);
    return `${indexRoutePath}${deResRoutePath}${deRoutePath}`;
  }

  /**
   * 获取首页根路由路径
   *
   * @static
   * @param {Route} route 路由对象
   * @returns {string}
   * @param {*} isGlobal 是否为全局
   * @memberof ViewTool
   */
  public static getIndexRoutePath(isGlobal?: boolean): string {
    const param = null;
    if (isGlobal) {
      if (Util.isExistAndNotEmpty(param)) {
        return `/${App.getEnvironment()?.AppIndexViewName}/${encodeURIComponent(`${param}`)}`;
      }
      return `/${App.getEnvironment()?.AppIndexViewName}`;
    } else {
      if (Util.isExistAndNotEmpty(param)) {
        return `/app/${encodeURIComponent(`${param}`)}`;
      }
      return `/app`;
    }
  }

  /**
   * 获取关系实体路径
   *
   * @static
   * @param {*} [viewParam={}] 视图参数
   * @param {any[]} deResParameters 关系实体参数对象
   * @param {any[]} args 多项数据
   * @returns {string}
   * @memberof ViewTool
   */
  public static getDeResRoutePath(viewParam: any = {}, deResParameters: any[], args: any[]): string {
    let routePath: string = '';
    let [arg] = args;
    arg = arg ? arg : {};
    if (deResParameters && deResParameters.length > 0) {
      deResParameters.forEach(({ pathName, parameterName }: { pathName: string; parameterName: string }) => {
        let value: any = null;
        if (
          viewParam[parameterName] &&
          !Object.is(viewParam[parameterName], '') &&
          !Object.is(viewParam[parameterName], 'null')
        ) {
          value = viewParam[parameterName];
        } else if (arg[parameterName] && !Object.is(arg[parameterName], '') && !Object.is(arg[parameterName], 'null')) {
          value = arg[parameterName];
        }
        routePath =
          `${routePath}/${pathName}` + (Util.isExistAndNotEmpty(value) ? `/${encodeURIComponent(`${value}`)}` : '');
      });
    }
    return routePath;
  }

  /**
   * 当前激活路由路径
   *
   * @static
   * @param {any[]} parameters 当前应用视图参数对象
   * @param {any[]} args 多项数据
   * @param {*} data 行为参数
   * @returns {string}
   * @memberof ViewTool
   */
  public static getActiveRoutePath(parameters: any[], args: any[], data: any, viewParam: any = {}): string {
    let routePath: string = '';
    // 不存在应用实体
    if (parameters && parameters.length > 0) {
      if (parameters.length === 1) {
        const [{ parameterName }] = parameters;
        routePath = `/views/${parameterName}`;
        if (Object.keys(data).length > 0) {
          routePath = `${routePath}?${encodeURIComponent(`${qs.stringify(data, { delimiter: ';' })}`)}`;
        }
      } else if (parameters.length === 2) {
        let [arg] = args;
        arg = arg ? arg : {};
        const [
          { pathName: _pathName, parameterName: _parameterName },
          { pathName: _pathName2, parameterName: _parameterName2 },
        ] = parameters;
        const _value: any = arg[_parameterName] || viewParam[_parameterName] || null;
        routePath = `/${_pathName}${Util.isExistAndNotEmpty(_value) ? `/${_value}` : ''}/views/${_parameterName2}`;
        if (data && Object.keys(data).length > 0) {
          routePath = `${routePath}?${encodeURIComponent(`${qs.stringify(data, { delimiter: ';' })}`)}`;
        }
      }
    }
    return routePath;
  }

  /**
   * 格式化路由参数
   *
   * @static
   * @param {*} params
   * @returns {*}
   * @memberof ViewTool
   */
  public static formatRouteParams(params: any, route: any, context: any, viewparams: any): void {
    Object.keys(params).forEach((key: string, index: number) => {
      const param: string | null | undefined = params[key];
      if (!param || Object.is(param, '') || Object.is(param, 'null')) {
        return;
      }
      if (param.indexOf('=') > 0) {
        const _param = qs.parse(param, { delimiter: ';' });
        Object.assign(context, _param);
      } else {
        Object.assign(context, { [key]: param });
      }
    });
    if (route && route.fullPath && route.fullPath.indexOf('?') > -1) {
      const _viewparams: any = route.fullPath.slice(route.fullPath.indexOf('?') + 1);
      const _viewparamArray: Array<string> = decodeURIComponent(_viewparams).split(';');
      if (_viewparamArray.length > 0) {
        _viewparamArray.forEach((item: any) => {
          Object.assign(viewparams, qs.parse(item));
        });
      }
    }
  }

  /**
   * 首页路由结构参数
   *
   * @private
   * @static
   * @type {any[]}
   * @memberof ViewTool
   */
  private static indexParameters: any[] = [];

  /**
   * 设置首页路由结构参数
   *
   * @static
   * @param {any[]} parameters
   * @memberof ViewTool
   */
  public static setIndexParameters(parameters: any[]): void {
    this.indexParameters = [...parameters];
  }

  /**
   * 获取首页路由结构参数
   *
   * @static
   * @returns {any[]}
   * @memberof ViewTool
   */
  public static getIndexParameters(): any[] {
    return this.indexParameters;
  }

  /**
   * 首页视图参数
   *
   * @static
   * @type {*}
   * @memberof ViewTool
   */
  public static indexViewParam: any = {};

  /**
   * 设置首页视图参数
   *
   * @static
   * @param {*} [viewParam={}]
   * @memberof ViewTool
   */
  public static setIndexViewParam(viewParam: any = {}): void {
    Object.assign(this.indexViewParam, viewParam);
  }

  /**
   * 获取首页视图参数
   *
   * @static
   * @returns {*}
   * @memberof ViewTool
   */
  public static getIndexViewParam(): any {
    return this.indexViewParam;
  }

  /**
   * 计算界面行为项权限状态
   *
   * @static
   * @param {*} [data] 传入数据
   * @param {*} [ActionModel] 界面行为模型
   * @param {*} [UIService] 界面行为服务
   * @memberof ViewTool
   */
  public static calcActionItemAuthState(data: any, ActionModel: any, UIService: IUIService) {
    const result: any[] = [];
    if (!UIService) return;
    for (const key in ActionModel) {
      if (!ActionModel.hasOwnProperty(key)) {
        return result;
      }
      const _item = ActionModel[key];
      let dataActionResult: any;
      if (_item && _item['dataAccessAction']) {
        if (Object.is(_item['actionTarget'], 'NONE') || Object.is(_item['actionTarget'], '')) {
          dataActionResult = UIService.getAllOPPrivs({}, _item['dataAccessAction']);
        } else {
          if (data && Object.keys(data).length > 0) {
            dataActionResult = UIService.getAllOPPrivs(data, _item['dataAccessAction']);
          }
        }
      } else {
        dataActionResult = 1;
      }
      // 无权限:0;有权限:1
      if (dataActionResult === 0) {
        // 禁用:1;隐藏:2;隐藏且默认隐藏:6
        if (_item.getNoPrivDisplayMode === 1) {
          _item.disabled = true;
        }
        if (_item.getNoPrivDisplayMode === 2 || _item.getNoPrivDisplayMode === 6) {
          _item.visabled = false;
        } else {
          _item.visabled = true;
        }
      }
      if (dataActionResult === 1) {
        _item.visabled = true;
        _item.disabled = false;
      }
      // 返回权限验证的结果
      _item.dataActionResult = dataActionResult;
      result.push(dataActionResult);
    }
    return result;
  }

  /**
   * 计算界面行为项权限状态（树节点版本）
   *
   * @static
   * @param {*} [data] 传入数据
   * @param {*} [ActionModel] 界面行为模型
   * @param {*} [UIService] 界面行为服务
   * @memberof ViewTool
   */
  public static calcTreeActionItemAuthState(data: any, ActionModel: any, UIService: IUIService) {
    const result: any[] = [];
    if (!UIService) return;
    for (const key in ActionModel) {
      if (!ActionModel.hasOwnProperty(key)) {
        return result;
      }
      const _item = ActionModel[key];
      let dataActionResult: any;
      if (Object.is(_item['actiontarget'], 'NONE') || Object.is(_item['actiontarget'], '')) {
        dataActionResult = UIService.getAllOPPrivs({}, _item['dataaccaction']);
      } else {
        if (_item && _item['dataaccaction'] && UIService.enableDEMainState()) {
          if (data && Object.keys(data).length > 0) {
            dataActionResult = UIService.getAllOPPrivs(data, _item['dataaccaction']);
          }
        }
      }
      // 无权限:0;有权限:1
      if (dataActionResult === 0) {
        // 禁用:1;隐藏:2;隐藏且默认隐藏:6
        if (_item.noprivdisplaymode === 1) {
          _item.disabled = true;
        }
        if (_item.noprivdisplaymode === 2 || _item.noprivdisplaymode === 6) {
          _item.visabled = false;
        } else {
          _item.visabled = true;
        }
      }
      if (dataActionResult === 1) {
        _item.visabled = true;
        _item.disabled = false;
      }
      // 返回权限验证的结果
      _item.dataActionResult = dataActionResult;
      result.push(dataActionResult);
    }
    return result;
  }

  /**
   * 计算重定向上下文
   *
   * @static
   * @param {*} [tempContext] 上下文
   * @param {*} [data] 传入数据
   * @param {*} [redirectAppEntity] 应用实体对象
   * @memberof ViewTool
   */
  public static async calcRedirectContext(tempContext: any, data: any, redirectAppEntity: any) {
    if (
      redirectAppEntity &&
      redirectAppEntity.getMinorPSAppDERSs() &&
      (redirectAppEntity.getMinorPSAppDERSs() as []).length > 0
    ) {
      for (const item of redirectAppEntity.getMinorPSAppDERSs()) {
        const parentPSAppDEFieldCodeName: string = item.M.getParentPSAppDEField?.codeName;
        if (parentPSAppDEFieldCodeName) {
          const curData: any = data;
          if (curData && curData[parentPSAppDEFieldCodeName.toLowerCase()]) {
            const majorAppEntity: any = item.getMajorPSAppDataEntity();
            await majorAppEntity.fill();
            if (!tempContext[majorAppEntity.codeName.toLowerCase()]) {
              Object.assign(tempContext, {
                [majorAppEntity.codeName.toLowerCase()]: curData[parentPSAppDEFieldCodeName.toLowerCase()],
              });
            }
          }
        }
      }
    }
  }

  /**
   * 移动端图标名称解析
   *
   * @param {string} className
   */
  public static setIcon(className: string): any {
    if (className.startsWith('fa fa-')) {
      return className.slice(6);
    } else {
      return className;
    }
  }

  /**
   * 打开编辑数据视图
   *
   * @param {any[]} args 数据参数
   * @param {*} actionContext 视图容器对象
   * @param {*} fullargs 全量数据
   * @param {*} params 额外参数
   * @param {*} $event 事件源对象
   * @param {*} xData 数据部件
   */
  public static async opendata(
    args: any[],
    actionContext?: any,
    fullargs?: any,
    params?: any,
    $event?: any,
    xData?: any,
  ) {
    if (!actionContext) {
      return;
    }
    const openAppViewLogic: IPSAppViewLogic | null = actionContext.viewInstance.findPSAppViewLogic('opendata');
    if (!openAppViewLogic || !openAppViewLogic.getPSAppUILogic()) {
      return;
    }
    const viewOpenAppUIlogic: IPSAppUIOpenDataLogic | undefined | null =
      openAppViewLogic.getPSAppUILogic() as IPSAppUIOpenDataLogic;
    if (viewOpenAppUIlogic?.getOpenDataPSAppView()) {
      const openViewRef: IPSAppUILogicRefView = viewOpenAppUIlogic.getOpenDataPSAppView() as IPSAppUILogicRefView;
      const data: any = {};
      const tempContext = JSON.parse(JSON.stringify(actionContext.context));
      // 准备参数
      if (args.length > 0) {
        Object.assign(tempContext, args[0]);
      }
      if (
        openViewRef?.getPSNavigateContexts() &&
        (openViewRef?.getPSNavigateContexts() as IPSNavigateContext[])?.length > 0
      ) {
        const localContext = Util.formatNavParam(openViewRef.getPSNavigateContexts());
        const _context: any = Util.computedNavData(
          fullargs[0],
          actionContext.context,
          actionContext.viewParam,
          localContext,
        );
        Object.assign(tempContext, _context);
      }
      if (openViewRef?.getPSNavigateParams() && (openViewRef.getPSNavigateParams() as IPSNavigateParam[])?.length > 0) {
        const localViewParam = Util.formatNavParam(openViewRef.getPSNavigateParams());
        const _param: any = Util.computedNavData(
          fullargs[0],
          actionContext.context,
          actionContext.viewParam,
          localViewParam,
        );
        Object.assign(data, _param);
      }
      if (
        fullargs &&
        fullargs.length > 0 &&
        fullargs[0]['srfprocessdefinitionkey'] &&
        fullargs[0]['srftaskdefinitionkey']
      ) {
        Object.assign(data, { processDefinitionKey: fullargs[0]['srfprocessdefinitionkey'] });
        Object.assign(data, { taskDefinitionKey: fullargs[0]['srftaskdefinitionkey'] });
        // 将待办任务标记为已读准备参数
        const quickGroupData = (this as any).quickGroupData;
        if (quickGroupData && quickGroupData.hasOwnProperty('srfwf') && fullargs[0]['srftaskid']) {
          Object.assign(data, { srfwf: quickGroupData['srfwf'] });
          Object.assign(data, { srftaskid: fullargs[0]['srftaskid'] });
        }
      }
      let deResParameters: any[] = [];
      let parameters: any[] = [];
      const openView: IPSAppView | null = openViewRef.getRefPSAppView();
      if (!openView) return;
      await openView.fill(true);
      if (openView.getPSAppDataEntity()) {
        // 处理视图关系参数 （只是路由打开模式才计算）
        if (!openView.openMode || openView.openMode == 'INDEXVIEWTAB' || openView.openMode == 'POPUPAPP') {
          deResParameters = Util.formatAppDERSPath(tempContext, (openView as IPSAppDEView).getPSAppDERSPaths());
        }
      }
      if (!openView?.openMode || openView.openMode == 'INDEXVIEWTAB') {
        if (openView.getPSAppDataEntity()) {
          parameters = [
            {
              pathName: Util.srfpluralize((openView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName).toLowerCase(),
              parameterName: (openView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase(),
            },
            {
              pathName: 'views',
              parameterName: ((openView as IPSAppDEView).getPSDEViewCodeName() as string).toLowerCase(),
            },
          ];
        } else {
          parameters = [{ pathName: 'views', parameterName: openView.name?.toLowerCase() }];
        }
      } else {
        if (openView?.getPSAppDataEntity()) {
          parameters = [
            {
              pathName: Util.srfpluralize((openView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName)?.toLowerCase(),
              parameterName: (openView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName?.toLowerCase(),
            },
          ];
        }
        if (openView && openView.modelPath) {
          Object.assign(tempContext, { viewpath: openView.modelPath });
        }
      }
      // 关闭视图回调
      const callback: Function = (result: any, xData: any) => {
        if (!result || !Object.is(result.ret, 'OK')) {
          return;
        }
        if (!xData || !(xData.refresh instanceof Function)) {
          return;
        }
        xData.refresh(result.datas);
      };
      // 重定向视图
      if (openView?.redirectView) {
        const targetRedirectView: IPSAppDERedirectView = openView as IPSAppDERedirectView;
        await targetRedirectView.fill();
        if (
          targetRedirectView.getRedirectPSAppViewRefs() &&
          targetRedirectView.getRedirectPSAppViewRefs()?.length === 0
        ) {
          return;
        }
        Object.assign(params, actionContext.viewParam);
        const redirectUIService: any = await App.getUIService().getService(
          actionContext.context,
          (ModelTool.getViewAppEntityCodeName(targetRedirectView) as string)?.toLowerCase(),
        );
        await redirectUIService.loaded();
        const redirectAppEntity: IPSAppDataEntity | null = targetRedirectView.getPSAppDataEntity();
        await ViewTool.calcRedirectContext(tempContext, fullargs[0], redirectAppEntity);
        redirectUIService
          .getRDAppView(
            tempContext,
            args[0][(ModelTool.getViewAppEntityCodeName(actionContext.viewInstance) as string)?.toLowerCase()],
            params,
          )
          .then(async (result: any) => {
            if (!result) {
              return;
            }
            const returnContext: any = result?.srftempcontext;
            const targetOpenViewRef: IPSAppViewRef | undefined = targetRedirectView
              .getRedirectPSAppViewRefs()
              ?.find((item: IPSAppViewRef) => {
                return item.name === result.param.split(':')[0];
              });
            if (!targetOpenViewRef) {
              return;
            }
            if (
              targetOpenViewRef.getPSNavigateContexts() &&
              (targetOpenViewRef.getPSNavigateContexts() as IPSNavigateContext[]).length > 0
            ) {
              const localContextRef: any = Util.formatNavParam(targetOpenViewRef.getPSNavigateContexts(), true);
              const _context: any = Util.computedNavData(fullargs[0], tempContext, data, localContextRef);
              Object.assign(tempContext, _context);
            }
            if (result && result.hasOwnProperty('srfsandboxtag')) {
              Object.assign(tempContext, { srfsandboxtag: result['srfsandboxtag'] });
              Object.assign(data, { srfsandboxtag: result['srfsandboxtag'] });
            }
            const targetOpenView: IPSAppView | null = targetOpenViewRef.getRefPSAppView();
            if (!targetOpenView) {
              return;
            }
            await targetOpenView.fill(true);
            if (!targetOpenView.openMode || targetOpenView.openMode == 'INDEXVIEWTAB') {
              if (targetOpenView.getPSAppDataEntity()) {
                deResParameters = Util.formatAppDERSPath(
                  tempContext,
                  (targetOpenView as IPSAppDEView).getPSAppDERSPaths(),
                );
                parameters = [
                  {
                    pathName: Util.srfpluralize(
                      (targetOpenView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName,
                    ).toLowerCase(),
                    parameterName: (targetOpenView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase(),
                  },
                  {
                    pathName: 'views',
                    parameterName: ((targetOpenView as IPSAppDEView).getPSDEViewCodeName() as string).toLowerCase(),
                  },
                ];
              } else {
                parameters = [
                  {
                    pathName: targetOpenView.codeName.toLowerCase(),
                    parameterName: targetOpenView.codeName.toLowerCase(),
                  },
                ];
              }
            } else {
              if (targetOpenView.getPSAppDataEntity()) {
                parameters = [
                  {
                    pathName: Util.srfpluralize(
                      (targetOpenView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName,
                    ).toLowerCase(),
                    parameterName: (targetOpenView.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase(),
                  },
                ];
              }
              if (targetOpenView && targetOpenView.modelPath) {
                Object.assign(tempContext, { viewpath: targetOpenView.modelPath });
              }
            }
            this.openTargtView(
              targetOpenView,
              actionContext,
              tempContext,
              data,
              xData,
              $event,
              deResParameters,
              parameters,
              args,
              callback,
            );
          });
      } else {
        if (fullargs && fullargs.copymode) {
          Object.assign(data, { copymode: true });
        }
        this.openTargtView(
          openView,
          actionContext,
          tempContext,
          data,
          xData,
          $event,
          deResParameters,
          parameters,
          args,
          callback,
        );
      }
    } else {
      LogUtil.log('opendata视图逻辑不存在，请确认');
    }
  }

  /**
   * 打开新建数据视图
   *
   * @param {any[]} args 数据参数
   * @param {*} actionContext 视图容器对象
   * @param {*} fullargs 全量数据
   * @param {*} params 额外参数
   * @param {*} $event 事件源对象
   * @param {*} xData 数据部件
   */
  public static async newdata(
    args: any[],
    actionContext: any,
    fullargs?: any,
    params?: any,
    $event?: any,
    xData?: any,
  ) {
    const newAppViewLogic: IPSAppViewLogic | null = actionContext.viewInstance.findPSAppViewLogic('newdata');
    if (!newAppViewLogic || !newAppViewLogic.getPSAppUILogic()) {
      return;
    }
    const viewNewAppUIlogic: IPSAppUINewDataLogic | undefined | null =
      newAppViewLogic.getPSAppUILogic() as IPSAppUINewDataLogic;
    if (viewNewAppUIlogic) {
      if (viewNewAppUIlogic.enableWizardAdd) {
        let wizardPSAppView: IPSAppView | null;
        if (viewNewAppUIlogic.getWizardPSAppView()) {
          wizardPSAppView = (viewNewAppUIlogic.getWizardPSAppView() as IPSAppUILogicRefView).getRefPSAppView();
          if (!wizardPSAppView) return;
          await wizardPSAppView.fill();
          const view: any = {
            viewname: 'app-view-shell',
            height: wizardPSAppView.height,
            width: wizardPSAppView.width,
            title: wizardPSAppView.caption,
          };
          const tempContext: any = JSON.parse(JSON.stringify(actionContext.context));
          if (wizardPSAppView && wizardPSAppView.modelPath) {
            Object.assign(tempContext, { viewpath: wizardPSAppView.modelPath });
          }
          // todo 向导
        }
      } else if (viewNewAppUIlogic.enableBatchAdd) {
        let batchAddPSAppViews: Array<IPSAppUILogicRefView> = [];
        const minorPSAppDERSs: IPSAppDERS[] = (
          actionContext.viewInstance.getPSAppDataEntity() as IPSAppDataEntity
        ).getMinorPSAppDERSs() as IPSAppDERS[];
        if (!minorPSAppDERSs) return;
        await (minorPSAppDERSs[0] as IPSAppDERS).fill();
        if (
          viewNewAppUIlogic.getBatchAddPSAppViews() &&
          (viewNewAppUIlogic.getBatchAddPSAppViews() as IPSAppUILogicRefView[]).length > 0
        ) {
          batchAddPSAppViews = viewNewAppUIlogic.getBatchAddPSAppViews() as IPSAppUILogicRefView[];
        }
        if (batchAddPSAppViews.length == 0) {
          return;
        }
        const openViewModel: IPSAppUILogicRefView | undefined = batchAddPSAppViews.find(
          (item: IPSAppUILogicRefView) => {
            return item.refMode && item.refMode !== actionContext.context?.srfparentdename?.toUpperCase();
          },
        );
        const otherViewModel: IPSAppUILogicRefView | undefined = batchAddPSAppViews.find(
          (item: IPSAppUILogicRefView) => {
            return item.refMode && item.refMode == actionContext.context?.srfparentdename?.toUpperCase();
          },
        );
        if (!openViewModel) {
          return;
        }
        const openView: IPSAppDEView = openViewModel.getRefPSAppView() as IPSAppDEView;
        await openView.fill(true);
        let otherView: IPSAppDEView;
        if (otherViewModel) {
          otherView = otherViewModel.getRefPSAppView() as IPSAppDEView;
          await otherView.fill(true);
        }
        // todo 多对多打开视图
      } else if (viewNewAppUIlogic.batchAddOnly) {
        LogUtil.warn('暂未支持');
      } else if (viewNewAppUIlogic.getNewDataPSAppView()) {
        const newviewRef: IPSAppUILogicRefView | null = viewNewAppUIlogic.getNewDataPSAppView();
        if (!newviewRef) return;
        const data: any = {};
        if (args[0].srfsourcekey) {
          data.srfsourcekey = args[0].srfsourcekey;
        }
        if (fullargs && (fullargs as any).copymode) {
          Object.assign(data, { copymode: (fullargs as any).copymode });
        }
        const tempContext = JSON.parse(JSON.stringify(actionContext.context));
        const dataview: IPSAppView | null = newviewRef.getRefPSAppView();
        if (!dataview) return;
        await dataview.fill(true);
        if (
          dataview.getPSAppDataEntity() &&
          tempContext[(dataview.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase()]
        ) {
          delete tempContext[(dataview.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase()];
        }
        if (args.length > 0) {
          Object.assign(tempContext, args[0]);
        }
        if (
          newviewRef.getPSNavigateContexts() &&
          (newviewRef.getPSNavigateContexts() as IPSNavigateContext[]).length > 0
        ) {
          const localContext = Util.formatNavParam(newviewRef.getPSNavigateContexts());
          const _context: any = Util.computedNavData(
            fullargs[0],
            actionContext.context,
            actionContext.viewParam,
            localContext,
          );
          Object.assign(tempContext, _context);
        }
        if (newviewRef.getPSNavigateParams() && (newviewRef.getPSNavigateParams() as IPSNavigateParam[]).length > 0) {
          const localViewParam = Util.formatNavParam(newviewRef.getPSNavigateParams());
          const _param: any = Util.computedNavData(
            fullargs[0],
            actionContext.context,
            actionContext.viewParam,
            localViewParam,
          );
          Object.assign(data, _param);
        }
        let deResParameters: any[] = [];
        let parameters: any[] = [];
        if (dataview.getPSAppDataEntity()) {
          // 处理视图关系参数 （只是路由打开模式才计算）
          if (!dataview.openMode || dataview.openMode == 'INDEXVIEWTAB' || dataview.openMode == 'POPUPAPP') {
            deResParameters = Util.formatAppDERSPath(tempContext, (dataview as IPSAppDEView)?.getPSAppDERSPaths());
          }
        }
        if (!dataview.openMode || dataview.openMode == 'INDEXVIEWTAB') {
          if (dataview.getPSAppDataEntity()) {
            parameters = [
              {
                pathName: Util.srfpluralize(
                  (dataview.getPSAppDataEntity() as IPSAppDataEntity)?.codeName,
                ).toLowerCase(),
                parameterName: (dataview.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase(),
              },
              {
                pathName: 'views',
                parameterName: ((dataview as IPSAppDEView).getPSDEViewCodeName() as string).toLowerCase(),
              },
            ];
          } else {
            parameters = [{ pathName: 'views', parameterName: dataview?.codeName.toLowerCase() }];
          }
        } else {
          if (dataview.getPSAppDataEntity()) {
            parameters = [
              {
                pathName: Util.srfpluralize(
                  (dataview.getPSAppDataEntity() as IPSAppDataEntity)?.codeName,
                ).toLowerCase(),
                parameterName: (dataview.getPSAppDataEntity() as IPSAppDataEntity)?.codeName.toLowerCase(),
              },
            ];
          }
          if (dataview && dataview.modelPath) {
            Object.assign(tempContext, { viewpath: dataview.modelPath });
          }
        }
        // 关闭视图回调
        const callback: Function = (result: any, xData: any) => {
          if (!result || !Object.is(result.ret, 'OK')) {
            return;
          }
          if (!xData || !(xData.refresh instanceof Function)) {
            return;
          }
          xData.refresh(result.datas);
        };
        if (!dataview.openMode || dataview.openMode == 'INDEXVIEWTAB') {
          // 打开顶级分页视图
          const _data: any = { w: new Date().getTime() };
          Object.assign(_data, data);
          if (tempContext.srfdynainstid) {
            Object.assign(_data, { srfdynainstid: tempContext.srfdynainstid });
          }
          const routePath = ViewTool.buildUpRoutePath(tempContext, deResParameters, parameters, args, _data);
          App.getOpenViewService().openView(routePath);
        } else if (dataview.openMode == 'POPUPAPP') {
          // 独立程序打开
          const routePath = ViewTool.buildUpRoutePath(tempContext, deResParameters, parameters, args, data);
          App.getOpenViewService().openPopupApp('./#' + routePath);
        } else if (dataview.openMode == 'POPUPMODAL') {
          const container: Subject<any> = App.getOpenViewService().openModal(
            { viewModel: dataview },
            tempContext,
            data,
            actionContext.navDatas,
          );
          container.subscribe((result: any) => {
            callback(result, xData);
          });
        } else if (dataview.openMode.indexOf('DRAWER') !== -1) {
          const container: Subject<any> = App.getOpenViewService().openDrawer(
            { viewModel: dataview },
            tempContext,
            data,
            actionContext.navDatas,
          );
          container.subscribe((result: any) => {
            callback(result, xData);
          });
        } else if (dataview.openMode == 'POPOVER') {
          LogUtil.warn('打开气泡卡片不支持');
        } else {
          LogUtil.warn(`${dataview.openMode}不支持`);
        }
      } else {
        LogUtil.warn('newdata视图逻辑不存在，请确认');
      }
    } else {
      LogUtil.warn('newdata视图逻辑不存在，请确认');
    }
  }

  /**
   * 打开目标视图
   *
   * @param {*} openView 目标视图模型对象
   * @param {*} tempContext 临时上下文
   * @param {*} data 数据
   * @param {*} xData 数据部件实例
   * @param {*} event 事件源
   * @param {*} deResParameters
   * @param {*} parameters
   * @param {*} args 额外参数
   * @param {Function} callback 回调
   * @memberof MainViewBase
   */
  public static openTargtView(
    openView: any,
    actionContext: any,
    tempContext: any,
    data: any,
    xData: any,
    event: any,
    deResParameters: any,
    parameters: any,
    args: any,
    callback: Function,
  ) {
    if (!openView?.openMode || openView.openMode == 'INDEXVIEWTAB') {
      if (tempContext.srfdynainstid) {
        Object.assign(data, { srfdynainstid: tempContext.srfdynainstid });
      }
      const routePath = ViewTool.buildUpRoutePath(tempContext, deResParameters, parameters, args, data);
      App.getOpenViewService().openView(routePath);
    } else if (openView.openMode == 'POPUPAPP') {
      const routePath = ViewTool.buildUpRoutePath(tempContext, deResParameters, parameters, args, data);
      App.getOpenViewService().openPopupApp('./#' + routePath);
    } else if (openView.openMode == 'POPUPMODAL') {
      const container: Subject<any> = App.getOpenViewService().openModal(
        { viewModel: openView },
        tempContext,
        data,
        actionContext.navDatas,
      );
      container.subscribe((result: any) => {
        callback(result, xData);
      });
    } else if (openView.openMode.indexOf('DRAWER') !== -1) {
      const container: Subject<any> = App.getOpenViewService().openDrawer(
        { viewModel: openView },
        tempContext,
        data,
        actionContext.navDatas,
      );
      container.subscribe((result: any) => {
        callback(result, xData);
      });
    } else if (openView.openMode == 'POPOVER') {
      App.getNoticeService().warning('打开气泡卡片暂未实现');
    } else {
      App.getNoticeService().warning(`${openView.openMode}打开气泡卡片暂未实现`);
    }
  }
}
