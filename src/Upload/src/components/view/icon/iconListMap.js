

export const DEFAULT_ICON = null;

const iconValidatorMap = {
  image(type) {
    return type.startsWith('image/');
  },
  video(type) {
    return type.startsWith('video/');
  },
  pdf(type) {
    return type === 'application/pdf';
  },
  ppt(type) {
    return (
      type === 'application/vnd.ms-powerpoint' ||
      type ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
  },
  text(type) {
    return type === 'text/plain';
  },
  word(type) {
    return (
      type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      type === 'application/msword'
    );
  },
  zip(type) {
    return type === 'application/zip';
  },
};

export const formatType = (type) => {
  if (!type) return;
  const lowerType = type.toLowerCase();
  let result;
  Object.entries(iconValidatorMap).some((item) => {
    const [key, validator] = item;
    if (validator(lowerType)) {
      result = key;
      return true;
    }
    return false;
  });
  return result;
};

const IconListMap = {};

export default IconListMap;
