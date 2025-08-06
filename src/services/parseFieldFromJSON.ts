function deepParseJSON(value: any): any {
  if (typeof value !== 'string') return value;

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'string') {
      return deepParseJSON(parsed);
    }
    return parsed;
  } catch {
    return value;
  }
}

export function parseFieldFromJSON<T extends Record<string, any>,K extends keyof T,ParsedFieldType = any>(
  items: T[],
  fieldName: K
): (Omit<T, K> & { [P in K]: ParsedFieldType })[] {
  return items.map((item) => {
    const parsed = deepParseJSON(item[fieldName]);
    return {
      ...item,
      [fieldName]: parsed,
    } as Omit<T, K> & { [P in K]: ParsedFieldType };
  });
}
