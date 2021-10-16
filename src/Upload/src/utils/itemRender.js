function itemRender(props, file, files) {
  const { itemRender, onCancel, onStop, onUpload, onPreview } = props
  if (!itemRender) return false;
  return function (
    node,
    progress
  ) {
    return itemRender(
      node,
      file,
      files,
      {
        preview: onPreview.bind(this, file),
        cancel: onCancel.bind(this, file),
        stop: onStop.bind(this, file),
        upload: onUpload.bind(this, file),
      },
      progress,
    );
  };
}

export default itemRender;
