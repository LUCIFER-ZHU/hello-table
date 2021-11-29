import { clone } from 'ramda';
import Schema from 'async-validator';
import { PluralizeRule } from './pluralize-rule';
import { LogUtil } from './log-util';

/**
 * 平台工具类
 *
 * @export
 * @class Util
 */
export class Util {
  /**
   * 创建 UUID
   *
   * @static
   * @returns {string}
   * @memberof Util
   */
  public static createUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * 判断对象是否为空，避免发生数值0误判
   *
   * @param obj
   */
  public static isExist(obj: any): boolean {
    return obj !== undefined && obj !== null;
  }

  /**
   * 字符串不为空并且对象存在
   *
   * @param str
   */
  public static isExistAndNotEmpty(str: string | undefined | null): boolean {
    return this.isExist(str) && !this.isEmpty(str);
  }

  /**
   * @description 字符串转驼峰
   * @static
   * @param {string} name
   * @return {*}
   * @memberof Util
   */
  public static formatCamelCase(name: string) {
    const re = /-(\w)/g;
    return name.replace(re, function ($0: string, $1: string) {
      return $1.toUpperCase();
    });
  }

  /**
   * 计算单词复数
   *
   * @static
   * @returns {string}
   * @memberof Util
   */
  public static srfpluralize(word: string) {
    const wordStr = word.trim().toLowerCase();
    if (wordStr.length == 0) {
      return wordStr;
    }
    const pluralizeRule = new PluralizeRule();
    if (pluralizeRule.isUncountable(wordStr)) {
      return wordStr;
    }
    const newWordStr = pluralizeRule.irregularChange(wordStr);
    if (newWordStr) {
      return newWordStr;
    } else {
      return pluralizeRule.ruleChange(wordStr);
    }
  }

  /**
   * 创建序列号
   *
   * @static
   * @returns {number}
   * @memberof Util
   */
  public static createSerialNumber(): number {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000);
    }
    return s4();
  }

  /**
   * 判断是否为一个函数
   *
   * @static
   * @param {*} func
   * @returns {boolean}
   * @memberof Util
   */
  public static isFunction(func: any): boolean {
    return typeof func === 'function';
  }

  /**
   *
   *
   * @static
   * @param {*} [o={}]
   * @memberof Util
   */
  public static processResult(o: any = {}): void {
    if (o.url != null && o.url !== '') {
      window.location.href = o.url;
    }
    if (o.code != null && o.code !== '') {
      // tslint:disable-next-line:no-eval
      eval(o.code);
    }

    if (o.downloadurl != null && o.downloadurl !== '') {
      const downloadurl = this.parseURL2(o.downloadurl, '');
      this.download(downloadurl);
    }
  }

  /**
   * 下载文件
   *
   * @static
   * @param {string} url
   * @memberof Util
   */
  public static download(url: string): void {
    window.open(url, '_blank');
  }

  /**
   *
   *
   * @static
   * @param {any} url
   * @param {any} params
   * @returns {string}
   * @memberof Util
   */
  public static parseURL2(url: string, params: any): string {
    let tmpURL;
    if (url.indexOf('../../') !== -1) {
      tmpURL = url.substring(url.indexOf('../../') + 6, url.length);
    } else if (url.indexOf('/') === 0) {
      tmpURL = url.substring(url.indexOf('/') + 1, url.length);
    } else {
      tmpURL = url;
    }

    if (params) {
      return tmpURL + (url.indexOf('?') === -1 ? '?' : '&');
    } else {
      return tmpURL;
    }
  }

  /**
   * 是否是数字值(包括可转换的,已排除了空值)
   *
   * @param {*} num
   * @returns {boolean}
   * @memberof Util
   */
  public static isNumber(num: any): boolean {
    return !this.isEmpty(num) && !isNaN(num);
  }

  /**
   * 是否未定义
   *
   * @static
   * @param {*} value
   * @returns {boolean}
   * @memberof Util
   */
  public static isUndefined(value: any): boolean {
    return typeof value === 'undefined';
  }

  /**
   * 是否为空
   *
   * @static
   * @param {*} value
   * @returns {boolean}
   * @memberof Util
   */
  public static isEmpty(value: any): boolean {
    return this.isUndefined(value) || Object.is(value, '') || value === null || value !== value;
  }

  /**
   * 是否存在数据(空对象和空数组算无值)
   *
   * @static
   * @param {*} value
   * @returns {boolean}
   * @memberof Util
   */
  public static isExistData(value: any): boolean {
    if (this.isEmpty(value)) {
      return false;
    } else {
      if (value && Array.isArray(value)) {
        return value.length > 0 ? true : false;
      } else if (value && Object.prototype.toString.call(value) === '[object Object]') {
        return Object.keys(value).length > 0 ? true : false;
      } else {
        return this.isExist(value) ? true : false;
      }
    }
  }

  /**
   * 转换为矩阵参数
   *
   * @static
   * @param {*} obj
   * @returns {*}
   * @memberof Util
   */
  public static formatMatrixStringify(obj: any): any {
    let str: string = '';
    if (obj && !(obj instanceof Array) && obj instanceof Object) {
      const keys: string[] = Object.keys(obj);
      keys.forEach((key: string) => {
        if (!obj[key]) {
          return;
        }
        if (!Object.is(str, '')) {
          str += ';';
        }
        str += `${key}=${obj[key]}`;
      });
    }
    return Object.is(str, '') ? undefined : str;
  }

  /**
   * 准备路由参数
   *
   * @static
   * @param {*} { route: route, sourceNode: sourceNode, targetNode: targetNode, data: data }
   * @returns {*}
   * @memberof Util
   */
  public static prepareRouteParmas({
    route: route,
    sourceNode: sourceNode,
    targetNode: targetNode,
    data: data,
  }: any): any {
    const params: any = {};
    if (!sourceNode || (sourceNode && Object.is(sourceNode, ''))) {
      return params;
    }
    if (!targetNode || (targetNode && Object.is(targetNode, ''))) {
      return params;
    }
    const indexName = route.matched[0].name;
    Object.assign(params, { [indexName]: route.params[indexName] });
    Object.assign(params, { [targetNode]: this.formatMatrixStringify(data) });
    return params;
  }

  /**
   * 获取当前值类型
   *
   * @static
   * @param {*} obj
   * @returns
   * @memberof Util
   */
  public static typeOf(obj: any): string {
    const toString = Object.prototype.toString;
    const map: any = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object',
    };
    return map[toString.call(obj)];
  }

  /**
   * 深拷贝(deepCopy)
   *
   * @static
   * @param {*} data
   * @returns {*}
   * @memberof Util
   */
  public static deepCopy(data: any): any {
    return clone(data);
  }

  /**
   * 名称格式化
   *
   * @static
   * @param {string} name
   * @returns {string}
   * @memberof Util
   */
  public static srfFilePath2(name: string): string {
    if (!name || (name && Object.is(name, ''))) {
      LogUtil.error('名称异常');
      return '';
    }
    name = name.replace(/[_]/g, '-');
    let state: number = 0;
    let _str = '';
    const uPattern = /^[A-Z]{1}$/;

    const str1 = name.substring(0, 1);
    const str2 = name.substring(1);
    state = uPattern.test(str1) ? 1 : 0;
    _str = `${_str}${str1.toLowerCase()}`;

    for (const chr of str2) {
      if (uPattern.test(chr)) {
        if (state === 1) {
          _str = `${_str}${chr.toLowerCase()}`;
        } else {
          _str = `${_str}-${chr.toLowerCase()}`;
        }
        state = 1;
      } else {
        _str = `${_str}${chr.toLowerCase()}`;
        state = 0;
      }
    }
    _str = _str.replace(/---/g, '-').replace(/--/g, '-');

    return _str;
  }

  /**
   * 附加参数格式化
   *
   * @static
   * @param {any} arg 表单数据
   * @param {any} parent 外层context或viewparams
   * @param {any} params 附加参数
   * @returns {any}
   * @memberof Util
   */
  public static formatData(arg: any, parent: any, params: any): any {
    const _data: any = {};
    Object.keys(params).forEach((name: string) => {
      if (!name) {
        return;
      }
      let value: string | null = params[name];
      if (value && value.startsWith('%') && value.endsWith('%')) {
        const key = value.substring(1, value.length - 1);
        if (arg && arg.hasOwnProperty(key)) {
          if (arg[key] !== null && arg[key] !== undefined) {
            value = arg[key];
          } else if (parent[key] !== null && parent[key] !== undefined) {
            value = parent[key];
          } else {
            value = null;
          }
        } else {
          value = null;
        }
      }
      Object.assign(_data, { [name]: value });
    });
    return _data;
  }

  /**
   * 格式化导航数据
   *
   * @static
   * @param {any} data 导航模型原生数据
   * @memberof Util
   */
  public static formatNavParam(navParam: any, isConvertToLower: boolean = false) {
    if (!navParam) {
      return {};
    }
    const localNavparam: any = {};
    if (navParam && navParam.length > 0) {
      navParam.forEach((element: any) => {
        localNavparam[element.key.toLowerCase()] = element.rawValue
          ? element.value
          : isConvertToLower
            ? `%${element.value.toLowerCase()}%`
            : `%${element.value}%`;
      });
    }
    return localNavparam;
  }

  /**
   * 格式化视图关系参数
   *
   * @static
   * @param {any} context 应用上下文数据
   * @param {any} appDERSPaths 关系路径数据
   * @memberof Util
   */
  public static formatAppDERSPath(context: any, appDERSPaths: any) {
    if (!appDERSPaths || appDERSPaths.length === 0) {
      return [];
    }
    let counter: number = 0;
    for (const appDERSPath of appDERSPaths) {
      const tempData: any = { isInclude: true, data: [] };
      for (const singleAppDERSPath of appDERSPath) {
        const majorPSAppDataEntity = singleAppDERSPath.getMajorPSAppDataEntity();
        if (majorPSAppDataEntity && majorPSAppDataEntity.codeName) {
          tempData.isInclude = context[majorPSAppDataEntity.codeName.toLowerCase()] && tempData.isInclude;
          tempData.data.push({
            pathName: this.srfpluralize(majorPSAppDataEntity.codeName).toLowerCase(),
            parameterName: majorPSAppDataEntity.codeName.toLowerCase(),
          });
        }
      }
      counter++;
      if (tempData.isInclude) {
        return tempData.data;
      } else {
        if (counter === appDERSPaths.length) {
          return [];
        }
      }
    }
  }

  /**
   * 计算导航数据
   * 先从当前数据目标计算，然后再从当前上下文计算，最后从当前视图参数计算，没有则为null
   *
   * @static
   * @param {any} data 表单数据
   * @param {any} parentContext 外层context
   * @param {any} parentParam 外层param
   * @param {any} params 附加参数
   * @returns {any}
   * @memberof Util
   */
  public static computedNavData(data: any, parentContext: any, parentParam: any, params: any): any {
    const _data: any = {};
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach((name: string) => {
        if (!name) {
          return;
        }
        let value: string | null = params[name];
        if (value && value.toString().startsWith('%') && value.toString().endsWith('%')) {
          const key = value.substring(1, value.length - 1).toLowerCase();
          if (data && data.hasOwnProperty(key)) {
            value = data[key];
          } else if (parentContext && parentContext[key]) {
            value = parentContext[key];
          } else if (parentParam && parentParam[key]) {
            value = parentParam[key];
          } else {
            value = null;
          }
        }
        Object.assign(_data, { [name.toLowerCase()]: value });
      });
    }
    return _data;
  }

  /**
   * 日期格式化
   *
   * @static
   * @param {string} fmt 格式化字符串
   * @param {any} date 日期对象
   * @returns {string}
   * @memberof Util
   */
  public static dateFormat(date: any, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string {
    let ret;
    const opt: any = {
      'Y+': date.getFullYear().toString(), // 年
      'M+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'D+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'h+': date.getHours().toString(), // 时
      'm+': date.getMinutes().toString(), // 分
      's+': date.getSeconds().toString(), // 秒
      'S+': date.getSeconds().toString(),
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
      }
    }
    return fmt;
  }

  /**
   * 深度合并对象
   *
   * @param FirstOBJ 目标对象
   * @param SecondOBJ 原对象
   * @returns {Object}
   * @memberof Util
   */
  public static deepObjectMerge(FirstOBJ: any, SecondOBJ: any) {
    for (const key in SecondOBJ) {
      FirstOBJ[key] =
        FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
          ? this.deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
          : (FirstOBJ[key] = SecondOBJ[key]);
    }
    return FirstOBJ;
  }

  /**
   * 表单项校验
   *
   * @param property 表单项属性名
   * @param data 表单数据
   * @param rules 表单值规则
   * @returns {Promise}
   * @memberof Util
   */
  public static validateItem(property: string, data: any, rules: any) {
    // 1.获取数值和规则
    const rule = rules[property];
    // 2.创建校验规则
    const schema = new Schema({ [property]: rule });
    // 校验返回Promise
    return schema.validate(data);
  }

  /**
   * 比较两个对象的属性是否都相等
   *
   * @static
   * @param {*} newVal
   * @param {*} oldVal
   * @returns
   * @memberof Util
   */
  public static isFieldsSame(newVal: any, oldVal: any) {
    try {
      // 两者不同看属性是否相同，先判断个数，后判断值
      if (Object.keys(newVal).length !== Object.keys(oldVal).length) {
        return false;
      }
      for (const field of Object.keys(newVal)) {
        if (newVal[field] !== oldVal[field]) {
          return false;
        }
      }
      return true;
    } catch (error) {
      // 报错说明不是对象，直接判断是否相等
      return newVal === oldVal;
    }
  }

  /**
   * 把context和viewparams转换成视图用的viewdata和viewparam参数
   *
   * @static
   * @param {*} context
   * @param {*} viewparams
   * @returns
   * @memberof Util
   */
  public static getViewProps(context: any, viewparams: any, navdatas: Array<any> = []) {
    return { viewdata: JSON.stringify(context), viewparam: JSON.stringify(viewparams), navdatas: navdatas };
  }

  /**
   * 给定值在数组查找目标元素
   *
   * @static
   * @param {Array<any>} array 目标数组
   * @param {string} field 属性
   * @param {*} value 值
   * @returns
   * @memberof Util
   */
  public static findElementByField(array: Array<any>, field: string, value: any) {
    if (!array || !field || !value) {
      return null;
    }
    return array.find((element: any) => {
      return element[field] == value;
    });
  }

  /**
   * 改变数组的某个元素的位置，其他元素按顺序延后
   *
   * @static
   * @param {*} arr 数组
   * @param {number} oldIndex 改变之前在旧数组中索引
   * @param {number} newIndex 改变之后再新数组中的索引
   * @memberof Util
   */
  public static changeIndex(arr: any, oldIndex: number, newIndex: number) {
    // 移除原元素
    const temp = arr.splice(oldIndex, 1)[0];
    // 插入新位置
    arr.splice(newIndex, 0, temp);
  }

  /**
   * 清除附加数据（源数据里面有的数据在目标数据中都清除）
   *
   * @param source 源数据
   * @param target 目标数据
   *
   * @memberof Util
   */
  public static clearAdditionalData(source: any, target: any) {
    if (target && Object.keys(target).length > 0 && source && Object.keys(source).length > 0) {
      Object.keys(source).forEach((key: string) => {
        if (target.hasOwnProperty(key)) {
          delete target[key];
        }
      });
    }
  }

  /**
   * 是否为空对象（包括值）
   *
   * @param source 源对象
   * @memberof Util
   */
  public static isEmptyObject(source: any): boolean {
    if (this.isEmpty(source)) {
      return true;
    } else {
      if (source.toString() === '[object Object]') {
        let flag: boolean = true;
        for (const key of Object.keys(source)) {
          if (!this.isEmptyObject(source[key])) {
            flag = false;
          }
        }
        return flag;
      } else {
        return false;
      }
    }
  }

  /**
   * 计算容器尺寸
   *
   * @param {number} value
   * @return {*}  {string}
   */
  public static calcBoxSize(value: number): string {
    if (value > 1) {
      return value + 'px';
    } else if (value > 0) {
      return value * 100 + '%';
    }
    return 'auto';
  }

  /**
   * 上下文替换正则
   *
   * @author chitanda
   * @date 2021-04-23 20:04:01
   * @static
   */
  static contextReg = /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;
  /**
   * 数据替换正则
   *
   * @author chitanda
   * @date 2021-04-23 20:04:09
   * @static
   */
  static dataReg = /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;

  /**
   * @description 将base64转换为文件
   * @static
   * @param {string} dataurl
   * @param {string} [filename='图片']
   * @return {*} 
   * @memberof Util
   */
  static dataURLtoFile(dataurl: string, filename: string = '图片') {
    let arr: any[] = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime
    });
  }

  /**
   * 数组排序(默认升序)
   * @param items 原数组
   * @param field 排序属性
   * @param dir 排序方向 [ 'ASC': 升序，'DESC': 降序 ]
   * @returns 
   */
  public static arraySort(items: any[], field: string = '', dir: "ASC" | "DESC" = "ASC"): any[] {
    return items.sort((a: any, b: any) => {
      const v1 = field ? a[field] : a;
      const v2 = field ? b[field] : b;
      if (v1 > v2) {
        return dir == 'ASC' ? 1 : -1;
      } else if (v1 < v2) {
        return dir == 'ASC' ? -1 : 1;
      }
      return 0;
    })
  }
}

/**
 * 设置sessionStorage数据
 *
 */
export const setSessionStorage: Function = (key: string, value: any) => {
  if (!value) {
    return;
  }
  sessionStorage.setItem(key, JSON.stringify(value));
};

/**
 * 获取sessionStorage数据
 *
 */
export const getSessionStorage: Function = (key: string) => {
  if (!key) {
    return null;
  }
  const value = sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  } else {
    return value;
  }
};

/**
 * 删除sessionStorage数据
 *
 */
export const removeSessionStorage: Function = (key: string) => {
  if (!key) {
    return;
  }
  if (sessionStorage.getItem(key)) {
    sessionStorage.removeItem(key);
  }
};

/**
 * 节流
 *
 * @param {any} fun 函数
 * @param {any} params 参数
 * @param {any} context 方法上下文
 * @param {number} delay 延迟时间，默认300
 * @static
 * @memberof Util
 */
export const throttle: Function = (fun: any, params: any[], context: any, delay: number = 300) => {
  const now: any = Date.now();
  if (!fun.last || now - fun.last >= delay) {
    if (typeof fun === 'function') {
      return fun.apply(context, params);
    }
    fun.last = now;
  }
};

const map = new WeakMap();

/**
 * 防抖
 *
 * @param {any} fun 函数
 * @param {any} params 参数
 * @param {number} wait 延迟时间，默认300
 * @static
 * @memberof Util
 */
export const debounce: Function = (fun: any, params: any, wait: number = 300) => {
  if (typeof fun === 'function') {
    if (map.has(fun)) {
      const num = map.get(fun);
      clearTimeout(num);
    }
    map.set(
      fun,
      setTimeout(() => {
        map.delete(fun);
        fun(params);
      }, wait),
    );
  }
};
