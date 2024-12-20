import ProductCreateRequest from './ProductCreateRequest';

class AuctionCreateRequest {
    constructor({
      title,
      productCreateRequest,
      startTime,
      endTime,
      currentPrice,
      startingPrice,
      minimumBidIncrement,
      extensionCount
    }) {
      this.title = title;
      this.productCreateRequest = productCreateRequest; // An instance of ProductCreateRequest
      this.startTime = startTime;
      this.endTime = endTime;
      this.currentPrice = currentPrice;
      this.startingPrice = startingPrice;
      this.minimumBidIncrement = minimumBidIncrement;
      this.extensionCount = extensionCount;
    }
  
    validate() {
      if (!this.title || typeof this.title !== 'string') {
        throw new Error("Title is required and must be a string");
      }
      if (!(this.productCreateRequest instanceof ProductCreateRequest)) {
        throw new Error("ProductCreateRequest must be an instance of ProductCreateRequest");
      }
      if (!this.startTime || isNaN(Date.parse(this.startTime))) {
        throw new Error("Start time must be a valid date");
      }
      if (!this.endTime || isNaN(Date.parse(this.endTime))) {
        throw new Error("End time must be a valid date");
      }
      if (typeof this.currentPrice !== 'number' || this.currentPrice < 0) {
        throw new Error("Current price must be a non-negative number");
      }
      if (typeof this.startingPrice !== 'number' || this.startingPrice < 0) {
        throw new Error("Starting price must be a non-negative number");
      }
      if (typeof this.minimumBidIncrement !== 'number' || this.minimumBidIncrement <= 0) {
        throw new Error("Minimum bid increment must be a positive number");
      }
      if (typeof this.extensionCount !== 'number' || this.extensionCount < 0) {
        throw new Error("Extension count must be a non-negative number");
      }
    }
  
    toJSON() {
      return {
        title: this.title,
        productCreateRequest: this.productCreateRequest.toJSON(),
        startTime: this.startTime,
        endTime: this.endTime,
        currentPrice: this.currentPrice,
        startingPrice: this.startingPrice,
        minimumBidIncrement: this.minimumBidIncrement,
        extensionCount: this.extensionCount
      };
    }
  }
  
  export default AuctionCreateRequest;
  