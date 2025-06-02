function interpolateValues(vector : number[], count : number) {
    // Generate values berdasarkan distribusi vector yang ada
    const mean = vector.reduce((sum, val) => sum + val, 0) / vector.length;
    const variance = vector.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / vector.length;
    const stdDev = Math.sqrt(variance);

    // Generate random values dengan distribusi yang mirip
    return Array.from({ length: count }, () => {
        return mean + (Math.random() - 0.5) * stdDev * 0.1; // Scale down untuk padding
    });
}

function padVector(vector : number[], targetDim : number) {
    const paddingSize = targetDim - vector.length;
    const interpolatedValues = interpolateValues(vector, paddingSize);
    return [...vector, ...interpolatedValues];
}

function compressVector(vector : number[], targetDim : number) {
    // Strategi 2: Average pooling (lebih baik)
    const chunkSize = Math.ceil(vector.length / targetDim);
    const compressed = [];

    for (let i = 0; i < targetDim; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, vector.length);
        const chunk = vector.slice(start, end);
        const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
        compressed.push(avg);
    }

    return compressed;
}

export function adjustDimensions(textVector : number[], targetDim = 512) {
    const currentDim = textVector.length;

    if (currentDim === targetDim) {
        return textVector;
    }

    if (currentDim < targetDim) {
        // Pad dengan zeros atau interpolate
        return padVector(textVector, targetDim);
    } else {
        // Truncate atau compress
        return compressVector(textVector, targetDim);
    }
}