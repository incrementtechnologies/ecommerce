<template>
  <div>
    <div style="margin-bottom: 10px; width: 100%; float: left;">
      <button class="btn btn-primary" @click="filterBy('bundled')" :class="{'btn-warning': activePage === 'bundled'}">Bundled</button>
      <button class="btn btn-primary" @click="filterBy('regular')" :class="{'btn-warning': activePage === 'regular'}">Regular</button>
      <button class="btn btn-primary" @click="filterBy('all')" :class="{'btn-warning': activePage === 'all'}">All</button>
    </div>

    <div class="products-holder" v-for="item, index in sorted" @click="redirect('/product/edit/' + item.code)">
      <div class="products-image">
        <img :src="config.BACKEND_URL + item.featured[0].url" v-if="item.featured !== null">
        <i class="fa fa-image" v-else></i>
      </div>
      <div class="products-details">
        <div class="products-title" :style="{width: item.price === null ? '100%' : '50%'}">
          <label style="padding-top: 5px;"><b>{{item.title}}</b></label>
          <label>{{item.description}}</label>
        </div>  
        <div class="products-price" v-if="item.price === null">
          <label v-if="item.price !== null">
            <label v-if="item.price.length === 1">PHP {{item.price[0].price}}</label>
            <label v-if="item.price.length > 1">PHP {{item.price[item.price.length - 1].price + ' - ' + item.price[0].price}}</label>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
 .products-holder{
    width: 24%;
    float: left;
    height: 300px;
    margin-right: 1%;
    border: solid 1px #ddd;
    margin-bottom: 10px;
    color: #555;
    margin-top: 25px;
  }
  .products-holder:hover{
    cursor: pointer;
    border: solid 1px #ffaa81;
    background: #ffaa81;
    color: #fff;
  }

  .products-image{
    width: 100%;
    float: left;
    position: relative;
    height: 250px;
    text-align: center;
  }

  .products-image img{
    height: 250px;
    float: left;
    width: 100%;
  }
  .products-image .fa-image{
    font-size: 150px;
    line-height: 250px;

  }
  .products-details{
    height: 50px;
    width: 100%;
    float: left;
    border-top: solid 1px #ddd;
  }
  .products-title{
    width: 50%;
    float: left;
    height: 50px;
  }
  .products-title label{
    width: 96%;
    float: left;
    font-size: 12px;
    margin: 0px !important;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
  }
  .products-price{
    width: 50%;
    float: left;
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    text-align: right;
    padding-right: 5px;
  }

  .products-wishlist{
    height: 50px;
    text-align: center;
    line-height: 50px;
    width: 100%;
    position: absolute;
    top: 50%;
    z-index: 10;
    display: none;
  }

  .products-wishlist:hover, .products-wishlist i:hover, .products-wishlist label:hover{
    cursor: pointer;
  }

  .products-wishlist label{
    line-height: 50px;
    float: left;
    width: 50%;
    text-align: center;
  }
  
  .products-wishlist i{
    font-size: 32px;
    line-height: 50px;
  }

  .products-holder:hover .products-wishlist{
    display: block;
  }

  @media (max-width: 992px){
    .products-holder{
      width: 98%;
      margin-left: 1%;
      margin-right: 1%;
    }
  }
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
    this.filterBy('bundled')
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      common: COMMON,
      activePage: 'bundled',
      sorted: []
    }
  },
  props: ['data', 'flag'],
  methods: {
    redirect(parameter){
      if(this.user.type === 'MANUFACTURER' || this.flag === true){
        ROUTER.push(parameter)
      }
    },
    filterBy(type){
      this.activePage = type
      if(type === 'all'){
        this.sorted = this.data
      }else{
        this.sorted = this.data.filter((item) => {
          if(item.type === type){
            return item
          }
        })
      }
    }
  }
}
</script>
