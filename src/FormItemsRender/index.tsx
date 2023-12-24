import { Col, Form, Input, Select } from 'antd';
import { DatePickerProps } from 'antd/es/date-picker';
import { FormInstance, FormItemProps } from 'antd/es/form';
import { ColProps } from 'antd/es/grid/col';
import { InputProps } from 'antd/es/input';
import { RadioProps } from 'antd/es/radio';
import { SelectProps } from 'antd/es/select';
import React, { FC, Fragment } from 'react';

export type FieldProps = {
  /** 查询展示类型 */
  type?:
    | 'Input'
    | 'Select'
    | 'DatePicker'
    | 'Radio'
    | 'TimePicker'
    | 'DateRangePicker';

  /** Col属性 */
  colProps?: ColProps;

  /** Form.Item 属性配置 */
  formItemProps?: FormItemProps & { noLabel?: boolean };

  /** 内嵌Form.Item */
  childrenFormItem?: FieldProps;

  /** 组件属性 */
  componentProps?: (
    | Omit<InputProps, 'onChange'>
    | Omit<SelectProps<any>, 'onChange'>
    | Omit<DatePickerProps, 'onChange'>
    | Omit<RadioProps, 'onChange'>
  ) & {
    format?: string;
    options?: any;
    optionsMapping?: { text: string; value: string };
    onChange: (val: any, form: FormInstance) => any;
  };

  sort?: number;
};

export type FormItemsRenderProps = {
  fields: FieldProps[];
  form: FormInstance;
  isGrid?: boolean;
  colSpan?: number;
};

const getNameString = (item) =>
  item?.formItemProps?.label && typeof item?.formItemProps?.label === 'string'
    ? item.formItemProps.label
    : '';

export const collection = {
  Input({ onChange, ...rest }, form, item) {
    return <Input placeholder={`请输入${getNameString(item)}`} />;
  },
  Select(
    { options, optionsMapping, disabled, action, rowKey, onChange, ...rest },
    form,
    item,
  ) {
    return (
      <Select
        placeholder={`请选择${getNameString(item)}`}
        onChange={(val) => {
          typeof onChange === 'function' && onChange(val, form, rowKey);
        }}
        {...rest}
      >
        {(options || []).map((v, i) => (
          <Select.Option key={i} value={v?.value || v[optionsMapping?.value]}>
            {v?.text || v[optionsMapping?.text]}
          </Select.Option>
        ))}
      </Select>
    );
  },
};

const FormItemsRender: FC<FormItemsRenderProps> = ({
  fields,
  form,
  isGrid = true,
  colSpan,
}) => {
  return (
    <>
      {fields.map(
        (
          { type, formItemProps, childrenFormItem, colProps, componentProps },
          index,
        ) => {
          const itemProps = { ...(formItemProps || {}) };
          if (formItemProps?.noLabel) {
            itemProps.label = undefined;
            delete itemProps.noLabel;
          }

          const item = (
            <Form.Item {...itemProps}>
              {
                /** 嵌套Form.Item 没有Col */
                childrenFormItem ? (
                  <Form.Item {...(childrenFormItem?.formItemProps || {})}>
                    {collection[childrenFormItem?.type] &&
                      collection[childrenFormItem?.type](
                        {
                          ...(childrenFormItem?.componentProps || {}),
                        },
                        form,
                        childrenFormItem,
                      )}
                  </Form.Item>
                ) : (
                  collection[type] &&
                  collection[type](
                    { ...(componentProps || {}) },
                    form,
                    fields[index],
                  )
                )
              }
            </Form.Item>
          );
          return (
            <Fragment key={index}>
              {isGrid ? (
                <Col
                  {...(colProps
                    ? { ...colProps, ...(colSpan ? { span: colSpan } : {}) }
                    : {})}
                >
                  {item}
                </Col>
              ) : (
                item
              )}
            </Fragment>
          );
        },
      )}
    </>
  );
};

export default FormItemsRender;
