export interface GenerateImageParams {
    prompt: string;
    apiKey: string;
    width?: number;
    height?: number;
}

export const generateImage = async ({ prompt, apiKey, width = 768, height = 768 }: GenerateImageParams): Promise<string> => {
    // Model: stability-ai/sdxl 
    const version = "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({
            version,
            input: {
                prompt,
                width,
                height,
                scheduler: "K_EULER",
                num_inference_steps: 50,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to start generation");
    }

    const prediction = await response.json();
    const getUrl = prediction.urls.get;

    // Poll for result
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await fetch(getUrl, {
            headers: {
                Authorization: `Token ${apiKey}`,
            },
        });
        result = await statusResponse.json();
    }

    if (result.status === "failed") {
        throw new Error("Generation failed");
    }

    return result.output[0];
};
