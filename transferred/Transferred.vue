<template>
  <div class="holder">
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']">
    </filter-product>
    <table class="table table-bordered" v-if="data !== null">
      <thead>
        <tr>
          <td>Transfer Code</td>
          <td>Transferred by</td>
          <td>Transferred to</td>
          <td>Number of Items</td>
          <td>Transffered On</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.code}}</td>
          <td>{{item.account.username}}</td>
          <td>{{item.to_details.name}}</td>
          <td>
            <button class="btn btn-primary" @click="redirect('/transferred_products/' + item.code)">
              {{item.transferred_products !== null ? item.transferred_products.length : 0}}
            </button>
          </td>
          <td>{{item.created_at_human}}</td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'Looks like you have not added a product!'" :action="'Click the New Product Button to get started.'"></empty>
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
export default {
  mounted(){
    this.retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''})
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
      category: [{
        title: 'Product Traces',
        sorting: [{
          title: 'Transferred on ascending',
          payload: 'created_at',
          payload_value: 'asc'
        }, {
          title: 'Transferred on descending',
          payload: 'created_at',
          payload_value: 'desc'
        }, {
          title: 'Transferred by ascending',
          payload: 'username',
          payload_value: 'asc'
        }, {
          title: 'Transferred by descending',
          payload: 'username',
          payload_value: 'desc'
        }, {
          title: 'Transferred to ascending',
          payload: 'name',
          payload_value: 'asc'
        }, {
          title: 'Transferred to descending',
          payload: 'name',
          payload_value: 'desc'
        }]
      }],
      common: COMMON
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'filter-product': require('components/increment/ecommerce/filter/Product.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort, filter){
      let key = Object.keys(sort)
      let parameter = {
        column: filter.column,
        value: filter.value + '%',
        sort: {
          value: sort[key[0]],
          column: key[0]
        }
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('transfers/retrieve', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.data = response.data
          if(this.selectedItem !== null){
            this.selectedItem = this.data[this.selectedIndex]
          }
        }else{
          this.data = null
          this.selectedIndex = null
          this.selectedItem = null
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
        case 'list': this.listStyle = 'list'
          break
      }
    }
  }
}
</script>
