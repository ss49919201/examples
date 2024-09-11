const parseRawJson = (
  json: string
): {
  valid: boolean;
  data?: unknown;
} => {
  try {
    return { valid: true, data: JSON.parse(json) };
  } catch (error) {
    return { valid: false };
  }
};
