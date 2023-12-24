/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-14 10:24:57
 * @LastEditTime: 2023-12-18 12:35:43
 */
import { TableRowSelection } from 'antd/es/table/interface';
import { Dispatch, Key, useState } from 'react';

interface UsetableRowSelectionProps<T> {
  enableAllSelection: boolean;
  selectedRows: T[];
  rowSelection: TableRowSelection<T>;
  setSelected: Dispatch<{ selectedRowKeys: Key[]; selectedRows: T[] }>;
}

export type ConfigProps<T> = TableRowSelection<T> & {
  enableAllSelection?: boolean;
};

export default <T>(config?: ConfigProps<T>): UsetableRowSelectionProps<T> => {
  const [{ selectedRowKeys, selectedRows }, setSelected] = useState<{
    selectedRowKeys: Key[];
    selectedRows: T[];
  }>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  return {
    enableAllSelection: !!config?.enableAllSelection,
    selectedRows,
    setSelected,
    rowSelection: {
      selectedRowKeys,
      onChange(keys, rows) {
        setSelected({
          selectedRowKeys: keys,
          selectedRows: rows,
        });
        if (typeof config?.onChange === 'function') {
          config.onChange(keys, rows);
        }
      },
    },
  };
};
