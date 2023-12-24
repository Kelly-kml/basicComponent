import { useRequest } from 'ahooks';
import { Table, TableProps } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import mergeWith from 'lodash/mergeWith';
import React, { ReactElement, useImperativeHandle, useState } from 'react';
import { camelToDownLine } from '../utils';
import useMergeState from './hooks/useMergeState';
import { BasicTableProps, TableQueryProps } from './types';
import findItemAndIndex from './utils/index';

function BasicTable<T extends AnyObject>(
  props: BasicTableProps<T>,
): ReactElement<T> {
  // const dataSource = [
  //   {
  //     key: '1',
  //     name: '胡彦斌',
  //     age: 32,
  //     address: '西湖区湖底公园1号',
  //   },
  //   {
  //     key: '2',
  //     name: '胡彦祖',
  //     age: 42,
  //     address: '西湖区湖底公园1号',
  //   },
  // ];

  const {
    request,
    tableRef,
    postData,
    columns: basicTableColumns,
    rowKey,
    defaultDataSource,
    onDataSourceChange, // setDataSource数据
    beforeRequestFormatParams,
    // leftHeader,
    isLocal = false, //默认不启用本地分页
    immediate = true,
    ...rests
  } = props;

  const [loading, setLoading] = useMergeState<TableProps<T>['loading']>(false, {
    value: rests?.loading,
    // onChange: rests?.setLoading,
  });

  const [dataSource, setDataSource] = useMergeState<T[]>([], {
    value: rests?.dataSource as T[],
    onChange: onDataSourceChange,
    defaultValue: defaultDataSource,
  });

  const [total, setTotal] = useState<number>(0);
  const [cacheDataSource, setCacheDataSource] = useState<T[]>([]);
  const [queryParams, setQueryParams] = useState<TableQueryProps>({
    current: 1,
    size: 10,
    dto: {
      searchKey: '',
      key: '',
    },
  });
  // const [queryParams, setQueryParams] = useState<TableQueryProps>(() => {
  // const query = {
  //   current: 1,
  //   size: 10,
  //   dto: {
  //     searchKey: '',
  //     key: ''
  //   },
  // };
  //   let cacheQuery = {};
  //   try {
  //     cacheQuery = JSON.parse(window.sessionStorage.getItem(cacheKey));
  //   } catch (e) {
  //     console.warn(e);
  //     cacheQuery = {};
  //   }
  //   return { ...query, ...cacheQuery };
  // });

  /**
   * 请求接口
   */
  const { params, run: onSearch } = useRequest(
    async (params: AnyObject = {}, needLoading = true) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      needLoading && setLoading(true);
      if (typeof request === 'function') {
        let query = mergeWith(queryParams, params, (oVal, newVal, key, obj) => {
          if (newVal === undefined) {
            obj[key] = undefined;
          }
        });

        if (typeof beforeRequestFormatParams === 'function') {
          query = await beforeRequestFormatParams(query);
        }
        return request(query);
      }
      return Promise.resolve(rests?.dataSource || defaultDataSource || []);
    },
    {
      manual: !immediate,
      loadingDelay: 200,
      pollingWhenHidden: false,
      debounceInterval: 500,
      initialData: [],
      formatResult(res: any) {
        if (typeof postData === 'function') {
          const post = postData(res);
          return Array.isArray(post) ? post : res?.data || [];
        }

        if (res?.pagination) {
          setQueryParams((state) => ({
            ...state,
            current: Number(res?.pagination?.current) || 1,
            size: Number(res.pagination?.size) || 10,
          }));
          setTotal(Number(res.pagination?.total) || 0);
        }

        let result = [];

        if (Array.isArray(res)) {
          result = res;
        }
        if (Array.isArray(res?.data)) {
          result = res.data;
        }

        //本地分页
        if (isLocal) {
          setCacheDataSource(result);
        }
        return result;
      },

      onSuccess(data: any) {
        if (Array.isArray(data)) {
          setDataSource(data);
        } else {
          setDataSource([]);
          setTotal(0);
        }
        setLoading(false);
      },

      onError(err: any) {
        setTotal(0);
        setDataSource([]);
        setLoading(false);
        throw err;
      },
    },
  );

  /**
   * table onChange
   * @param {CurriedFunction1, pageSize}
   * @param filter
   * @param sorter
   */
  const onChange: TableProps<T>['onChange'] = (
    { current, pageSize },
    filters,
    sorter,
  ) => {
    const query = { ...queryParams };
    query.current = current;
    query.size = pageSize;

    // 本地分页筛选处理
    if (isLocal) {
    } else {
      // 筛选
      Object.keys(filters).forEach((key) => {
        query.dto[key] = filters[key];
      });

      // 排序
      if (Array.isArray(sorter)) {
        const ordersArr: any = [];
        sorter.forEach(({ field, order }) => {
          if (order) {
            const orders: { column: string; asc?: boolean } = {
              column: camelToDownLine(field as string),
            };
            orders.asc = order === 'ascend';
            ordersArr.push(order);
          }
        });
        query.orders = ordersArr;
      } else {
        // 单列排序
        const { field, order } = sorter;
        if (order) {
          query.orders = [
            {
              column: camelToDownLine(field as string),
              asc: order === 'ascend',
            },
          ];
        } else {
          delete query.orders;
        }
      }
      onSearch(query);
    }

    setQueryParams(query);
  };

  /**
   * 更新列表单行或者多行数据
   * @param prop
   */
  const updateTableData = (
    prop: Array<{ rowKey: string; values: AnyObject }>,
  ) => {
    if (Array.isArray(prop) && prop.length) {
      const temp = [...dataSource];
      for (let i = 0; i < temp.length; i++) {
        const { item, index } = findItemAndIndex(
          prop,
          (v) => v.rowKey === temp[i]?.[rowKey],
        );
        if (index !== -1 && item) {
          Object.keys(item.values || {}).forEach((k) => {
            (temp[i] as any)[k] = item.values?.[k];
          });
          if (index === prop.length) {
            break;
          }
        }
      }
      setDataSource(temp);
    }
  };

  /**
   * 对外暴露实例的方法
   */
  useImperativeHandle(tableRef, () => ({
    onSearch,
    dataSource,
    updateTableData,
  }));

  return (
    <div>
      <Table
        loading={loading}
        rowKey={rowKey}
        dataSource={dataSource}
        columns={columns}
        onChange={onChange}
      />
      ;
    </div>
  );
}

const TableContainer = <T extends AnyObject>(props: BasicTableProps<T>) => {
  return (
    // <Container>
    <BasicTable<T> {...props} />
    // </Container>
  );
};

export default TableContainer;
