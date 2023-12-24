import { Typography } from 'antd';
import classNames from 'classnames';
import { isEmpty, sortBy } from 'lodash';
import React from 'react';
import Icon from '../../Icon/index';
import EditCell from '../components/EditCell';

function useColumns<T>({
  columns,
  editable,
  rowKey,
  highSearch,
  form,
  editableUtils,
}) {
  const mergeColumns = (data = []) =>
    data
      .map((item, index) => {
        return (
          !item?.hideInTable && {
            ...item,
            onHeaderCell: (args) => args as any,
            onCell: (args) => ({ ...args, column: item }),
            // 嵌套
            ...(Array.isArray(item?.children) && item?.children?.length
              ? { children: mergeColumns(item?.children) }
              : {}),
            // 枚举并且可筛选
            ...(item?.valueEnum && item?.filterable && !item?.filters
              ? {
                  filters: Object.keys(item?.valueEnum).map((key) => ({
                    text: item?.valueEnum[key]?.text,
                    value: item?.valueEnum[key]?.filterProp || key,
                  })),
                }
              : {}),
            // 筛选图标
            filterIcon: (filtered) => (
              <Icon
                type={
                  filtered ? 'cdd_shaixuanxuanzhong' : 'cdd_shaixuanchanggui'
                }
              />
            ),
            render(text, record, ind) {
              // 自定义渲染
              if (item?.render) {
                return item?.render(text, record, ind, {
                  form: editable?.form,
                  rowKey: record[rowKey],
                  actions: editableUtils?.actions,
                });
              }

              // 编辑表单
              if (
                (item?.editable &&
                  !(
                    item?.editable?.isEditOnlyCustomRow !== false &&
                    !record?.['__CUSTOM__']
                  )) ||
                item.editable?.forceEdit
              ) {
                return (
                  <EditCell
                    form={form}
                    text={text}
                    record={record}
                    index={ind}
                    rowKey={rowKey}
                    editable={item?.editable}
                    column={data[index]}
                    editableUtils={editableUtils}
                  />
                );
              }

              // 可复制、文本溢出
              if (item?.copyable || item?.ellipsis) {
                return (
                  <Typography.Text
                    style={{
                      maxWidth: '100%',
                      margin: 0,
                      padding: 0,
                    }}
                    title=""
                    copyable={
                      item?.copyable && text
                        ? {
                            text,
                            tooltips: ['', ''],
                          }
                        : undefined
                    }
                    ellipsis={
                      item?.ellipsis && text ? { tooltip: text } : false
                    }
                  >
                    {text}
                  </Typography.Text>
                );
              }

              // 枚举类型渲染
              if (item?.renderStatus || item?.valueEnum) {
                let obj = item?.valueEnum?.[text];

                // 匹配不上使用默认渲染
                if (isEmpty(obj) && item?.valueEnum?.['__DEFAULT__']) {
                  obj = item?.valueEnum?.['__DEFAULT__'];
                }

                let txt =
                  (typeof obj?.text === 'function'
                    ? obj.text(text)
                    : obj?.text) || text;

                let status = obj?.status || 'default';

                /* if (isEmpty(txt) && obj?.['NULL']) {
                  txt =
                    (typeof obj?.['NULL']?.text === 'function'
                      ? obj['NULL'].text(text)
                      : obj['NULL'].text) || '-';
                  status = obj?.['NULL']?.status || 'default';
                } */

                const styles = obj?.color ? { color: obj.color } : {};
                const dotStyles = obj?.color ? { background: obj.color } : {};

                return (
                  <div
                    className={classNames('basic-table-cell-status', status, {
                      tag: item?.renderStatus === 'tag',
                    })}
                    style={styles}
                  >
                    {item?.renderStatus === 'dotText' ? (
                      <>
                        <span className="dot" style={dotStyles} />
                        <span>{txt}</span>
                      </>
                    ) : (
                      txt
                    )}
                  </div>
                );
              }

              return text || '-';
            },
          }
        );
      })
      .filter(Boolean);

  const getSearchFormItems = () => {
    const headSearchFormItems = [];
    const highSearchFormItems = [];
    const colModelState = {}; // 抽取没列需要绑定的数据

    const loop = (items = []) =>
      items.forEach((item) => {
        // 抽取需要绑定的数据
        if (item?.search?.modelState || item?.editable?.modelState) {
          let key = item?.dataIndex;
          let model = {};
          if (item?.search?.modelState) {
            key = item?.search?.formItemProps?.name || key;
            model = item?.search?.modelState;
          } else {
            key = item?.editable?.formItemProps?.name || key;
            model = item?.editable?.modelState;
          }
          colModelState[key] = model;
        }

        // 头部搜索、高级搜索表单项
        if (item?.search) {
          const searchItem = {
            ...item.search,
            formItemProps: {
              ...(item.search?.formItemProps || {}),
            },
          };

          // name
          if (
            !searchItem?.childrenFormItem &&
            !searchItem?.formItemProps?.name &&
            item.dataIndex
          ) {
            searchItem.formItemProps.name = item.dataIndex;
          }

          // label
          if (
            !searchItem?.childrenFormItem &&
            !searchItem?.formItemProps?.label &&
            item.title
          ) {
            searchItem.formItemProps.label = item.title;
          }

          // col
          if (!searchItem?.colProps || !searchItem?.colProps?.span) {
            searchItem.colProps = {
              ...(searchItem?.colProps || {}),
              span:
                typeof highSearch !== 'boolean'
                  ? highSearch?.colSpan || 12
                  : 12,
            };
          }

          if (item.search.showInHighSearch) {
            if (typeof highSearch !== 'boolean' && !highSearch.showLabel) {
              searchItem.formItemProps.noLabel = true;
            }
            highSearchFormItems.push(searchItem);
          }

          if (!item?.search?.hideInHead) {
            headSearchFormItems.push(searchItem);
          }
        }

        if (Array.isArray(item?.children) && item?.children?.length) {
          loop(item.children);
        }
      });

    loop(columns);

    return {
      colModelState,
      headSearchFormItems: sortBy(headSearchFormItems, (v) => v.sort),
      highSearchFormItems: sortBy(highSearchFormItems, (v) => v.sort),
    };
  };

  return {
    tableColumns: mergeColumns(columns),
    ...getSearchFormItems(),
  };
}

export default useColumns;
