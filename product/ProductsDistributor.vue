<template>
  <div class="holder">
     <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter, $event.level)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']">
    </filter-product>
    <!-- <div style="margin-bottom: 10px;width: 100%; float: left;" v-if="data !== null">
      <button class="btn btn-primary" @click="filterBy('bundled')" :class="{'btn-warning': activePageNow === 'bundled'}">Bundled</button>
      <button class="btn btn-primary" @click="filterBy('regular')" :class="{'btn-warning': activePageNow === 'regular'}">Regular</button>
      <button class="btn btn-primary" @click="filterBy('all')" :class="{'btn-warning': activePageNow === 'all'}">All</button>
    </div> -->
    <image-view :data="data" :flag="false" v-if="listStyle === 'columns'"></image-view>
    <table-view :data="data" v-if="listStyle === 'list' && data !== null" :type="'consignments'"></table-view>
    <empty v-if="data === null" :title="empty.title" :action="empty.guide"></empty>
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    />
  </div>
</template>
<style>
  .holder{  
    width: 98%;
    float: left;
    margin-right: 2%;
    margin-top: 25px;
    margin-bottom: 50px;
  }
  .results{
    width: 100%;
    float: left;
    margin-top: 25px;
  }
  .item:hover{
    cursor: pointer;
  }

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
    width: 100%;
    float: left;
    font-size: 12px;
    margin: 0px !important;
    padding-left: 10px;
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

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
import COMMON from 'src/common.js'
import Pager from 'components/increment/generic/pager/Pager.vue'
export default {
  mounted(){
    this.retrieve({'title': 'asc'}, {column: 'title', value: ''}, true)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      selectedItem: null,
      selectedIndex: null,
      listStyle: 'list',
      currentType: 'all',
      activePageNow: null,
      currentLevel: null,
      category: [{
        title: 'Product',
        level: true,
        sorting: [{
          title: 'Title at ascending',
          payload: 'title',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Title at descending',
          payload: 'title',
          payload_value: 'desc',
          type: 'text'
        }]
      }, {
        title: 'Merchant',
        level: false,
        sorting: [{
          title: 'Name at ascending',
          payload: 'name',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Name at descending',
          payload: 'name',
          payload_value: 'desc',
          type: 'text'
        }]
      }],
      common: COMMON,
      currentFilter: null,
      currentSort: null,
      empty: {
        title: null,
        guide: null
      },
      numPages: null,
      activePage: 1,
      limit: 5,
      level: false
    }
  },
  components: {
    'create': require('components/increment/ecommerce/product/Create.vue'),
    'table-view': require('components/increment/ecommerce/product/TableView.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'filter-product': require('components/increment/ecommerce/filter/FilterWithSort.vue'),
    'image-view': require('components/increment/ecommerce/product/ImageView.vue'),
    'Pager': require('components/increment/generic/pager/Pager.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort, filter, level){
      if(level !== undefined) {
        this.level = level
      }
      if(this.user.subAccount === null || this.user.subAccount.merchant === null || typeof this.user.subAccount.merchant === 'undefined'){
        this.empty = {
          title: 'Empty Merchant!',
          guide: 'Go to My Profile then Merchant Settings and fill up necessary information.'
        }
        return false
      }
      if(filter !== null){
        this.currentFilter = filter
      }
      if(sort !== null){
        this.currentSort = sort
      }
      console.log(this.level)
      if(this.level === true){
        console.log('first')
        this.currentLevel = this.level
        this.retrieveFirstLevel(sort, filter, level)
      }else{
        this.currentLevel = this.level
        console.log('second')
        this.retrieveSecondLevel(sort, filter, level)
      }
    },
    retrieveFirstLevel(sort, filter, level){
      let parameter = {
        condition: {
          value: '%' + this.currentFilter.value + '%',
          column: this.currentFilter.column
        },
        merchant_id: this.user.subAccount.merchant.id,
        sort: this.currentSort,
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType,
        type: this.user.type,
        productType: this.currentType,
        limit: this.limit,
        // tags: 'herbicide',
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({'display': 'block'})
      let route = null
      console.log(this.user)
      if(this.user.type === 'DISTRIBUTOR') {
        route = 'transfers/retrieve_products_first_level'
      } else {
        route = 'transfers/retrieve_products_first_level_end_user'
      }
      this.APIRequest(route, parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          if(this.selectedItem !== null){
            this.selectedItem = this.data[this.selectedIndex]
          }
        }else{
          this.data = null
          this.selectedIndex = null
          this.numPages = null
          this.selectedItem = null
          this.empty = {
            title: 'Empty Consignments!',
            guide: 'Start asking to transfer item to your account.'
          }
        }
      })
    },
    retrieveSecondLevel(sort, filter, level){
      let parameter = {
        condition: {
          value: '%' + this.currentFilter.value + '%',
          column: this.currentFilter.column
        },
        merchant_id: this.user.subAccount.merchant.id,
        sort: this.currentSort,
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType,
        type: this.user.type,
        productType: this.currentType,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('transfers/retrieve_products_second_level_end_user', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          if(this.selectedItem !== null){
            this.selectedItem = this.data[this.selectedIndex]
          }
        }else{
          this.data = null
          this.selectedIndex = null
          this.numPages = null
          this.selectedItem = null
          this.empty = {
            title: 'Empty Consignments!',
            guide: 'Start asking to transfer item to your account.'
          }
        }
      })
    },
    filterBy(type){
      this.activePageNow = type
      this.currentType = type
      this.activePage = 1
      if(type === 'all'){
        if(this.currentLevel === true){
          this.retrieveFirstLevel({'title': 'asc'}, {column: 'title', value: ''}, true)
        }else{
          this.retrieveSecondLevel({'title': 'asc'}, {column: 'title', value: ''}, false)
        }
      }else{
        let parameter = {
          condition: {
            value: '%' + this.currentFilter.value + '%',
            column: this.currentFilter.column
          },
          merchant_id: this.user.subAccount.merchant.id,
          sort: this.currentSort,
          account_id: this.user.userID,
          inventory_type: this.common.ecommerce.inventoryType,
          type: this.user.type,
          productType: type,
          limit: this.limit,
          offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
        }
        $('#loading').css({'display': 'block'})
        this.APIRequest('transfers/retrieve_products_first_level', parameter).then(response => {
          $('#loading').css({'display': 'none'})
          if(response.data.length > 0){
            this.data = response.data
            this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
            if(this.selectedItem !== null){
              this.selectedItem = this.data[this.selectedIndex]
            }
          }else{
            this.data = null
            this.selectedIndex = null
            this.numPages = null
            this.selectedItem = null
            this.empty = {
              title: 'Empty Consignments!',
              guide: 'Start asking to transfer item to your account.'
            }
          }
        })
      }
    },
    editModal(item, index){
      for (var i = 0; i < this.$children.length; i++) {
        if(this.$children[i].$el.id === 'updateProducts'){
          this.selectedItem = item
          this.selectedIndex = index
          this.$children[i].modal()
        }
      }
    },
    manageGrid(event){
      switch(event){
        case 'th-large': this.listStyle = 'columns'
          break
        case 'list': this.listStyle = 'list'
          break
      }
    }
  }
}
</script>
