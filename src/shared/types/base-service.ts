export interface BaseService<T> {
  execute(): Promise<T> | T;
}
