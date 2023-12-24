import { Dispatch, Key, useContext, useMemo } from 'react';
import { Context } from '../components/Container';
import { ActionsType, BasicTableProps } from '../types';
import findItemAndIndex from '../utils/findItemAndIndex';
import useMergeState from './useMergeState';

export type EditableProps<T> = {
  isAllRowEditable: boolean;
  editableRowKeys: Key[];
  isEditableTable: boolean;
  actions: ActionsType<T>;
};

type OptionsProps<T> = {
  dataSource: T[];
  setDataSource: Dispatch<T[] | ((state: T[]) => T[])>;
  rowKeyStr: string;
};

export default <T,>(
  props: BasicTableProps<T>,
  { dataSource, setDataSource, rowKeyStr }: OptionsProps<T>,
): EditableProps<T> => {
  const { dispatch } = useContext(Context);

  const [editableRowKeys, setEditableRowKeys] = useMergeState([], {
    value: props?.editable?.editableRowKeys,
    onChange: props?.editable?.onChange,
  });

  // 是否是所有行多能编辑
  const isAllRowEditable = useMemo<boolean>(
    () => props?.editable?.mode === undefined,
    [props?.editable?.mode],
  );

  // 是否是可编辑table
  const isEditableTable = useMemo<boolean>(
    () => !!props?.editable,
    [props?.editable],
  );

  // 编辑相关操作
  const actions: ActionsType<T> = {
    /**
     * 新增一行编辑数据，手动添加的行数据默认带 {__CUSTOM__: true} 属性标记
     * @param data
     * @param option
     * @returns
     */
    addEditRow(data, option) {
      const appendData = { ...data, __CUSTOM__: true };
      if (!option || option?.position === 'last') {
        setDataSource((s) => [...s, appendData]);
        return;
      }

      if (
        option?.rowKey &&
        (option?.position === 'after' || option?.position === 'before')
      ) {
        const index = dataSource.findIndex(
          (v) => v[rowKeyStr] === option?.rowKey,
        );
        if (index !== -1) {
          const temp = [...dataSource];
          temp.splice(
            option?.position === 'before' ? index : index + 1,
            0,
            appendData,
          );
          setDataSource(temp);
        } else {
          console.warn(`rowKey: ${option?.rowKey} 不存在`);
        }
        return;
      }
    },

    /**
     * 删除编辑行
     * @param rowKey
     * @returns
     */
    deleteRow(rowKey) {
      const { item, index } = findItemAndIndex(
        dataSource,
        (v) => v[rowKeyStr] === rowKey,
      );
      if (index !== -1) {
        // 删除行数据
        const temp = [...dataSource];
        temp.splice(index, 1);
        setDataSource(temp);

        // 删除对应行绑定数据
        dispatch((draft) => {
          if (typeof draft?.[item?.[rowKeyStr]] !== 'undefined') {
            return void delete draft?.[item?.[rowKeyStr]];
          }
        });

        return;
      }
      console.warn(`rowKey: ${rowKey} 不存在数据中`);
    },
  };

  return {
    isAllRowEditable,
    editableRowKeys,
    isEditableTable,
    actions,
  };
};
