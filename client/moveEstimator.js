import * as tf from '@tensorflow/tfjs';

// Example model to estimate moving costs based on inputs (inventory size, distance, move type)
export async function estimateMoveCost(inventorySize, distance, moveType) {
  // Example training data (replace this with real historical data)
  const data = [
    { inventorySize: 50, distance: 10, moveType: 'loading', cost: 200 },
    { inventorySize: 150, distance: 25, moveType: 'packing', cost: 600 },
    { inventorySize: 100, distance: 30, moveType: '2movers', cost: 800 },
    { inventorySize: 200, distance: 50, moveType: 'onsite', cost: 400 },
    // Add more training data as needed
  ];

  // Encode move types into numeric values (you can enhance this with one-hot encoding or similar techniques)
  const moveTypeToNumeric = {
    'loading': 0,
    'packing': 1,
    'onsite': 2,
    '2movers': 3
  };

  const inputs = data.map(d => [d.inventorySize, d.distance, moveTypeToNumeric[d.moveType]]);
  const labels = data.map(d => d.cost);

  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 1 }));  // 3 inputs: inventorySize, distance, moveType

  model.compile({
    optimizer: tf.train.sgd(0.001),
    loss: 'meanSquaredError',
  });

  // Train the model
  await model.fit(inputTensor, labelTensor, {
    epochs: 100,
  });

  // Predict the cost using the user input
  const prediction = model.predict(tf.tensor2d([[inventorySize, distance, moveTypeToNumeric[moveType]]]));
  return prediction.dataSync()[0];  // Return the predicted cost
}