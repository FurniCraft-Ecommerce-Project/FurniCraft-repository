import { pipeline } from "@huggingface/transformers";

export const textEmbedding = async (text : string) => {
    const textEncoder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2',{
        dtype: 'fp32', // full precicision, lebih akurat
        device: 'cpu'  // Eksplisit specify device
    });
    const textEmbedding = await textEncoder(text, { pooling: 'mean', normalize: true });
    
    const resEmbed = (textEmbedding.ort_tensor as any).cpuData
    return resEmbed
}

export const textEmbeddingFunctOpenAi = async (base64Image : string, question : string, url : string) => {
    const base64ImageDataUrl = base64Image

    const payload = {
        model: "openai", // Ensure vision support
        messages: [
            {
            role: "user",
            content: [
                { type: "text", text: question },
                {
                type: "image_url",
                image_url: {
                    url: base64ImageDataUrl,
                },
                },
            ],
            },
        ],
        max_tokens: 500, // Optional
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });


    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
        );
    }

    const result = await response.json();
    const resultValueText = result.choices[0].message.content

    const resEmbed = await textEmbedding(resultValueText)

    return {
        textEmbed : resEmbed,
        resOpenAi : resultValueText
    }
}