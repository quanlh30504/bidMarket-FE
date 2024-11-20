import axiosClient from './axiosClient';

class OrderService {
  
  // Tạo đơn hàng mới
  static createOrder(orderDto) {
    return axiosClient.post('/api/orders', orderDto);
  }

  // Lấy đơn hàng theo Auction ID
  static getOrderByAuctionId(auctionId) {
    return axiosClient.get(`/api/orders/auction/${auctionId}`);
  }

  // Lấy danh sách đơn hàng theo User ID với phân trang (order của bidder
  static getOrdersByUserId(userId, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'DESC') {
    return axiosClient.get(`/api/orders/user/${userId}`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    });
  }
}

export default OrderService;
