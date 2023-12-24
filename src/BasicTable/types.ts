import { FormInstance } from 'antd';
import { DatePickerProps } from 'antd/es/date-picker';
import { FormItemProps } from 'antd/es/form';
import { ColProps } from 'antd/es/grid/col';
import { InputProps } from 'antd/es/input';
import { RadioProps } from 'antd/es/radio';
import { SelectProps } from 'antd/es/select';
import { TableProps } from 'antd/es/table';
import { ColumnType, Key } from 'antd/es/table/interface';
import { AnyObject } from 'antd/es/_util/type';
import { Dispatch, ReactNode, Ref } from 'react';
// import { RouterProps } from 'react-router-dom';

export type FieldProps = {
  /** 查询展示类型 */
  type?:
    | 'Input'
    | 'Select'
    | 'DatePicker'
    | 'Radio'
    | 'TimePicker'
    | 'DateRangePicker';

  /** Col属性 */
  colProps?: ColProps;

  /** Form.Item 属性配置 */
  formItemProps?: FormItemProps & { noLabel?: boolean };

  /** 内嵌Form.Item */
  childrenFormItem?: FieldProps;

  /** 组件属性 */
  componentProps?: (
    | Omit<InputProps, 'onChange'>
    | Omit<SelectProps<any>, 'onChange'>
    | Omit<DatePickerProps, 'onChange'>
    | Omit<RadioProps, 'onChange'>
  ) & {
    format?: string;
    options?: any;
    optionsMapping?: { text: string; value: string };
    onChange: (val: any, form: FormInstance) => any;
  };

  sort?: number;
};

export type FormItemsRenderProps = {
  fields: FieldProps[];
  form: FormInstance;
  isGrid?: boolean;
  colSpan?: number;
};

export type FnProps<T> = (prop: {
  rowKey: string;
  text: any;
  model: AnyObject;
  record: AnyObject;
  setModel: (draft: AnyObject) => any;
}) => T;

export type EditableProps<T> = {
  isAllRowEditable: boolean;
  editableRowKeys: Key[];
  isEditableTable: boolean;
  actions: ActionsType<T>;
};

export type ParamsConfigProps<T> = {
  /** 支持类型 */
  type:
    | 'Input'
    | 'Radio'
    | 'Select'
    | 'DatePicker'
    | 'DateRangePicker'
    | 'DateTimeRangePicker'
    | 'TextArea'
    | 'InputNumber'
    | 'text';

  /** 列表编辑行用到 */
  rowKey?: string;

  /** 列单元格显示文本 */
  text?: any;

  /** form.item label */
  label?: ReactNode;

  /** form.item name */
  name: FormItemProps['name'];

  /** table 编辑类型 */
  editableUtils?: EditableProps<T>;

  record?: T;

  /** 绑定Content对象 */
  model?: AnyObject;

  /** 组件属性扩展 */
  componentProps: Omit<
    InputProps | RadioProps | SelectProps<any> | DatePickerProps,
    'onChange' | 'disabled' | 'loading'
  > & {
    disabled?: boolean | FnProps<boolean>;
    options?: any[] | FnProps<any[]>;
    loading?: boolean | FnProps<boolean>;
    notFoundContent?: ReactNode | FnProps<ReactNode>;
    optionsMapping?: { text: string; value: string };
    onChange?: (
      val: any,
      option: {
        form: FormInstance;
        rowKey: string;
        actions: ActionsType<T>;
        model: AnyObject;
        setModel: (draft: AnyObject) => any;
        extra: AnyObject;
        record: AnyObject;
      } & AnyObject,
    ) => void;
  } & { [k: string]: any };
};

// 列表项属性
export interface BasicTableColumnType<T> extends Omit<ColumnType<T>, 'render'> {
  /**搜索、高级搜索 */
  search?: SearchConfigProps;

  /**内容是否可以复制 */
  copyable?: boolean;

  /**列是否可以筛选 */
  filterable?: boolean;

  /**在配置展示列中，该列不可操作，必须存在 */
  checkedDisabledInShowConfig?: boolean;

  /** 常用渲染状态 */
  renderStatus?: boolean;

  /**值枚举对应显示 */
  valueEnum?: ValueEnum;

  /** 字段不显示在table列中，用于搜索或者高级搜索 */
  hideInTable?: boolean;

  /** 指定当前列为查询keyword */
  assignSearch?: boolean;

  /** 列提示 */
  tips?: ReactNode;

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

  /** 单个单元格是否可以编辑 */
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

        /** 一定是编辑列 */
        forceEdit?: boolean;
      };
}

export interface SearchConfigProps extends FieldProps {
  /** 咨询项是否在高级搜索中使用 */
  showInHighSearch: boolean | { sort: number };

  /** 查询项不显示在头部 */
  hideInHead?: boolean | { sort: number };

  /** 排序 */
  sort?: number;

  /** 基于此单元格绑定的属性 */
  modelState?: AnyObject;
}

export type ActionsType<T> = {
  addEditRow: (
    data: T & AnyObject,
    options?: {
      position?: 'after' | 'before' | 'last';
      rowKey?: string;
    },
  ) => void;
};

export type TableQueryProps = {
  current?: number;
  size?: number;
  dto?: {
    searchKey?: string;
    [k: string]: any;
  };
  order?: Array<{
    column: string;
    /** 排序（升序true | 降序false | 不排序null */
    asc?: boolean | null;
  }>;
  [k: string]: any;
};

export type ValueEnum = {
  [k: string]: {
    text: ReactNode | ((text: any) => ReactNode);
    filterProps?: string;
    value?: any;
    status?: 'success' | 'error' | 'failed' | 'warning' | 'danger' | ' active';
    color?: string;
  };
};

export interface BasicTableColumnGroupType<T>
  extends Omit<BasicTableColumnType<T>, 'dataIndex'> {
  children: BasicTableColumnType<T>[];
}

export type BasicTableColumnsType<T> = (
  | BasicTableColumnType<T>
  | BasicTableColumnGroupType<T>
)[];

export type HighSearchConfig =
  | boolean
  | {
      /** 每项col占比 */
      colSpan?: number;

      /** 是否展示 Form.Item 的label */
      showLabel?: boolean;
    };

export type EditableRef = {
  getFieldsValue: () => void;
};

// table的props
export interface BasicTableProps<T>
  extends Omit<TableProps<T>, 'columns' | 'rowKey'> {
  /**rowKey 必传 */
  rowKey: string;

  /**扩展配置项 */
  columns: BasicTableColumnsType<T>;

  setPagination?: Dispatch<TableProps<T>['pagination']>;

  /** 请求函数 */
  request?:
    | Promise<any>
    | ((...args: any[]) => Promise<any>)
    | ((...args: any[]) => (...rest: any[]) => Promise<any>);

  /** 对外暴露的方法 */
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
  emptyCellRender?: ((record: any, index: any) => ReactNode) | ReactNode;

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

export type basicTableRef<T> = {
  onSearch: (params: AnyObject) => any;
  // historyPush: RouterProps['history']['push'];
  historyPush: any;
  dataSource: T[];
  model: AnyObject;
  updateTableData: (props: Array<{ rowKey: string; value: AnyObject }>) => void;
  setModel: (draft: AnyObject) => any;
};
