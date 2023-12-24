/*
 * @Description: sessionStorage缓存
 * @author: kelly
 * @Date: 2023-12-22 11:04:14
 * @LastEditTime: 2023-12-22 11:31:49
 */
import { getAuthData } from 'KellyCOM/utils/tools';
import { useCallback, useState } from 'react';

const username = getAuthData()?.user?.username;

export type PageCacheProps<T> = [
  T,
  {
    setData: (data: T) => void;
    remove: () => void;
  },
];

export default <T extends AnyObject = any>(
  path?: string,
): PageCacheProps<T> => {
  const name = path || window.location.pathname;
  const key = `${username}_${name}`;
  const [state, setState] = useState<T>(() => {
    let result: T;
    try {
      const data = window.sessionStorage.getItem(key);
      result = JSON.parse(data);
    } catch (err) {
      result = {} as T;
    }
    return result;
  });

  const setData = useCallback((data: T) => {
    setState(data);
    window.sessionStorage.removeItem(key);
  }, []);

  const remove = useCallback(() => {
    window.sessionStorage.removeItem(key);
  }, []);

  return [state, { setData, remove }];
};
