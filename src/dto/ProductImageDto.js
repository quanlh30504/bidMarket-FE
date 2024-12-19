class ProductImageDto {
    constructor({ imageUrl, isPrimary }) {
      this.imageUrl = imageUrl; // URL of the image
      this.isPrimary = isPrimary; // Boolean indicating if this is the primary image
  
      this.validate();
    }
  
    validate() {
      if (!this.imageUrl || typeof this.imageUrl !== 'string') {
        throw new Error('Image URL is required and must be a string');
      }
      if (typeof this.isPrimary !== 'boolean') {
        throw new Error('isPrimary must be a boolean');
      }
    }

    toJSON() {
      return {
        imageUrl: this.imageUrl,
        isPrimary: this.isPrimary,
      };
    }
  }
  
  export default ProductImageDto;
  