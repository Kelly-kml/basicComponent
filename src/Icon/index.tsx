import { createFromIconfontCN } from '@ant-design/icons';
import { IconFontProps } from '@ant-design/icons/es/components/IconFont';
import React, { FC, useContext, useMemo } from 'react';
import { Context } from '../../src/utils/globalState';

const isDev = process.env.NODE_ENV === 'development';

let IS_DOC_PROD: boolean = false;

try {
  // @ts-ignore
  IS_DOC_PROD = isDocProd === 'TRUE';
} catch (e) {
  IS_DOC_PROD = false;
}

const Icon: FC<IconFontProps> = (props) => {
  const { publicPath } = useContext(Context);

  const scriptUrl = useMemo(() => {
    const { host } = window.location;
    const hostName = isDev || IS_DOC_PROD ? '172.16.200.21' : host;
    return `//${hostName}/common-static/cdd-iconfont.js`;
  }, [publicPath]);

  const CustomIcon = useMemo(
    () =>
      createFromIconfontCN({
        scriptUrl,
      }),
    [scriptUrl],
  );

  return <CustomIcon {...props} />;
};

export default Icon;
