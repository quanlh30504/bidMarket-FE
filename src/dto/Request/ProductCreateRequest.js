import { CategoryType } from '../../router/index';
import ProductImageDto from '../ProductImageDto';

class ProductCreateRequest {
  constructor({
    productId = null,
    name,
    description,
    sellerId,
    stockQuantity,
    categories = new Set(),
    productImages = []
  }) {
    this.productId = productId;
    this.name = name;
    this.description = description;
    this.sellerId = sellerId;
    this.stockQuantity = stockQuantity;
    this.categories = categories;
    this.productImages = productImages;
    console.log('productImages:', productImages);
    console.log('this.productImages:', this.productImages);
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
    if (!(this.categories instanceof Set) || ![...this.categories].every((cat) => CategoryType[cat])) {
      throw new Error('Categories must be an array of valid CategoryType values');
    }
    if (
      !Array.isArray(this.productImages) ||
      !this.productImages.every((img) => img instanceof ProductImageDto)
    ) {
      throw new Error('Product images must be an array of ProductImageDto instances');
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
      productImages: this.productImages.map((productImageDto) => productImageDto.toJSON()),
    };
  }
}

export default ProductCreateRequest;
