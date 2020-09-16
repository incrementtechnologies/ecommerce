<template>
  <div class="holder">
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter, $event.filterValue)"
      @changeStyle="manageGrid($event)"
      :grid="['list']">
    </filter-product>
    <table class="table table-bordered" v-if="data !== null">
      <thead>
        <tr>
          <td>Transfer Code
            <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayCode('desc')" v-if="activeSortCode === 'asc'"></i>
            <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayCode('asc')" v-if="activeSortCode === 'desc'"></i>
          </td>
          <td>User</td>
          <td>Transferred {{filterValue === 0 ? 'from' : 'to'}}</td>
          <td>Number of Items</td>
          <td>Transferred On</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.code}}</td>
          <td>{{item.name}}</td> 
          <td>{{filterValue === 0 ? item.from : item.to}}</td>
          <td>
            <button class="btn btn-primary" @click="redirect('/consignment_products/' + item.code)">
              {{item.number_of_items}}
            </button>
          </td>
          <td>{{item.trasferred_on}}</td>
        </tr>
      </tbody>
    </table>
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    />
    <empty v-if="data === null" :title="filterValue === 0 ? 'Empty Consignments In!' : 'Empty Consignments Out!'" :action="filterValue === 0 ? 'Start accepting consignments from other business now!' : 'Start transfering item now by using the mobile app.'"></empty>
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
    this.retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''}, 0)
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
      numPages: null,
      activePage: 1,
      limit: 5,
      category: [{
        title: 'Consignments in',
        sorting: [{
          title: 'Transferred on ascending',
          payload: 'created_at',
          payload_value: 'asc',
          type: 'date'
        }, {
          title: 'Transferred on descending',
          payload: 'created_at',
          payload_value: 'desc',
          type: 'date'
        }, {
          title: 'Transferred by ascending',
          payload: 'username',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Transferred by descending',
          payload: 'username',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Transferred to ascending',
          payload: 'name',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Transferred to descending',
          payload: 'name',
          payload_value: 'desc',
          type: 'text'
        }]
      }, {
        title: 'Consignments out',
        sorting: [{
          title: 'Transferred on ascending',
          payload: 'created_at',
          payload_value: 'asc',
          type: 'date'
        }, {
          title: 'Transferred on descending',
          payload: 'created_at',
          payload_value: 'desc',
          type: 'date'
        }, {
          title: 'Transferred by ascending',
          payload: 'username',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Transferred by descending',
          payload: 'username',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Transferred to ascending',
          payload: 'name',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Transferred to descending',
          payload: 'name',
          payload_value: 'desc',
          type: 'text'
        }]
      }],
      common: COMMON,
      filterValue: 0,
      activeSortCode: 'asc',
      filter: null,
      sort: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    Pager,
    'filter-product': require('components/increment/ecommerce/filter/Product.vue')
  },
  methods: {
    sortArrayCode(sort){
      this.activeSortCode = sort
      if(sort === 'desc'){
        this.data = this.data.sort((a, b) => {
          return a.code < b.code ? -1 : 1
        })
      }else{
        this.data = this.data.sort((a, b) => {
          return a.code > b.code ? -1 : 1
        })
      }
    },
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort = null, filter = null, filterValue = null){
      if(sort !== null){
        this.sort = sort
      }
      if(filter !== null){
        this.filter = filter
      }
      if(this.filterValue !== null){
        this.filterValue = filterValue
      }
      this.data = null
      if(this.user.subAccount === null || typeof this.user.subAccount === 'undefined'){
        return false
      }
      let key = Object.keys(this.sort)
      let parameter = {
        column: this.filter.column,
        value: this.filter.value + '%',
        sort: {
          value: this.sort[key[0]],
          column: key[0]
        },
        merchant_id: this.user.subAccount.merchant.id,
        filter_value: this.filterValue === 0 ? 'to' : 'from',
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('transfers/retrieve_allowed_only', parameter).then(response => {
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
