<template>
  <div class="filter">
    <div class="input-group">
      <select class="btn btn-primary select-btn" v-model="filterValue" @change="selectCategory">
        <option v-for="(item, index) in category" :value="index" :key="index">
          {{item.title}}
        </option>
      </select>
      <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" v-if="activeCategory !== null">
        Sorting
      </button>
      <div class="dropdown-menu" v-if="activeCategory !== null">
        <a class="dropdown-item" value="high" v-for="(item, index) in activeCategory" :key="index" @click="changeSort(item)">{{item.title}}</a>
      </div>  
      <input type="text" class="form-control" v-model="searchValue" @keypress="keypressHandler" :placeholder="'Search ' + '...'">
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.filter{
  width: 100%;
  float: left;
  height: 50px;
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
.btn{
  border-radius: 0px !important;
  height: 40px !important;
}
.select-btn{
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
}
</style>
<script>
import ROUTER from '../../../../router'
import AUTH from '../../../../services/auth'
import CONFIG from '../../../../config.js'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      searchValue: '',
      filterValue: null,
      sortValue: '',
      title: '',
      payload: '',
      payloadValue: '',
      SortOrder: '',
      sortData: {
        'title': 'asc'
      },
      activeCategory: null,
      activeSort: null,
      itemTemp: {
        'payload': 'title',
        'payload_value': 'asc',
        'title': 'Title ascending'
      }
    }
  },
  props: ['category'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      //
    },
    selectCategory(){
      this.activeSort = null
      this.activeCategory = this.category[this.filterValue].sorting
      this.itemTemp = this.activeCategory
    },
    changeSort(item){
      this.itemTemp = item
      let object = {}
      let filter = {
        column: item.payload,
        value: this.searchValue
      }
      object[item.payload] = item.payload_value
      let parameter = {
        sort: object,
        filter: filter
      }
      this.$emit('changeSortEvent', parameter)
    },
    keypressHandler(event){
      if(event.charCode === 13){
        console.log(this.itemTemp)
        let item = this.itemTemp
        let object = {}
        let filter = {
          column: item.payload,
          value: this.searchValue
        }
        object[item.payload] = item.payloadValue
        let parameter = {
          sort: object,
          filter: filter
        }
        this.$emit('changeSortEvent', parameter)
      }
    }
  }
}
</script>
