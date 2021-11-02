function itemRender(props, file, files) {
  const { itemRender } = props
  const onPreview = props["on-preview"]
  const onUpload = props["on-upload"]
  const onStop = props["on-stop"]
  const onCancel = props["on-cancel"]
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
