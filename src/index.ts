import Emittery, {EventName} from 'emittery';

type PromiseOrValue<T> = Promise<T> | T;

export type TransformFn<T = unknown, P extends Pipeline<T> = Pipeline<T>> = (
  value: any,
  pipeline: P,
) => PromiseOrValue<any>;

export class Pipeline<T = unknown, EventData extends Record<EventName, any> = object> extends Emittery<EventData> {
  protected _pipes: TransformFn<T>[] = [];

  get pipes(): TransformFn<T>[] {
    return this._pipes;
  }

  /**
   * Create a copy of the current pipeline
   * @returns
   */
  fork() {
    const newPipeline = new (this.constructor as any)();
    for (const fn of this._pipes) {
      newPipeline.pipe(fn);
    }
    return newPipeline;
  }

  /**
   * Remove the first function of the pipeline
   * @returns
   */
  shift() {
    return this._pipes.shift();
  }

  /**
   * Remove the last function of the pipeline
   * @returns
   */
  pop() {
    return this._pipes.pop();
  }

  /**
   * Remove a specific function in the pipeline (work like Array.prototype.splice)
   * @param start
   * @param deleteCount
   * @returns
   */
  splice(start: number, deleteCount?: number) {
    return this._pipes.splice(start, deleteCount);
  }

  /**
   * Add a new function to the pipeline
   * @param fn
   * @returns
   */
  pipe(fn: TransformFn<T>) {
    this._pipes.push(fn);
    return this;
  }

  /**
   * Add a new function to a specific position to the pipeline
   * @param fn
   * @param position
   */
  pipeInsert(fn: TransformFn<T>, position: number) {
    this._pipes.splice(position, 0, fn);
  }

  /**
   * Execute asynchronously the pipeline and return the result
   * @param data
   * @returns
   */
  async execute(data?: T) {
    for (const fn of this._pipes) {
      const result = await fn(data, this as Pipeline<T, any>);
      if (result !== undefined) {
        data = result;
      }
    }
    return data;
  }

  /**
   * Execute the pipeline and return the result
   * @param data
   * @returns
   */
  executeSync(data?: T) {
    for (const fn of this._pipes) {
      const result = fn(data, this as Pipeline<T, any>);
      if (result !== undefined) {
        data = result;
      }
    }
    return data;
  }
}

export function createPipeline() {
  return new Pipeline();
}
