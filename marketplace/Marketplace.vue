<template>
<div class="marketplace-holder">
  <div class="banner text-white">
    <h1>Welcome {{user.username}} to Marketplace</h1> 
    <h3>We have all you need.</h3>
    <button class="btn btn-primary btn"@click="redirect('editor/v2')">Want to print something?</button>
  </div>  
    <div class="product-holder">  
      <div class="filter">
        <br></br>
          <div class="input-group">
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
              Sorting
            </button>


              <div class="dropdown-menu">
                <a class="dropdown-item" value="high">Price(highest)</a>
                <a class="dropdown-item" value="low">Price(lowest)</a>
                <!-- <a class="dropdown-item" @click="redirect('editor/v2')">Description(ascending)</a> -->
                <!-- test -->
                <!-- test -->
                <!-- test -->
                <a class="dropdown-item" value="downtop">Description(descending)</a>
              </div>  
            <select class="btn btn-white" v-model="filterValue">
              <option v-for="(item, index) in sort"  :key="index">
                {{item.title}}
              </option>
            </select>
            <input type="text" class="form-control" v-model="searchValue" :placeholder="'Search ' + filterValue + '...'">
          </div>
        <div class="results">
          <products v-if="data !== null" :data="sortedData"></products>
          <dynamic-empty v-if="data === null" :title="'No products yet!'" :action="'Please be back soon.'" :icon="'far fa-smile'" :iconColor="'text-primary'"></dynamic-empty>
          </div>
      </div>
    </div>
  </div>

</template>



<style scoped lang="scss">
@import "~assets/style/colors.scss";
.marketplace-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  margin-bottom: 50px;
}
.banner{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  padding: 20px;
  background: #ffaa81;
}
.product-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
 
}
.listing{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
}
.listing .filter{
  width: 100%;
  float: left;
  height: 50px;
  margin-top: 25px;
}

.form-control{
  height: 40px !important;
}
.input-group{
  margin-bottom: 10px !important;
}
.input-group-addon{
  width: 100px !important;
  background: #22b173 !important;
  color: #fff !important;
}
.input-group-title{
  width: 100px !important;
  background: #028170 !important;
  color: #fff !important;
}

.listing .results{
  width: 100%;
  font-size: left;
  min-height: 10px;
  overflow-y: hidden;
}
#attach-file {
  color: $primary;
  font-size: 7em;
  margin-right: 150p;
}
.modal-body {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.modal-body img {
  width: 40%;
  max-width: 150px;
}
.modal-body img:hover {
  cursor: pointer;
}
.divider {
  border-left: 1px solid rgba(0,0,0,0.2);
  height: 120px;
}
@media (max-width: 992px){
  .modal-body {
    flex-direction: column;
  }
  .divider {
    border-top: 1px solid rgba(0,0,0,0.2);
    width: 120px;
    height:1px;
    margin-bottom: 10px;
  } 
}

.modal-content {
    max-width: 700px;
    margin: 0 auto;
}

.btn-primary {
    background: #22b173;
    border-color: #22b173;
}

select.btn.btn-white {
    border-color: lightgrey;
}

button.btn.btn-primary.dropdown-toggle {
    min-height: 40px;
}
</style>
<script>
import ROUTER from '../../../../router'
import AUTH from '../../../../services/auth'
import CONFIG from '../../../../config.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      searchValue: '',
      filterValue: 'Product',
      sort: [{
        title: 'Product'
      }, {
        title: 'Company'
      }, {
        title: 'Location'
      } ]
    }
  },
  components: {
    'products': require('components/increment/ecommerce/marketplace/Products.vue'),
    'dynamic-empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
      if(parameter === 'editor/v2'){
        AUTH.mode = 1
      }
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: 'published',
          column: 'status',
          clause: '='
        }],
        sort: {
          // 'created_at': 'desc'
          // 'title': 'desc'
        },
        account_id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }
        console.log(this.data)
      })
    },
    attachFile(){
      alert('Attach FILE!')
    },
    attachTemplate(){
      alert('Attach TEMPLATE!')
    }
  },
  computed: {
    sortedData(){
      return this.data.filter(product => {
        if(this.filterValue === 'Product'){
          return (
            product.title.toLowerCase().includes(this.searchValue.toLowerCase())
          )
        }
        if(this.filterValue === 'Company'){
          return (
            product.account.username.toLowerCase().includes(this.searchValue.toLowerCase())
          )
        }
      })
    }
  }
}
</script>
