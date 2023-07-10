import {jest} from '@jest/globals';

import {Pipeline, TransformFn, createPipeline} from '../..';

describe('Pipeline', () => {
  let pipeline: Pipeline;

  beforeEach(() => {
    pipeline = createPipeline();
  });

  it('should initialize with an empty array of pipes', () => {
    expect(pipeline.pipes).toEqual([]);
  });

  describe('fork', () => {
    it('should create a copy of the current pipeline', () => {
      pipeline.pipe(() => {});
      const newPipeline = pipeline.fork();
      expect(newPipeline.pipes).toEqual(pipeline.pipes);
      expect(newPipeline).toBeInstanceOf(Pipeline);
    });
  });

  describe('shift', () => {
    it('should remove the first function of the pipeline', () => {
      const fn1: TransformFn = () => {};
      const fn2: TransformFn = () => {};
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      const shiftedFn = pipeline.shift();
      expect(shiftedFn).toBe(fn1);
      expect(pipeline.pipes).toEqual([fn2]);
    });
  });

  describe('pop', () => {
    it('should remove the last function of the pipeline', () => {
      const fn1: TransformFn = () => {};
      const fn2: TransformFn = () => {};
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      const poppedFn = pipeline.pop();
      expect(poppedFn).toBe(fn2);
      expect(pipeline.pipes).toEqual([fn1]);
    });
  });

  describe('splice', () => {
    it('should remove a specific function in the pipeline', () => {
      const fn1: TransformFn = () => {};
      const fn2: TransformFn = () => {};
      const fn3: TransformFn = () => {};
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      pipeline.pipe(fn3);
      const removedFns = pipeline.splice(1, 2);
      expect(removedFns).toEqual([fn2, fn3]);
      expect(pipeline.pipes).toEqual([fn1]);
    });
  });

  describe('pipe', () => {
    it('should add a new function to the pipeline', () => {
      const fn: TransformFn = () => {};
      pipeline.pipe(fn);
      expect(pipeline.pipes).toEqual([fn]);
    });

    it('should return the pipeline instance', () => {
      const fn: TransformFn = () => {};
      const result = pipeline.pipe(fn);
      expect(result).toBe(pipeline);
    });
  });

  describe('pipeInsert', () => {
    it('should add a new function to a specific position in the pipeline', () => {
      const fn1: TransformFn = () => {};
      const fn2: TransformFn = () => {};
      const fn3: TransformFn = () => {};
      pipeline.pipe(fn1);
      pipeline.pipeInsert(fn2, 1);
      expect(pipeline.pipes).toEqual([fn1, fn2]);
      pipeline.pipeInsert(fn3, 1);
      expect(pipeline.pipes).toEqual([fn1, fn3, fn2]);
    });
  });

  describe('execute', () => {
    it('should execute the pipeline asynchronously and return the result', async () => {
      const fn1: TransformFn = jest.fn((data: number) => data + 1);
      const fn2: TransformFn = jest.fn((data: number) => data * 2);
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      const result = await pipeline.execute(2);
      expect(result).toBe(6); // (2 + 1) * 2
      expect(fn1).toHaveBeenCalledWith(2, pipeline);
      expect(fn2).toHaveBeenCalledWith(3, pipeline);
    });

    it('should execute the pipeline asynchronously and pass previous param if returns undefined', async () => {
      const fn1: TransformFn = jest.fn((data: number) => data + 1);
      const fn2: TransformFn = jest.fn((data: number) => undefined);
      const fn3: TransformFn = jest.fn((data: number) => data * 2);
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      pipeline.pipe(fn3);
      const result = await pipeline.execute(2);
      expect(result).toBe(6); // (2 + 1) * 2
      expect(fn1).toHaveBeenCalledWith(2, pipeline);
      expect(fn2).toHaveBeenCalledWith(3, pipeline);
      expect(fn3).toHaveBeenCalledWith(3, pipeline);
    });
  });

  describe('executeSync', () => {
    it('should execute the pipeline synchronously and return the result', () => {
      const fn1: TransformFn = jest.fn((data: number) => data + 1);
      const fn2: TransformFn = jest.fn((data: number) => data * 2);
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      const result = pipeline.executeSync(2);
      expect(result).toBe(6); // (2 + 1) * 2
      expect(fn1).toHaveBeenCalledWith(2, pipeline);
      expect(fn2).toHaveBeenCalledWith(3, pipeline);
    });

    it('should execute the pipeline synchronously and pass previous param if returns undefined', () => {
      const fn1: TransformFn = jest.fn((data: number) => data + 1);
      const fn2: TransformFn = jest.fn((data: number) => undefined);
      const fn3: TransformFn = jest.fn((data: number) => data * 2);
      pipeline.pipe(fn1);
      pipeline.pipe(fn2);
      pipeline.pipe(fn3);
      const result = pipeline.executeSync(2);
      expect(result).toBe(6); // (2 + 1) * 2
      expect(fn1).toHaveBeenCalledWith(2, pipeline);
      expect(fn2).toHaveBeenCalledWith(3, pipeline);
      expect(fn3).toHaveBeenCalledWith(3, pipeline);
    });
  });
});
