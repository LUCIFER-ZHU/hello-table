/**
 * 复数变化规则
 *
 *
 */
export class PluralizeRule {
  /**
   * 不规则
   *
   * @protected
   * @type {string[]}
   * @memberof PluralizeRule
   */
  protected irregular: Map<string, string> = new Map();

  /**
   * 不可数
   *
   * @protected
   * @type {string[]}
   * @memberof PluralizeRule
   */
  protected uncountable: string[] = [
    'equipment',
    'information',
    'rice',
    'money',
    'species',
    'series',
    'fish',
    'sheep',
    'people',
    'men',
    'children',
    'sexes',
    'moves',
    'stadiums',
    'oxen',
    'octopi',
    'viri',
    'aliases',
    'quizzes',
  ];

  /**
   * 初始化pluralizeRule对象
   *
   * @param opts 额外参数
   * @memberof PluralizeRule
   */
  public constructor(opts: any = {}) {
    this.initIrregular();
  }

  /**
   * 初始化不规则变化
   *
   * @param opts 额外参数
   * @memberof PluralizeRule
   */
  protected initIrregular() {
    this.irregular.set('person', 'people');
    this.irregular.set('man', 'men');
    this.irregular.set('child', 'children');
    this.irregular.set('sex', 'sexes');
    this.irregular.set('move', 'moves');
    this.irregular.set('stadium', 'stadiums');
  }

  /**
   * 是否为不可数
   *
   * @param word 单词
   * @returns 返回判断
   * @memberof PluralizeRule
   */
  public isUncountable(word: string) {
    const index: number = this.uncountable.findIndex((wordStr: string) => {
      return Object.is(word, wordStr);
    });
    if (index == -1) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 不规则变化
   *
   * @param word 单词
   * @returns 返回变化值
   * @memberof PluralizeRule
   */
  public irregularChange(word: string) {
    for (const item of this.irregular.entries()) {
      if (word && word.endsWith(item[0])) {
        return word.replace(new RegExp(item[0], 'g'), item[1]);
      }
    }
    return this.irregular.get(word);
  }

  /**
   * 规则变化
   *
   * @param word 单词
   * @returns 返回变化值
   * @memberof PluralizeRule
   */
  public ruleChange(word: string) {
    if (/(ax|test)is$/.test(word)) return word.replace(/is$/, 'es');
    if (/(octop|vir)us$/.test(word)) return word.replace(/us$/, 'i');
    if (/(octop|vir)i$/.test(word)) return word;
    if (/(alias|status)$/.test(word)) return word + 'es';
    if (/(bu)s$/.test(word)) return word.replace(/s$/, 'ses');
    if (/(buffal|tomat)o$/.test(word)) return word.replace(/o$/, 'oes');
    if (/([ti])um$/.test(word)) return word.replace(/um$/, 'a');
    if (/([ti])a$/.test(word)) return word;
    if (/sis$/.test(word)) return word.replace(/sis$/, 'ses');
    if (/(?:([^f])fe|([lr])f)$/.test(word)) return word.substring(0, word.length - 1) + 'ves';
    if (/(hive)$/.test(word)) return word + 's';
    if (/([^aeiouy]|qu)y$/.test(word)) return word.replace(/y$/, 'ies');
    if (/(x|ch|ss|sh)$/.test(word)) return word + 'es';
    if (/(matr|vert|ind)ix|ex$/.test(word)) return word.replace(/ix|ex$/, 'ices');
    if (/([m|l])ouse$/.test(word)) return word.replace(/ouse$/, 'ice');
    if (/([m|l])ice$/.test(word)) return word;
    if (/^(ox)$$/.test(word)) return word + 'en';
    if (/(quiz)$/.test(word)) return word + 'zes';
    if (/s$/.test(word)) return word.replace(/s$/, 's');
    return word + 's';
  }
}
