<template>
  <div class="variations-holder" v-if="variationData">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" v-if="variationData.variation.length > 0" style="font-weight: 600;">Product Variations</label>
    </div>
    <center v-if="variationData === null"><i class="fa fa-circle-o-notch fa-spin" style="font-size:50px;color:#cae166" ></i><br>Loading</center>
    <div v-if="isEdit === false && variationData.variation.length === 0 || variationData.variation === null">No variation configurations added. Click edit to add a variation configuration.</div>
    <div class="variations-content" v-if="variationData.variation.length > 0">
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
              <tr v-for="(itemVariation, indexVariation) in variationData.variation" :key="indexVariation">
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
                  <!-- <button class="btn btn-primary" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button> -->
                  <button class="btn btn-primary" style="margin-left: 10px;" @click="redirect('/traces/' + itemVariation.id + '/' + item.code)" title="View Batches">View Batches</button>
                  <button v-if="isEdit === true && (itemVariation.total_active_variation === 0 || itemVariation.is_used === false)" class="btn btn-danger btn-sm" style="margin-left: 10px;" @click="addOrDelete(itemVariation, false)" title="Delete Inventory">Delete</button>
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
    <button class="btn btn-primary form-control-custom" data-toggle="collapse" data-target="#demo" v-if="isEdit===true">Create new product variation</button>
    <div class="error text-danger">{{errorMessage1}}</div>
    <div id="demo" class="collapse"><br>
      <div class="table table-borderless">
        <tbody>
          <tr class="pl-0">
            <td class="pl-0">
              <input type="number"  @keydown="filterKey" class="form-control form-control-custom mr-5" placeholder="Type variation value here..." v-model="newAttribute.payload_value" @input="getVariationName($event, 'payload_value') && filterInput" :disabled="isEdit===false">
            </td>
            <td class="pl-0">
              <select class="form-control form-control-custom" v-model="newAttribute.payload" v-if="variationData.variation.length <= 0" :disabled="isEdit===false" @change="getVariationName($event, 'payload')">
                <option selected></option>
                <option v-for="(item, index) in common.ecommerce.productUnits" :value="item" :key="index">{{item}}</option>
              </select>
              <input class="form-control form-control-custom" id="payload" :placeholder="`${item.title}(${convertion.getUnitsAbbreviation(variationData.variation[0].payload)})`" :value="variationData.variation[0].payload" v-else disabled>
            </td>
            <td class="pl-0" id="variationTD">
              <span class="input form-control form-control-custom variationName pt-3" style="background-color:#E9ECEF" aria-disabled="true">{{variationName}}</span>
              <!-- <input style="width:200px" type="text" class="form-control form-control-custom variationName" id="variationName"  placeholder='Variation name' v-model="variationName" disabled> -->
            </td>
            <td class="pl-0 pr-0">
              <button class="btn btn-primary form-control-custom" @click="addOrDelete(null, true)" :disabled="isEdit===false || newAttribute.payload_value < 1 || newAttribute.payload_value === '' "><i class="fa fa-plus p-0"></i></button>
            </td>
          </tr>
        </tbody>
        <label><i>Note: You cannot add variations with decimal</i></label>
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
        ref="confirmationModalVariation"
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
    this.variationName = `${this.item.title} (${this.newAttribute.payload_value}${this.convertion.getUnitsAbbreviation(this.newAttribute.payload)})`
  },
  props: ['item', 'isEdit', 'variationData'],
  data(){
    return {
      user: AUTH.user,
      convertion: Convertion,
      config: CONFIG,
      common: COMMON,
      errorMessage: null,
      errorMessage1: null,
      deletedId: null,
      newAttribute: {
        product_id: this.item.id,
        payload: 'Litres (L)',
        payload_value: ''
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
        this.errorMessage1 = ''
      } else {
        this.deleteVariation()
      }
    },
    addOrDelete(item, bool){
      let input = this.newAttribute.payload_value
      let firstIndex = input && input.length ? parseInt(input[0]) : null
      if(firstIndex && firstIndex > 0){
        bool === true ? this.confirmationMessage = 'Are you sure you want to add this variation?' : this.confirmationMessage = 'Deleting a variation will permanently remove this product and any dependent bundles. Are you sure you want to delete this variation?'
        if(bool === true){
          if(this.newAttribute.payload_value === null || this.newAttribute.payload_value === ''){
            this.errorMessage = 'Fill up the required fields.'
          } else {
            console.log('TESTING', item)
            console.log('TESTING', this.confirmationMessage)
            this.isDelete = false
            let parameter = {
              id: this.newAttribute
            }
            this.$refs.confirmationModalVariation.show(parameter)
          }
        }else {
          this.isDelete = true
          console.log('TESTING----------', item)
          console.log('TESTING', this.confirmationMessage)
          this.toDeleteVariation = item.id
          console.log('id var', this.toDeleteVariation)
          this.$refs.addOrDelete.show()
        }
      }else{
        bool === true ? this.confirmationMessage = 'Are you sure you want to add this variation?' : this.confirmationMessage = 'Deleting a variation will permanently remove this product and any dependent bundles. Are you sure you want to delete this variation?'
        if(bool === false){
          this.isDelete = true
          console.log('TESTING----------', item)
          console.log('TESTING', this.confirmationMessage)
          this.toDeleteVariation = item.id
          this.$refs.confirmationModalVariation.show(item.id)
        }
        console.log('testinggggggggggg', firstIndex)
      }
    },
    getVariationName(event, type){
      if(type === 'payload'){
        this.newAttribute.payload = event.target.value
      }else{
        this.newAttribute.payload_value = event.target.value
      }
      if(this.variationData.variation[0] !== undefined){
        if(this.variationData.variation[0].payload !== null || this.variationData.variation[0].payload !== '' || this.variationData.variation[0].payload !== undefined){
          this.newAttribute.payload = this.variationData.variation[0].payload
          this.errorMessage1 = ''
          this.errorInput = false
        }
      }
      if(this.newAttribute.payload_value % 1 !== 0){
        this.errorMessage1 = 'Variation value should be an integer!'
        this.errorInput = true
        return
      }
      if(this.newAttribute.payload === ' ' || this.newAttribute.payload === null){
        this.variationName = `${this.item.title} (${this.newAttribute.payload_value !== undefined ? this.newAttribute.payload_value : ''})`
        this.errorMessage1 = 'Please choose a product unit!'
        this.errorInput = true
        return
      } else if(this.newAttribute.payload !== null || this.newAttribute.payload !== ''){
        console.log('fsdaf', this.newAttribute.payload)
        this.variationName = `${this.item.title} (${this.newAttribute.payload_value} ${this.newAttribute.payload !== undefined ? this.convertion.getUnitsAbbreviation(this.newAttribute.payload) : ''})`
      } else{
        if(this.variationData.variation[0] !== undefined){
          this.variationName = `${this.item.title} (${this.newAttribute.payload_value} ${this.convertion.getUnitsAbbreviation(this.variationData.variation[0].payload)})`
        }else{
          this.variationName = `${this.item.title} (${this.newAttribute.payload_value})`
        }
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
        this.$parent.retrieveVariation()
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
      console.log('>>>>>>>>', this.variationData.variation)
      if(this.variationData.variation !== null){
        let exist = this.variationData.variation.filter(el => {
          return parseInt(newValue) === parseInt(el.payload_value)
        })
        if(exist.length > 0){
          this.errorMessage = 'Value is already existed in the list'
        }else{
          this.errorMessage = null
        }
      }
    },
    create(){
      if(this.item && this.variationData.variation.length > 0){
        this.newAttribute.payload = this.variationData.variation[0].payload
      }
      if(parseInt(this.newAttribute.payload_value) > 0 && this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== ''){
        this.payloadValueExit(this.newAttribute.payload_value)
        if(this.errorMessage !== null){
          return
        }
        if(this.variationData.variation.length > 0){
          this.newAttribute.payload = $('#payload').val()
        }else{
        }
        console.log('READ IN CREATE', this.newAttribute)
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          console.log('After IN CREATE', this.newAttribute)
          if(response.data !== null){
            this.variationName = this.variationData.title
            this.newAttribute.payload_value = ''
            // this.newAttribute.payload = null
            this.errorMessage = null
            $('#demo').collapse({toggle: false}).collapse('hide')
            this.$parent.retrieveVariation()
          }else if(response.error !== null){
            this.errorMessage = response.error
          }
        })
      }else{
        this.errorMessage = 'Unit Value should be greater than 0'
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
            this.$parent.retrieveVariation()
          }
        })
      }else{
        this.errorMessage = 'Fill up the required fields.'
      }
    },
    filterKey(e){
      const key = e.key
      // If is '-' key, stop it
      if(key === '-'){
        return e.preventDefault()
      }

      if(key === '.'){
        this.errorMessage1 = 'Variation value should be an integer!'
        return e.preventDefault()
      }
      // OPTIONAL
      // If is 'e' key, stop it
      if(key === 'e'){
        return e.preventDefault()
      }
    },
    filterInput(e){
      // This can also prevent copy + paste invalid character
      e.target.value = e.target.value.replace(/[^0-9]+/g, '')
    }
  }
}
</script>
