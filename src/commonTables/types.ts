import { ColumnType, TableProps } from 'antd/es/table';
import { FormInstance } from 'antd/lib/form';
import { Key } from 'antd/lib/table/interface';
import { Dispatch, ReactNode, Ref } from 'react';
import { RouterProps } from 'react-router-dom';
import { FieldProps } from '../FormItemsRender';
import { ParamsConfigProps } from '../FormItemsRender/getFormItem';

export type ActionsType<T> = {
  addEditRow: (
    data: T & AnyObject,
    option?: {
      position?: 'after' | 'before' | 'last'; // 新增一行的位置, 默认为last，添加在最后一行
      rowKey?: string;
    },
  ) => void;

  deleteRow: (rowKey: string) => void;
};

export type TableQueryProps = {
  current?: number;
  size?: number;
  dto?: {
    searchKey?: string;
    [k: string]: any;
  };
  orders?: Array<{
    column: string;
    asc?: boolean | null;
  }>;
  [k: string]: any;
};

export type ValueEnum = {
  [k: string]: {
    text: ReactNode | ((text: any) => ReactNode);
    filterProp?: string;
    value?: any;
    status?: 'success' | 'error' | 'failed' | 'warning' | 'active';
    color?: string;
  };
};

export interface SearchConfigProps extends FieldProps {
  /** @name 查询项是否在高级搜索中使用 */
  showInHighSearch?: boolean | { sort: number };

  /** @name 查询项不显示在头部 */
  hideInHead?: boolean | { sort: number };

  /** 排序 */
  sort?: number;

  /** 基于此单元格绑定的属性 */
  modelState?: AnyObject;
}

// 列配置属性
export interface BasicTableColumnType<T> extends Omit<ColumnType<T>, 'render'> {
  /** 搜索、高级搜索  */
  search?: SearchConfigProps;

  /** 内容是否可复制  */
  copyable?: boolean;

  /** 列是否可筛选  */
  filterable?: boolean;

  /** 在配置展示列中，该列不可操作，必须存在 */
  checkedDisabledInShowConfig?: boolean;

  /** 常用状态渲染 */
  renderStatus?: 'tag' | 'text' | 'dotText';

  /** 列提示 */
  tips?: ReactNode;

  /** 值枚举对应显示 */
  valueEnum?: ValueEnum;

  /** 字段不显示在table列中，用于搜索或者高级搜索 */
  hideInTable?: boolean;

  /** 指定当前列为查询keyword */
  assignSearch?: boolean;

  /** 扩展render */
  render?: (
    text: any,
    record: T,
    index: number,
    other: {
      form: FormInstance;
      rowKey: string;
      actions: ActionsType<T>;
    },
  ) => ReactNode;

  /** 单个单元格是否可编辑 */
  editable?:
    | false
    | {
        /** 列星号 */
        required?: boolean;

        /** 基于此单元格绑定的属性 */
        modelState?: AnyObject;

        /** 编辑列表单类型 */
        type?: FieldProps['type'];

        /** 编辑状态时Form.Item配置 */
        formItemProps?: FieldProps['formItemProps'];

        /** 编辑状态时 */
        componentProps?: ParamsConfigProps<T>['componentProps'];

        /* 特有场景，是否是只有在手动添加的行中才能编辑，默认为true */
        isEditOnlyCustomRow?: boolean;

        /** 一定是编辑列 */
        forceEdit?: boolean;
      };
}

export interface BasicTableColumnGroupType<T>
  extends Omit<BasicTableColumnType<T>, 'dataIndex'> {
  children: BasicTableColumnType<T>[];
}

export type BasicTableColumnsType<T> = (
  | BasicTableColumnType<T>
  | BasicTableColumnGroupType<T>
)[];

export type BasicTableRef<T> = {
  onSearch: (params: AnyObject) => any;
  historyPush: RouterProps['history']['push'];
  dataSource: T[];
  model: AnyObject;
  updateTableData: (prop: Array<{ rowKey: string; values: AnyObject }>) => void;
  setModel: (draft: AnyObject) => any;
};

export type HighSearchConfig =
  | boolean
  | {
      /** 每项Col占比 */
      colSpan?: number;

      /** 是否展示 Form.Item 的label */
      showLabel?: boolean;
    };

// 编辑table Ref暴露
export type EditableRef = {
  getFieldsValue: () => void;
};

export interface BasicTableProps<T>
  extends Omit<TableProps<T>, 'columns' | 'rowKey'> {
  /** rowKey 改成必传 */
  rowKey: string;

  /** 扩展列配置 */
  columns: BasicTableColumnsType<T>;

  setPagination?: Dispatch<TableProps<T>['pagination']>;

  /** 请求函数 */
  request?:
    | Promise<any>
    | ((...args: any[]) => Promise<any>)
    | ((...args: any[]) => (...rest: any[]) => Promise<any>);

  /** 对外暴露方法 */
  tableRef?: Ref<BasicTableRef<T>>;

  /** 是否需要初次加载获取列表数据，在异步条件的时候设计为false，默认为true */
  immediate?: boolean;

  /** 自定义处理列表数据 */
  postData?: (response: any) => T[] | void;

  /** 列表数据改变 */
  onDataSourceChange?: (value: T[], oldValue: T[]) => void;

  /** 默认数据源 */
  defaultDataSource?: T[];

  /** 开启自动刷新功能，自动刷新时间，设置为true时默认为15秒刷新一次列表 */
  autoRefresh?:
    | boolean
    | {
        /** 开启默认可选择的刷新时间 */
        enableDefaultRefreshTime: boolean;

        /** 自定义刷新时间下拉项 */
        options?: number[];
      };

  /* 选择所有页 */
  enableAllSelection?: boolean;

  /* table 列是否可拖动伸缩，默认为false，配置为true时，column 配置宽度为number类型 */
  resizable?: boolean;

  /* table行是否允许拖拽排序，默认为false */
  isSortable?: boolean;

  /** 是否开启本地前端分页、查询、排序功能，默认为false */
  isLocal?: boolean;

  /** 是否开启选择全部页 */
  isAllSelection?: boolean;

  /** 是否隐藏列表头部，默认为false */
  hiddenHead?: boolean;

  /** 是否展示高级搜索功能 */
  hiddenHighSearch?: boolean;

  /** 列表头部左侧自定义渲染 */
  leftHead?: ReactNode;

  /** 列表头部右侧配置前自定义渲染 */
  addonRightHead?: ReactNode;

  /** 头部导航左右两侧列宽数量 */
  headLayout?: [number, number];

  /** 高级搜索配置 */
  highSearch?: HighSearchConfig;

  /** 列表头部关键字查询， all 表示可以查询列表所有字符，assign表示指定列查询，在columns里面配置 assignSearch: true */
  headKeywordSearch?: 'all' | 'assign';

  /** 请求数据格式转换，用于适用不同平台接口 */
  beforeRequestFormatParams?: (params: TableQueryProps) => AnyObject;

  /** 导出列表数据， 设置为true时，为前端实现导出 */
  onExport?: boolean | ((...args: any[]) => any);

  /** 自定义列显示, 默认为true */
  enableColumnsSetting?: boolean;

  /** 单元格空值渲染，默认渲染 - */
  emptyCellRender?: ((record, index) => ReactNode) | ReactNode;

  /** 设置loading状态 */
  setLoading?: Dispatch<boolean>;

  /** 编辑 */
  editable?: {
    form: FormInstance;

    /** 编辑模式，单行编辑、多行编辑 */
    mode?: 'multiple' | 'single';

    /** 编辑值改变 */
    onValuesChange?: () => any;

    /** 处于编辑状态的行Key */
    editableRowKeys?: Key[];

    /** 编辑table对外暴露方法  */
    editableRef?: Ref<EditableRef>;

    onChange?: (newRowKeys: Key[], oldRowKeys: Key[]) => void;

    /** TODO: 从外面选中的数据,从外面选中设置不可编辑 */
    checkedRowsData?: T[];
  };
}
