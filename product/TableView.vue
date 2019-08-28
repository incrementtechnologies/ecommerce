<template>
  <table class="table table-bordered table-hover">
    <thead>
      <tr>
        <td>SKU</td>
        <td>Title</td>
        <td>Tags</td>
        <td>Inventory</td>
        <td>Date</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index" @click="redirect('/product/edit/' + item.code)">
        <td>{{item.sku}}</td>
        <td>{{item.title}}</td>
        <td>{{item.tags}}</td>
        <td>{{item.sku}}</td>
        <td>{{item.created_at_human}}</td>
<!--         <td>
          <label class="text-primary action-link" @click="redirect('/product/edit/' + item.code)">EDIT</label> / 
          <label class="text-danger action-link">DELETE</label>
        </td> -->
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
