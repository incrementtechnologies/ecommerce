# product

# routes
``` javascript

  {
    path: '/products',
    name: 'products',
    component: resolve => require(['components/increment/product/Products.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/product/edit/:code',
    name: 'product',
    component: resolve => require(['components/increment/product/EditProduct.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/wishlists',
    name: 'wishlists',
    component: resolve => require(['components/increment/product/Wishlists.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
```