import * as tf from '@tensorflow/tfjs';

// Example model to estimate moving costs based on inputs (inventory size, distance, move type)
export async function estimateMoveCost(inventorySize, distance, moveType) {
    const moveTypeToNumeric = {
        'local': 0,
        'intrastate': 1,
        'interstate': 2
    };

    // Ensure the AI model has trained data (replace data here with real data if possible)
    const data = [
        { inventorySize: 50, distance: 10, moveType: 'local', cost: 200 },
        // More data for better accuracy
    ];

    // Encode move types into numeric values (you can enhance this with one-hot encoding or similar techniques)
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
    return prediction.dataSync()[0];  // Return the estimated cost
}