import { SearchOutlined } from '@ant-design/icons';
import { useToggle } from 'ahooks';
import { Button, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { FormItemsRender, Icon } from 'KellyCOM';
import React from 'react';
import HighSearch from './HighSearch';
import ShowColumnsSetting from './ShowColumnsSetting';

function TableHeadSearch({
  queryParams,
  highSearch,
  isLocal,
  onSearch,
  headSearchFormItems,
  headKeywordSearch,
  headLayout,
  leftHead,
  setQueryParams,
  highSearchFormItems,
  enableColumnsSetting,
  onExport,
}) {
  const [highSearchForm] = Form.useForm();
  const [showHighSearch, { toggle }] = useToggle();
  const [headSearchForm] = Form.useForm();
  const [showColumnSetting, { toggle: setShowColumnSetting }] =
    useToggle(false);

  /**
   * 搜索关键字查询
   */
  const handleKeywordSearch = (ev) => {
    if (!isLocal) {
      const keyword =
        ev?.target?.value || headSearchForm.getFieldValue('searchKey');
      onSearch({ dto: { searchKey: keyword } });
    }
  };

  return (
    <>
      <Row className="basic-table-head">
        <Col span={headLayout[0]}>{leftHead}</Col>
        <Col span={headLayout[1]}>
          <Form
            form={headSearchForm}
            layout="inline"
            className="basic-table-head-form"
            onValuesChange={(values) => {
              setQueryParams((s) => ({
                ...s,
                dto: {
                  ...s.dto,
                  ...values,
                },
              }));
            }}
          >
            <FormItemsRender
              isGrid={false}
              form={headSearchForm}
              fields={headSearchFormItems}
            />
            {headKeywordSearch === 'all' ? (
              <Form.Item name="searchKey">
                <Input
                  allowClear
                  suffix={
                    <SearchOutlined
                      className="search-icon"
                      onClick={handleKeywordSearch}
                    />
                  }
                  disabled={showHighSearch}
                  placeholder="请输入字符查询"
                  onPressEnter={handleKeywordSearch}
                  onChange={(ev) => {
                    // 值为空时重新搜索
                    if (!ev.target.value.trim()) {
                      onSearch({ dto: { searchKey: '' } });
                    }
                  }}
                />
              </Form.Item>
            ) : (
              <Form.Item noStyle>
                <Input.Group compact>
                  <Form.Item
                    name={['search', 'searchFiled']}
                    noStyle
                    rules={[
                      { required: true, message: 'Province is required' },
                    ]}
                  >
                    <Select placeholder="请选择">
                      <Select.Option value="Zhejiang">Zhejiang</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={['search', 'searchValue']}
                    noStyle
                    rules={[{ required: true, message: 'Street is required' }]}
                  >
                    <Input
                      style={{ width: '50%' }}
                      placeholder="Input street"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            )}
            <Form.Item noStyle>
              <div className="table-head-toolbar">
                {highSearch && (
                  <Button
                    type="link"
                    className="toggle-high-search"
                    onClick={() => {
                      if (!showHighSearch && queryParams?.dto?.searchKey) {
                        headSearchForm.setFieldsValue({ searchKey: '' });
                        onSearch({ dto: { searchKey: '' } });
                      }
                      toggle();
                    }}
                  >
                    高级搜索
                    <Icon
                      type="cdd_below-line"
                      className={classNames('toggle-icon', {
                        expanded: showHighSearch,
                      })}
                    />
                  </Button>
                )}
                {enableColumnsSetting && (
                  <Tooltip title="设置显示字段">
                    <Button
                      type="link"
                      className="icon"
                      onClick={() => {
                        setShowColumnSetting(true);
                      }}
                    >
                      <Icon type="cdd_ic_btn_set" />
                    </Button>
                  </Tooltip>
                )}
                {onExport && (
                  <Tooltip title="导出数据">
                    <Button type="link" className="icon">
                      <Icon type="cdd_ic_btn_download" />
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="刷新">
                  <Button
                    type="link"
                    className="icon"
                    onClick={() => onSearch()}
                  >
                    <Icon type="cdd_shuaxin" />
                  </Button>
                </Tooltip>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      {highSearch && (
        <HighSearch
          form={highSearchForm}
          config={highSearch}
          show={showHighSearch}
          fieldItems={highSearchFormItems}
          onSearch={onSearch}
          onValuesChange={(values) => {
            console.log(values);
          }}
        />
      )}

      {enableColumnsSetting && (
        <ShowColumnsSetting
          visible={showColumnSetting}
          onClose={() => {
            setShowColumnSetting(false);
          }}
        />
      )}
    </>
  );
}

export default TableHeadSearch;
