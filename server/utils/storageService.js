const supabase = require('./supabase');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Original file name
 * @param {string} bucket - Bucket name (e.g., 'profiles', 'shops')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
exports.uploadFile = async (fileBuffer, fileName, bucket = 'uploads') => {
  try {
    const fileExt = fileName.split('.').pop();
    const filePath = `${uuidv4()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Supabase Storage Error:', error);
    throw new Error('Failed to upload image to storage');
  }
};
