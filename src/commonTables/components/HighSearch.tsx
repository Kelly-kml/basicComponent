/*
 * @Description: 高级搜索
 * @author: kelly
 * @Date: 2023-12-11 15:40:43
 * @LastEditTime: 2023-12-14 17:30:46
 */
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import { FormProps } from 'antd/es/form';
import classNames from 'classnames';
import { FormItemsRender } from 'KellyCOM';
import React, { FC, useMemo } from 'react';
import { HighSearchConfig, SearchConfigProps } from '../types';

export interface HighSearchProps extends FormProps {
  show: boolean;
  fieldItems: SearchConfigProps[];
  config: HighSearchConfig;
  onSearch: (...args: any[]) => any;
}

const HighSearch: FC<HighSearchProps> = ({
  show,
  form,
  onValuesChange,
  fieldItems,
  config,
  onSearch,
}) => {
  const formConfig = useMemo(() => {
    let result: HighSearchConfig = {
      colSpan: 6,
      showLabel: false,
    };
    if (config && typeof config !== 'boolean') {
      result = { ...result, ...config };
    }
    return result;
  }, [config]);

  return (
    <div
      className={classNames('basic-table-high-search', {
        show,
      })}
    >
      <Form
        form={form}
        onValuesChange={(...args) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          typeof onValuesChange === 'function' && onValuesChange(...args);
        }}
      >
        <Row gutter={20}>
          <FormItemsRender form={form} fields={fieldItems} />
        </Row>
        <Row>
          <Col span={24} className="handle-box">
            <Button
              type="primary"
              onClick={() => {
                const data = form.getFieldsValue();
                onSearch({ dto: data });
              }}
            >
              搜索
              <SearchOutlined />
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                const data = form.getFieldsValue();
                console.log(data);
                onSearch({ dto: data });
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default HighSearch;
