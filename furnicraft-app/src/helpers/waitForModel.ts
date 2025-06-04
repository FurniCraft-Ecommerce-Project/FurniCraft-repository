async function waitForModel(taskId: string, retries = 60, interval = 5000) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.status === 'SUCCEEDED') {
      return data;
    }

    if (data.status === 'FAILED') {
      throw new Error('Model generation failed.');
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('Model generation did not complete in 2 minutes.');
}

export default waitForModel;