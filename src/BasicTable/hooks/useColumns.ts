function useColumns<T>({
  columns,
  editable,
  rowKey,
  highSearch,
  form,
  editableUtils
}){
  const mergeColumns = (data = []) => data.map((item, index)=> {
    return (
      !item?.hideInTable && {
        ...item,
        onHeaderCell: args => args as any,
        onCell: args => ({...args, column:item}),
        // 嵌套
        ...(Array.isArray(item?.children) && item?.children?.length)
          ? {children: mergeColumns(item?.children)}
          : {})
      }
    )
  })
}