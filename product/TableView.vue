<template>
  <div>
<!--     <div style="margin-bottom: 10px;width: 100%; float: left;" v-if="this.$route.path !== '/products/d'">
      <button class="btn btn-primary" @click="filterBy('bundled')" :class="{'btn-warning': activePage === 'bundled'}">Bundled</button>
      <button class="btn btn-primary" @click="filterBy('regular')" :class="{'btn-warning': activePage === 'regular'}">Regular</button>
      <button class="btn btn-primary" @click="filterBy('all')" :class="{'btn-warning': activePage === 'all'}">All</button>
    </div> -->
    <table class="table table-bordered table-responsive" v-if="type === 'consignments' && sorted.length > 0">
      <thead>
        <tr>
          <td v-if="user.type !== 'MANUFACTURER'">Merchant</td>
          <td>Title
            <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayTitle('desc')" v-if="activeSortTitle === 'asc'"></i>
            <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayTitle('asc')" v-if="activeSortTitle === 'desc'"></i>
          </td>
          <td v-if="user.type === 'MANUFACTURER'">Tags</td>
          <td>Inventory
            <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayInventory('desc')" v-if="activeSortInventory === 'asc'"></i>
            <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayInventory('asc')" v-if="activeSortInventory === 'desc'"></i>
          </td>
          <td v-if="user.type === 'MANUFACTURER'">Action</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sorted" :key="index">
          <td v-if="user.type !== 'MANUFACTURER'">
            {{item.merchant_from}}
          </td>
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type !== 'regular'" title="This is a bundled product"></i>
            <label class="underline-on-hover" @click="redirect('/marketplace/product/' + (item.product_code ? item.product_code : item.code) )">{{item.title}} {{item.volume}}</label>
          </td>
          <td v-if="user.type === 'MANUFACTURER'">{{item.tags}}</td>
          <td v-if="user.type === 'MANUFACTURER'">
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)" title="Total active trace">>{{item.inventory ? parseInt(item.inventory.qty[0].total_remaining_product) : 0}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td v-if="user.type !== 'MANUFACTURER'">
             <button class="btn btn-primary" title="Total active trace">{{user.type === "DISTRIBUTOR" ? parseInt(item.qty) : item.qty}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td v-if="user.type === 'MANUFACTURER'">
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">VIEW DETAILS</button>
            <!-- <button class="btn btn-warning" @click="addProductTraces(item.id)" v-if="item.type === 'regular' && item.status === 'published'">Add Inventory</button> -->
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-bordered table-responsive" v-if="type === 'products' && sorted.length > 0">
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
        <tr v-for="(item, index) in sorted" :key="index">
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type !== 'regular'" title="This is a bundled product"></i>
            {{item.title}}
          </td>
          <td>{{item.tags}}</td>
          <td>
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)" title="Total active trace">{{parseFloat(item.qty).toFixed(2)}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td>
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">VIEW DETAILS</button>
            <!-- <button class="btn btn-warning" @click="addProductTraces(item.id)" v-if="item.type === 'regular' && item.status === 'published'">Add Inventory</button> -->
          </td>
        </tr>
      </tbody>
    </table>

    <empty v-if="sorted.length === 0" :title="title" :action="guide"></empty>

    <create-modal :property="createProductTraceModal"></create-modal>
    <create-product-traces-modal :params="productId"></create-product-traces-modal>
  </div>
</template>
<style>
.underline-on-hover:hover{
  cursor: pointer;
  text-decoration: underline;
}
.btn-warning:hover{
  color: #fff !important;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
import ProductTrace from './CreateProductTrace.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
    this.filterBy('all')
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      createProductTraceModal: ProductTrace,
      productId: null,
      sorted: [],
      activePage: 'all',
      title: 'Empty Products!',
      guide: 'No activity at the moment.',
      activeSortTitle: 'asc',
      activeSortInventory: 'asc'
    }
  },
  components: {
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'create-product-traces-modal': require('./CreateProductTraces.vue')
  },
  props: ['data', 'type'],
  watch: {
    data (to, from){
      this.filterBy('all')
    }
  },
  methods: {
    sortArrayTitle(sort){
      this.activeSortTitle = sort
      if(sort === 'asc'){
        this.data = this.data.sort((a, b) => {
          return a.title < b.title ? -1 : 1
        })
      }else{
        this.data = this.data.sort((a, b) => {
          return a.title > b.title ? -1 : 1
        })
      }
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
      this.productId = id
      setTimeout(() => {
        $('#createProductTracesModal').modal('show')
      }, 100)
    },
    showModal(action, item){
      switch(action){
        case 'create':
          this.createProductTraceModal = {...ProductTrace}
          let inputs = this.createProductTraceModal.inputs
          inputs.map(input => {
            if(input.variable !== 'qty'){
              input.value = null
            }else{
              input.value = 1
            }
            input.disabled = false
          })
          this.createProductTraceModal.params = [{
            variable: 'account_id',
            value: AUTH.user.userID
          }, {
            variable: 'account_type',
            value: AUTH.user.type
          }, {
            variable: 'product_id',
            value: item.id
          }, {
            variable: 'inventory_type',
            value: COMMON.ecommerce.inventoryType
          }]
          break
      }
      $('#createProductTraceModal').modal('show')
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
    },
    retrieve(sort){
      this.$parent.retrieve(null, null)
    }
  }
}
</script>
