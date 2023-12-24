/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-14 15:06:43
 * @LastEditTime: 2023-12-14 15:37:47
 */

import { message } from 'antd';
import basicAxiosRequest, {
  BasicAxios,
  BasicAxiosRequestParams,
} from 'basic-axios-request';
import { AuthDataProps } from '../../../types';
import { changeObjectPropsFormatLineToHump } from '../index';

export * from 'basic-axios-request';

export type ResProps = {
  code: number;
  data: any;
  msg: string;
  [k: string]: any;
};

const IS_CMB = process.env.REACT_APP_COMPANY === 'CMB';

const whitelist = ['/login', '/auth/refreshtoken', '/upms/anon/tenant'];

const logout = () => {
  if (window.location.pathname !== '/basicPortal/login') {
    const { accessToken, user } =
      JSON.parse(window.localStorage.getItem('basicPortal.authData') as any)
        ?.val || {};
    if (accessToken) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !IS_CMB
        ? window.fetch('/auth/oauth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'TENANT-ID': user?.tenantId || '-1',
            },
          })
        : window.fetch(`/gateway/logout?accessToken=${accessToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'TENANT-ID': user?.tenantId || '-1',
            },
          });
    }
    window.location.href = '/basicPortal/login';
  }
};

const Http = (params: Partial<BasicAxiosRequestParams> = {}): BasicAxios =>
  basicAxiosRequest({
    axiosCreateConfig: {
      baseURL: '/api',
    },
    whitelist,
    accessTokenExpires() {
      try {
        const { expires } =
          JSON.parse(window.localStorage.getItem('basicPortal.authData')) || {};
        return expires;
      } catch (e) {
        throw new Error('获取接口过期时间失败，检查authData数据是否正确');
      }
    },
    getToken() {
      const { accessToken, access_token, refreshToken, refresh_token } =
        (JSON.parse(window.localStorage.getItem('basicPortal.authData') as any)
          ?.val || {}) as AuthDataProps;
      return {
        accessToken: accessToken || access_token,
        refreshToken: refreshToken || refresh_token,
      };
    },
    async updateAccessToken(request, oldRefreshToken) {
      const res: { code: number; data: any } = await request.post(
        '/upms/auth/refreshtoken',
        {
          authorization: 'cG9ydGFsLWNsaWVudDpiNGZHOHRNQA==',
          refresh_token: oldRefreshToken,
        },
      );
      if (res?.code === 0) {
        const authData = changeObjectPropsFormatLineToHump(res.data);
        window.localStorage.setItem(
          'basicPortal.authData',
          JSON.stringify({
            val: authData,
            expires: Number(new Date()) + Number(authData?.expiresIn) * 1000,
          }),
        );
        return authData?.accessToken || authData?.access_token;
      }
    },
    beforeRequest(config) {
      const { user } =
        JSON.parse(window.localStorage.getItem('basicPortal.authData') as any)
          ?.val || {};
      config.headers = {
        ...config.headers,
        'TENANT-ID': user?.tenantId || '-1',
      };
      return config;
    },
    afterResponse(res) {
      const response: ResProps = res?.data;
      const config = res?.config;

      // 常规接口返回
      if (response?.code === 0) {
        return res?.data;
      }

      // 文件下载
      if (
        config.responseType === 'blob' ||
        config.responseType?.includes('application/vnd.ms-excel') ||
        Boolean(config?.isDownloadFile)
      ) {
        // 自定义下载处理
        if (Boolean(config?.manualDownload)) {
          return res?.data;
        }

        // 默认下载方法
        const fileName = window.decodeURIComponent(
          config?.downloadFileName ||
            res.headers['content-disposition'].match(/filename=(.*)/)?.[1] ||
            res.headers['content-disposition'].match(
              /filename\*=utf-8''(.*)/,
            )?.[1] ||
            '',
        );

        const blob = new Blob([res?.data], {
          type: 'application/octet-stream',
        });
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const blobURL = window.URL.createObjectURL(blob);
          const tempLink = document.createElement('a');
          tempLink.style.display = 'none';
          tempLink.href = blobURL;
          tempLink.setAttribute('download', fileName);
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
          }
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
        }

        return res?.data;
      }

      // 刷新token接口没有返回正确数据直接退出
      if (
        response?.code !== 0 &&
        res.config?.url?.endsWith('/auth/refreshtoken')
      ) {
        logout();
        return Promise.reject(response);
      }

      message.error(response?.msg || '服务器发生未知错误，请稍后再试', 2);
      return Promise.reject(response);
    },
    onResponseReject(error) {
      const { response } = error || {};
      if (response?.status === 401) {
        logout();
      }
    },
    logout,
    ...params,
  });

export default Http;
