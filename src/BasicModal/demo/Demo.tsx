import { Button } from 'antd';
import { BasicModal } from 'KellyCOM';
import React, { useState } from 'react';

const Demo = () => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        打开可拖拽弹出框
      </Button>
      <BasicModal
        width="50%"
        title="可拖拽弹出框"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <div>此弹出框头部可自由拖拽</div>
      </BasicModal>
    </div>
  );
};

export default Demo;
