import { useRequest } from 'ahooks';
import { Form, Table } from 'antd';
import { TableProps } from 'antd/es/table';
import { AnyObject } from 'antd/es/_util/type';
import mergeWith from 'lodash/mergeWith';
import React, {
  ReactElement,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import useHistory, { RouterProps } from 'react-router-dom';
import { camelToDownLine } from '../tools/index';
import CellRender from './components/CellRender';
import Container, { Context } from './components/Container';
import HeaderCell from './components/HeaderCell';
import HighSearch from './components/HighSearch';
import TableHeadSearch from './components/TableHeadSearch';
import useColumns from './hooks/useColumns';
import useEditable from './hooks/useEditable';
import useGenModelState from './hooks/useGenModelState';
import useMergeState from './hooks/useMergeState';
import './styles.less';
import { BasicTableProps, TableQueryProps } from './types';
import findItemAndIndex from './utils/findItemAndIndex';

export * from './types';

function BasicTable<T extends AnyObject>(
  props: BasicTableProps<T>,
): ReactElement<T> {
  const {
    request,
    tableRef,
    postData,
    columns: basicTableColumns,
    rowKey,
    leftHead,
    // addonRightHead,
    beforeRequestFormatParams,
    editable,
    defaultDataSource,
    onDataSourceChange,
    immediate = true,
    isLocal = false,
    // resizable = false,
    // isSortable = false,
    hiddenHead = false,
    highSearch = false,
    // autoRefresh = false,
    // enableAllSelection = false,
    onExport = false,
    enableColumnsSetting = true,
    headLayout = [8, 16],
    headKeywordSearch = 'all',
    ...rests
  } = props;
  const { dispatch, ...modelState } = useContext(Context);
  const history = useHistory();
  const cacheKey = window.location.pathname;

  const [loading, setLoading] = useMergeState<TableProps<T>['loading']>(false, {
    value: rests?.loading,
    onChange: rests?.setLoading,
  });

  const [dataSource, setDataSource] = useMergeState<T[]>([], {
    value: rests?.dataSource as T[],
    onChange: onDataSourceChange,
    defaultValue: defaultDataSource,
  });

  const [total, setTotal] = useState<number>(0);
  const [cacheDataSource, setCacheDataSource] = useState<T[]>([]); // 本地分页筛选数据
  const [queryParams, setQueryParams] = useState<TableQueryProps>(() => {
    const query = {
      current: 1,
      size: 10,
      dto: {
        searchKey: '',
      },
    };
    let cacheQuery = {};
    try {
      cacheQuery = JSON.parse(window.sessionStorage.getItem(cacheKey));
    } catch (e) {
      console.warn(e);
      cacheQuery = {};
    }
    return { ...query, ...cacheQuery };
  });

  /**
   * 请求接口谁
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
      formatResult(res) {
        if (typeof postData === 'function') {
          const post = postData(res);
          return Array.isArray(post) ? post : res?.data || [];
        }

        if (res?.pagination) {
          setQueryParams((state) => ({
            ...state,
            current: Number(res.pagination?.current) || 1,
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

        // 本地分页
        if (isLocal) {
          setCacheDataSource(result);
        }

        return result;
      },

      onSuccess(data) {
        if (Array.isArray(data)) {
          setDataSource(data);
        } else {
          setDataSource([]);
          setTotal(0);
        }
        setLoading(false);
      },

      onError(err) {
        setTotal(0);
        setDataSource([]);
        setLoading(false);
        throw err;
      },
    },
  );

  /**
   * 在跳转前缓存查询条件
   */
  const historyPush: RouterProps['history']['push'] = (to, state?) => {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(queryParams));
    history.push(to, state);
  };

  /** 编辑列表相关 */
  const editableUtils = useEditable(props, {
    dataSource,
    setDataSource,
    rowKeyStr: rowKey,
  });

  /** 列渲染hook */
  const {
    tableColumns,
    headSearchFormItems,
    highSearchFormItems,
    colModelState,
  } = useColumns<T>({
    columns: basicTableColumns,
    editable,
    highSearch,
    rowKey,
    form: editable?.form,
    editableUtils,
  });

  /** 生成全局Content绑定的数据 */
  useGenModelState({ colModelState, dataSource, rowKey });

  /**
   * table onChange
   * @param {current, pageSize}
   * @param filters
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
        const ordersArr = [];
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
   * 更新列表单行或多行数据
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
    historyPush,
    dataSource,
    updateTableData,
    model: modelState,
    setModel: dispatch,
  }));

  /** 列表分页 */
  const mergePagination = useMemo(
    () =>
      props?.pagination === false
        ? false
        : {
            total,
            current: queryParams.current,
            pageSize: queryParams.size,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['1', '5', '10', '20', '50', '100'],
            showTotal: (n) => `共计 ${n} 项`,
          },
    [props?.pagination, total, queryParams.current, queryParams.size],
  );

  /** 列表主体 */
  const TableContent = (
    <div className="basic-table">
      {!hiddenHead && (
        <TableHeadSearch
          queryParams={queryParams}
          highSearch={HighSearch}
          isLocal={isLocal}
          headSearchFormItems={headSearchFormItems}
          onSearch={onSearch}
          headKeywordSearch={headKeywordSearch}
          headLayout={headLayout}
          leftHead={leftHead}
          setQueryParams={setQueryParams}
          highSearchFormItems={highSearchFormItems}
          enableColumnsSetting={enableColumnsSetting}
          onExport={onExport}
        />
      )}
      <div>
        <Table<T>
          loading={loading}
          columns={tableColumns}
          rowKey={rowKey}
          dataSource={dataSource}
          onChange={onChange}
          pagination={mergePagination}
          rowSelection={rests.rowSelection}
          components={{
            header: {
              cell: HeaderCell,
            },
            body: {
              cell: CellRender,
            },
          }}
        />
      </div>
    </div>
  );

  return editable?.form ? (
    <Form
      form={editable?.form}
      component={false}
      onValuesChange={(changedValues) => {
        // TODO: 考虑是否需要同步回dataSource
        console.log(changedValues);
      }}
    >
      {TableContent}
    </Form>
  ) : (
    TableContent
  );
}

const BasicTableContainer = <T,>(props: BasicTableProps<T>) => (
  <Container>
    <BasicTable<T> {...props} />
  </Container>
);

export default BasicTableContainer;
