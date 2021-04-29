<template>
  <div class="holder">
    <div class="row mb-4">
      <div class="col-sm-6">
          <i class="fa fa-reply" style="color:#cae166; font-size:20px;cursor:pointer;" title="Back" @click="showInventory === false ? $router.push('/product/edit/' + $route.params.code) : retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''}, 'active')"></i>
          <h5>Batches</h5>
          <h5 v-if="returnHasData.length > 0">Product: {{returnHasData[0].product.title}} ({{returnHasData[0].product.variation[0].payload_value}} {{conversion.getUnitsAbbreviation(returnHasData[0].product.variation[0].payload)}})</h5>
      </div>
      <div class="col-sm-6">
      <div>
          <button class="btn btn-primary" v-if="returnHasData.length > 0" style="position:absolute;right:15px;bottom:0;" @click="addTraces(returnHasData[0].product.variation[0])">Create Batch</button>
      </div>
      </div>
    </div>
    <div v-if="showInventory === false">
      <!-- <div>
        <button class="btn btn-primary pull-right" style="margin-bottom: 10px;">Create Batch</button>
        <button class="btn btn-primary pull-left" style="margin-bottom: 10px;" v-if="viewInactive === false" @click="retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''}, 'inactive'), viewInactive = !viewInactive">Show Inactive</button>
        <button class="btn btn-primary pull-left" v-if="viewInactive === true" @click="retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''}, 'active'), viewInactive = !viewInactive">Show Active</button>
        <button class="btn btn-warning pull-right" v-if="viewInactive === true" style="margin-bottom: 10px;" @click="exportData()"><i class="fas fa-file-export" style="padding-right: 5px;"></i>Export</button>
      </div> -->
      <filter-product v-bind:category="category" 
        :activeCategoryIndex="0"
        :activeSortingIndex="0"
        @changeSortEvent="retrieve($event.sort, $event.filter)"
        @changeStyle="manageGrid($event)"
        :grid="['list', 'th-large']">
      </filter-product>
      <table class="table table-bordered" v-if="returnHasData[1].traces.length > 0">
        <thead>
          <tr>
            <td>Batch Number
              <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayBatch('desc')" v-if="activeSortBatch === 'asc'"></i>
              <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayBatch('asc')" v-if="activeSortBatch === 'desc'"></i>
            </td>
            <td>Manufacture Date
              <i class="fas fa-chevron-up pull-right action-link" @click="sortArrayDate('desc')" v-if="activeSortDate === 'asc'"></i>
              <i class="fas fa-chevron-down  pull-right action-link" @click="sortArrayDate('asc')" v-if="activeSortDate === 'desc'"></i>
            </td>
            <td>Batch Quantity</td>
            <td>Active Quantity</td>
            <!-- <td>Status</td> -->
            <td>Created At</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in returnHasData[1].traces" :key="index">
            <td>{{item.batch_number}}</td>
            <td>{{item.manufacturing_date}}</td>
            <td>{{item.total_qty}}</td>
            <td>{{item.active_qty}}</td>
            <!-- <td style="text-transform: UPPERCASE">{{item.status}}</td> -->
            <td>{{item.created_at_human}}</td>
            <td>
              <button class="btn btn-warning" @click="editTrace(item)">Edit</button>
              <button class="btn btn-warning" @click="showInventoryTable(item)" v-if="item.active_qty !== 0">View Inventory</button>
              <button class="btn btn-warning" @click="showModal(item, returnHasData[0].product)" v-if="item.active_qty !== item.total_qty">Order Labels</button>
            </td>
          </tr>
        </tbody>
      </table>
      <empty v-if="returnHasData[1].traces.length <= 0" :title="'Looks like you have not added a product!'" :action="'Click the New Product Button to get started.'"></empty>
      <!-- The Modal -->
      <div class="modal fade" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Order Smart Labels</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body" v-if="selectedBatch !== null">
              <label><b>Product:</b> {{selectedBatch.product.title}} ({{selectedBatch.product.variation[0].payload_value}} {{conversion.getUnitsAbbreviation(selectedBatch.product.variation[0].payload)}})</label><br>
              <label><b>Batch Number:</b> {{selectedBatch.batch_number}}</label><br>
              <label><b>Manufacture Date:</b> {{selectedBatch.manufacturing_date}}</label><br>
              <div class="row">
                <div class="col-sm-5">
                  <label><b>Label Quantity:</b> {{selectedBatch.total_qty}}</label>  
                </div>
                <div class="col-sm-7">
                  <select class="form-control custom-form-control">
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <span style="font-size: 12px">All Agricord labels include Lifetime traceability through Agricord platform</span>
              <center><button class="btn btn-warning" style="width:50%; margin-top:2%" @click="exportTraces(selectedBatch)">Export Order</button></center>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InventoryEnhance v-if="showInventory === true"  :inventory="inventoryList"/>
    <edit-product-trace-modal :data="trace" :currQty="qty"></edit-product-trace-modal>
    <create-product-traces-modal ref="addTrace" :params="productId" :variations="selectedVariation"></create-product-traces-modal>
    <empty :title="viewInactive === false ? 'Empty Active Batches!' : 'Empty Inactive Batches!'" v-if="returnHasData.length <= 0"></empty>
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
import Conversion from 'src/services/conversion.js'
import { ExportToCsv } from 'export-to-csv'
import InventoryEnhance from './InventoryEnhance.vue'
import EditProductTraces from './EditProductTraces.vue'
export default {
  mounted(){
    this.retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''}, 'active')
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      conversion: Conversion,
      productId: null,
      errorMessage: null,
      data: [],
      selectedItem: null,
      selectedIndex: null,
      listStyle: 'list',
      selectedBatch: null,
      category: [{
        title: 'Product Traces',
        sorting: [{
          title: 'Created ascending',
          payload: 'created_at',
          payload_value: 'asc',
          type: 'date'
        }, {
          title: 'Created descending',
          payload: 'created_at',
          payload_value: 'desc',
          type: 'date'
        }, {
          title: 'Batch number ascending',
          payload: 'batch_number',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Batch number descending',
          payload: 'batch_number',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Manufacturing date ascending',
          payload: 'manufacturing_date',
          payload_value: 'asc',
          type: 'custom-date'
        }, {
          title: 'Manufacturing date descending',
          payload: 'manufacturing_date',
          payload_value: 'desc',
          type: 'custom-date'
        }]
      }],
      common: COMMON,
      date: null,
      viewInactive: false,
      activeSortBatch: 'asc',
      activeSortDate: 'asc',
      showInventory: false,
      inventoryList: null,
      selectedVariation: null,
      trace: null,
      qty: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'filter-product': require('components/increment/ecommerce/filter/Product.vue'),
    'create-product-traces-modal': require('../product/CreateProductTraces'),
    'edit-product-trace-modal': require('./EditProductTraces'),
    InventoryEnhance,
    EditProductTraces
  },
  computed: {
    returnHasData(){
      return this.data
    }
  },
  methods: {
    sortArrayBatch(sort){
      this.activeSortBatch = sort
      if(sort === 'desc'){
        this.data = this.data.sort((a, b) => {
          return a.batch_number < b.batch_number ? -1 : 1
        })
      }else{
        this.data = this.data.sort((a, b) => {
          return a.batch_number > b.batch_number ? -1 : 1
        })
      }
    },
    sortArrayDate(sort){
      this.activeSortDate = sort
      if(sort === 'desc'){
        this.data = this.data.sort((a, b) => {
          return a.manufacturing_date < b.manufacturing_date ? -1 : 1
        })
      }else{
        this.data = this.data.sort((a, b) => {
          return a.manufacturing_date > b.manufacturing_date ? -1 : 1
        })
      }
    },
    addTraces(variation){
      console.log(this.data[0].product.id)
      this.productId = this.data[0].product.id
      let fullVariation = {
        variation: variation,
        product: this.data[0].product.title
      }
      this.selectedVariation = fullVariation
      setTimeout(() => {
        $('#createProductTracesModal').modal('show')
      }, 100)
    },
    editTrace(item){
      this.trace = item
      this.qty = item.total_qty
      console.log(this.trace)
      setTimeout(() => {
        $('#editProductTracesModal').modal('show')
      }, 100)
    },
    showModal(item, product){
      item['product'] = product
      this.selectedBatch = item
      console.log(this.selectedBatch)
      $('#myModal').modal('show')
    },
    showInventoryTable(item){
      this.showInventory = true
      this.inventoryList = item
    },
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort, filter, status){
      this.showInventory = false
      if(status === undefined || status === null) {
        status = this.viewInactive ? 'inactive' : 'active'
      }
      let parameter = {
        condition: [{
          value: '%' + filter.value + '%',
          column: filter.column,
          clause: 'like'
        }],
        code: this.$route.params.code,
        sort: sort
      }
      if(this.$route.params.product_attribute_id !== undefined){
        parameter['product_attribute_id'] = this.$route.params.product_attribute_id
        $('#loading').css({'display': 'block'})
        this.APIRequest('product_traces/retrieve_with_attribute', parameter).then(response => {
          $('#loading').css({'display': 'none'})
          if(response.data.length > 0){
            console.log(response.data)
            this.data = response.data
            this.date = response.request_timestamp
            if(this.selectedItem !== null){
              this.selectedItem = this.data[this.selectedIndex]
            }
            console.log('DATA', this.data)
          }else{
            this.data = []
            console.log('DATA ELSE', this.data)
            this.selectedIndex = null
            this.selectedItem = null
          }
        })
      }else{
        $('#loading').css({'display': 'block'})
        this.APIRequest('product_traces/retrieve', parameter).then(response => {
          $('#loading').css({'display': 'none'})
          if(response.data.length > 0){
            this.data = response.data
            this.date = response.request_timestamp
            if(this.selectedItem !== null){
              this.selectedItem = this.data[this.selectedIndex]
            }
          }else{
            this.data = null
            this.selectedIndex = null
            this.selectedItem = null
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
        case 'list': this.listStyle = 'list'
          break
      }
    },
    exportTraces(selectedBatch){
      console.log('[SELECTED BATCH]', selectedBatch)
      let options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Trackr',
        useTextFile: false,
        useBom: true,
        // useKeysAsHeaders: true,
        filename: COMMON.APP_NAME + ' - ' + this.date,
        headers: ['TEXT FIELD', 'NFC_STRING', 'TEXT FIELD', 'BLANK', 'TEXT FIELD', 'TEXT_FIELD', 'TEXT_FIELD', '', 'Status', 'Created_at']
      }
      var exportData = []
      let parameter = {
        product_attribute_id: selectedBatch.product_attribute_id,
        batch_number: selectedBatch.batch_number,
        status: 'inactive'
      }
      console.log('paramter', parameter)
      $('#loading').css({'display': 'block'})
      this.APIRequest('product_traces/retrieve_with_traces', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        response.data.map(el => {
          var code = `${selectedBatch.product.title} (${selectedBatch.product.variation[0].payload_value} ${this.conversion.getUnitsAbbreviation(selectedBatch.product.variation[0].payload)})` + '<>' + selectedBatch.product.merchant.name + '<>' + el.batch_number + '<>' + el.manufacturing_date + '<>' + el.code + '<>' + selectedBatch.product.merchant.website
          var object = {
            // trace_code: el.code,
            // batch_number: el.batch_number,
            // manufacturing_date: el.manufacturing_date,
            // status: el.status,
            // created_at: el.created_at_human,
            // nfc: code
            text_field1: 'Text',
            nfc_string: code,
            text_field2: 'en',
            blank: '',
            text_field3: 'no',
            text_field4: 'no',
            text_field5: 'no',
            empty: '',
            status: el.status,
            created_at: el.created_at_human
          }
          exportData.push(object)
        })
        if(exportData.length > 0){
          var csvExporter = new ExportToCsv(options)
          csvExporter.generateCsv(exportData)
        }
      })
    },
    exportData(){
      $('#loading').css({'display': 'block'})
      let options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Trackr',
        useTextFile: false,
        useBom: true,
        // useKeysAsHeaders: true,
        filename: COMMON.APP_NAME + ' - ' + this.date,
        headers: ['trace_code', 'batch_number', 'manufacturing_date', 'status', 'created_at', 'nfc']
      }
      var exportData = []
      if(this.data !== null){
        for (var i = 0; i < this.data.length; i++) {
          let item = this.data[i]
          var code = item.product.title + item.variation[0].payload_value + this.conversion.getUnitsAbbreviation(item.variation[0].payload) + '<>' + item.product.merchant.name + '<>' + item.batch_number + '<>' + item.manufacturing_date + '<>' + item.code + '<>' + item.product.merchant.website
            // this is an export hehe
          if(item.status === 'inactive'){
            var object = {
              trace_code: item.code,
              batch_number: item.batch_number,
              manufacturing_date: item.manufacturing_date,
              status: item.status,
              created_at: item.created_at_human,
              nfc: code
            }
            exportData.push(object)
          }
        }
      }
      if(exportData.length > 0){
        var csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(exportData)
      }
      $('#loading').css({'display': 'none'})
    }
  }
}
</script>
