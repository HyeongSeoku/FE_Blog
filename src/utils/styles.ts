export const hexToRgba = (hex: string, opacity: number) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    throw new Error("Invalid HEX color.");
  }

  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity}%)`;
};

export const setRootProperty = (propertyName: string, value: string) => {
  if (propertyName && value) {
    document.documentElement.style.setProperty(propertyName, value);
  } else {
    console.error("propertyName 또는 value가 유효하지 않습니다.");
  }
};