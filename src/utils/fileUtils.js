import axiosClient from "../services/axiosClient";

const fileUtils = {
    validateFile: (file, options = {}) => {
        const {
            validTypes = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'application/zip',
                'application/x-rar-compressed'
            ],
            maxSize = 10 * 1024 * 1024
        } = options;

        if (!validTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: ${validTypes.join(', ')}`);
        }
        if (file.size > maxSize) {
            const sizeMB = maxSize / (1024 * 1024);
            throw new Error(`File size must be less than ${sizeMB}MB`);
        }
        return true;
    },

    validateImage: (file) => {
        return fileUtils.validateFile(file, {
            validTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            maxSize: 5 * 1024 * 1024
        });
    },

    uploadFile: async (file, folder, options = {}) => {
        try {
            console.log('Starting file upload process', { file, folder });

            // Validate based on file type
            if (file.type.startsWith('image/')) {
                fileUtils.validateImage(file);
            } else {
                fileUtils.validateFile(file, options);
            }

            // Changed to /api/images/presigned-url to match backend
            const presignedResponse = await axiosClient.get('/api/images/presigned-url', {
                params: {
                    folder: `chat/${folder}`,
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
            // Return just the fileUrl string instead of an object
            return fileUrl;

        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw new Error(error.response?.data?.message || 'Failed to upload file');
        }
    },

    uploadImage: async (file, folder) => {
        return fileUtils.uploadFile(file, folder, {
            validTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            maxSize: 5 * 1024 * 1024
        });
    },

    getFileTypeIcon: (fileType) => {
        if (fileType.startsWith('image/')) return '📷';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word')) return '📝';
        if (fileType.includes('excel')) return '📊';
        if (fileType.includes('powerpoint')) return '📺';
        if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
        return '📎';
    }
};

export default fileUtils;