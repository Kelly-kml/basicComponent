/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-11 15:10:52
 * @LastEditTime: 2023-12-11 15:15:43
 */
import { Spin } from 'antd';
import { SpinProps } from 'antd/es/spin';
import React, { FC } from 'react';

export type LoadingProps = SpinProps;

const Loading: FC<LoadingProps> = (props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Spin size="large" tip="拼命加载中..." {...props} />
    </div>
  );
};

export default Loading;
