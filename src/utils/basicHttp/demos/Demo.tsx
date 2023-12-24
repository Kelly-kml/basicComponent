/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-14 15:06:43
 * @LastEditTime: 2023-12-14 15:11:58
 */
import { useRequest } from 'ahooks';
import React from 'react';
import basicHttp from '../index';

const Http = basicHttp({
  axiosCreateConfig: {
    baseURL: '',
  },
});

const getList = () => Http.get('/mock/list');

const Demo = () => {
  const { data } = useRequest(getList);

  return <div>ds</div>;
};

export default Demo;
