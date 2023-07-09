# Pipeline

> A powerful pipeline implementation for asynchronous data transformation and event-driven programming.

## Installation

You can install the package using npm or yarn:

```bash
npm install pipeline
```

or

```bash
yarn add pipeline
```

## Usage

To use the `Pipeline` class, import it from the package:

```javascript
import {Pipeline, TransformFn, createPipeline} from 'pipeline';
```

### Creating a Pipeline

To create a new pipeline, use the `createPipeline` function:

```javascript
const pipeline = createPipeline();
```

### Adding Functions to the Pipeline

You can add transformation functions to the pipeline using the `pipe` method. These functions will be executed in the
order they are added:

```javascript
const double = value => value * 2;
const square = value => value * value;

pipeline.pipe(double);
pipeline.pipe(square);
```

### Executing the Pipeline

To execute the pipeline asynchronously and retrieve the transformed result, use the `execute` method:

```javascript
const data = 2;
pipeline.execute(data).then(result => {
  console.log(result); // Output: 16 (2 * 2 * 2)
});
```

To execute the pipeline synchronously, use the `executeSync` method:

```javascript
const data = 2;
const result = pipeline.executeSync(data);
console.log(result); // Output: 16 (2 * 2 * 2)
```

### Event Emitter

The `Pipeline` class extends the `Emittery` class, which provides event emitter functionality. You can listen for events
and emit events using the inherited methods from `Emittery`.

```javascript
pipeline.on('aggregated', data => {
  console.log(data);
  // => { value: 2 }
});

pipeline.emit('aggregated', {value: 2});
```

### Modifying the Pipeline

You can modify the pipeline by removing functions or inserting functions at specific positions.

- `shift`: Remove the first function from the pipeline.
- `pop`: Remove the last function from the pipeline.
- `splice`: Remove a specific function from the pipeline based on the start index and delete count.
- `pipeInsert`: Insert a new function at a specific position in the pipeline.

```javascript
pipeline.shift(); // Remove the first function
pipeline.pop(); // Remove the last function
pipeline.splice(1, 2); // Remove two functions starting from index 1
pipeline.pipeInsert(newFunction, 1); // Insert a new function at index 1
```

### Forking the Pipeline

To create a copy of the current pipeline, you can use the `fork` method:

```javascript
const newPipeline = pipeline.fork();
```

The `fork` method creates a new instance of the pipeline with the same functions.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a
pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
