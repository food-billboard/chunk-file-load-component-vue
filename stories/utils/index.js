

export async function sleep(times=1000) {
  return new Promise(resolve => setTimeout(resolve, times))
}

let mockCache = {};

export const exitDataFn = async (
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

export const uploadFn = async (data, name) => {
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

export const completeFn = async (data) => {
  await sleep();
  console.log('completeFn', data);
  mockCache[data.name] = {};
};