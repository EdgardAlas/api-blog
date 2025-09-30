export interface BaseService<P = void, T = void> {
  execute(params: P): Promise<T> | T;
}
