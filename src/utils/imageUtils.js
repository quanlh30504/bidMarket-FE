import myAxios from "../services/axiosClient";

const imageUtils = {    
    validateImage: (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: ${validTypes.join(', ')}`);
        }
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }
        return true;
    },

    uploadImage: async (file, folder) => {
        try {
            console.log('Starting image upload process', { file, folder });
            imageUtils.validateImage(file);

            // Get presigned URL
            const presignedResponse = await myAxios.get('/api/images/presigned-url', {
                params: {
                    folder,
                    fileType: file.type
                }
            });

            console.log('Presigned URL response:', presignedResponse.data);

            if (!presignedResponse.data || !presignedResponse.data.uploadUrl) {
                throw new Error('Invalid response from presigned URL endpoint');
            }

            const { uploadUrl, fileUrl } = presignedResponse.data;
            console.log('Presigned URL:', uploadUrl, 'File URL:', fileUrl);


            // Upload to S3
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (!uploadResponse.ok) {
                throw new Error(`Failed to upload to S3: ${uploadResponse.statusText}`);
            }

            if (!fileUrl) {
                throw new Error('File URL missing from presigned URL response');
            }
            console.log('Upload successful, final URL:', fileUrl);
            return fileUrl;

        } catch (error) {
            console.error('Error in uploadImage:', error);
            throw new Error(error.response?.data?.message || 'Failed to upload image');
        }
    }
};

export default imageUtils;