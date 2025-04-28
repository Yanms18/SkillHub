/**
 * Uploads a video file to Cloudinary.
 * @param {File} file - The video file to upload.
 * @param {string} title - The title for the video (optional, can be used as public_id or context).
 * @param {string} description - The description for the video (optional, can be used as context).
 * @returns {Promise<Object>} - The Cloudinary upload response.
 */
export async function uploadVideoToCloudinary(file, title, description) {
  // You must set your Cloudinary upload preset and cloud name in your .env file
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary cloud name or upload preset not set in .env");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (title) formData.append("public_id", title.replace(/\s+/g, "_"));
  if (description) formData.append("context", `caption=${description}`);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed: " + (await response.text()));
  }

  return await response.json();
}