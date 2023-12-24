/*
 * @Description: 全局Context数据
 * @Author: kelly
 * @Date: 2023/12/14
 */
import { createContext, Dispatch, Reducer } from 'react';
import { RouterProps } from 'react-router-dom';
import { PermissionProps } from './types';

export type StateProps = {
  appHistory: RouterProps['history'];
  isMicroEnv: boolean;
  publicPath: string;
  systemId: string;
  permissions: PermissionProps;
};

export type StateAction = {
  key: keyof StateProps;
  payload: StateProps[StateAction['key']];
};

export const initState: StateProps = {
  appHistory: null as any,
  systemId: null as string,
  isMicroEnv: process.env.NODE_ENV === 'production',
  publicPath: '/',
  permissions: {},
};

export const reducers: Reducer<StateProps, Partial<StateProps>> = (
  state,
  action,
) => {
  if (Object.prototype.toString.call(action) !== '[object Object]') {
    return state;
  }
  return { ...state, ...action };
};

export interface ContextProps extends StateProps {
  dispatch?: Dispatch<Partial<StateProps>>;
}

export const Context = createContext<ContextProps>(initState);
