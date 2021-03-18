<template>
  <div class="variations-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Create Bundled</label>
      <div><br>
        <select class="form-control form-control-custom"  style="float: left; width: 40%;" @change="getAttribute($event)" v-model="selectedVariation" :disabled="isEdit===false">
            <option v-for="itemVariation, indexVariation in item.variation" :value="itemVariation.id" >{{itemVariation.payload}}({{itemVariation.payload_value}})</option>
        </select>
        <input type="number" class="form-control form-control-custom" style="float: left; width: 40%; margin-left: 10px;" placeholder="Qty" v-model="newAttribute.qty" @keyup.enter="create()" :disabled="isEdit===false">
        <i class="fa fa-check mt-2" style="color: #cae166; font-size: 30px;" v-if="newAttribute.product_attribute_id !== null && newAttribute.qty !== null"></i>
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="confirmAdd()" :disabled="isEdit===false"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="variations-content" v-if="item.bundled !== null">
      <div class="attribute-item" v-for="itemVariation, indexVariation in item.bundled[0].variation">
        <input class="form-control form-control-custom" style="width: 40%; float: left; margin-right: 10px;" :placeholder="`${item.bundled[0].qty} X ${item.title}(${itemVariation.payload})`" disabled>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 35%;" :placeholder="item.bundled[0].qty" disabled>
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
        bundled: null,
        product_attribute_id: null,
        qty: null
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
    getAttribute(data){
      this.newAttribute.product_attribute_id = data.target.value
    },
    payloadValueExit(newValue, newAttribute){
      console.log(this.item)
      if(this.item.bundled !== null){
        this.item.bundled.map(el => {
          if(parseInt(newValue) === el.qty && parseInt(newAttribute) === el.product_attribute_id){
            this.errorMessage = 'Value is already existed in the list'
            return true
          }else{
            this.errorMessage = null
            return true
          }
        })
      }
    },
    create(){
      console.log('updateed 18-03-2021 2:16')
      console.log(this.newAttribute.product_attribute_id, this.newAttribute.qty)
      if(this.newAttribute.product_attribute_id !== null && this.newAttribute.qty !== null){
        this.payloadValueExit(this.newAttribute.qty, this.newAttribute.product_attribute_id)
        if(this.errorMessage !== null){
          return
        }
        let parameter = {
          account_id: this.user.userID,
          title: this.item.title,
          description: this.item.description,
          status: 'pending',
          type: 'bundled',
          merchant_id: this.user.subAccount.merchant.id
        }
        $('#loading').css({display: 'block'})
        if(this.item.bundled === null){
          this.APIRequest('products/create', parameter).then(response => {
            $('#loading').css({display: 'none'})
            if(response.data > 0){
              this.newAttribute.bundled = response.data
              this.APIRequest('bundled_settings/create', this.newAttribute).then(response => {
                if(response.data > 0){
                  this.errorMessage = null
                  this.$parent.retrieve()
                }
              })
            }
          })
        }else{
          this.newAttribute.bundled = this.item.id
          this.APIRequest('bundled_settings/create', this.newAttribute).then(response => {
            if(response.data > 0){
              this.errorMessage = null
              this.newAttribute.qty = null
              this.$parent.retrieve()
            }
          })
        }
      }else{
        this.errorMessage = 'Fill up the required fields.'
      }
    },
    confirmAdd(){
      $('#connectionError').modal('show')
    }
  }
}
</script>
