import axiosClient from './axiosClient';
import imageUtils from '../utils/imageUtils';

class ProductService {
  // Lấy thông tin sản phẩm theo ID
  static getProduct(id) {
    return axiosClient.get(`/api/products/${id}`);
  }

  // Lấy tất cả các sản phẩm
  static getAllProducts() {
    return axiosClient.get('/api/products');
  }

  // Tìm kiếm sản phẩm với phân trang và các tham số tùy chọn
  static searchProducts({ name, categoryType, status, page = 0, size = 10, sortField = 'createdAt', sortDirection = 'ASC' }) {
    return axiosClient.get('/api/products/search', {
      params: {
        name,
        categoryType,
        status,
        page,
        size,
        sortField,
        sortDirection
      },
    });
  }

  // Tạo sản phẩm mới
  static createProduct(productCreateRequest) {
    return axiosClient.post('/api/products', productCreateRequest);
  }

  // Cập nhật sản phẩm theo ID
  static updateProduct(id, productUpdateRequest) {
    return axiosClient.put(`/api/products/${id}`, productUpdateRequest);
  }

  // Cập nhật trạng thái sản phẩm theo ID
  static updateProductStatus(id, newStatus) {
    return axiosClient.put(`/api/products/${id}/status`, null, {
      params: {
        newStatus,
      },
    });
  }

  // Xóa sản phẩm theo ID
  static deleteProduct(id) {
    return axiosClient.delete(`/api/products/${id}`);
  }

  // Tải lên nhiều hình ảnh và trả về một mảng URL
  static async getUploadedImageUrls(files) {
    try {
      const uploadPromises = files.map((file) => imageUtils.uploadImage(file, 'products'));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error in uploadProductImages:', error);
      throw new Error('Failed to upload images');
    }
  }
}

export default ProductService;
