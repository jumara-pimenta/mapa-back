export const dateInFormatOneRgx = new RegExp(
  /([0-9]{2})[-]([0-9]{2})[-]([0-9]{4})/,
);

export const dateInFormatTwoRgx = new RegExp(
  /([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})/,
);

export const dateInFormatThreeRgx = new RegExp(
  /([0-9]{2})[/]([0-9]{2})[/]([0-9]{4})/,
);

export const durationPathRgx = new RegExp(/^([0-9]{2})[:]([0-9]{2})$/);

export const DurationRgx = new RegExp(/^[0-9]{2}h[0-9]{2}/gm);
export const StartsAtRgx = new RegExp(/^[0-9]{2}h[0-9]{2}/gm);
