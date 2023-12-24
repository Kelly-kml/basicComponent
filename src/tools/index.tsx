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
