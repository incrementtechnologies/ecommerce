<template>
  <div class="variations-holder">
    <div class="form-group" v-if="item.bundled !== null">
      <label for="exampleInputEmail1" style="font-weight: 600;">Created Bundles</label>
    </div>
    <center v-if="item === null"><i class="fa fa-circle-o-notch fa-spin" style="font-size:50px;color:#cae166"></i><br>Loading</center>
    <div class="variations-content" v-if="item.bundled.length > 0">
      <!-- <div class="attribute-item"> -->
        <div class="table-responsive"> 
          <table class="table table-hover">
            <thead>
              <tr>
                <td><b>Bundled Name</b></td>
                <td><b>Qty</b></td>
                <td v-if="isEdit"><b>Action</b></td>
              </tr>
            </thead>
            <tbody>
              <tr  v-for="(itemVariation, indexVariation) in item.bundled" :key="indexVariation" v-if="itemVariation.variation.length">
                <td>{{`${itemVariation.qty} X ${item.title} (${itemVariation.variation[0].payload_value}${convertion.getUnitsAbbreviation(itemVariation.variation[0].payload)})`}}</td>
                <td>{{itemVariation.scanned_qty}}</td>
                <td v-if="isEdit"><button v-if="itemVariation.scanned_qty === 0 || itemVariation.scanned_qty === null" class="btn btn-danger" @click="addOrDelete(itemVariation, false)" title="Delete Inventory" :disabled="isEdit===false">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      <!-- </div> -->
    </div>
    <div v-if="item.bundled === null && !isEdit">
      <p style="color:black;">No bundle configurations added. Click edit to add a bundle configuration.</p>
    </div>
    <button class="btn btn-primary form-control-custom" data-toggle="collapse" data-target="#demo" v-if="item !== null && isEdit === true">Create new bundle configuration</button>
    <div id="demo" class="collapse">
      <div>
      <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
        <br>
          <select class="form-control form-control-custom"  style="float: left; width: 40%;" @change="getAttribute($event)" v-model="selectedVariation" :disabled="isEdit===false">
              <option v-for="(itemVariation, indexVariation) in variationData.variation" :key="indexVariation" :value="{id: itemVariation.id, payload: itemVariation.payload, payload_value: itemVariation.payload_value}" >{{itemVariation.payload_value}}&nbsp;{{convertion.getUnitsAbbreviation(itemVariation.payload)}}</option>
          </select>
          <input 
            type="number"
            class="form-control form-control-custom"
            style="float: left; width: 40%; margin-left: 10px;"
            placeholder="Qty"
            v-model="newAttribute.qty"
            :disabled="isEdit===false"
            @keyup="getAttribute(null)"
          >
          <i class="fa fa-check mt-2" style="color: #cae166; font-size: 30px;" v-if="newAttribute.product_attribute_id !== null && newAttribute.qty !== null"></i>
          <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="addOrDelete(null, true)" :disabled="isEdit===false"><i class="fa fa-plus"></i></button>
      </div>
      <label><i>Note: Configurations must fit in a single pallet</i></label>
    </div>
    <Confirmation
        :title="'Confirmation Message'"
        :message="confirmationMessage"
        ref="confirmModal"
        @onConfirm="processData($event.id, $event)"
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
import Convertion from 'src/services/conversion.js'
import ProductTrace from './CreateProductTrace.js'
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
export default {
  mounted(){
  },
  props: ['item', 'isEdit', 'variationData'],
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
        bundled: null,
        qty: null,
        product_attribute_id: null
      },
      variantId: null,
      variantPayload: null,
      variantPayloadValue: null,
      createProductTraceModal: ProductTrace,
      productId: this.item.id,
      selectedVariation: null,
      toDeleteBundle: null,
      confirmationMessage: null,
      isDelete: null
    }
  },
  components: {
    Confirmation,
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    'confirmation': require('components/increment/generic/modal/Confirmation.vue'),
    'create-product-traces-modal': require('./CreateProductTraces.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    processData(){
      if(this.isDelete === true){
        this.deleteBundle()
      } else {
        this.create()
      }
    },
    addOrDelete(item, bool){
      console.log(this.item.bundled)
      bool === true ? this.confirmationMessage = 'Are you sure you want to create this new bundle configuration?' : this.confirmationMessage = 'Are you sure you want to delete this bundle configuration?'
      if(bool === true) {
        if(this.selectedVariation !== null && this.newAttribute.qty !== null) {
          this.isDelete = false
          this.$refs.confirmModal.show()
        } else {
          this.errorMessage = 'Fill up the required fields.'
        }
      } else{
        this.toDeleteBundle = item
        this.isDelete = true
        this.$refs.confirmModal.show()
      }
    },
    deleteBundle(){
      console.log('[ID TO DELETE]', this.toDeleteBundle)
      let bundleSetting = {
        id: this.toDeleteBundle.id,
        bundled: this.toDeleteBundle.bundled
      }
      let product = {
        id: this.toDeleteBundle.bundled
      }
      let attribute = {
        id: this.toDeleteBundle.product_attribute_id
      }
      this.APIRequest('products/delete', product).then(response => {
        this.APIRequest('bundled_settings/delete', bundleSetting).then(response => {})
        this.APIRequest('product_attributes/delete', attribute).then(response => {
          return this.$parent.retrieveBundled()
        })
        return this.$parent.retrieveBundled()
      })

    },
    create(){
      console.log('item', this.item)
      console.log(this.newAttribute.product_attribute_id, this.newAttribute.qty)
      this.payloadValueExit(this.newAttribute.qty, this.variantPayload, this.variantPayloadValue)
      if(this.errorMessage !== null){
        return
      }else{
        let parameter = {
          account_id: this.user.userID,
          title: `${this.newAttribute.qty} X ${this.item.title}(${this.convertion.getUnitsAbbreviation(this.variantPayload)}${this.variantPayloadValue})`,
          description: this.item.description,
          status: 'pending',
          type: 'bundled',
          merchant_id: this.user.subAccount.merchant.id
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('products/create', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data > 0){
            let varParams = {
              payload: this.variantPayload,
              payload_value: this.variantPayloadValue,
              product_id: response.data
            }
            this.APIRequest('product_attributes/create', varParams).then(res => {
              this.newAttribute.product_attribute_id = this.item.variation.id
              this.newAttribute.bundled = response.data
              this.APIRequest('bundled_settings/create', this.newAttribute).then(response => {
                // this.$parent.retrieve()
                if(response.data > 0){
                  this.errorMessage = null
                  // this.variantId = null
                  // this.variantPayload = null
                  // this.variantPayloadValue = null
                  this.selectedVariation = null
                  this.newAttribute.qty = null
                  this.$parent.retrieveBundled()
                }
              })
            })
            this.$parent.retrieveBundled()
          }
        })
      }
    },
    getAttribute(data){
      this.variantId = this.selectedVariation.id
      this.variantPayload = this.selectedVariation.payload
      this.variantPayloadValue = this.selectedVariation.payload_value
    },
    payloadValueExit(newValue, payload, payloadValue){
      console.log(this.item)
      if(this.item.bundled !== null){
        this.item.bundled.map(el => {
          if(el.variation !== null){
            el.variation.map(each => {
              if(parseInt(newValue) === el.qty || (each.payload === payload && each.payload_value === payloadValue)){
                this.errorMessage = 'Value is already existed in the list'
                return true
              }else{
                this.errorMessage = null
                return false
              }
            })
          }
        })
      }
    },
    // create(){
    //   console.log('updateed 18-03-2021 2:16')
    //   console.log(this.newAttribute.product_attribute_id, this.newAttribute.qty)
    //   if(this.selectedVariation !== null && this.newAttribute.qty !== null){
    //     this.payloadValueExit(this.newAttribute.qty, this.variantPayload, this.variantPayloadValue)
    //     if(this.errorMessage !== null){
    //       return
    //     }
    //     let parameter = {
    //       account_id: this.user.userID,
    //       title: `${this.newAttribute.qty} X ${this.item.title}(${this.variantPayloadValue}${this.convertion.getUnitsAbbreviation(this.variantPayload)})`,
    //       description: this.item.description,
    //       status: 'pending',
    //       type: 'bundled',
    //       merchant_id: this.user.subAccount.merchant.id
    //     }
    //     $('#loading').css({display: 'block'})
    //     this.APIRequest('products/create', parameter).then(response => {
    //       $('#loading').css({display: 'none'})
    //       if(response.data > 0){
    //         let varParams = {
    //           payload: this.variantPayload,
    //           payload_value: this.variantPayloadValue,
    //           product_id: response.data
    //         }
    //         this.APIRequest('product_attributes/create', varParams).then(res => {
    //           this.newAttribute.product_attribute_id = res.data
    //           this.newAttribute.bundled = response.data
    //           this.APIRequest('bundled_settings/create', this.newAttribute).then(response => {
    //             this.$parent.retrieve()
    //             if(response.data > 0){
    //               this.errorMessage = null
    //               // this.variantId = null
    //               // this.variantPayload = null
    //               // this.variantPayloadValue = null
    //               this.selectedVariation = null
    //               this.newAttribute.qty = null
    //               // this.$parent.retrieve()
    //             }
    //           })
    //         })
    //       }
    //     })
    //   }else{
    //     this.errorMessage = 'Fill up the required fields.'
    //   }
    // },
    confirmAdd(){
      $('#connectionError').modal('show')
    }
  }
}
</script>
