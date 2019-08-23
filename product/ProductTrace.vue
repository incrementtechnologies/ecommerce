<template>
  <div class="inventories-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Stocks</label>
      <div>
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="create()"> Add</button>
        <button class="btn btn-warning form-control-custom" style="margin-left: 10px;" @click="create()"> Import</button>
      </div>
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Available:</label>
      <label v-if="parseInt(item.qty) > 0" class="alert alert-success">{{item.qty}}</label>
      <label v-if="parseInt(item.qty) <= 0" class="alert alert-warning">Out of Stock</label>
    </div>
    <div class="inventories-content" v-if="item.product_traces !== null">
      <table class="table table-bordered">
        <thead>
          <tr>
            <td>Trace ID</td>
            <td>Batch ID</td>
            <td>Manufacturing Date</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itemI, indexI in item.product_traces">
            <td>
              {{itemI.id}}
            </td>
            <td>
              {{itemI.batch_number}}
            </td>
            <td>{{itemI.manufacturing_date}}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-center">
              <button class="btn btn-primary">View More</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.inventories-holder{
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
.inventories-content{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.inventories-content .title{
  height: 50px;
  width: 100%;
  float: left;
  font-weight: 600;
  line-height: 50px;
}
.inventories-item{
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
import ROUTER from '../../../../router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      newItem: {
        product_id: this.item.id,
        qty: null
      }
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    create(){
      if(this.newItem.qty !== null && this.newItem.qty !== '' && isNaN(this.newItem.qty) === false){
        this.APIRequest('product_traces/create', this.newItem).then(response => {
          if(response.data > 0){
            this.newItem.qty = null
            this.errorMessage = null
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Input must be a number greater than 0.'
      }
    },
    deleteItem(item){
      let parameter = {
        id: item.id
      }
      this.APIRequest('product_traces/delete', parameter).then(response => {
        this.$parent.retrieve()
      })
    },
    update(item){
      if(item.qty !== null && item.qty !== '' && isNaN(item.qty) === false){
        this.APIRequest('product_traces/update', item).then(response => {
          if(response.data === true){
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Input must be a number greater than 0.'
      }
    }
  }
}
</script>
