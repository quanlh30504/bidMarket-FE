import ProductImageDto from '../ProductImageDto';
import { CategoryType } from '../../router/index';

class ProductUpdateRequest {
  constructor({
    name,
    description,
    stockQuantity,
    productImages = [],
    categories = new Set(),
    newImages = [],
  }) {
    this.name = name;
    this.description = description;
    this.stockQuantity = stockQuantity;
    this.productImages = productImages; // List of ProductImageDto
    this.categories = categories; // Set of CategoryType (use an array for simplicity in JS)
    this.newImages = newImages; // List of strings (URLs or file references)
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    if (!this.description || typeof this.description !== 'string') {
      throw new Error('Description is required and must be a string');
    }
    if (typeof this.stockQuantity !== 'number' || this.stockQuantity < 0) {
      throw new Error('Stock quantity must be a non-negative number');
    }
    if (
      !Array.isArray(this.productImages) ||
      !this.productImages.every((img) => img instanceof ProductImageDto)
    ) {
      throw new Error('Product images must be an array of ProductImageDto instances');
    }
    if (![...this.categories].every((cat) => CategoryType[cat])) {
      throw new Error('Categories must be an array of valid CategoryType values');
    }
    if (!Array.isArray(this.newImages) || !this.newImages.every((img) => typeof img === 'string')) {
      throw new Error('New images must be an array of strings');
    }
  }

  hasNewImages() {
    return this.newImages && this.newImages.length > 0;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      stockQuantity: this.stockQuantity,
      productImages: this.productImages.map((img) => img.toJSON()),
      categories: this.categories,
      newImages: this.newImages,
    };
  }
}

export default ProductUpdateRequest;
