/*
 * @Description: hooks封装防抖功能
 * @author: kelly
 * @Date: 2023-12-18 23:05:14
 * @LastEditTime: 2023-12-18 23:05:29
 */
import { useCallback, useEffect, useRef } from 'react';

const useDebounce = (fn, delay, dep = []) => {
  const { current } = useRef({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    [fn],
  );

  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn(...args);
    }, delay);
  }, dep);
};

export default useDebounce;
