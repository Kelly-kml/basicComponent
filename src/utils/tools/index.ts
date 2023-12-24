import { AuthDataProps } from 'KellyCOM/types';
/**
 * 获取登录权限
 */
export const getAuthData = (): AuthDataProps => {
  try {
    const { val } =
      JSON.parse(window.localStorage.getItem('authData') || null) || {};
    return val || {};
  } catch (err) {
    return {} as AuthDataProps;
  }
};
