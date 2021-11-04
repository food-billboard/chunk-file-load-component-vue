export const MOCK_COMPLETE_STRING_FILE = 'mock_complete_file';

export const MOCK_COMPLETE_OBJECT_FILE = {
  name: Symbol(100),
  id: (Math.random() + Date.now()).toString(),
  local: {
    type: 'url',
    value: {
      fileId: 'testId',
      filename: 'testName',
    },
  },
};
