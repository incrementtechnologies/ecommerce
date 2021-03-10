<template>
  <div class="variations-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Variations</label>
      <div><br>
        <select class="form-control form-control-custom"  style="float: left; width: 40%;" v-model="newAttribute.payload" v-if="item.variation === null">
            <option v-for="(item, index) in common.ecommerce.productUnits" :value="item">{{item}}</option>
        </select>
        <input class="form-control form-control-custom"  style="float: left; width: 40%;" :placeholder="`${item.title}(${item.variation[0].payload})`" v-else disabled>
        <input type="number" class="form-control form-control-custom" style="float: left; width: 40%; margin-left: 10px;" placeholder="Type variation value here..." v-model="newAttribute.payload_value" @keyup.enter="create()" :disabled="isEdit===false">
        <i class="fa fa-check mt-2" style="color: #cae166; font-size: 30px;" v-if="newAttribute.payload_value !== null && newAttribute.payload_value !== ''"></i>
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="confirmAdd()" :disabled="isEdit===false"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="variations-content" v-if="item.variation !== null">
      <div class="attribute-item" v-for="itemVariation, indexVariation in item.variation">
        <input class="form-control form-control-custom" style="width: 40%; float: left; margin-right: 10px;" :placeholder="`${item.title}(${itemVariation.payload})`" disabled>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 35%;" placeholder="Type variation value here..." v-model="itemVariation.payload_value" @keyup.enter="update(itemVariation)" disabled>
         <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" disabled>
          {{itemVariation.product_trace_qty}}
        </button>
        <!--  @click="redirect('/traces/' + itemVariation.id + '/' + item.code)" -->
        <!-- <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="update(itemVariation)">
          <i class="fa fa-sync"></i>
        </button> -->
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="addTraces(itemVariation)" title="Add Inventory" :disabled="isEdit===false">Inventory</button>
        <!-- <button class="btn btn-danger form-control-custom" style="margin-left: 10px;" @click="deleteConfirm(itemVariation)">
          <i class="fa fa-trash"></i>
        </button> -->
      </div>
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
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
export default {
  mounted(){
  },
  props: ['item', 'isEdit'],
  data(){
    return {
      user: AUTH.user,
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
      selectedVariation: null
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
    addTraces(variation){
      console.log(variation)
      console.log(this.$refs.addTrace)
      // this.$refs.addTrace.errorMessage = null
      this.productId = this.item.id
      this.selectedVariation = variation
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
