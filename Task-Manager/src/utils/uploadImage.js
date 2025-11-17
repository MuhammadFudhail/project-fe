const uploadImage = async (imageFile) => {
  const formData = new FormData();

  // Field yang wajib untuk Cloudinary
  formData.append("file", imageFile);
  formData.append("upload_preset", "myapp_upload"); // ganti dengan nama preset kamu

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djs1k1meh/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    return data.secure_url; // ini URL final gambarnya
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadImage;
