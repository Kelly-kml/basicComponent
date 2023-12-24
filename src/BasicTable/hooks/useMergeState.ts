import { Dispatch, useEffect, useRef, useState } from 'react';

type OptionsType<T> = {
  defaultValue?: T;
  value?: T;
  onChange?: (newVal: T, oldValue: T) => void;
};

export default <T>(
  initialState: T | (() => T),
  { value, defaultValue, onChange }: OptionsType<T>,
): [T, Dispatch<T>] => {
  const mountRef = useRef<boolean>(false);
  const [innerState, setInnerState] = useState<T>(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return typeof initialState === 'function'
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        (initialState as Function)()
      : initialState;
  });

  let mergedValue = value !== undefined ? value : innerState;
  // let mergedValue: any = initialState;

  const triggerChange = (newVal: T) => {
    setInnerState(newVal);
    if (mergedValue !== newVal && onChange) {
      onChange(newVal, mergedValue);
    }
  };

  useEffect(() => {
    mountRef.current = true;
    return () => {
      mountRef.current = false;
    };
  });

  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    // if (value === undefined) {
    //   setInnerState(undefined);
    // }
  }, [value]);

  const mountSetState: Dispatch<T> = (state: T) => {
    requestAnimationFrame(() => {
      if (mountRef.current) {
        triggerChange(state);
      }
    });
  };

  return [mergedValue, mountSetState];
};
