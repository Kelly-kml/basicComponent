import { usePrevious } from 'ahooks';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { useCallback, useContext, useEffect } from 'react';
import { Context } from '../components/Container';

export default ({ colModelState, dataSource, rowKey }) => {
  const preDataSource = usePrevious(dataSource);
  const prevModelState = usePrevious(colModelState);

  const { dispatch, ...model } = useContext(Context);

  const generate = useCallback(() => {
    const obj = { ...model };
    if (Array.isArray(dataSource) && !isEmpty(colModelState)) {
      dataSource.forEach((item) => {
        // key 可能不存在于dataSource的item，既然定义了，肯定是需要用的
        Object.keys(colModelState).forEach((k) => {
          if (typeof obj?.[item?.[rowKey]] === 'undefined') {
            obj[item?.[rowKey]] = {};
          }
          if (typeof obj?.[item?.[rowKey]]?.[k] === 'undefined') {
            obj[item[rowKey]][k] = colModelState[k];
          }
        });
      });
      dispatch(obj);
    }
  }, [dataSource, colModelState, model, dispatch]);

  useEffect(() => {
    if (
      !isEqual(dataSource, preDataSource) ||
      !isEqual(colModelState, prevModelState)
    ) {
      generate();
    }
  }, [colModelState, dataSource]);
};
