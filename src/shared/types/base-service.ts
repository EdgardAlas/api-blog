export interface BaseService<T = void> {
  execute(...args: unknown[]): Promise<T> | T;
}
