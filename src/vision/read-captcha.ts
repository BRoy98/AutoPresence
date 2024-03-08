const vision = require("@google-cloud/vision");

// Creates a client
const client = new vision.ImageAnnotatorClient({
  projectId: process.env.GCP_PROJECT_ID,
});

export const readCaptcha = async (fileName): Promise<string> => {
  // Performs text detection on the local file
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;

  let description: string;
  detections.forEach((text) => {
    if (!description && text.description) description = text.description;
  });
  return description.toUpperCase();
};
