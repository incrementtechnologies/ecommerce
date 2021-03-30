<template>
  <div class="variations-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Product Variations</label>
    </div>
    <div class="variations-content" v-if="item.variation !== null">
      <!-- <div class="attribute-item"> -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <td><b>Product Name</b></td>
                <td><b>Size</b></td>
                <td><b>Available</b></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(itemVariation, indexVariation) in item.variation" :key="indexVariation">
                <td>{{item.title}}&nbsp;({{itemVariation.payload_value}} {{convertion.getUnitsAbbreviation(itemVariation.payload)}})</td>
                <td>{{itemVariation.payload_value}}{{convertion.getUnitsAbbreviation(itemVariation.payload)}}</td>
                <td><button class="btn btn-primary" style="margin-left: 10px;" @click="redirect('/traces/' + itemVariation.id + '/' + item.code)" disabled>
                      {{itemVariation.product_trace_qty}}
                    </button>
                </td>
                <!-- <td> -->
                  <!-- <button class="btn btn-primary btn-sm" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button> -->
                  <!-- </td> -->
                <!-- <td><button class="btn btn-primary" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button></td> -->
                <td>
                  <button class="btn btn-primary" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button>
                  <!-- <button class="btn btn-primary" style="margin-left: 10px;" @click="redirect('/traces/' + itemVariation.id + '/' + item.code)" title="View Batches">View Batches</button></td> -->
                  <button v-if="itemVariation.product_trace_qty === 0 || itemVariation.product_trace_qty === null" class="btn btn-danger btn-sm" style="margin-left: 10px;" @click="addOrDelete(itemVariation, false)" title="Delete Inventory" :disabled="isEdit===false">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <input class="form-control form-control-custom" style="width: 40%; float: left; margin-right: 10px;" :placeholder="`${item.title}-${itemVariation.payload_value}${itemVariation.payload.substring(itemVariation.payload.lastIndexOf('s') + 1)}`" disabled>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 35%;" placeholder="Type variation value here..." v-model="itemVariation.payload_value" @keyup.enter="update(itemVariation)" disabled>
         <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" disabled>
          {{itemVariation.product_trace_qty}}
        </button> -->
        <!--  @click="redirect('/traces/' + itemVariation.id + '/' + item.code)" -->
        <!-- <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="update(itemVariation)">
          <i class="fa fa-sync"></i>
        </button> -->
        <!-- <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button> -->
        <!-- <button class="btn btn-danger form-control-custom" style="margin-left: 10px;" @click="deleteConfirm(itemVariation)">
          <i class="fa fa-trash"></i>
        </button> -->
      <!-- </div> -->
    </div>
    <button class="btn btn-primary form-control-custom" data-toggle="collapse" data-target="#demo">Create new product variation</button>
    <div id="demo" class="collapse"><br>
      <div class="table table-borderless">
        <tbody>
          <tr class="pl-0">
            <td>
              <input type="number" class="form-control form-control-custom" placeholder="Type variation value here..." v-model="newAttribute.payload_value" @keyup.enter="getVariationName()" :disabled="isEdit===false">
            </td>
            <td class="pl-0">
              <select class="form-control form-control-custom" v-model="newAttribute.payload" v-if="item.variation === null" :disabled="isEdit===false" @change="getVariationName()">
                  <option v-for="(item, index) in common.ecommerce.productUnits" :value="item" :key="index">{{item}}</option>
              </select>
              <input class="form-control form-control-custom" id="payload" :placeholder="`${item.title}(${convertion.getUnitsAbbreviation(item.variation[0].payload)})`" :value="item.variation[0].payload" v-else disabled>
            </td>
            <td class="pl-0">
              <input type="text" class="form-control form-control-custom"  placeholder='Variation name' v-model="variationName" disabled>
            </td>
            <td class="pl-0 pr-0">
              <button class="btn btn-primary form-control-custom" @click="addOrDelete(null, true)" :disabled="isEdit===false"><i class="fa fa-plus p-0"></i></button>
            </td>
          </tr>
        </tbody>
      </div>
        <!-- <input type="number" class="form-control form-control-custom" style="float: left; width: 30%; " placeholder="Type variation value here..." v-model="newAttribute.payload_value" @keyup.enter="getVariationName()" :disabled="isEdit===false">
        <select class="form-control form-control-custom"  style="float: left; width: 30%;margin-left: 10px;" v-model="newAttribute.payload" v-if="item.variation === null" :disabled="isEdit===false" @change="getVariationName()">
            <option v-for="(item, index) in common.ecommerce.productUnits" :value="item" :key="index">{{item}}</option>
        </select>
        <input class="form-control form-control-custom"  style="float: left; width: 30%;margin-left: 10px;" id="payload" :placeholder="`${item.title}(${convertion.getUnitsAbbreviation(item.variation[0].payload)})`" :value="item.variation[0].payload" v-else disabled>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 30%; margin-left: 10px;" placeholder='Variation name' v-model="variationName" disabled> -->
        <!-- <i class="fa fa-check mt-2" style="color: #cae166; font-size: 30px;" v-if="newAttribute.payload_value !== null && newAttribute.payload_value !== ''"></i> -->
        <!-- <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="confirmAdd()" :disabled="isEdit===false"><i class="fa fa-plus"></i></button> -->
    </div>
    <Confirmation
        :title="'Confirmation Modal'"
        :message="confirmationMessage"
        ref="confirmationModal"
        @onConfirm="processData($event)"
      />
    <create-modal :property="createProductTraceModal"></create-modal>
    <create-product-traces-modal ref="addTrace" :params="productId" :variations="selectedVariation"></create-product-traces-modal>
  </div>
</template>
<style scoped>
.variations-holder{
  width: 100%;
  float: left;
  min-height: 100px;
  overflow-y: hidden;
}
.error{
  width: 100%;
  float: left;
  line-height: 50px;
}
.variations-content{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.variations-content .title{
  height: 50px;
  width: 100%;
  float: left;
  font-weight: 600;
  line-height: 50px;
}
.attribute-item{
  width: 100%;
  float: left;
  height: 50px;
  margin-bottom: 15px;
}
.form-control-custom{
  height: 50px !important;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import axios from 'axios'
import ProductTrace from './CreateProductTrace.js'
import Convertion from 'src/services/conversion.js'
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
export default {
  mounted(){
  },
  props: ['item', 'isEdit'],
  data(){
    return {
      user: AUTH.user,
      convertion: Convertion,
      config: CONFIG,
      common: COMMON,
      errorMessage: null,
      deletedId: null,
      newAttribute: {
        product_id: this.item.id,
        payload: null,
        payload_value: null
      },
      createProductTraceModal: ProductTrace,
      productId: this.item.id,
      selectedVariation: null,
      variationName: null,
      confirmationMessage: null,
      toDeleteVariation: null,
      isDelete: null
    }
  },
  components: {
    Confirmation,
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    'create-product-traces-modal': require('./CreateProductTraces.vue'),
    'confirmation': require('components/increment/generic/modal/Confirmation.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    processData(event){
      if(this.isDelete === false){
        this.create()
        console.log('Reading in create')
      } else {
        this.deleteVariation()
      }
    },
    addOrDelete(item, bool){
      bool === true ? this.confirmationMessage = 'Are you sure you want to add this variation?' : this.confirmationMessage = 'Are you sure you want to delete this variation?'
      if(bool === true){
        if(this.newAttribute.payload_value === null || this.newAttribute.payload_value === ''){
          this.errorMessage = 'Fill up the required fields.'
        }else {
          console.log('TESTING', item)
          console.log('TESTING', this.confirmationMessage)
          this.isDelete = false
          let parameter = {
            id: this.newAttribute
          }
          this.$refs.confirmationModal.show(parameter)
        }
      } else {
        this.isDelete = true
        console.log('TESTING', item)
        console.log('TESTING', this.confirmationMessage)
        this.toDeleteVariation = item.id
        this.$refs.confirmationModal.show()
      }
    },
    getVariationName(){
      console.log('[VARIATION NAME]', this.newAttribute.payload_value, this.newAttribute.payload)
      if(this.newAttribute.payload !== null){
        this.variationName = `${this.item.title} (${this.newAttribute.payload_value}${this.convertion.getUnitsAbbreviation(this.newAttribute.payload)})`
      }else{
        this.variationName = `${this.item.title} (${this.newAttribute.payload_value}${this.convertion.getUnitsAbbreviation(this.item.variation[0].payload)})`
      }
    },
    deleteVariation(){
      let parameter = {
        id: this.toDeleteVariation
      }
      console.log(parameter)
      $('#loading').css({display: 'block'})
      this.APIRequest('product_attributes/delete', parameter).then(response => {
        console.log('[Response]', response.data)
        $('#loading').css({display: 'none'})
        this.$parent.retrieve()
      })
    },
    addTraces(variation){
      console.log(variation)
      console.log(this.$refs.addTrace)
      // this.$refs.addTrace.errorMessage = null
      this.productId = this.item.id
      let fullVariation = {
        variation: variation,
        product: this.item.title
      }
      console.log(fullVariation)
      this.selectedVariation = fullVariation
      setTimeout(() => {
        $('#createProductTracesModal').modal('show')
      }, 100)
    },
    payloadValueExit(newValue){
      console.log(this.item)
      if(this.item.variation !== null){
        this.item.variation.map(el => {
          if(parseInt(newValue) === parseInt(el.payload_value)){
            this.errorMessage = 'Value is already existed in the list'
            return true
          }else{
            this.errorMessage = null
            return false
          }
        })
      }
    },
    create(){
      if(this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== ''){
        this.payloadValueExit(this.newAttribute.payload_value)
        if(this.errorMessage !== null){
          return
        }
        if(this.item.variation !== null){
          this.newAttribute.payload = $('#payload').val()
        }else{
        }
        console.log('READ IN CREATE')
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          if(response.data > 0){
            this.variationName = ''
            this.newAttribute.payload_value = null
            this.errorMessage = null
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Fill up the required fields.'
      }
    },
    confirmAdd(){
      $('#connectionError').modal('show')
    },
    update(item){
      if(item.payload_value !== null && item.payload_value !== ''){
        this.APIRequest('product_attributes/update', item).then(response => {
          if(response.data === true){
            this.errorMessage = null
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Fill up the required fields.'
      }
    }
  }
}
</script>
