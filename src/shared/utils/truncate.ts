export const truncate = (value = '', limit = 10) => {
  return value.length > limit ? `${value.substring(0, limit)}...` : value;
};
