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
              <tr v-for="itemVariation, indexVariation in item.variation">
                <td>{{item.title}}({{itemVariation.payload_value}} {{convertion.getUnitsAbbreviation(itemVariation.payload)}})</td>
                <td>{{itemVariation.payload_value}}{{convertion.getUnitsAbbreviation(itemVariation.payload)}}</td>
                <td><button class="btn btn-primary" style="margin-left: 10px;" @click="redirect('/traces/' + itemVariation.id + '/' + item.code)">
                      {{itemVariation.product_trace_qty}}
                    </button>
                </td>
                <td><button class="btn btn-primary" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button></td>
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
        <input type="number" class="form-control form-control-custom" style="float: left; width: 30%; " placeholder="Type variation value here..." v-model="newAttribute.payload_value" @keyup.enter="getVariationName()" :disabled="isEdit===false">
        <select class="form-control form-control-custom"  style="float: left; width: 30%;margin-left: 10px;" v-model="newAttribute.payload" v-if="item.variation === null" :disabled="isEdit===false" @change="getVariationName()">
            <option v-for="(item, index) in common.ecommerce.productUnits" :value="item">{{item}}</option>
        </select>
        <input class="form-control form-control-custom"  style="float: left; width: 30%;margin-left: 10px;" id="payload" :placeholder="`${item.title}(${convertion.getUnitsAbbreviation(item.variation[0].payload)})`" :value="item.variation[0].payload" v-else disabled>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 30%; margin-left: 10px;" placeholder='Variation name' v-model="variationName" disabled>
        <!-- <i class="fa fa-check mt-2" style="color: #cae166; font-size: 30px;" v-if="newAttribute.payload_value !== null && newAttribute.payload_value !== ''"></i> -->
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="confirmAdd()" :disabled="isEdit===false"><i class="fa fa-plus"></i></button>
      </div>
    <Confirmation
        :title="'Confirmation Modal'"
        :message="'Are you sure you want to add this variation?'"
        ref="confirmDelete"
        @onConfirm="create($event)"
        >
    </Confirmation>
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
      variationName: null
    }
  },
  components: {
    Confirmation,
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    'create-product-traces-modal': require('./CreateProductTraces.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    getVariationName(){
      console.log('[VARIATION NAME]', this.newAttribute.payload_value, this.newAttribute.payload)
      if(this.newAttribute.payload !== null){
        this.variationName = `${this.item.title}(${this.newAttribute.payload_value}${this.convertion.getUnitsAbbreviation(this.newAttribute.payload)})`
      }else{
        this.variationName = `${this.item.title}(${this.newAttribute.payload_value}${this.convertion.getUnitsAbbreviation(this.item.variation[0].payload)})`
      }
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
      if(this.item && this.item.variation !== null){
        this.newAttribute.payload = this.item.variation[0].payload
      }
      if(this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== ''){
        this.payloadValueExit(this.newAttribute.payload_value)
        if(this.errorMessage !== null){
          return
        }
        if(this.item.variation !== null){
          this.newAttribute.payload = $('#payload').val()
        }else{
        }
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          if(response.data > 0){
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
