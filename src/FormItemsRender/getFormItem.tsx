import { DatePicker, Input, InputNumber, Radio, Select } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { DatePickerProps } from 'antd/lib/date-picker';
import { FormInstance } from 'antd/lib/form';
import { InputProps } from 'antd/lib/input';
import { RadioProps } from 'antd/lib/radio';
import { SelectProps } from 'antd/lib/select';
import isPlainObject from 'lodash/isPlainObject';
import React, { ReactNode } from 'react';
import { EditableProps } from '../commonTables/hooks/useEditable';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export type ActionsType<T> = {
  addEditRow: (
    data: T & AnyObject,
    option?: {
      position?: 'after' | 'before' | 'last'; // 新增一行的位置, 默认为last，添加在最后一行
      rowKey?: string;
    },
  ) => void;

  deleteRow: (rowKey: string) => void;
};

export type FnProps<T> = (prop: {
  rowKey: string;
  text: any;
  model: AnyObject;
  record: AnyObject;
  setModel: (draft: AnyObject) => any;
}) => T;

export type ParamsConfigProps<T> = {
  /** 支持类型 */
  type:
    | 'Input'
    | 'Radio'
    | 'Select'
    | 'DatePicker'
    | 'DateRangePicker'
    | 'DateTimeRangePicker'
    | 'TextArea'
    | 'InputNumber'
    | 'text';

  /** 列表编辑行用到 */
  rowKey?: string;

  /** 列单元格显示文本 */
  text?: any;

  /** form.item label */
  label?: ReactNode;

  /** form.item name */
  name: FormItemProps['name'];

  /** table 编辑类型 */
  editableUtils?: EditableProps<T>;

  record?: T;

  /** 绑定Content对象 */
  model?: AnyObject;

  /** 组件属性扩展 */
  componentProps: Omit<
    InputProps | RadioProps | SelectProps<any> | DatePickerProps,
    'onChange' | 'disabled' | 'loading'
  > & {
    disabled?: boolean | FnProps<boolean>;
    options?: any[] | FnProps<any[]>;
    loading?: boolean | FnProps<boolean>;
    notFoundContent?: ReactNode | FnProps<ReactNode>;
    optionsMapping?: { text: string; value: string };
    onChange?: (
      val: any,
      option: {
        form: FormInstance;
        rowKey: string;
        actions: ActionsType<T>;
        model: AnyObject;
        setModel: (draft: AnyObject) => any;
        extra: AnyObject;
        record: AnyObject;
      } & AnyObject,
    ) => void;
  } & { [k: string]: any };
};

const SUPPORT_FN_PROPS = ['options', 'disabled', 'loading', 'notFoundContent'];
const EXTRA_FN_PROPS = ['onFocus', 'onBlur', 'onChange', 'onSearch'];

export default <T,>(
  {
    type,
    rowKey,
    componentProps,
    label,
    editableUtils,
    text,
    model,
    record,
  }: ParamsConfigProps<T>,
  form: FormInstance,
): ReactNode => {
  const { dispatch, ...modelState } = model || {};
  const title = typeof label === 'string' ? label : '';

  /**
   * 转换支持函数返回值决定的属性
   * @returns
   */
  const convertProps = () => {
    const common = {};
    Object.keys(componentProps).forEach((key) => {
      if (
        SUPPORT_FN_PROPS.includes(key) &&
        typeof componentProps[key] === 'function'
      ) {
        common[key] = componentProps[key]({
          text,
          rowKey,
          model: modelState,
          setModel: dispatch,
          record,
        });
      } else if (
        EXTRA_FN_PROPS.includes(key) &&
        typeof componentProps[key] === 'function'
      ) {
        common[key] = (ev, option, ...args) =>
          componentProps[key](ev, {
            extra: {
              ...(isPlainObject(option) ? option : { option }),
              ...args,
            },
            record,
            form,
            rowKey,
            model,
            actions: editableUtils?.actions,
            setModel: dispatch,
          });
      } else {
        common[key] = componentProps[key];
      }
    });
    return common;
  };

  const commonProps: AnyObject = {
    ...convertProps(),
  };

  if (type === 'Input') {
    return <Input placeholder={`请输入${title}`} {...commonProps} />;
  }

  if (type === 'Select') {
    const common = { ...commonProps };
    delete common.options;

    return (
      <Select placeholder={`请选择${title}`} {...common}>
        {(commonProps?.options || []).map((v, i) => {
          return (
            <Select.Option
              key={i}
              value={v?.[componentProps?.optionsMapping?.value] || v?.value}
              data-item={v}
            >
              {v?.[componentProps?.optionsMapping?.text] || v?.text || v?.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }

  if (type === 'DateRangePicker') {
    return <RangePicker {...commonProps} />;
  }

  if (type === 'DatePicker') {
    return <DatePicker {...commonProps} />;
  }

  if (type === 'TextArea') {
    return <TextArea {...commonProps} />;
  }

  if (type === 'Radio') {
    const common = { ...commonProps };
    delete common.options;
    return (
      <Radio.Group {...common}>
        {(commonProps?.options || []).map((v, i) => {
          return (
            <Radio
              key={i}
              value={v?.[componentProps?.optionsMapping?.value] || v?.value}
            >
              {v?.[componentProps?.optionsMapping?.text] || v?.text || v?.label}
            </Radio>
          );
        })}
      </Radio.Group>
    );
  }

  if (type === 'InputNumber') {
    return <InputNumber {...commonProps} />;
  }

  return null;
};

export const isValidFormItem = (type: string): boolean =>
  [
    'Input',
    'Select',
    'Radio',
    'DatePicker',
    'TextArea',
    'InputNumber',
  ].includes(type);
