/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-18 15:27:47
 * @LastEditTime: 2023-12-18 15:30:37
 */
import {
  BaseOptions,
  BasePaginatedOptions,
  BaseResult,
  CombineService,
  LoadMoreFormatReturn,
  LoadMoreOptions,
  LoadMoreOptionsWithFormat,
  LoadMoreParams,
  LoadMoreResult,
  OptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedOptionsWithFormat,
  PaginatedParams,
  PaginatedResult,
} from '@ahooksjs/use-request/es/types';
import { useRequest } from 'ahooks';
import { message } from 'antd';

type DefaultRes<T = any> = {
  code: number;
  data: T;
};

function useHttp<R = any, P extends any[] = any, U = any, UU extends U = any>(
  service: CombineService<R, P>,
  options: OptionsWithFormat<R, P, U, UU>,
): BaseResult<U, P>;
function useHttp<R = any, P extends any[] = any, U = any>(
  service: CombineService<R, P>,
  options?: BaseOptions<R, P>,
): BaseResult<R extends DefaultRes<infer T> ? T : R, P>;
function useHttp<R extends LoadMoreFormatReturn, RR>(
  service: CombineService<RR, LoadMoreParams<R>>,
  options: LoadMoreOptionsWithFormat<R, RR>,
): LoadMoreResult<R>;
function useHttp<R extends LoadMoreFormatReturn, RR>(
  service: CombineService<RR, LoadMoreParams<R>>,
  options: LoadMoreOptions<R>,
): LoadMoreResult<R extends DefaultRes<infer T> ? T : R>;
function useHttp<R = any, Item = any, U extends Item = any>(
  service: CombineService<R, PaginatedParams>,
  options: PaginatedOptionsWithFormat<R, Item, U>,
): PaginatedResult<Item>;
function useHttp<R = any, Item = any, U extends Item = any>(
  service: CombineService<PaginatedFormatReturn<Item>, PaginatedParams>,
  options: BasePaginatedOptions<U>,
): PaginatedResult<Item extends DefaultRes<infer T> ? T : Item>;
function useHttp(service: any, options?: any): any {
  return useRequest(service, {
    formatResult(res) {
      if (res?.code !== 0) {
        message.error(res?.msg || '服务出现未知错误，请稍后再试');
      }
      return res?.data;
    },
    ...(options || {}),
  });
}

export default useHttp;
