import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const HeaderCell = ({
  title,
  tips,
  editable,
  rowSpan,
  colSpan,
  style,
  className,
}) => {
  return (
    <th
      style={{
        ...(style || {}),
        ...(editable?.formItemProps?.hidden ? { display: 'none' } : {}),
      }}
      className={className}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <span className={`${editable?.required ? 'require-mark' : ''}`}>
        {title}
      </span>
      <>
        {tips && (
          <Tooltip placement="top" title={tips}>
            <InfoCircleOutlined className="tips-icon" />
          </Tooltip>
        )}
      </>
    </th>
  );
};

export default HeaderCell;
