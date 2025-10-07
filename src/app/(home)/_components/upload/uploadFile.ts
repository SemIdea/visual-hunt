export const uploadFile = async (file: File | string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "default_visual");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dmu6nlwyt/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data.secure_url;
  } else {
    throw new Error(data.error.message);
  }
};
