/**
 * 字符串驼峰转下划线
 * @param str
 */
export const camelToDownLine = (str: string): string => {
  const res = /^[A-Z]+/.test(str)
    ? str.replace(str[0], str[0].toLowerCase())
    : str;
  return res.replace(/[A-Z]./, (v = '') => {
    return '_' + v.replace(v[0], v[0].toLowerCase());
  });
};

/**
 * 下划线格式字符转换为驼峰式
 * @param str
 */
export const changeStringFormatLineToHump = (str = ''): string => {
  if (!str.includes('_')) {
    return str;
  }
  return str.replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
};

type ChangeObjectPropsFormatLineToHumpReturn<T> = {
  [K in keyof T]: T[K];
};

/**
 * 将对象所有属性扩展一份驼峰式属性
 */
export const changeObjectPropsFormatLineToHump = <T = Record<string, unknown>,>(
  obj: T,
): ChangeObjectPropsFormatLineToHumpReturn<T> & { [k: string]: any } => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new Error('转换参数不是对象类型');
  }

  const loop = (prop: any) => {
    Object.keys(prop).forEach((k) => {
      const newKey = changeStringFormatLineToHump(k);
      if (newKey !== k) {
        prop[newKey] = prop[k];
      }

      if (Object.prototype.toString.call(prop[k]) === '[object Object]') {
        loop(prop[k]);
      }
    });
  };

  loop(obj);

  return obj;
};
