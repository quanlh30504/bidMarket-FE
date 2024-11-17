import axiosClient from './axiosClient';

class AuctionService {
  // Tạo một phiên đấu giá mới
  static createAuction(request) {
    return axiosClient.post('/api/auctions', request);
  }

  // Cập nhật thông tin của phiên đấu giá bằng ID
  static updateAuction(id, request, newImages = null) {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    if (newImages) {
      formData.append('newImages', newImages);
    }

    return axiosClient.put(`/api/auctions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Lấy tất cả các phiên đấu giá
  static getAllAuction() {
    return axiosClient.get('/api/auctions');
  }

  // Lấy thông tin chi tiết của một phiên đấu giá theo ID
  static getAuctionById(id) {
    return axiosClient.get(`/api/auctions/${id}`);
  }

  // Tìm kiếm phiên đấu giá với các tham số tùy chọn
  static searchAuctions({
    title,
    categoryType,
    status,
    minPrice,
    maxPrice,
    startTime,
    endTime,
    page = 0,
    size = 10,
    sortField = 'currentPrice',
    sortDirection = 'ASC',
  }) {
    return axiosClient.get('/api/auctions/search', {
      params: {
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

  // Đóng phiên đấu giá theo ID
  static closeAuction(auctionId) {
    return axiosClient.put(`/api/auctions/close/${auctionId}`);
  }

  // Hủy phiên đấu giá theo ID
  static cancelAuction(auctionId) {
    return axiosClient.put(`/api/auctions/cancel/${auctionId}`);
  }

  // Mở phiên đấu giá theo ID
  static openAuction(auctionId) {
    return axiosClient.put(`/api/auctions/open/${auctionId}`);
  }

  // Mở lại (reOpen) một phiên đấu giá
  static reOpenAuction(id, auctionUpdateRequest) {
    return axiosClient.put(`/api/auctions/reOpen/${id}`, auctionUpdateRequest);
  }
}

export default AuctionService;
