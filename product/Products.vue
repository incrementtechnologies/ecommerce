<template>
	<div class="holder">
    <create :type="type"></create>
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']">
    </filter-product>
    <div style="margin-bottom: 10px;width: 100%; float: left;">
      <button class="btn btn-primary" @click="filterBy('bundled')" :class="{'btn-warning': activePageNow === 'bundled'}">Bundled</button>
      <button class="btn btn-primary" @click="filterBy('regular')" :class="{'btn-warning': activePageNow === 'regular'}">Regular</button>
      <button class="btn btn-primary" @click="filterBy('all')" :class="{'btn-warning': activePageNow === 'all'}">All</button>
    </div>
    <div class="products-holder" v-for="item, index in data" @click="redirect('/product/edit/' + item.code)" v-if="listStyle === 'columns' && data !== null">
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
    <!-- <div class="products-holder" v-for="item, index in data" @click="redirect('/product/edit/' + item.code)" v-if="listStyle === 'columns'">
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
    </div> -->
    <table class="table table-bordered table-responsive" v-if="data !== null && listStyle === 'list'">
      <thead>
        <tr>
          <td>Title
            <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayTitle('desc')" v-if="activeSortTitle === 'asc'"></i>
            <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayTitle('asc')" v-if="activeSortTitle === 'desc'"></i>
          </td>
          <td>Tags</td>
          <td>Inventory
            <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayInventory('desc')" v-if="activeSortInventory === 'asc'"></i>
            <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayInventory('asc')" v-if="activeSortInventory === 'desc'"></i>
          </td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type !== 'regular'" title="This is a bundled product"></i>
            {{item.title}}
          </td>
          <td>{{item.tags}}</td>
          <td>
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)" title="Total active trace">{{user.type === 'USER' ? parseFloat(item.qty).toFixed(2) : parseInt(item.qty)}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td>
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">EDIT</button>
            <button class="btn btn-warning" @click="addProductTraces(item.id)" v-if="item.type === 'regular' && item.status === 'published'">Add Inventory</button>
          </td>
        </tr>
      </tbody>
    </table>
    <create-product-traces ref="addInventory" :params="productId"/>
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    />
    <empty v-if="data === null" :title="empty.title" :action="empty.guide"></empty>
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
import axios from 'axios'
import COMMON from 'src/common.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default {
  mounted(){
    this.retrieve({'title': 'asc'}, {column: 'title', value: ''})
    if(this.$route.params.type){
      this.type = this.$route.params.type
    }else{
      if(this.user.type !== 'MANUFACTURER'){
        this.type = 'd'
      }else{
        this.type = 'm'
      }
    }
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      productId: null,
      data: null,
      sorted: [],
      selectedItem: null,
      selectedIndex: null,
      listStyle: 'list',
      type: null,
      currentType: 'all',
      activePageNow: null,
      category: [{
        title: 'Product',
        sorting: [{
          title: 'Title ascending',
          payload: 'title',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Title descending',
          payload: 'title',
          payload_value: 'desc',
          type: 'text'
        }]
      }],
      common: COMMON,
      currentFilter: null,
      currentSort: null,
      numPages: null,
      activePage: 1,
      limit: 5,
      empty: {
        title: null,
        guide: null
      },
      activeSortTitle: 'asc',
      activeSortInventory: 'asc'
    }
  },
  components: {
    'create': require('components/increment/ecommerce/product/Create.vue'),
    'table-view': require('components/increment/ecommerce/product/TableView.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'filter-product': require('components/increment/ecommerce/filter/Product.vue'),
    'image-view': require('components/increment/ecommerce/product/ImageView.vue'),
    'create-product-traces': require('components/increment/ecommerce/product/CreateProductTraces.vue'),
    Pager
  },
  methods: {
    sortArrayTitle(sort){
      this.activeSortTitle = sort
      let result = null
      if(sort === 'asc'){
        result = this.data.sort((a, b) => {
          return a.title < b.title ? -1 : 1
        })
      }else{
        result = this.data.sort((a, b) => {
          return a.title > b.title ? -1 : 1
        })
      }
      this.data = result
    },
    sortArrayInventory(sort){
      this.activeSortInventory = sort
      if(sort === 'desc'){
        this.data = this.data.sort((a, b) => {
          return a.qty < b.qty ? -1 : 1
        })
      }else{
        this.data = this.data.sort((a, b) => {
          return a.qty > b.qty ? -1 : 1
        })
      }
    },
    redirect(parameter){
      ROUTER.push(parameter)
    },
    addProductTraces(id){
      var date = new Date()
      this.productId = id
      this.$refs.addInventory.newData.batch_number = null
      this.$refs.addInventory.manufacturing.year = date.getFullYear()
      this.$refs.addInventory.manufacturing.month = (parseInt(date.getMonth()) + 1)
      this.$refs.addInventory.manufacturing.date = null
      this.$refs.addInventory.newData.qty = 1
      setTimeout(() => {
        $('#createProductTracesModal').modal('show')
      }, 100)
    },
    retrieve(sort, filter){
      if(this.user.subAccount.merchant === null){
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
      let parameter = {
        condition: [{
          value: '%' + this.currentFilter.value + '%',
          column: this.currentFilter.column,
          clause: 'like'
        }, {
          value: this.user.subAccount.merchant.id,
          column: 'merchant_id',
          clause: '='
        }],
        sort: this.currentSort,
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      if(this.currentType !== 'all') {
        parameter.condition.push({
          value: this.currentType,
          column: 'type',
          clause: '='
        })
      } else {
        parameter.condition.splice(2)
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('products/retrieve_basic', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        $('#createProductTracesModal').modal('hide')
        if(response.data.length > 0){
          this.data = response.data
          console.log(this.activePage)
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          if(this.selectedItem !== null){
            this.selectedItem = this.data[this.selectedIndex]
          }
        }else{
          this.data = null
          this.selectedIndex = null
          this.selectedItem = null
          this.numPages = null
          this.empty = {
            title: 'Looks like you have not added a product!',
            guide: 'Click the New Product Button to get started.'
          }
        }
      })
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
    },
    filterBy(type){
      this.activePageNow = type
      this.currentType = type
      this.activePage = 1
      if(type === 'all') {
        this.retrieve({'title': 'asc'}, {column: 'title', value: ''})
      } else {
        let parameter = {
          condition: [{
            value: '%' + this.currentFilter.value + '%',
            column: this.currentFilter.column,
            clause: 'like'
          }, {
            value: type,
            column: 'type',
            clause: '='
          }, {
            value: this.user.subAccount.merchant.id,
            column: 'merchant_id',
            clause: '='
          }],
          sort: this.currentSort,
          account_id: this.user.userID,
          inventory_type: this.common.ecommerce.inventoryType,
          limit: this.limit,
          offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
        }
        $('#loading').css({'display': 'block'})
        this.APIRequest('products/retrieve_basic', parameter).then(response => {
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
            this.selectedItem = null
            this.numPages = null
            this.empty = {
              title: 'Looks like you have not added a product!',
              guide: 'Click the New Product Button to get started.'
            }
          }
        })
      }
    }
  }
}
</script>
