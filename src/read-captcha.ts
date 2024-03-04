const vision = require("@google-cloud/vision");

// Creates a client
const client = new vision.ImageAnnotatorClient({
  projectId: "personal-stuff-415907",
});

export const readCaptcha = async (fileName) => {
  // Performs text detection on the local file
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;

  let description;
  detections.forEach((text) => {
    if (!description && text.description) description = text.description;
  });
  return description;
};
