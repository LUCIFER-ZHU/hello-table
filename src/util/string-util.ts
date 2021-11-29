import { notNilEmpty } from 'qx-util';

/**
 * 字符串工具类
 *
 * @author chitanda
 * @date 2021-04-23 20:04:27
 * @export
 * @class StringUtil
 */
export class StringUtil {
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
   * 填充字符串中的数据
   *
   * @author chitanda
   * @date 2021-04-23 20:04:17
   * @static
   * @param {string} str
   * @param {*} [context]
   * @param {*} [data]
   * @return {*}  {string}
   */
  static fillStrData(str: string, context?: any, data?: any): string {
    if (notNilEmpty(str)) {
      if (notNilEmpty(context)) {
        const strArr = str.match(this.contextReg);
        strArr?.forEach(_key => {
          const key = _key.slice(10, _key.length - 1);
          str = str.replace(`\${context.${key}}`, context[key] || '');
        });
      }
      if (notNilEmpty(data)) {
        const strArr = str.match(this.dataReg);
        strArr?.forEach(_key => {
          const key = _key.slice(7, _key.length - 1);
          str = str.replace(`\${data.${key}}`, data[key] || '');
        });
      }
    }
    return str;
  }
}
