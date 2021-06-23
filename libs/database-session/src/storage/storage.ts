import als from 'async-local-storage';

als.enable();
als.enableLinkedTop();

function set<TData>(key: string, value: TData): void {
  als.set(key, value, true);
}

function get<TData>(key: string): TData | undefined {
  return als.get(key) ?? undefined;
}

export { set, get };
