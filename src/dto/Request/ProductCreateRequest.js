import { CategoryType } from '../../router/index';

class ProductCreateRequest {
  constructor({
    productId = null,
    name,
    description,
    sellerId,
    stockQuantity,
    categories = new Set(),
    imageUrls = []
  }) {
    this.productId = productId;
    this.name = name;
    this.description = description;
    this.sellerId = sellerId;
    this.stockQuantity = stockQuantity;
    this.categories = categories;
    this.imageUrls = imageUrls;
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error("Name is required and must be a string");
    }
    if (!this.sellerId) {
      throw new Error("Seller ID is required");
    }
    if (typeof this.stockQuantity !== 'number' || this.stockQuantity < 0) {
      throw new Error("Stock quantity must be a non-negative number");
    }
    if (!Array.isArray(this.imageUrls)) {
      throw new Error("Image URLs must be an array");
    }
    if (!(this.categories instanceof Set) || ![...this.categories].every((cat) => CategoryType[cat])) {
      throw new Error('Categories must be an array of valid CategoryType values');
    }
  }

  toJSON() {
    return {
      productId: this.productId,
      name: this.name,
      description: this.description,
      sellerId: this.sellerId,
      stockQuantity: this.stockQuantity,
      categories: Array.from(this.categories),
      imageUrls: this.imageUrls
    };
  }
}

export default ProductCreateRequest;
