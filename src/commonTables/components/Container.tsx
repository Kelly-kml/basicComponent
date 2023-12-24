import { AnyObject } from 'antd/es/_util/type';
import isPlainObject from 'lodash/isPlainObject';
import React, { createContext, FC } from 'react';
import { useImmerReducer } from 'use-immer';

export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

export type TableModelStateProps = AnyObject;

export const initState: TableModelStateProps = {};

export const reducers = (draft: any, action: (arg0: any) => any) => {
  if (typeof action === 'function') {
    return void action(draft);
  }
  if (isPlainObject(action)) {
    return action;
  }
  throw new Error('dispatch 不支持非函数、对象以外的其他类型参数');
};

export const Context = createContext(initState);

const Container: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducers, initState);

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export default Container;
