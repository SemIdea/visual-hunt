export const env = {
    publicUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    cloudinary: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
    },
};
