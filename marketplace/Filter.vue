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
          <!-- make a loop instead of calling repeatedly -->
        <a class="dropdown-item" value="high" v-for="(item, index) in activeCategory" :key="index" @click="changeSort(item)">{{item.title}}</a>
      </div>  
      <input type="text" class="form-control" v-model="searchValue" :placeholder="'Search ' + filterValue + '...'">
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.filter{
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
      SortOrder: '',
      sortData: {
        'title': 'asc'
      },
      activeCategory: null,
      activeSort: null
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
    },
    changeSort(item){
      let object = {}
      object[item.payload] = item.payload_value
      this.$emit('changeSortEvent', object)
    },
    sortHandler(name, val){
      switch(name){
        case 'description': this.sortData = {'description': val}
          break
        case 'title': this.sortData = {'title': val}
          break
        default: this.sortData = {'title': 'asc'}
      }
      console.log(this.sortData)
      this.retrieve()
    }
  }
}
</script>
