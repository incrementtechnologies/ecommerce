<template>
  <div>
    <div data-backdrop="static" data-keyboard="false" class="modal fade" id="editProductTracesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary">
              <h5 class="modal-title" id="exampleModalLabel">Edit Batch</h5>
              <button type="button" class="close" @click="cancel()" aria-label="Close">
                <span aria-hidden="true" class="text-white">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <span v-if="errorMessage !== null" class="text-danger text-center">
                <label><b>Opps! </b>{{errorMessage}}</label>
              </span>
              <br v-if="errorMessage !== null">
              <br>
              <div v-if="data !== null">
                <div class="form-group">
                  <label for="exampleInputEmail1">Variation Name <b class="text-danger">*</b></label>
                  <input type="text" min="1" class="form-control" :placeholder="`${variations.title} (${variations.variation[0].payload_value} ${convertion.getUnitsAbbreviation(variations.variation[0].payload)})`" disabled>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Manufactured Date <b class="text-danger">*</b></label>
                  <input type="text" min="1" class="form-control" :placeholder="`${data.manufacturing_date}`" disabled>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Batch Number <b class="text-danger">*</b></label>
                  <input type="text" min="1" class="form-control" placeholder="Type qty here..." v-model="data.batch_number" disabled>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Batch Quantity <b class="text-danger">*</b></label>
                  <input type="number" min="1" class="form-control" :placeholder="currQty" v-model="newData.qty">
                </div>
              </div>
              <div  v-if="!showCalc" class="modal-footer">
                <button type="button" class="btn btn-danger mr-auto" @click="$emit('deleteBatch', data)" v-if="data.active_qty === 0">Delete</button>
                <button type="button" class="btn btn-primary" @click="showCalc = true">OK</button>
              </div>
              <span v-if="showCalc && newData.qty > currQty">Add {{newData.qty - currQty}} unit(s) to batch</span>
              <span v-if="showCalc && newData.qty < currQty">Sorry, batch quantity can only be reduced created.</span>
            </div>
            <div class="modal-footer" v-if="showCalc">
              <button type="button" class="btn btn-danger" @click="cancel()">Cancel</button>
              <button type="button" class="btn btn-primary" @click="submit()">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
}

.form-control{
  height: 50px !important;
}
.form-group-three{
  width: 30% !important;
  float: left;
}

.margin-left{
  margin-left: 4%;
}

.margin-right{
  margin-right: 3%;
}

.mx-datepicker,
.mx-input-wrapper {
  width: unset;
  position: unset;
  display: unset;
}


@media (max-width: 991px){
  .form-group-three{
    width: 100% !important;
    float: left;
  }
  .margin-left{
    margin-left: 0%;
  }
  .margin-right{
    margin-left: 0%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import DatePicker from 'vue2-datepicker'
import Convertion from 'src/services/conversion.js'
import 'vue2-datepicker/index.css'
export default {
  mounted(){
    var date = new Date()
    this.manufacturing.year = date.getFullYear()
    this.manufacturing.month = (parseInt(date.getMonth()) + 1)
  },
  data(){
    return {
      user: AUTH.user,
      convertion: Convertion,
      config: CONFIG,
      common: COMMON,
      errorMessage: null,
      manufacturing: {
        date: null,
        month: null,
        year: null
      },
      newData: {
        batch_number: null,
        manufacturing_date: null,
        qty: null,
        product_id: null,
        account_id: null,
        inventory_type: COMMON.ecommerce.inventoryType,
        product_attribute_id: null,
        isEdit: false
      },
      allowDate: false,
      tempQty: null,
      showCalc: false
    }
  },
  components: {
    DatePicker
  },
  props: ['params', 'variations', 'data', 'currQty'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    isCheck(event){
      console.log('[EVENT]', event.target.checked)
      this.allowDate = !this.allowDate
      this.manufacturing.date = event.target.checked === true ? null : this.manufacturing.date
    },
    submit(){
      if(this.validate()){
        this.newData.batch_number = this.data.batch_number
        this.newData.product_id = this.data.product_id
        // this.newData.qty = this.data.total_qty
        this.newData.account_id = this.data.account_id
        this.newData.product_attribute_id = this.data.product_attribute_id
        this.newData.manufacturing_date = this.data.manufacturing_date
        $('#loading').css({'display': 'block'})
        this.APIRequest('product_traces/create', this.newData).then(response => {
          $('#loading').css({'display': 'none'})
          if(response.error.length > 0 && response.error !== null){
            this.errorMessage = response.error
            this.newData.qty = this.data.total_qty
          }
          this.errorMessage = null
          this.showCalc = false
          $('#editProductTracesModal').modal('hide')
          this.$parent.retrieve({'created_at': 'asc'}, {column: 'created_at', value: ''})
        })
      }
    },
    validate(){
      console.log(this.data.total_qty, this.currQty)
      if(this.data.total_qty <= 0 || this.data.total_qty === '' || this.data.total_qty === null){
        this.errorMessage = 'Quantity should not be less than or equal to 0'
        return false
      }else if(this.data.total_qty < this.currQty){
        this.errorMessage = 'Quantity should not be less than to your current qty: ' + this.currQty
        return false
      }
      return true
    },
    cancel(){
      this.errorMessage = null
      this.qty = null
      this.data.total_qty = this.currQty
      this.showCalc = false
      $('#editProductTracesModal').modal('hide')
    }
  }
}
</script>
