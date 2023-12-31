export const dateInFormatOneRgx = new RegExp(
  /([0-9]{2})[-]([0-9]{2})[-]([0-9]{4})/,
);

export const dateInFormatTwoRgx = new RegExp(
  /([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})/,
);

export const dateInFormatThreeRgx = new RegExp(
  /([0-9]{2})[/]([0-9]{2})[/]([0-9]{4})/,
);

export const DurationRgx = new RegExp(/^[0-9]{2}h[0-9]{2}/gm);

export const StartsAtRgx = new RegExp(/^([01][0-9]|2[0-3]):([0-5][0-9])$/);

export const passwordRgx = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/);

export const durationPathRgx = new RegExp(
  /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/,
);
