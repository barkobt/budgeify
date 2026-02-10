function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

export function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function fromAnyToLocalDateKey(input: string | Date): string {
  if (input instanceof Date) {
    return toLocalDateKey(input);
  }

  const trimmed = input.trim();
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnlyMatch) {
    return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date input: ${input}`);
  }

  return toLocalDateKey(parsed);
}
