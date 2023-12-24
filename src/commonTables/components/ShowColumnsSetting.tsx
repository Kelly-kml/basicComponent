/*
 * @Description: 列设置
 * @author: kelly
 * @Date: 2023-12-11 15:40:43
 * @LastEditTime: 2023-12-14 19:16:03
 */
import arrayMove from 'array-move';
import { BasicModal } from 'KellyCOM';
import React, { FC, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

export type ShowColumnsSettingProps = {
  visible: boolean;
  onClose: () => void;
};

const Container = SortableContainer(({ children }) => {
  return <ul style={{ display: 'flex', flexWrap: 'wrap' }}>{children}</ul>;
});

const SortableItem = SortableElement(({ value }) => (
  <li style={{ width: 160, height: 50, background: '#ccc', margin: 20 }}>
    {value}
  </li>
));

const ShowColumnsSetting: FC<ShowColumnsSettingProps> = ({
  visible,
  onClose,
}) => {
  const [list, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
  ]);

  return (
    <BasicModal
      width="50%"
      forceRender
      title="表格列设置"
      visible={visible}
      wrapClassName="column-setting-modal"
      onCancel={() => onClose()}
    >
      <div className="setting-box">
        <div className="show-box"></div>
        <div className="sort-box">
          <Container
            axis="xy"
            helperClass="sortableHelper"
            onSortEnd={({ oldIndex, newIndex }) => {
              setItems((state) => arrayMove(state, oldIndex, newIndex));
            }}
          >
            {list.map((value, index) => (
              <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
          </Container>
        </div>
      </div>
    </BasicModal>
  );
};

export default ShowColumnsSetting;
