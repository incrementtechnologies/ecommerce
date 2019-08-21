<template>
  <table class="table table-bordered">
    <thead>
      <tr>
        <td>SKU</td>
        <td>Title</td>
        <td>Tags</td>
        <td>Inventory</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td>{{item.sku}}</td>
        <td>{{item.title}}</td>
        <td>{{item.tags}}</td>
        <td>{{item.sku}}</td>
        <td>
          <label class="text-primary action-link">EDIT</label> / 
          <label class="text-danger action-link">DELETE</label>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style>
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG
    }
  },
  props: ['data'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
