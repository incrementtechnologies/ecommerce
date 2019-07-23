<template>
  <div class="filter">
    <div class="input-group">
      <select class="btn btn-primary select-btn dropdown" v-model="filterValue" @change="selectCategory">
        <option class="dropdown-title" v-for="(item, index) in category" :value="index" :key="index">
          {{item.title}}
        </option>
      </select>
      <select class="btn btn-warning select-btn dropdown" v-model="sortValue" @change="changeSort" v-if="activeSort !== null">
        <option class="dropdown-title" v-for="(item, index) in activeSort" :value="index" :key="index">
          {{item.title}}
        </option>
      </select>
      <input type="text" class="form-control" v-model="searchValue" @keypress="keypressHandler" :placeholder="'Search ' + '...'">
      <div class="view-option">
       <h3> <i :class="`fa fa-${toggleStyle === true ? 'list' : 'th'}`" @click="changeView()" aria-hidden="true"></i></h3>
      </div>
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
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
@media (max-width: 650px){
  .dropdown {
      width: 20%;
  }
  .dropdown-title {
    font-size: 10px;
  }
}
.view-option{
  i:hover{
    cursor: pointer;
    background: $secondary;
  }
  .fa-list{
    float: right;
    margin-left: 15px;
  }
  .fa-th{
    float: right;
  }
}
</style>
<script>
import ROUTER from '../../../../router'
import AUTH from '../../../../services/auth'
import CONFIG from '../../../../config.js'
import axios from 'axios'
export default {
  mounted(){
    this.activeCategoryIndex = this.activeCategoryIndex !== null ? this.activeCategoryIndex : 0
    this.activeSortingIndex = this.activeSortingIndex !== null ? this.activeSortingIndex : 0
    this.activeCategory = this.category[this.activeCategoryIndex]
    this.activeSort = this.category[this.activeCategoryIndex].sorting
    this.filterValue = this.activeCategoryIndex
    this.sortValue = this.activeSortingIndex
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      searchValue: '',
      filterValue: null,
      sortValue: null,
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
      },
      toggleStyle: false
    }
  },
  props: ['category', 'activeCategoryIndex', 'activeSortingIndex'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      //
    },
    changeView(){
      this.toggleStyle = !this.toggleStyle
      this.$emit('changeStyle', this.toggleStyle)
    },
    selectCategory(){
      this.activeSort = this.category[this.filterValue].sorting
      this.activeCategory = this.category[this.filterValue]
      this.sortValue = 0
    },
    changeSort(){
      let object = {}
      let filter = {
        column: this.activeSort[this.sortValue].payload,
        value: this.searchValue
      }
      object[this.activeSort[this.sortValue].payload] = this.activeSort[this.sortValue].payload_value
      let parameter = {
        sort: object,
        filter: filter
      }
      this.$emit('changeSortEvent', parameter)
    },
    keypressHandler(event){
      if(event.charCode === 13){
       // console.log(this.itemTemp)
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
