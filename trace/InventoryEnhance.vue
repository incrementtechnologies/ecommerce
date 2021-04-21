<template>
    <div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <td>Trace ID</td>
              <td>Batch ID</td>
              <td>Manufacturing Date</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
          <tr v-for="itemI, indexI in data">
            <td>
              {{itemI.code}}
            </td>
            <td>
              {{itemI.batch_number}}
            </td>
            <td>{{itemI.manufacturing_date}}</td>
            <td>
              {{itemI.status}}
            </td>
          </tr>
        </tbody>
        </table>
    </div>
</template>

<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
import COMMON from 'src/common.js'
import Conversion from 'src/services/conversion.js'
export default {
  props: ['inventory'],
  data: () => ({
    data: []
  }),
  methods: {
    hideInventory(){
      this.$emit('hideInventory', false)
    }
  },
  created(){
    let parameter = {
      product_attribute_id: this.inventory.product_attribute_id,
      status: 'active',
      batch_number: this.inventory.batch_number
    }
    console.log('paramter', parameter)
    $('#loading').css({'display': 'block'})
    this.APIRequest('product_traces/retrieve_with_traces', parameter).then(response => {
      $('#loading').css({'display': 'none'})
      console.log('RESPONSE', response.data)
      this.data = response.data
    })
  }
}
</script>

<style>

</style>
