<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <td>Title</td>
          <td>Tags</td>
          <td>Inventory</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type === 'bundled'" title="This is a bundled product"></i>
            {{item.title}}
          </td>
          <td>{{item.tags}}</td>
          <td @click="redirect('/traces/' + item.code)">
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)">{{item.qty}}</button>
          </td>
          <td>
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">EDIT</button>
            <button class="btn btn-warning" @click="showModal('create', item)">Add Inventory</button>
          </td>
        </tr>
      </tbody>
    </table>

    <create-modal :property="createProductTraceModal"></create-modal>
  </div>
</template>
<style>
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
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      createProductTraceModal: ProductTrace
    }
  },
  components: {
    'create-modal': require('components/increment/generic/modal/Modal.vue')
  },
  props: ['data'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    showModal(action, item){
      switch(action){
        case 'create':
          this.createProductTraceModal = {...ProductTrace}
          let inputs = this.createProductTraceModal.inputs
          inputs.map(input => {
            if(input.variable !== 'status'){
              input.value = null
            }else{
              input.value = 'Normal'
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
    retrieve(sort){
      this.$parent.retrieve(null, null)
    }
  }
}
</script>
