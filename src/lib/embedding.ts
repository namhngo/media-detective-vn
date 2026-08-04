const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

type EmbeddingResponse = {
  data: Array<{ embedding: number[]; index: number }>;
};

/**
 * Generates OpenAI embeddings for structured summaries only. The seed script
 * uses this now; Eve's vector tool will use the same helper later.
 */
export async function createEmbeddings(inputs: string[]) {
  if (inputs.length === 0) return [];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing.");

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: inputs }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embedding request failed (${response.status}).`);
  }

  const payload = (await response.json()) as EmbeddingResponse;
  const embeddings = payload.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);

  if (embeddings.length !== inputs.length) {
    throw new Error("OpenAI returned an unexpected embedding count.");
  }
  if (embeddings.some((embedding) => embedding.length !== EMBEDDING_DIMENSIONS)) {
    throw new Error(`Expected ${EMBEDDING_DIMENSIONS}-dimension embeddings.`);
  }

  return embeddings;
}

/** PostgreSQL's pgvector text literal format. Values come from OpenAI, never user SQL. */
export function toVectorLiteral(embedding: number[]) {
  return `[${embedding.join(",")}]`;
}
