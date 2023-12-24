import { FC, LazyExoticComponent } from 'react';
import { RouterProps } from 'react-router-dom';

export type GetMenuParams = {
  systemCode?: string;
  systemId?: string;
  appId?: string;
  applicationId?: string;
};
export type MenuDataProps = {
  createdTime: string;
  updatedTime: string;
  createdBy: string;
  updatedBy: string;
  id: string;
  parentId: string;
  name: string;
  icon: string;
  path: string;
  type: string;
  status: string;
  route: string;
  sort: number;
  routeName: string;
  component: string;
  redirect: string;
  bread: string;
  checked: boolean;
  systemId: string;
  systemCode: string;
  des: string;
  extendInfo: string;
  ipPermissionChecked: boolean;
  children: MenuDataProps[];
};

export type PermissionProps = {
  [k: string]: {
    extendInfo: string;
    icon: string;
    ipPermissionChecked: boolean;
    name: string;
    redirect: string;
    status: string;
  };
};

export type MicroMountFnParams = {
  /* 微应用加载的容器 */
  container: HTMLElement;

  /* 应用ID */
  appId: string;

  /* 门户应用路由 */
  appHistory: RouterProps['history'];

  /* 应用标识，和权限中心配置的routeName一致，和应用package.json name一致 */
  appName: string;

  /* 系统ID，门户中应用挂载到对应系统的时候用到 */
  systemId?: string;

  /** 应用和门户之间的全局共享数据 */
  globalData?: {
    childHistory: RouterProps['history'];
    [k: string]: any;
  };

  /** 设置应用和门户之间的全局数据 */
  dispatchGlobalData?: (...args: any[]) => any;
};

export type CreateBasicAppReturn = {
  mount(props: MicroMountFnParams): void;
  unmount(props: MicroMountFnParams): void;
};

interface ProviderProps {
  children: any;
  initialStates?: any;
}

export interface BasicAppProps
  extends Omit<MicroMountFnParams, 'container' | 'appHistory'> {
  /* 是否采用微应用模式加载 */
  isMicroEnv?: boolean;

  /* 门户应用history实例，用于应用之间的跳转 */
  appHistory?: RouterProps['history'];

  /* 不需要传，传了也不处理 */
  publicPath?: string;

  /* 开发环境下登录用户名 */
  username?: string;

  /* 登录密码 */
  password?: string;

  /* 租户ID */
  tenantId?: string;

  /* 动态加载页面的路径，默认 @/views下 */
  viewsPath?: string;

  /* 默认打开路由 */
  defaultRoute?: string;

  /* 挂载路径 */
  root?: HTMLElement;

  /* 包裹整个应用组件 */
  provider?: (props: ProviderProps) => JSX.Element;

  /* 门户链接应用特有标记 */
  portalStark?: string;

  /** 自定义layout */
  layouts?: FC[];

  /** 自定义路由 */
  pageRoutes?: {
    [k: string]: LazyExoticComponent<any>;
  };
}

export type User = {
  id: string;
  username: string;
  password: string;
  enabled: boolean;
  nickName: string;
  roleName: string;
  email: string;
  avatar: string;
  phone: string;
  groupId: string;
  pathName: string;
  groupName: string;
  roles: string[];
  menus: any[];
  tenantId: string;
  gender: string;
  oaId: string;
  oaXh: string;
  oaDep1: string;
  oaDep3: string;
  oaPos1: string;
  oaUpdateTime: string;
  jsDlzhDm: string;
  jsSwryDm: string;
  jsSwrysfDm: string;
  jsSwryxm: string;
  createdBy: string;
  createdTime: string;
  updatedTime: string;
  updatedBy: string;
  groupCode: string;
  parentGroupCode: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
};

export type AuthDataProps = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  user: User;
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginParamsProps = {
  username: string;
  password: string;
  tenant: string;
};

export type TenantDataProps = {
  createdTime: string;
  updatedTime: string;
  createdBy: string;
  updatedBy: string;
  del: boolean;
  id: string;
  name: string;
  code: string;
  remark: string;
  systemIds: string;
  administrators: string;
  applicationIds: string;
  userId: string;
};

export type SystemDataProp = {
  createdTime: string;
  updatedTime: string;
  createdBy: string;
  updatedBy: string;
  del: boolean;
  id: string;
  name: string;
  route: string;
  routeName: string;
  status: string;
  path: string;
  icon: string;
  sort: number;
  checked: boolean;
  ipPermissionChecked: boolean;
};

export type ApplicationDataProps = {
  createdTime: string;
  updatedTime: string;
  createdBy: string;
  updatedBy: string;
  id: string;
  name: string;
  route: string;
  routeName: string;
  status: string;
  path: string;
  icon: string;
  clientId: string;
  sort: number;
  businessType: number;
  image: string;
  imageUrl: string;
  clientSecret: string;
  scope: string;
  authorizedGrantTypes: string;
  webServerRedirectUri: string;
  authorities: string;
  accessTokenValidity: string;
  refreshTokenValidity: string;
  additionalInformation: string;
  autoapprove: string;
  applicationrouteName: string;
  checked: boolean;
  applicationId: string;
  needOauth: string;
  authorGrantTypes: string;
};
