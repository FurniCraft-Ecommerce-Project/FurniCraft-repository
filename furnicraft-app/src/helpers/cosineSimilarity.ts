export const cosineSimilarity = (hfResult : number[], embedding : number[]) => {
  const dot = hfResult.reduce((acc, val, i) => acc + val * embedding[i], 0);
  const normA = Math.sqrt(hfResult.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(embedding.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}