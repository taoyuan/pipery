import Emittery, {EventName} from 'emittery';

type PromiseOrValue<T> = Promise<T> | T;

export type TransformFn<T = any, R = any> = (value: T, pipeline: Pipeline<any>) => PromiseOrValue<R>;

export class Pipeline<EventData extends Record<EventName, any> = {}> extends Emittery<EventData> {
  protected _pipes: TransformFn[] = [];

  get pipes(): TransformFn[] {
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
  pipe(fn: TransformFn) {
    this._pipes.push(fn);
    return this;
  }

  /**
   * Add a new function to a specific position to the pipeline
   * @param fn
   * @param position
   */
  pipeInsert(fn: TransformFn, position: number) {
    this._pipes.splice(position, 0, fn);
  }

  /**
   * Execute asynchronously the pipeline and return the result
   * @param data
   * @returns
   */
  async execute(data?: unknown) {
    let result = data;
    for (const fn of this._pipes) {
      result = await fn(result, this);
    }
    return result;
  }

  /**
   * Execute the pipeline and return the result
   * @param data
   * @returns
   */
  executeSync(data?: unknown) {
    for (const fn of this._pipes) {
      data = fn(data, this);
    }
    return data;
  }
}

export function createPipeline() {
  return new Pipeline();
}
