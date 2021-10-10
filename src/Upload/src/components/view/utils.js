
export const actionIconPerformance = (
  showUploadList,
  value,
) => {
  let previewShow = true;
  let previewIconNode = null;
  let uploadShow = true;
  let uploadIconNode = null;
  let deleteShow = true;
  let deleteIconNode = null;
  let stopIconNode = null;
  if (typeof showUploadList === 'object') {
    const {
      showPreviewIcon,
      showRemoveIcon,
      showUploadIcon,
      previewIcon,
      removeIcon,
      uploadIcon,
      stopIcon,
    } = showUploadList;
    previewShow = !!showPreviewIcon || !!previewIcon;
    previewIconNode =
      !!previewShow &&
      (typeof previewIcon === 'function' ? previewIcon(value) : previewIcon);
    uploadShow = !!showUploadIcon || !!uploadIcon;
    uploadIconNode =
      !!uploadShow &&
      (typeof uploadIcon === 'function' ? uploadIcon(value) : uploadIcon);
    stopIconNode =
      !!uploadShow &&
      (typeof stopIcon === 'function' ? stopIcon(value) : stopIcon);
    deleteShow = !!showRemoveIcon || !!removeIcon;
    deleteIconNode =
      !!deleteShow &&
      (typeof removeIcon === 'function' ? removeIcon(value) : removeIcon);
  }
  return {
    previewShow,
    previewIconNode,
    uploadShow,
    uploadIconNode,
    deleteShow,
    deleteIconNode,
    stopIconNode,
  };
};