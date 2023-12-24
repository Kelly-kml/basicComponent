import { useDebounceFn } from 'ahooks';
import { Button, Form, Spin } from 'antd';
import { Icon } from 'KellyCOM';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import BasicTable from '../../BasicTable/index';
import { BasicTableColumnsType, BasicTableRef } from '../types';
import { getContainerOptions, getRhcsList } from './services';

export type FormDataRecordProps = {
  id: string;
  arcType: string;
  instanceName: string;
  dbType: string;
  clusterId: string;
  operationMachineName: string;
  timePoint: string;
};

export const TRANSFER_ARCTYPE_OPTIONS = [
  { text: '容器类', value: 'CONTAINNER' },
  { text: '非容器类', value: 'RHCS' },
];

export const OPERATIONMACHINENAME = [
  { text: 'store01sz （深圳）', value: 'store01sz' },
  { text: 'restore01sh （上海）', value: 'restore01sh' },
];

const defaultDataSource = [
  {
    id: '1',
    arcType: '容器类',
    instanceName: 'ngslave77',
    dbType: 'MGR',
    clusterId: '1282590122105114716',
    operationMachineName: '',
    timePoint: '',
  },
  {
    id: '2',
    arcType: '容器类',
    instanceName: 'ngslave78',
    dbType: 'HA',
    clusterId: '1282590122105114716',
    operationMachineName: '',
    timePoint: '',
  },
];

const EditTable = () => {
  const [form] = Form.useForm();
  const tableRef = useRef<BasicTableRef<FormDataRecordProps>>();

  // 查询数据库服务名下拉项
  const { run: getCurrentRowOptions } = useDebounceFn(
    async (str, { rowKey }) => {
      const target = (str || '')?.trim();
      if (target.length < 2) {
        return;
      }

      // 设置loading状态
      tableRef.current?.setModel((draft) => {
        if (draft?.[rowKey]?.instanceName?.loading !== undefined) {
          draft[rowKey].instanceName.loading = true;
        }
      });

      const isContainer =
        form.getFieldValue([rowKey, 'arcType']) === 'CONTAINNER';

      try {
        const res = isContainer
          ? await getContainerOptions(target)
          : await getRhcsList(target);

        if (res?.code === 0 && Array.isArray(res?.data)) {
          tableRef.current?.setModel((draft) => {
            draft[rowKey].instanceName.options = res.data.map((v) => ({
              text: v.name || v.instance_name,
              value: v.name || v.instance_name,
              dbType: isContainer ? v?.arcType : 'RHCS',
            }));
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        tableRef.current?.setModel((draft) => {
          draft[rowKey].instanceName.loading = false;
        });
      }
    },
    { wait: 500 },
  );

  const columns: BasicTableColumnsType<FormDataRecordProps> = [
    {
      title: '架构类型',
      dataIndex: 'arcType',
      tips: '头部描述喵喵喵～',
      width: 240,
      valueEnum: {
        MGR: { text: 'MGR容器版' },
        HA: { text: 'HA容器版' },
      },
      editable: {
        type: 'Select',
        required: true,
        componentProps: {
          options: TRANSFER_ARCTYPE_OPTIONS,
          onChange(val, actions) {
            const rowKey = actions?.rowKey;
            if (val) {
              actions?.setModel((draft) => {
                if (draft?.[rowKey]?.instanceName?.disabled !== undefined) {
                  draft[rowKey].instanceName.disabled = false;
                }
              });
            }
          },
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请选择架构类型',
            },
          ],
        },
      },
    },
    {
      title: '数据库服务名',
      dataIndex: 'instanceName',
      width: 260,
      editable: {
        type: 'Select',
        required: true,
        // 单元格需要动态绑定的数据，通过类似 model.rowKey.instanceName.options 方式获取
        modelState: {
          disabled: true,
          loading: false,
          options: [],
        },
        componentProps: {
          showSearch: true,
          allowClear: true,
          // TODO: 使用函数回调关联状态不够优雅，🤔 考虑优化成类似SQL语句实现
          disabled: ({ rowKey, model }) =>
            model?.[rowKey]?.['instanceName']?.disabled,
          loading: ({ rowKey, model }) =>
            model?.[rowKey]?.['instanceName']?.loading,
          options: ({ rowKey, model }) =>
            model?.[rowKey]?.['instanceName']?.options,
          notFoundContent: ({ rowKey, model }) =>
            model?.[rowKey]?.['instanceName']?.loading ? (
              <Spin size="small" />
            ) : null,
          onSearch: getCurrentRowOptions,
          onChange(val, { rowKey, extra }) {
            const isContainer =
              form.getFieldValue([rowKey, 'arcType']) === 'CONTAINNER';
            const dbType = extra?.['data-item']?.dbType;
            // 设置列表数据库架构显示
            const values = [
              { rowKey, values: { dbType: !isContainer ? 'RHCS' : dbType } },
            ];
            tableRef.current.updateTableData(values);
          },
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入数据库服务名',
            },
          ],
        },
      },
    },
    {
      title: '数据库架构',
      dataIndex: 'dbType',
      valueEnum: {
        '0': {
          text: 'RHCS',
        },
        '2': {
          text: 'MGR容器版',
        },
        '7': {
          text: 'HA容器版',
        },
        MGR: {
          text: 'MGR容器版',
        },
        HA: {
          text: 'HA容器版',
        },
      },
    },
    {
      title: '指定恢复机',
      dataIndex: 'operationMachineName',
      width: 240,
      editable: {
        required: true,
        forceEdit: true,
        type: 'Select',
        componentProps: {
          disabled: ({ rowKey, model, record }) =>
            model?.[rowKey]?.['instanceName']?.disabled &&
            record?.['__CUSTOM__'],
          options: OPERATIONMACHINENAME,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入指定恢复机',
            },
          ],
        },
      },
    },
    {
      title: '指定时间点',
      dataIndex: 'timePoint',
      width: 250,
      editable: {
        type: 'DatePicker',
        forceEdit: true,
        componentProps: {
          format: 'MM/DD/YYYY HH:mm:ss',
          showTime: true,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入指定时间点',
            },
          ],
        },
      },
    },
    {
      dataIndex: 'clusterId',
      width: 0,
      editable: {
        type: 'Input',
        formItemProps: {
          hidden: true,
        },
      },
    },
    {
      title: '操作',
      width: 130,
      render(_, record, index, options) {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                options?.actions?.addEditRow(
                  {
                    id: nanoid(), // 不能使用 index + 1，因为是在当前行后面添加，否则id会重复
                    arcType: '',
                    instanceName: '',
                    dbType: '',
                    clusterId: '',
                    operationMachineName: '',
                    timePoint: '',
                  },
                  {
                    position: 'after',
                    rowKey: record?.id,
                  },
                );
              }}
              style={{ fontSize: 18, color: 'var(--primary-color})' }}
            >
              <Icon type="cdd_xinzeng" />
            </Button>
            {index > 0 && record?.['__CUSTOM__'] && (
              <Button
                type="link"
                onClick={() => {
                  options?.actions?.deleteRow(record?.id);
                }}
                style={{ fontSize: 18, color: 'var(--error-color)' }}
              >
                <Icon type="cdd_shanchu" />
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <BasicTable<FormDataRecordProps>
        hiddenHead
        isLocal
        columns={columns}
        rowKey="id"
        defaultDataSource={defaultDataSource}
        tableRef={tableRef}
        editable={{
          form,
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            form.validateFields().then((data) => {
              console.log('>>>表单数据:', data);
            });
          }}
        >
          提交
        </Button>
      </div>
    </>
  );
};

export default EditTable;
