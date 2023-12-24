import basicHttp from '../../utils/basicHttp/index';

const Http = basicHttp();

type TableParams = {
  current?: number;
  size?: number;
  dto?: {
    searchKey?: string;
    [k: string]: any;
  };
  [k: string]: any;
};

export interface MysqlArchitectureInfo {
  id: string;
  clusterId: string;
  instanceconfigId: string;
  memberRole: string;
  podClusterName?: any;
  podNamespace: string;
  podLabels: string;
  podName: string;
  podNodeName: string;
  createTime: string;
  updateTime: string;
}

export interface ListRecordProps {
  createdTime: string;
  updatedTime: string;
  createdBy?: any;
  updatedBy?: any;
  id: string;
  nsName: string;
  namespace: string;
  operationStatus: number;
  namespaceId: string;
  type: string;
  projectName?: any;
  systemName?: any;
  dbVersion: string;
  vip: string;
  status: string;
  name: string;
  clusterId: string;
  clusterName?: any;
  arcType: string;
  grafanaUrl: string;
  zabbixUrl: string;
  cuid: string;
  podNum: number;
  pods?: any;
  mysqlArchitectureInfos: MysqlArchitectureInfo[];
  runTime?: any;
  applicationType?: any;
  disk?: any;
  characterset?: any;
  spec?: any;
  backuppolicy?: any;
  logSize?: any;
  logDiskName?: any;
  logDiskSize: string;
  dataDiskName?: any;
  dataDiskSize: string;
  requestCpu: string;
  limitCpu: string;
  requestMemory: string;
  maxConnections?: any;
  port: number;
  podName?: any;
  performance: string;
  cores: number;
  memory: number;
  yaml: string;
}

export const getList = (data: TableParams): HttpTableRes<ListRecordProps> =>
  Http.post('/page', data);
export interface ClusterProps {
  id: string;
  name: string;
  description: string;
  code: string;
  serverAddress: string;
  status: string;
  caCertData: string;
  userToken: string;
  createdTime: string;
  gitVersion?: any;
  freeCpu?: any;
  allocatableCpu?: any;
  allocatableCpuRate?: any;
  freeMemory?: any;
  allocatableMemory?: any;
  allocatableMemoryRate?: any;
  freeDisk?: any;
  allocatableDiskRate?: any;
  allocatableDisk?: any;
  freeIp?: any;
  allocatableIp?: any;
  allocatableIpRate?: any;
  masterAddress: string;
  operationMachine: string;
}

/**
 * 获取集群
 * @returns
 */
export const getClusters = (): HttpRes<ClusterProps[]> =>
  Http.get('/cluster/all');

export interface NamespaceProps {
  id: string;
  name: string;
  zhName: string;
  description?: any;
  clusterId: string;
  clusterName: string;
  createdTime: string;
  podNum?: any;
  quota?: any;
  variable?: any;
  status: number;
}

/**
 * 获取命名空间
 * @param id String
 * @returns
 */
export const getNamespace = (id: string): HttpRes<NamespaceProps[]> =>
  Http.get('/namespace/all_by_clusterId?id=' + id);

export type ContainerOptionProps = {
  applicationType: string;
  arcType: string;
  backuppolicy: string;
  characterset: string;
  clusterId: string;
  clusterName: string;
  createdBy: string;
  createdTime: string;
  cuid: string;
  dataDiskName: string;
  instance_name?: string;
  dbVersion: string;
  disk: string;
  grafanaUrl: string;
  id: string;
  logDiskName: string;
  logSize: number;
  name: string;
  namespace: string;
  namespaceId: string;
  nsName: string;
  podNum: number;
  pods: string;
  projectName: string;
  runTime: string;
  spec: string;
  status: string;
  systemName: string;
  type: string;
  updatedBy: string;
  updatedTime: string;
  vip: string;
};

export const getContainerOptions = (
  name: string,
): HttpRes<ContainerOptionProps[]> =>
  Http.get('/instanceconfig/all/name?name=' + name);

export const getRhcsList = (name: string): HttpRes<ContainerOptionProps[]> =>
  Http.get('/instanceconfig/rhcsList?name=' + name);
