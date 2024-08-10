export const truncateFileName = (name: string, length = 100) => {
  if (name.length > length) {
    const ext = name.split(".").pop();
    if (ext) {
      return name.substring(0, length - ext.length - 1) + "." + ext;
    }
  }
  return name;
};
