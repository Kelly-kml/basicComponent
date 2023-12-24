/*
 * @Description:
 * @author: kelly
 * @Date: 2023-12-18 14:43:53
 * @LastEditTime: 2023-12-18 14:44:16
 */
import React, { FC } from 'react';
import img404 from './404.png';
import './styles.less';

// 可添加维护新的类型
type code = 404 | 401 | 500;

interface ErrorPageProps {
  type: code;
  // 额外的内容正常为空，传值：按钮之类的，不建议设置很多内容
  extra?: React.ReactNode | (() => React.ReactNode);
}

interface ErrorProps {
  code: code;
  img: string;
  description?: string;
}

const ERROR_MAP: ErrorProps[] = [
  {
    code: 404,
    img: img404,
    description: '抱歉，您访问的页面不存在。',
  },
];

const ErrorPage: FC<ErrorPageProps> = ({ type, extra = null }) => {
  const find = ERROR_MAP.find((v) => v.code === type);

  const hasExtra = !!extra;

  return (
    find && (
      <div className="basic-component-error-wrap">
        <div className="error-content">
          <img src={find.img} alt={type + '错误图片'} className="error-img" />

          <p className="error-description">{find.description}</p>

          {/* error-extra的样式可能要根据传进来的内容进行相应的调整 */}
          <div className="error-extra">
            {hasExtra && (typeof extra === 'function' ? extra() : extra)}
          </div>
        </div>
      </div>
    )
  );
};
export default ErrorPage;
