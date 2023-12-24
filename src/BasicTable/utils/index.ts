/**
 * @description: 数组查找元素并且返回index 方法
 */
export default <T = any>(
  arr: T[],
  fn: (item: T, index: number, arr: T[]) => boolean,
): { item: T; index: number } => {
  let item: T = 'undefined';
  let index = -1;

  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i, arr)) {
      item = arr[i];
      index = i;
      break;
    }
  }

  return { item, index };
};
