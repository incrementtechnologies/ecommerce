## Modules
Product, Wishlist, Coupon, Marketplace


## routes
``` javascript

  {
    path: '/products',
    name: 'products',
    component: resolve => require(['components/increment/ecommerce/product/Products.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/product/edit/:code',
    name: 'product',
    component: resolve => require(['components/increment/ecommerce/product/EditProduct.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/wishlists',
    name: 'wishlists',
    component: resolve => require(['components/increment/ecommerce/wishlist/Wishlists.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/coupons',
    name: 'coupons',
    component: resolve => require(['components/increment/ecommerce/coupon/Coupons.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    component: resolve => require(['components/increment/ecommerce/marketplace/Marketplace.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/marketplace/product/:code/:status?',
    name: 'marketplaceProduct',
    component: resolve => require(['components/increment/ecommerce/marketplace/Product.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
```