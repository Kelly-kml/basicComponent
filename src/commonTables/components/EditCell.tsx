/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-11 15:40:43
 * @LastEditTime: 2023-12-12 15:41:58
 */
import { Form } from 'antd';
import React, { useContext } from 'react';
import getFormItem, {
  isValidFormItem,
} from '../../FormItemsRender/getFormItem';
import { Context } from './Container';

const EditCell = ({
  editable,
  editableUtils,
  column,
  text,
  record,
  index,
  form,
  rowKey,
}) => {
  const model = useContext(Context);

  const name = [
    record[rowKey] || index,
    column?.editable?.formItemProps?.name || column?.dataIndex,
  ];

  return (
    <>
      {editable && isValidFormItem(editable?.type) ? (
        <Form.Item {...(editable?.formItemProps || {})} name={name}>
          {getFormItem(
            {
              ...editable,
              editableUtils,
              text,
              name,
              rowKey: record?.[rowKey],
              model,
              record,
              label: editable?.formItemProps?.label || column?.title,
              componentProps: {
                ...(editable?.componentProps || {}),
              },
            },
            form,
          )}
        </Form.Item>
      ) : (
        text
      )}
    </>
  );
};

export default EditCell;
