export class LogUtil {
  /**
   * 输出基本信息
   *
   * @static
   * @param {*} args
   * @memberof LogUtil
   */
  static log(...args: any[]): void {
    console.log(...args);
  }

  /**
   * 输出警告信息
   *
   * @static
   * @param {*} args
   * @memberof LogUtil
   */
  static warn(...args: any[]): void {
    console.warn(...args);
  }

  /**
   * 输出错误信息
   *
   * @static
   * @param {*} args
   * @memberof LogUtil
   */
  static error(...args: any[]): void {
    console.error(...args);
  }
}
