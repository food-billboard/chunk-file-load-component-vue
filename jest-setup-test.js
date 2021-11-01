

jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random().toString(),
  };
});

global.URL.createObjectURL = jest.fn(() => 'faker createObjectURL');

