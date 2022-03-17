

module.exports = {

  USER_PHOTO_PATHS: {
    application: 'customer/',
    customer: 'customer/',
    store: 'store/',
    delivery_firm: 'delivery-firm/'
  },
  
  USER_DEFAULT_PHOTOS: {
    application: 'default.jpg',
    customer: 'default.jpg',
    store: 'default.jpg',
    delivery_firm: 'default.jpg'
  },
  
  PRODUCT_PHOTO_PATH: 'product/',
  
  PRODUCT_DEFAULT_PATH: 'default.jpg',
  
  CATEGORY_PHOTO_PATH: 'category/',
  
  CATEGORY_DEFAULT_PATH: 'default.jpg',
  
  SUB_CATEGORY_PHOTO_PATH: 'sub-category/',
  
  SUB_CATEGORY_DEFAULT_PATH: 'default.jpg',

  PROMOTION_PHOTO_PATH: 'promotion/',

  PROMOTION_DEFAULT_PATH: 'default.jpg',

  getUserPhotoPath(photoName, type) {
    return `${process.env.PHOTOS_PATH}${this.USER_PHOTO_PATHS[type]}${photoName ? photoName : this.USER_DEFAULT_PHOTOS[type]}`;
  },

  getProductPhotoPath(photoName) {
    return `${process.env.PHOTOS_PATH}${this.PRODUCT_PHOTO_PATH}${photoName ? photoName : this.PRODUCT_DEFAULT_PATH}`;
  },

  getCategoryPhotoPath(photoName) {
    return `${process.env.PHOTOS_PATH}${this.CATEGORY_PHOTO_PATH}${photoName ? photoName : this.CATEGORY_DEFAULT_PATH}`;
  },

  getSubCategoryPhotoPath(photoName) {
    return `${process.env.PHOTOS_PATH}${this.SUB_CATEGORY_PHOTO_PATH}${photoName ? photoName : this.SUB_CATEGORY_DEFAULT_PATH}`;
  },

  getPromotionPhotoPath(photoName) {
    return `${process.env.PHOTOS_PATH}${this.PROMOTION_PHOTO_PATH}${photoName ? photoName : this.PROMOTION_DEFAULT_PATH}`;
  },
};

