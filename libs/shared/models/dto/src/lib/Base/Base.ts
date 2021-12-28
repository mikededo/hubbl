export interface DTO<T> {
  toClass(): Promise<T> | T;
}