
export const install = (
  key,
  action
) => {
  INSTALL_MAP[key] = action;
};

export function getInstallMap(key) {
  return INSTALL_MAP[key];
}

const INSTALL_MAP = {
  request: undefined,
  validator: undefined,
};

export const uninstall = (key) => {
  INSTALL_MAP[key] = undefined;
};
