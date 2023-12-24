import { Button } from 'antd';
import { useHttp, useTableRowSelection } from 'KellyCOM';
import React, { FC, useMemo, useRef } from 'react';
import BasicTable from '../../BasicTable/index';
import { BasicTableColumnsType, BasicTableRef } from '../types';
import {
  getClusters,
  getList,
  getNamespace,
  ListRecordProps,
} from './services';

const SearchTable: FC = () => {
  const tableRef = useRef<BasicTableRef<ListRecordProps>>();

  const { data: clusterOptions } = useHttp(getClusters);

  const {
    data: namespaceOptions,
    run: getNamespaceOptions,
    mutate: setNamespaceOptions,
  } = useHttp(getNamespace, { manual: true });

  const { selectedRows, rowSelection } = useTableRowSelection({
    enableAllSelection: true,
  });

  const columns: BasicTableColumnsType<ListRecordProps> = [
    {
      title: '数据库服务名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      search: {
        type: 'Input',
        showInHighSearch: true,
        hideInHead: true,
        sort: 1,
      },
    },
    {
      hideInTable: true,
      search: {
        type: 'Select',
        formItemProps: {
          name: 'clusterId',
          initialValue: ' ',
        },
        componentProps: {
          optionsMapping: { text: 'name', value: 'id' },
          options: [
            { text: '全部集群', value: ' ' },
            ...(clusterOptions || []),
          ],
          onChange(val, form) {
            form.setFieldsValue({ namespaceId: ' ' });
            setNamespaceOptions([]);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            val && getNamespaceOptions(val as string);
            tableRef.current.onSearch({
              dto: { clusterId: val, namespaceId: '' },
            });
          },
        },
      },
    },
    {
      hideInTable: true,
      search: {
        type: 'Select',
        formItemProps: {
          name: 'namespaceId',
          initialValue: ' ',
        },
        componentProps: {
          optionsMapping: { text: 'name', value: 'id' },
          options: [
            { text: '全部空间', value: ' ' },
            ...(namespaceOptions || []),
          ],
          onChange(val) {
            tableRef.current.onSearch({ dto: { namespaceId: val } });
          },
        },
      },
    },
    {
      title: '服务状态',
      dataIndex: 'cuid',
      renderStatus: 'tag',
      filterable: true,
      valueEnum: {
        running: {
          text: '正常',
          status: 'success',
        },
        failed: {
          text: '异常',
          status: 'error',
        },
        'N/A': {
          text: 'N/A',
        },
      },
    },
    {
      title: '系统状态',
      dataIndex: 'status',
      renderStatus: 'tag',
      filterable: true,
      valueEnum: {
        Running: {
          text: '运行中',
          status: 'success',
        },
        Unready: {
          text: '异常',
          status: 'error',
        },
      },
    },
    {
      title: '运营状态',
      dataIndex: 'operationStatus',
      renderStatus: 'dotText',
      filterable: true,
      valueEnum: {
        0: {
          text: '已上架',
          color: '#00A35D',
        },
        1: {
          text: '已下架',
          color: '#C42C2C',
        },
        2: {
          text: '下架中',
          color: '#FF8500',
        },
        3: {
          text: '上架中',
          color: '#006EFF',
        },
        4: {
          text: '删除中',
          color: '#929FBC',
        },
      },
    },
    {
      title: '所属空间',
      dataIndex: 'nsName',
    },
    {
      title: 'VIP',
      dataIndex: 'vip',
      ellipsis: true,
      search: {
        hideInHead: true,
        type: 'Input',
        showInHighSearch: true,
        sort: 4,
      },
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      search: {
        showInHighSearch: true,
        type: 'Input',
        hideInHead: true,
        sort: 3,
      },
    },
    {
      title: '所属宿主机',
      dataIndex: 'hostName',
      search: {
        hideInHead: true,
        showInHighSearch: true,
        type: 'Input',
      },
    },
    {
      title: '所属业务系统/子系统',
      dataIndex: 'systemName',
      search: {
        hideInHead: true,
        type: 'Input',
        showInHighSearch: true,
        sort: 2,
      },
    },
    {
      title: '架构类型',
      dataIndex: 'arcType',
      filterable: true,
      valueEnum: {
        MGR: {
          text: 'A容器版',
        },
        HA: {
          text: 'B容器版',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '操作',
      render() {
        return (
          <>
            <Button type="link">远程连接</Button>
          </>
        );
      },
    },
  ];

  const leftHead = useMemo(
    () => (
      <div>
        <Button disabled={selectedRows.length === 0}>运维操作</Button>
      </div>
    ),
    [selectedRows],
  );

  return (
    <div>
      <BasicTable<ListRecordProps>
        onExport
        tableRef={tableRef}
        columns={columns}
        request={(params) => getList({ ...params, size: 5 })}
        leftHead={leftHead}
        headLayout={[3, 21]}
        rowKey="id"
        highSearch={{ colSpan: 6, showLabel: false }}
        rowSelection={rowSelection}
        autoRefresh={{ enableDefaultRefreshTime: true }}
      />
    </div>
  );
};

export default SearchTable;
