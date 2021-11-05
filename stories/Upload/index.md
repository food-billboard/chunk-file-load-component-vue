# chunk-file-load-component-vue 
## API

- tips 部分参数与[antd](https://github.com/ant-design/ant-design)中的`Upload`组件类似

| 参数            | 说明                                                                                                                                            | 类型                                                                                                                                                                                                                                                                                                                                              | 默认值                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| defaultValue    | 默认值                                                                                                                                          | `string` \| `string[]` \| `PartialWrapperFile` \| `PartialWrapperFile[]`                                                                                                                                                                                                                                                              | -                                       |
| value           | 文件列表                                                                                                                                        | `string` \| `string[]` \| `PartialWrapperFile` \| `PartialWrapperFile[]`                                                                                                                                                                                                                                                              | -                                       |
| onChange        | 文件列表变化时的回调                                                                                                                            | `(value: WrapperFile[]) => void`                                                                                                                                                                                                                                                                                                                  | -                                       |
| onValidator     | 文件验证                                                                                                                                        | `(errorFile: File[], fulfilledFile: File[]) => void`                                                                                                                                                                                                                                                                                              | -                                       |
| onRemove        | 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除                        | `(task: WrapperFile) => (boolean | Promise)`                                                                                                                                                                                                                                                                                                     | -                                       |
| onError         | 文件上传出错时(注意，取消或暂停时也会触发此方法)                                                                                                | `(error: any, task: WrapperFile) => void`                                                                                                                                                                                                                                                                                                         | -                                       |
| viewStyle       | 自定义文件列表样式                                                                                                                              | `CSSProperties`                                                                                                                                                                                                                                                                                                                                   | -                                       |
| viewClassName   | 自定义文件列表类名                                                                                                                              | `string`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| viewType        | 上传列表的内建样式，支持两种基本样式 `list`, `card`                                                                                             | `list` \| `card`                                                                                                                                                                                                                                                                                                                              | `list`                                  |
| iconRender      | 自定义显示 icon                                                                                                                                 | `(file: WrapperFile, viewType: ViewType, originNode: VNode) => VNode`                                                                                                                                                                                                                                                                     | -                                       |
| itemRender      | 自定义上传列表项                                                                                                                                | `(originNode: VNode, file: WrapperFile, fileList: WrapperFile[], actions: { preview: Function, upload: Function, cancel: Function, stop: Function }, progress: Partial<{ complete: number, total: number, status: any, current: number }>) => VNode`                                                                                   | -                                       |
| showUploadList  | 是否展示文件列表, 可设为一个对象，用于单独设定 `showPreviewIcon`, `showRemoveIcon`, `showUploadIcon`, `removeIcon`, `previewIcon`, `uploadIcon` | `boolean | { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showUploadIcon?: boolean, removeIcon?: string | (file: UploadFile) => string | previewIcon?: string | (file: UploadFile) => string | uploadIcon?: string | (file: UploadFile) => string | uploadIcon?: string | (file: UploadFile) => string }` | `true`                                  |
| previewFile     | 自定义预览(默认情况仅支持图片)，返回`false`表示使用默认预览                                                                                     | `(file: WrapperFile, viewType: ViewType) => Promise<VNode | false>`                                                                                                                                                                                                                                                                          | -                                       |
| onPreviewFile   | 当文件预览时，返回`boolean`控制是否预览                                                                                                         | `(file: WrapperFile) => Promise<boolean>`                                                                                                                                                                                                                                                                                                         | -                                       |
| containerRender | 自定义上传容器渲染                                                                                                                              | `(action: { isDragAccept: boolean, isDragActive: boolean, isDragReject: boolean, isFocused: boolean, isFileDialogActive: boolean, locale?: object, isLimit: boolean }) => VNode`                                                                                                                                                              | -                                       |
| immediately     | 是否立即上传                                                                                                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                         | `true`                                  |
| limit           | 限制上传的文件数量，只在新增时限制，设置`-1`则不限制                                                                                            | `number`                                                                                                                                                                                                                                                                                                                                          | `-1`                                    |
| actionUrl       | 上传地址                                                                                                                                        | `string|[string, string, string?]`                                                                                                                                                                                                                                                                                                               | -                                       |
| method          | 请求方法，分为三阶段(上传前预查，上传，上传完成)                                                                                                | `[string | false, string, string | false]`                                                                                                                                                                                                                                                                                                      | `["get", "post", "post]`                |
| headers         | 请求的额外请求头，分为三阶段(上传前预查，上传，上传完成)                                                                                        | `[object | false, object | false, object | false]`                                                                                                                                                                                                                                                                                             | -                                       |
| withCredentials | 上传请求时是否携带 `cookie`                                                                                                                     | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| request         | 自定义请求逻辑，详情见[chunk-file-upload](https://github.com/food-billboard/chunk-file-load)                                                    | `object`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| lifecycle       | 文件上传生命周期，详情见[chunk-file-upload](https://github.com/food-billboard/chunk-file-load)                                                  | `object`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| accept          | 接受上传的文件类型                                                                                                                              | `string`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| minSize         | 文件上传最小大小                                                                                                                                | `number`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| maxSize         | 文件上传最大大小                                                                                                                                | `number`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| maxFiles        | 文件列表最大数量                                                                                                                                | `number`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| disabled        | 是否禁用                                                                                                                                        | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| validator       | 自定义文件验证                                                      | `Function`                                                                                                                                                                                                                                                                                                                                        | -                                       |
| multiple        | `是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件`                                                                                  | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| locale          | 默认文案设置                                                                                                                                    | `object`                                                                                                                                                                                                                                                                                                                                          | `{ container: "点击或拖拽文件到此处" }` |



## tips 
### 关于例子中出现的相关方法  

1. sleep  

```js
async function sleep(times=100) {
  return new Promise(resolve => setTimeout(resolve, times))
}
```

2. exitDataFn  

```js
const exitDataFn = async (
  params,
  name
) => {
  await sleep()
  console.log('exitDataFn', params);
  mockCache[name] = {
    max: params.chunksLength,
    chunkSize: params.chunkSize,
    size: params.size,
    index: 0,
  };
  //Mock server response
  return {
    data: 0,
  };
};
```

3. uploadFn  

```js
const uploadFn = async (data, name) => {
  await sleep();
  console.log('uploadFn', data, name);
  const size = mockCache[name].size;
  mockCache[name].index++;
  const nextOffset = mockCache[name].index * mockCache[name].chunkSize;
  //Mock server response
  return {
    data: nextOffset >= size ? size : nextOffset,
  };
};
```

4. completeFn  

```js
const completeFn = async (data) => {
  await sleep();
  console.log('completeFn', data);
  mockCache[data.name] = {};
};
```

### 预定义请求  
- 可以使用[默认请求](https://github.com/food-billboard/chunk-upload-request)

1. 此需要单独安装模块 `npm install chunk-upload-request`
2. 使用

```js
import request from 'chunk-upload-request';
import { Upload } from 'chunk-file-load-component-vue';

Upload.plugins.install('request', request());

export default {
  components: {
    Upload
  },
  render() {
    return (
      <upload
        immediately={false}
        actionUrl={['/api/check', '/api/load', '/api/complete']}
        lifecycle={{
          afterComplete() {
            console.log('upload complete');
          },
        }}
      />
    )
  }
}
```

- 注册`request`插件后，组件则不需要传递`request`参数，如果传递，则使用`props`的`request`
- 也可以自己实现自定义的`request`插件，参数及实现与[chunk-file-load](https://github.com/food-billboard/chunk-file-load)的`request`一致