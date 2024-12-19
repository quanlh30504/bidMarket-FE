import axiosClient from './axiosClient';
import fileUtils from '../utils/fileUtils';

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
  static searchProducts({
    sellerId = null,
    name = null,
    categoryType = null,
    status = null,
    page = 0,
    size = 10,
    sortField = 'createdAt',
    sortDirection = 'ASC',
  }) {
    return axiosClient.get('/api/products/search', {
      params: {
        sellerId,
        name,
        categoryType,
        status,
        page,
        size,
        sortField,
        sortDirection,
      },
    });
  }

  // Tạo sản phẩm mới
  static createProduct(productCreateRequest) {
    console.log('productCreateRequest:', productCreateRequest);
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
  static async getUploadedImageUrls(files, folder='products') {
    try {
      const uploadPromises = files.map((file) => fileUtils.uploadImage(file, folder));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error in uploadProductImages:', error);
      throw new Error('Failed to upload images');
    }
  }

  // 1 time 1 file
  static async getUploadedImageUrl(file, folder='products') {
    try {
      const url = await fileUtils.uploadImage(file, folder);
      return url;
    } catch (error) {
      console.error('Error in uploadProductImages:', error);
      throw new Error('Failed to upload images');
    }
  }
}

export default ProductService;
