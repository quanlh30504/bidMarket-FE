import axiosClient from './axiosClient';

class AdminService {

  // Tìm kiếm người dùng theo các tiêu chí với phân trang (đã có từ trước)
  static searchUsers({page = 0, size = 10, sortBy = null, sortDirection = null, email = null, role = null, isBanned = null, isVerified = null}) {
    return axiosClient.get('/api/users/search', {
      params: {
        email,
        role,
        isBanned,
        isVerified,
        page,
        size,
        sortBy,
        sortDirection,
      },
    });
  }


  // ??? dùng cái nào

  // Lấy tất cả đấu giá
  static getAllAuctions() {
    return axiosClient.get('/api/auctions');
  }

  // Tìm kiếm đấu giá theo các tiêu chí với phân trang
  static searchAuctions({sellerId = null, title = null, categoryType = [], status = null, minPrice = null, maxPrice = null, startTime = null, endTime = null, page = 0, size = 10, sortField = 'currentPrice', sortDirection = 'ASC'}) {
    return axiosClient.get('/api/auctions/search', {
      params: {
        sellerId,
        title,
        categoryType,
        status,
        minPrice,
        maxPrice,
        startTime,
        endTime,
        page,
        size,
        sortField,
        sortDirection,
      },
    });
  }
}



export default AdminService;
