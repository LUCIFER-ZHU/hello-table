import { LogUtil } from './log-util';
import { Util } from './util';

/**
 * 校验对象
 *
 * @export
 * @class Verify
 */
export class Verify {
  /**
   * 错误提示信息
   *
   * @static
   * @type {string}
   * @memberof Verify
   */
  public static errorInfo: string = '';

  /**
   * 值比较
   *
   * @static
   * @param {*} value
   * @param {*} value2
   * @returns {number}
   * @memberof Verify
   */
  public static compare(value: any, value2: any): number {
    let result: any;
    if (!Object.is(value, '') && !Object.is(value2, '') && !isNaN(value) && !isNaN(value2)) {
      result = this.compareNumber(parseFloat(value), parseFloat(value2));
    } else if (this.isParseDate(value) && this.isParseDate(value2)) {
      result = this.compareDate(new Date(value).getTime(), new Date(value2).getTime());
    } else if (value && (typeof value === 'boolean' || value instanceof Boolean)) {
      result = this.compareBoolean(value, value2);
    } else if (value && (typeof value === 'string' || value instanceof String)) {
      result = this.compareString(value, value2);
    }
    return result;
  }

  /**
   * 字符串比较
   *
   * @static
   * @param {*} value
   * @param {*} value2
   * @returns {number}
   * @memberof Verify
   */
  public static compareString(value: any, value2: any): number {
    return value.localeCompare(value2);
  }

  /**
   * boolean 值比较
   *
   * @static
   * @param {*} value
   * @param {*} value2
   * @returns {number}
   * @memberof Verify
   */
  public static compareBoolean(value: any, value2: any): number {
    if (value === value2) {
      return 0;
    } else {
      return -1;
    }
  }

  /**
   * 时间值比较（毫秒数）
   *
   * @static
   * @param {number} value
   * @param {number} value2
   * @returns {number}
   * @memberof Verify
   */
  public static compareDate(value: number, value2: number): number {
    if (value > value2) {
      return 1;
    } else if (value < value2) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * 是否是时间
   *
   * @static
   * @param {string} value
   * @returns {boolean}
   * @memberof Verify
   */
  public static isParseDate(value: string): boolean {
    const time = new Date(value);
    if (isNaN(time.getTime())) {
      return false;
    }
    return true;
  }

  /**
   * 数值比较
   *
   * @static
   * @param {number} value
   * @param {number} value2
   * @returns {number}
   * @memberof Verify
   */
  public static compareNumber(value: number, value2: number): number {
    if (isNaN(value)) {
      value = 0;
    }
    if (isNaN(value2)) {
      value2 = 0;
    }
    if (value > value2) {
      return 1;
    } else if (value < value2) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * 文本包含
   *
   * @static
   * @param {*} value
   * @param {*} value2
   * @returns {boolean}
   * @memberof Verify
   */
  public static contains(value: any, value2: any): boolean {
    if (value && value2) {
      // 定义一数组
      let arr = [];
      arr = value2.split(',');
      // 定义正则表达式的连接符
      const S = String.fromCharCode(2);
      const reg = new RegExp(S + value + S);
      return reg.test(S + arr.join(S) + S);
    }
    return false;
  }

  /**
   * 比较值
   *
   * @static
   * @param {*} value
   * @param {*} op
   * @param {*} value2
   * @returns {boolean}
   * @memberof Verify
   */
  public static testCond(value: any, op: any, value2: any): boolean {
    // 等于操作
    if (Object.is(op, 'EQ')) {
      const _value = `${value}`;
      return _value === value2;
    }
    // 大于操作
    if (Object.is(op, 'GT')) {
      const result: number = this.compare(value, value2);
      if (result !== undefined && result > 0) {
        return true;
      } else {
        return false;
      }
    }
    // 大于等于操作
    if (Object.is(op, 'GTANDEQ')) {
      const result: number = this.compare(value, value2);
      if (result !== undefined && result >= 0) {
        return true;
      } else {
        return false;
      }
    }
    // 值包含在给定的范围中
    if (Object.is(op, 'IN')) {
      return this.contains(value, value2);
    }
    // 不为空判断操作
    if (Object.is(op, 'ISNOTNULL')) {
      return value != null && value !== '';
    }
    // 为空判断操作
    if (Object.is(op, 'ISNULL')) {
      return value == null || value === '';
    }
    // 文本左包含
    if (Object.is(op, 'LEFTLIKE')) {
      return value && value2 && value.toUpperCase().indexOf(value2.toUpperCase()) === 0;
    }
    // 文本包含
    if (Object.is(op, 'LIKE')) {
      return value && value2 && value.toUpperCase().indexOf(value2.toUpperCase()) !== -1;
    }
    // 小于操作
    if (Object.is(op, 'LT')) {
      const result: number = this.compare(value, value2);
      if (result !== undefined && result < 0) {
        return true;
      } else {
        return false;
      }
    }
    // 小于等于操作
    if (Object.is(op, 'LTANDEQ')) {
      const result: number = this.compare(value, value2);
      if (result !== undefined && result <= 0) {
        return true;
      } else {
        return false;
      }
    }
    // 不等于操作
    if (Object.is(op, 'NOTEQ')) {
      const _value = `${value}`;
      return _value !== value2;
    }
    // 值不包含在给定的范围中
    if (Object.is(op, 'NOTIN')) {
      return !this.contains(value, value2);
    }
    // 文本右包含
    if (Object.is(op, 'RIGHTLIKE')) {
      if (!(value && value2)) {
        return false;
      }
      const nPos = value.toUpperCase().indexOf(value2.toUpperCase());
      if (nPos === -1) {
        return false;
      }
      return nPos + value2.length === value.length;
    }
    // 空判断
    // if (Object.is(op, 'TESTNULL')) {
    // }
    // 自定义包含
    // if (Object.is(op, 'USERLIKE')) {
    // }
    return false;
  }

  /**
   * 检查属性常规条件
   *
   * @static
   * @param {*} value 属性值
   * @param {string} op 检测条件
   * @param {*} value2 预定义值
   * @param {string} errorInfo 错误信息
   * @param {string} paramType 参数类型
   * @param {*} form 表单对象
   * @param {boolean} primaryModel 是否必须条件
   * @returns {boolean}
   * @memberof Verify
   */
  public static checkFieldSimpleRule(
    value: any,
    op: string,
    value2: any,
    errorInfo: string,
    paramType: string,
    form: any,
    primaryModel: boolean,
  ): boolean {
    if (Object.is(paramType, 'CURTIME')) {
      value2 = `${new Date()}`;
    }
    if (Object.is(paramType, 'ENTITYFIELD')) {
      value2 = value2 ? value2.toLowerCase() : '';
      const _value2Field = form[value2] ? form[value2] : value2;
      value2 = _value2Field;
    }
    if (Util.isEmpty(errorInfo)) {
      errorInfo = '内容必须符合值规则';
    }
    this.errorInfo = errorInfo;
    const result = this.testCond(value, op, value2);
    if (!result) {
      if (primaryModel) {
        // throw new Error(this.errorInfo);
      }
    }
    return !result;
  }

  /**
   * 检查属性字符长度规则
   *
   * @static
   * @param {*} viewValue
   * @param {number} minLength
   * @param {boolean} indexOfMin
   * @param {number} maxLength
   * @param {boolean} indexOfMax
   * @param {string} errorInfo
   * @param {boolean} primaryModel
   * @returns {boolean}
   * @memberof Verify
   */
  public static checkFieldStringLengthRule(
    viewValue: string,
    minLength: number,
    indexOfMin: boolean,
    maxLength: number,
    indexOfMax: boolean,
    errorInfo: string,
    primaryModel: boolean,
  ): boolean {
    if (Util.isEmpty(errorInfo)) {
      this.errorInfo = '内容长度必须符合范围规则';
    } else {
      this.errorInfo = errorInfo;
    }

    const isEmpty = Util.isEmpty(viewValue);
    if (isEmpty) {
      if (primaryModel) {
        throw new Error('值为空');
      }
      this.errorInfo = '值为空';
      return true;
    }

    const viewValueLength: number = viewValue.length;

    // 小于等于
    if (minLength !== null) {
      if (indexOfMin) {
        if (viewValueLength < minLength) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      } else {
        if (viewValueLength <= minLength) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      }
    }

    //  大于等于
    if (maxLength !== null) {
      if (indexOfMax) {
        if (viewValueLength > maxLength) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      } else {
        if (viewValueLength >= maxLength) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      }
    }

    this.errorInfo = '';
    return false;
  }

  /**
   * 检查属性值正则式规则
   *
   * @static
   * @param {string} viewValue 属性值
   * @param {*} strReg 验证正则
   * @param {string} errorInfo 错误信息
   * @param {boolean} primaryModel 是否关键条件
   * @returns {boolean}
   * @memberof Verify
   */
  public static checkFieldRegExRule(viewValue: string, strReg: any, errorInfo: string, primaryModel: boolean): boolean {
    if (Util.isEmpty(errorInfo)) {
      this.errorInfo = '值必须符合正则规则';
    } else {
      this.errorInfo = errorInfo;
    }
    const isEmpty = Util.isEmpty(viewValue);
    if (isEmpty) {
      if (primaryModel) {
        throw new Error('值为空');
      }
      this.errorInfo = '值为空';
      return true;
    }
    const regExp = new RegExp(strReg);
    if (!regExp.test(viewValue)) {
      if (primaryModel) {
        throw new Error(this.errorInfo);
      }
      return true;
    }

    this.errorInfo = '';
    return false;
  }

  /**
   * 检查脚本值规则
   *
   * @static
   * @param {string} value 属性值
   * @param {*} data 数据对象
   * @param {*} scriptCode 脚本内容
   * @param {string} errorInfo 错误信息
   * @param {boolean} primaryModel 是否关键条件
   * @returns {boolean}
   * @memberof Verify
   */
  public static checkFieldScriptRule(
    value: string,
    data: any,
    scriptCode: any,
    errorInfo: string,
    primaryModel: boolean,
  ): { isPast: boolean; infoMessage: string } {
    if (Util.isEmpty(errorInfo)) {
      this.errorInfo = '值必须符合脚本规则';
    } else {
      this.errorInfo = errorInfo;
    }
    // 脚本准备参数
    const source = data;
    let selfError = '';
    let resultBoolean: boolean = true;
    // 脚本回调
    const callback = (error: any) => {
      resultBoolean = false;
      // 脚本回调多个错误信息
      if (error?.length > 0) {
        error.forEach((item: any) => {
          if (item?.message) {
            selfError += item.message;
          }
        });
        // 脚本回调单个错误信息
      } else if (error?.message) {
        selfError = error.message;
      }
    };

    try {
      // 避免脚本内变量冲突
      const runScript = () => eval(scriptCode);
      runScript();
    } catch (error) {
      LogUtil.error(error);
    }

    this.errorInfo = '';
    if (!resultBoolean && primaryModel) {
      throw new Error(this.errorInfo);
    }
    return { isPast: resultBoolean, infoMessage: selfError || errorInfo };
  }

  /**
   * 检查属性值范围规则
   *
   * @static
   * @param {string} viewValue 属性值
   * @param {*} minNumber 最小数值
   * @param {boolean} indexOfMin 是否包含最小数值
   * @param {*} maxNumber 最大数值
   * @param {boolean} indexOfMax 是否包含最大数值
   * @param {string} errorInfo 错误信息
   * @param {boolean} primaryModel 是否关键条件
   * @returns {boolean}
   * @memberof Verify
   */
  public static checkFieldValueRangeRule(
    viewValue: string,
    minNumber: any,
    indexOfMin: boolean,
    maxNumber: any,
    indexOfMax: boolean,
    errorInfo: string,
    primaryModel: boolean,
  ): boolean {
    if (Util.isEmpty(errorInfo)) {
      this.errorInfo = '值必须符合值范围规则';
    } else {
      this.errorInfo = errorInfo;
    }

    const isEmpty = Util.isEmpty(viewValue);
    if (isEmpty) {
      if (primaryModel) {
        throw new Error('值为空');
      }
      this.errorInfo = '值为空';
      return true;
    }

    const valueFormat = this.checkFieldRegExRule(viewValue, /^-?\d*\.?\d+$/, '', primaryModel);
    if (valueFormat) {
      return true;
    } else {
      this.errorInfo = errorInfo;
    }

    const data = Number.parseFloat(viewValue);

    // 小于等于
    if (minNumber !== null) {
      if (indexOfMin) {
        if (data < minNumber) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      } else {
        if (data <= minNumber) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      }
    }

    // //大于等于
    if (maxNumber != null) {
      if (indexOfMax) {
        if (data > maxNumber) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      } else {
        if (data >= maxNumber) {
          if (primaryModel) {
            throw new Error(this.errorInfo);
          }
          return true;
        }
      }
    }

    this.errorInfo = '';
    return false;
  }

  /**
   * 检查属性值系统值范围规则  暂时支持正则表达式
   *
   * @static
   * @param {string} viewValue 属性值
   * @param {*} strReg 正则
   * @param {string} errorInfo  错误信息
   * @param {boolean} primaryModel 是否关键条件
   * @returns {boolean}
   * @memberof Verify
   */
  public static checkFieldSysValueRule(
    viewValue: string,
    strReg: any,
    errorInfo: string,
    primaryModel: boolean,
  ): boolean {
    return this.checkFieldRegExRule(viewValue, strReg, errorInfo, primaryModel);
  }

  /**
   * 遍历数据并进行逻辑判断，支持&&和||，支持短路
   *
   * @param {any[]} array 数组
   * @param {Function} callback 回调函数
   * @param {string} [operateTag='AND'] 与或操作标识,支持AND、OR
   * @param {boolean} [isReverse=false] 是否取反
   * @returns {boolean}
   * @memberof Verify
   */
  public static logicForEach(
    array: any[],
    callback: (item: any, index: number) => boolean,
    operateTag: string = 'AND',
    isReverse: boolean = false,
  ): boolean {
    if (!(array?.length > 0)) {
      return false;
    }
    let result: boolean = operateTag == 'AND';
    for (let i = 0, len = array.length; i < len; i++) {
      const temp = callback(array[i], i);
      if (operateTag == 'AND') {
        if (!temp) {
          result = false;
          break;
        }
      } else if (operateTag == 'OR') {
        if (temp) {
          result = true;
          break;
        }
      }
    }
    return isReverse ? !result : result;
  }

  /**
   * 校验属性值规则
   *
   * @param {string} name 校验属性值所在字段的名称
   * @param {*} data 数据对象
   * @param {*} condition 规则条件
   * @returns {{ isPast: boolean, infoMessage: string }}
   * @memberof Verify
   */
  public static verifyDeRules(name: string, data: any, condition: any): { isPast: boolean; infoMessage: string } {
    const flag = { isPast: true, infoMessage: condition.ruleInfo };
    if (condition.condType == 'GROUP') {
      const childRules = condition.getPSDEFVRConditions();
      if (childRules?.length > 0) {
        flag.isPast = this.logicForEach(
          childRules,
          (item: any) => {
            const { isPast, infoMessage } = this.verifyDeRules(name, data, item);
            // 每次都把分组的结果信息改为该条件的信息，短路后是最后一个条件的信息
            flag.infoMessage = infoMessage;
            return isPast;
          },
          condition.condOp,
          !!condition.notMode,
        );
        // 分组结果为false时，如果是AND分组且取反，或是OR分组未取反，提示分组信息
        if (
          !flag.isPast &&
          ((condition.condOp == 'AND' && condition.notMode) || (condition.condOp == 'OR' && !condition.notMode))
        ) {
          flag.infoMessage = condition.ruleInfo;
        }
      }
    } else {
      try {
        // 常规规则
        if (condition.condType == 'SIMPLE') {
          flag.isPast = !Verify.checkFieldSimpleRule(
            data[name],
            condition.condOp,
            condition.paramValue,
            condition.ruleInfo,
            condition.paramType,
            data,
            condition.isKeyCond,
          );
          // 数值范围
        } else if (condition.condType == 'VALUERANGE2') {
          flag.isPast = !Verify.checkFieldValueRangeRule(
            data[name],
            condition.minValue,
            condition.includeMinValue,
            condition.maxValue,
            condition.includeMaxValue,
            condition.ruleInfo,
            condition.isKeyCond,
          );
          // 正则式
        } else if (condition.condType == 'REGEX') {
          flag.isPast = !Verify.checkFieldRegExRule(
            data[name],
            condition.regExCode,
            condition.ruleInfo,
            condition.isKeyCond,
          );
          // 长度
        } else if (condition.condType == 'STRINGLENGTH') {
          flag.isPast = !Verify.checkFieldStringLengthRule(
            data[name],
            condition.minValue,
            condition.includeMinValue,
            condition.maxValue,
            condition.includeMaxValue,
            condition.ruleInfo,
            condition.isKeyCond,
          );
          // 系统值规则
        } else if (condition.condType == 'SYSVALUERULE' && condition?.getPSSysValueRule?.()) {
          const { ruleType, regExCode, scriptCode, ruleInfo } = condition.getPSSysValueRule();
          flag.infoMessage = condition.ruleInfo || ruleInfo;
          if (ruleType == 'REG') {
            flag.isPast = !Verify.checkFieldRegExRule(data[name], regExCode, flag.infoMessage, condition.isKeyCond);
          } else if (ruleType == 'SCRIPT') {
            const { isPast, infoMessage } = Verify.checkFieldScriptRule(
              data[name],
              data,
              scriptCode,
              flag.infoMessage,
              condition.isKeyCond,
            );
            flag.isPast = isPast;
            flag.infoMessage = infoMessage || flag.infoMessage;
          }
        }
      } catch (error) {
        flag.isPast = false;
      }
      // 取反
      flag.isPast = condition.notMode ? !flag.isPast : flag.isPast;
    }
    return flag;
  }

  /**
   * 构建校验条件
   *
   * @param {*} model 模型数据
   *
   * @memberof Verify
   */
  public static buildVerConditions(model: any) {
    if (!model) {
      return [];
    }
    const isNumber: boolean = model?.editorType === 'NUMBER' ? true : false;
    const rules: Array<any> = [];
    // 构建值的type，最大值，最小值，最大长度，最小长度
    if (isNumber) {
      if (model.maxValue) {
        rules.push({ type: 'number', max: model.maxValue, message: `内容最大值必须为${model.maxValue}` });
      }
      if (model.minValue) {
        rules.push({ type: 'number', min: model.minValue, message: `内容最小值必须为${model.minValue}` });
      }
    } else {
      if (model.M.showMaxLength) {
        if (model.maxLength) {
          rules.push({
            validator: (rule: any, value: any, callback: any) => {
              const length = Util.isExistAndNotEmpty(value) ? value.length : 0;
              if (length > model.maxLength) {
                callback(new Error(`内容最大长度必须为${model.maxLength},当前长度为${value.length}`));
              } else {
                callback();
              }
            },
          });
        }
      }
      if (model.minLength) {
        rules.push({ type: 'string', min: model.minLength, message: `内容最小长度必须为${model.minLength}` });
      }
    }
    // 构建正则
    if (
      model.getPSSysValueRule &&
      model.getPSSysValueRule.ruleType &&
      Object.is(model.getPSSysValueRule.ruleType, 'REG')
    ) {
      rules.push({
        type: isNumber ? 'number' : 'string',
        pattern: model.getPSSysValueRule.regExCode,
        message: `${model.getPSSysValueRule.ruleInfo}`,
      });
    }
    // 精度
    // if (model.precision) {
    //     const validateData = (rule: any, value: any, callback: Function) => {
    //         let errorMessage;
    //         if (value && value.toString()) {
    //             let tempValue: string = value.toString();
    //             if (tempValue.indexOf(".") !== -1) {
    //                 let len: number = tempValue.substring(tempValue.indexOf(".") + 1).length;
    //                 if (len !== model.precision) {
    //                     errorMessage = `内容精度必须为${model.precision}`;
    //                 }
    //             } else {
    //                 if (model.precision !== 0) {
    //                     errorMessage = `内容精度必须为${model.precision}`;
    //                 }
    //             }
    //         }
    //         callback(errorMessage);
    //     }
    //     rules.push(validateData);
    // }
    return rules;
  }
}
