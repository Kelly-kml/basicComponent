/*
 * @Description: 高级搜索
 * @author: kelly
 * @Date: 2023-12-11 15:40:43
 * @LastEditTime: 2023-12-12 16:50:19
 */
import React from 'react';

const CellRender = ({
  className,
  style,
  rowSpan,
  column,
  colSpan,
  children,
}) => {
  return (
    <td
      className={className}
      style={{
        ...(style || {}),
        ...(column?.editable?.formItemProps?.hidden ? { display: 'none' } : {}),
      }}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </td>
  );
};

export default CellRender;
