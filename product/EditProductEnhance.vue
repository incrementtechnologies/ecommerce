<template>
  <div v-if="data !== null">
    <div class="title">
      <b @click="redirect('/products')">
        <label class="text-primary action-link">Products</label>
      </b>
      <label class="text-primary">/ {{data.title}}</label>
    </div>
    <div class="product-item-holder">
      <div class="product-item-details">
        <div style="float:right;">
          <button class="btn btn-warning" v-if="isEdit === false" @click="redirect('/marketplace/product/' + data.code + '/' + 'preview')" >Preview</button>
          <button class="btn btn-primary" @click="isEdit = true" v-if="isEdit === false">Edit</button>
        </div>
        <div class="product-item-title">
          <label>Title <label class="text-danger">*</label></label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.title" placeholder="Type product title here..." :disabled="data.status === 'published' || isEdit === false">
        </div>
        <div class="product-item-title">
          <label>Description <label class="text-danger">*</label></label>
          <br>
          <textarea class="form-control" rows="20" v-model="data.description" placeholder="Type product description here..." :disabled="data.status === 'published' || isEdit===false"></textarea>
        </div>
        <div v-if="errorMessage !== null">
          <label class="text-danger">Opps! {{errorMessage}}</label>
        </div>
        <div class="product-item-title mb-3">
          <label>Classification</label>
          <br>
         <select class="form-control form-control-custom"  v-model="tempTags" :disabled="data.status !== 'published' && isEdit===false || listGroup.length > 0" @change="tagChecker($event)" v-if="data.tags !== ''">
            <option v-for="(tag, index) in returnTags.TAGS" :key="index" :value="tag" :selected="data.tags === tag ? true : false">{{tag}}</option>
          </select>
          <select class="form-control form-control-custom"  v-model="tempTags" :disabled="data.status !== 'published' || isEdit===false" @change="tagChecker($event)" v-else>
            <option v-for="(tag, index) in returnTags.TAGS" :key="index" :value="tag">{{tag}}</option>
          </select>
        </div>
        <div :hidden="data.status === 'published' || isEdit===false" class="mt-2">
          <div class="product-item-title mt-1" style="width: 90%" >
            <label :hidden="isEdit === false" :style="[]" >Activity Group</label>
            <label class="text-danger">{{errorMessageGroups}}</label>
            <br>
            <select class="form-control form-control-custom"  v-model="group" :hidden="isEdit===false">
              <option v-for="(group, index) in groups" :key="index" :value="group">{{group}}</option>
            </select>
          </div>
          <div class="product-item-title pl-2 pb-0 mt-5 mb-0" style="width: 10%;">
              <button class="btn btn-primary" @click="addGroup" :hidden="isEdit===false"><i class="fa fa-plus"></i></button>
          </div>
        </div>
        <div class="table-responsive">
          <label :hidden="isEdit" style="margin-top: 5%" ><strong style="font-weight: 600;margin-top: -20px !important;">Activity Group</strong></label>      
          <table :class="data.status !== 'published' && isEdit ? 'table table-hover mt-3 table-bordered table-sm w-50' : 'table table-hover mt-3 table-bordered table-sm w-25'" v-if="listGroup.length !== 0 && listGroup !== null">
              <thead>
                  <tr>
                    <td>Group</td>
                    <td v-if="data.status !== 'published' && isEdit ">Action</td>
                  </tr>
              </thead>
              <tbody>
                <tr :style="isEdit === false && data.status || data.status === 'published' ? 'background-color: #E9ECEF' : ''" v-for="(group, index) in listGroup" :key="index">
                  <td v-if="group.group !== null">{{group.group}}</td>
                  <td v-if="data.status !== 'published' && (group.group !== null && isEdit)"><button class="btn" @click="showConfirmationModal(index, 'group')" style="width:20%; background-color: transparent" :disabled="isEdit===false"><i class="fa fa-trash" style="color: red"></i></button></td>
                </tr>
              </tbody>
          </table>
          <div v-else>
            <label v-if="!isEdit">No Groups Available</label>
          </div>
        </div>
        <div v-if="errorMessageHracs !== null && (showHrac === true || (data.tags !== null && data.tags === 'Herbicide') || tags === 'Herbicide')" class="d-flex">
          <label class="mb-0" :style="[data.status !== 'published' || isEdit === false ? { 'margin-bottom': '-20px', 'font-weight': '600'} : { 'margin-bottom': '-20px !important', 'font-weight': '600'}]">HRAC Mode of Action</label>
          <label class="text-danger" style="font-weight: 600;" v-if="errorMessageHracs !== null">&nbsp;&nbsp;{{errorMessageHracs}}</label>
        </div>
        <div v-if="showHrac === true && (tags === 'Herbicide' || data.tags === 'Herbicide')">
          <label class="mb-0" :style="[data.status !== 'published' || isEdit === false ? { 'margin-bottom': '-20px', 'font-weight': '600'} : { 'margin-bottom': '-20px !important', 'font-weight': '600'}]" v-if="errorMessageHracs === null">HRAC Mode of Action</label>
          <div class="mt-0" v-show="data.status !== 'published' && isEdit">
            <div class="product-item-title mt-0" style="width: 90%">
            <select class="form-control form-control-custom" v-model="selectedHracs" :disabled="data.status === 'published' || isEdit===false">
                <option v-for="(el, index) in formulations.HRAC" :key="index" :value="el" >{{el}}</option>
            </select>
            </div>
            <div class="product-item-title pl-3 " style="width: 10%; margin-top: 1%;">
                <button class="btn btn-primary" @click="addHrac" :disabled="data.status === 'published' || isEdit===false"><i class="fa fa-plus"></i></button>
            </div>
          </div>
          <div class="">
            <div v-if="(listOfHracs.length > 0)">
              <table :class="data.status !== 'published' && isEdit ? 'mb-0 table table-hover table-bordered table-sm w-50' : 'mb-0 table table-hover table-bordered table-sm w-25'" style="margin-top: 3% !important;" >
                  <thead>
                      <tr>
                        <td>HRACS</td>
                        <td v-if="data.status !== 'published' && isEdit">Action</td>
                      </tr>
                  </thead>
                  <tbody>
                    <tr :style="isEdit === false && data.status || data.status === 'published' ? 'background-color: #E9ECEF' : ''" v-for="(el, index) in listOfHracs" :key="index">
                      <td>{{el}}</td>
                      <td v-if="data.status !== 'published' && isEdit"><button class="btn" @click="showConfirmationModal(index, 'hrac')" style="width:20%; background-color: transparent" :disabled="isEdit===false"><i class="fa fa-trash" style="color: red"></i></button></td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>
        </div>
        <label v-if="data !== null && data.details.hracs.length === 0 && data.tags === 'Herbicide' && data.status === 'published'">
          No HRAC Available
        </label>
        <div class="row" v-if="data.status !== 'published' && isEdit">
          <div class="product-item-title ml-4" :hidden="data.status === 'published' && isEdit === false" style="margin-bottom:-5%">
            <label class="mb-5">Actives <span class="text-danger">{{errorMessageActives}}</span></label>
          </div>
          <div class="col-sm-3 mb-0 product-item-title" :hidden="data.status === 'published' || isEdit===false">
            <input type="text" class="form-control form-control-custom" v-model="active.active_name" placeholder="Active constituents">
          </div>
          <div class="col-sm-2 pl-0 product-item-title" :hidden="data.status === 'published' || isEdit===false">
            <input
              type="number"
              class="form-control form-control-custom"
              v-model="active.value" 
              @keydown="filterKey" 
              @input="filterInput"
              placeholder="value" >
          </div>
          <div class="col-sm-3 pl-0 ml-0 product-item-title"  :hidden="data.status === 'published' || isEdit===false">
            <select class="form-control form-control-custom" v-model="active.attribute" @change="getValue($event, 'attribute1')">
              <option v-for="(item, index) in formulations.ACTIVE_UNITS1" :style="[active.attribute !== item ? {} : {display: 'none'}]" :value="item" :key="index">{{item}}</option>
            </select>
          </div>
            <div class="col-sm-3 product-item-title"  :hidden="data.status === 'published' || isEdit===false">
            <select class="form-control pl-0 ml-0 form-control-custom" v-model="active.attribute2" @change="getValue($event, 'attribute2')">
              <option v-for="(item, index) in formulations.ACTIVE_UNITS2" :style="[active.attribute2 !== item ? {} : {display: 'none'}]" :value="item" :key="index" >
                {{item}}
              </option>
            </select>
          </div>
          <div class="col-sm-1 product-item-title pl-0" style="margin-top: 3%;" :hidden="data.status === 'published' || isEdit===false"> 
            <button class="btn btn-primary" @click="addActive"><i class="fa fa-plus" ></i></button>
          </div>
        </div>
        <div v-else>
          <label style="margin-top: 1%" ><strong style="font-weight: 600;">Actives</strong></label>
          <p v-if="actives.length === 0">No Actives Available</p>
        </div>
        
        <div class="table-responsive" v-if="actives.length > 0">
          <table class="table table-hover table-bordered table-sm w-50 " style="float: left">
            <thead>
                <tr>
                  <td>Active Constituent</td>
                  <td>Value</td>
                  <td>Attribute</td>
                  <td v-if="data.status !== 'published' && isEdit">Action</td>
                </tr>
            </thead>
              <tbody v-if="actives === null || actives.length > 0">
                <tr :style="isEdit === false && data.status || data.status === 'published' ? 'background-color: #E9ECEF' : ''" v-for="(active, index) in actives" :key="index">
                  <td>{{active.active_name}}</td>
                  <td>{{active.value}}</td>
                  <td>{{conversion.getUnitsAbbreviation(active.attribute)}}/{{conversion.getUnitsAbbreviation(active.attribute2)}}</td>
                  <td v-if="data.status !== 'published' && isEdit"><button class="btn" @click="showConfirmationModal(index, 'active')" style="width:20%; background-color: transparent" :disabled="isEdit===false"><i class="fa fa-trash" style="color: red"></i></button></td>
                </tr>
              </tbody>
          </table>
        </div>
        <div class="product-item-title">
          <label>Solvent (if applicable)</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.details.solvent" placeholder="Solvent" :disabled="data.status === 'published' || isEdit===false">
        </div>
         <div class="product-item-title">
          <label>Other scheduled ingredients</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.details.other_ingredient" placeholder="Other ingredients" :disabled="data.status === 'published' || isEdit===false">
        </div>
         <div class="product-item-title">
          <label>Mixing Order</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.details.mixing_order" placeholder="Type product sku here..." :disabled="data.status === 'published' || isEdit===false">
        </div>
        <div class="product-item-title">
          <label>Formulation</label>
          <br>
          <select class="form-control form-control-custom" v-model="data.details.formulation" :disabled="data.status === 'published' || isEdit===false">
            <option v-for="(formulation, index) in formulations.FORMULATION" :key="index" :value="formulation">{{formulation}}</option>
          </select>
        </div>
        <div class="product-item-title">
          <label>Application Safety Equipment</label>
          <br>
          <div v-if="(!isEdit && data.details.safety_equipment.length <= 0) || (data.details.safety_equipment.length === null && !isEdit) ">
            <p>No safety directions added.</p>
          </div>
          <div v-else>
            <div class="form-check" v-for="(equip, index) in formulations.SAFETY_EQUIPMENTS" :key="index">
              <div v-if="data.status !== 'published'">
                <label class="form-check-label" v-if="isEdit">
                  <input type="checkbox" class="form-check-input" v-model="data.details.safety_equipment" :id="'equipment' + index" :value="equip"><span>{{equip}}</span>
                </label>
                <label class="form-check-label" v-if="data.details.safety_equipment.includes(equip) && !isEdit">
                  <input type="checkbox" class="form-check-input" v-model="data.details.safety_equipment" :id="'equipment' + index" :value="equip" :disabled="!isEdit"><span>{{equip}}</span>
                </label>
              </div>
              <div v-else>
                <label class="form-check-label" v-if="data.details.safety_equipment.includes(equip)">
                  <input type="checkbox" class="form-check-input" v-model="data.details.safety_equipment" :id="'equipment' + index" :value="equip" :disabled="data.status === 'published' || !isEdit"><span>{{equip}}</span>
                </label>
              </div>
            </div>
          </div>
          
        </div>
        <div class="product-item-title">
          <label>Shelf Life</label>
          <br>
          <div class="d-flex">
            <input type="number"
              @keydown="filterKey" 
              @input="filterInput"
              class="form-control form-control-custom"  style="width: 79%;" v-model="data.details.shelf_life" placeholder="Type shelf life" :disabled="data.status === 'published' || isEdit===false">
            <div class="p-2"></div>
            <input type="text" class="form-control form-control-custom" style="width:19%;" placeholder="Month/s" disabled>
          </div>
        </div>
         <div class="product-item-title">
          <label>APVMA Approval number</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.details.approval_number" placeholder="Approval number" :disabled="data.status === 'published' || isEdit===false">
        </div>
         <div class="product-item-title">
          <label>APVMA Approval date</label>
          <br>
          <input type="date" class="form-control form-control-custom" v-model="data.details.approval_date" placeholder="Approval date" :disabled="data.status === 'published' || isEdit===false">
        </div>
        <div class="product-item-title">
          <label>SKU</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.sku" placeholder="Type product sku here..." :disabled="data.status === 'published' || isEdit===false">
        </div>
        <div class="product-item-title">
          <label>Status</label>
          <br>
          <select class="form-control form-control-custom" v-model="data.status" :disabled="data.status === 'published' || isEdit===false">
            <option value="pending">Pending</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div class="product-item-title" v-if="isEdit === true">
          <button class="btn btn-danger" @click="showConfirmationModal(data.id, 'products')" v-if="data.inventories === null && data.product_traces === null && data.status === 'pending'" style="margin-top: 5px;">Delete</button>
          <button class="btn btn-danger pull-right" @click="cancel()" style="margin-right: 2px; margin-top: 5px;">Cancel</button>
          <button class="btn btn-primary pull-right" @click="updateProduct()" style="margin-right: 2px; margin-top: 5px;">Update</button>
        </div>
      </div>
      <images :productImages="data" :isEditing="isEdit"/>
    </div>
    <div class="product-more-details">
      <div class="pagination-holder">
        <ul class="product-menu">
          <li v-for="(item, index) in productMenu" :key="index" v-bind:class="{'menu-active': item.flag === true}" class="" @click="selectMenu(index)">{{item.title}}</li>
        </ul>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Variation'">
        <variations v-if="data.status === 'published'" :item="data" :isEdit="isEdit" :variationData="variationData"></variations>
        <p v-else>You must publish this product before creating variations.</p>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Price'">
        <prices :item="data"></prices>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Inventory'">
        <inventories :item="data" v-if="common.ecommerce.inventoryType === 'inventory'"></inventories>
        <product-trace v-if="common.ecommerce.inventoryType === 'product_trace'" :item="data"></product-trace>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Comment'">
        <product-comments :payloadValue="data.id" :payload="'product'" :load="true"></product-comments>
      </div>

      <div class="details-holder" v-if="selectedMenu.title === 'Bundled Products'">
        <bundled-products v-if="data.status === 'published' && variationData !== null" :item="bundledData" :isEdit="isEdit" :variationData="variationData"></bundled-products>
        <p v-else>Create a product variation before setting bundle configurations.</p>
      </div>

      <div class="details-holder" v-if="selectedMenu.title === 'Documentation'">
        <other-details @file1="getFiles($event, 'file1')" @file2="getFiles($event, 'file2')" v-bind:item="data" :isEditing="isEdit"></other-details>
      </div>
    </div>
    <browse-images-modal></browse-images-modal>
    <confirmation ref="confirmationModal" :title="'Confirmation Message'" :message="confirmationMessage" @onConfirm="removeBySplice($event.id, $event)"></confirmation>
  </div>
</template>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import GROUP from './Group.js'
import Conversion from 'src/services/conversion.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve()
    this.retrieveBundled()
    this.retrieveVariation()
    this.isEdit = false
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      conversion: Conversion,
      sample: [],
      errorMessage: null,
      data: null,
      formulations: GROUP,
      code: this.$route.params.code,
      prevMenuIndex: 0,
      selectedMenu: COMMON.ecommerce.editProductMenu[2],
      selectedImage: null,
      errorMessageActives: null,
      errorMessageGroups: null,
      qty: 1,
      priceFlag: false,
      newImage: {
        product_id: null,
        url: null,
        status: null
      },
      imageStatus: null,
      common: COMMON,
      newAttribute: {
        product_id: null,
        payload: null,
        payload_value: null
      },
      details: {
        group: null,
        solvent: null,
        safety: null,
        formulation: null,
        active: [],
        safety_equipment: [],
        mixing_order: []
      },
      groups: [],
      actives: [],
      active: {
        active_name: null,
        value: null,
        attribute: null,
        attribute2: null
      },
      group: null,
      listGroup: [],
      isEdit: false,
      tags: null,
      showHrac: false,
      selectedHracs: null,
      listOfHracs: [],
      errorMessageHracs: null,
      idxToBeDeleted: null,
      confirmationMessage: null,
      tagName: null,
      bundledData: null,
      variationData: null,
      tempTags: null
    }
  },
  computed: {
    productMenu: function (){
      if(this.data !== null){
        return (this.data.type === 'regular') ? [{title: 'Documentation',
          flag: true}, {title: 'Variation', flag: false}, {
            title: 'Bundled Products',
            flag: false
          }] : COMMON.ecommerce.editProductMenu
      }
    },
    returnTags(){
      return this.formulations
    }
  },
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    'product-comments': require('components/increment/generic/comment/Comments.vue'),
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'variations': require('components/increment/ecommerce/product/Variations.vue'),
    'inventories': require('components/increment/ecommerce/product/Inventories.vue'),
    'product-trace': require('components/increment/ecommerce/product/ProductTrace.vue'),
    'bundled-products': require('components/increment/ecommerce/product/BundledProductsEnhance.vue'),
    'prices': require('components/increment/ecommerce/product/Prices.vue'),
    'confirmation': require('components/increment/generic/modal/Confirmation.vue'),
    'images': require('components/increment/ecommerce/product/Images.vue'),
    'other-details': require('components/increment/ecommerce/product/OtherDetailsEnhance.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    getValue(event, type){
      if(type === 'attribute2'){
        if(event.target.value === 'Gram (g)'){
          let idx = this.formulations.ACTIVE_UNITS1.filter(function(value, index, arr){
            return value !== 'Grams (g)'
          })
          this.formulations.ACTIVE_UNITS1 = idx
        }else{
          // this.formulations.ACTIVE_UNITS1.push('Grams (g)')
        }
      }else{
        if(event.target.value === 'Grams (g)'){
          let idx = this.formulations.ACTIVE_UNITS2.filter(function(value, index, arr){
            return value !== 'Gram (g)'
          })
          this.formulations.ACTIVE_UNITS2 = idx
        }else{
          // this.formulations.ACTIVE_UNITS2.push('Gram (g)')
        }
      }
    },
    selectMenu(index){
      if(this.prevMenuIndex !== index){
        this.productMenu[this.prevMenuIndex].flag = false
        this.productMenu[index].flag = true
        this.prevMenuIndex = index
        this.selectedMenu = this.productMenu[index]
      }
    },
    cancel() {
      this.retrieve()
      this.isEdit = false
    },
    addActive(){
      if((this.active.active_name === null || this.active.active_name === '') || (this.active.value === null || this.active.value <= 0) || this.active.attribute === null || this.active.attribute2 === null){
        this.errorMessageActives = 'Empty fields cannot be added'
        return
      }

      let active = {
        active_name: this.active.active_name,
        value: this.active.value,
        attribute: this.active.attribute,
        attribute2: this.active.attribute2
      }

      if(this.actives.length > 0){
        this.actives.map(el => {
          if(el.active_name === this.active.active_name && el.value === this.active.value && el.attribute === this.active.attribute && el.attribute2 === this.active.attribute2){
            this.errorMessageActives = 'Active is already added'
            return
          }
          if(this.actives.length < 3){
            this.errorMessageActives = null
            this.actives.push(active)
            this.active.active_name = null
            this.active.value = null
            this.active.attribute = null
            this.active.attribute2 = null
            console.log(this.actives)
          }else{
            this.errorMessageActives = 'Active already reach max number(3)'
          }
        })
      }else{
        if(this.actives.length < 3){
          this.actives.push(active)
          this.active.active_name = null
          this.active.value = null
          this.active.attribute = null
          this.active.attribute2 = null
          console.log(this.actives)
        }else{
          this.errorMessageActives = 'Active already reach max number(3)'
        }
      }
      this.actives.map(el => {
        if(el.attribute !== null && el.attribute2 !== null){
          this.formulations.ACTIVE_UNITS1 = [el.attribute]
          this.formulations.ACTIVE_UNITS2 = [el.attribute2]
        }
      })
    },
    addGroup(){
      if(this.group === null || this.group === ''){
        this.errorMessageGroups = 'Empty field cannot be added'
        return
      }
      let group = {
        group: this.group
      }
      if(this.listGroup.length > 0){
        this.listGroup.map(el => {
          if(el.group === this.group){
            this.errorMessageGroups = 'Group is already added'
            return
          }else{
            this.errorMessageGroups = null
            if(this.listGroup.length < 3){
              this.listGroup.push(group)
              this.group = null
            }else{
              this.errorMessageGroups = 'Groups already reach max number(3)'
            }
          }
        })
      }else{
        if(this.listGroup.length < 3){
          this.errorMessageGroups = null
          this.listGroup.push(group)
          this.group = null
        }else{
          this.errorMessageGroups = 'Groups already reach max number(3)'
        }
      }
    },
    addHrac(){
      if(this.selectedHracs === null || this.selectedHracs === ''){
        this.errorMessage = 'Empty field cannot be added'
        return
      }
      if(this.listOfHracs.includes(this.selectedHracs)){
        this.errorMessageHracs = 'HRACS is already existed'
      }else if(this.listOfHracs.length === 3){
        this.errorMessageHracs = 'HRACS already reach max number(3)'
      }else{
        this.listOfHracs.push(this.selectedHracs)
        this.selectedHracs = null
        this.errorMessageHracs = null
      }
    },
    removeBySplice(index){
      console.log(index)
      if(index.array === 'active'){
        this.actives.splice(index.id, 1)
        this.errorMessageActives = null
      }else if(index.array === 'group'){
        this.listGroup.splice(index.id, 1)
        this.errorMessageGroups = null
      }else if(index.array === 'hrac'){
        this.listOfHracs.splice(index.id, 1)
        this.errorMessageHracs = null
      }else{
        this.deleteProduct(index.id)
      }
    },
    showConfirmationModal(id, array){
      let parameter = {
        id: id,
        array: array
      }
      this.confirmationMessage = 'Are you sure you want to delete this ' + array + '?'
      this.$refs.confirmationModal.show(parameter)
    },
    selectImage(url){
      this.selectedImage = url
    },
    samples(data){
      console.log(data)
    },
    getFiles(data, fileNumber){
      if(data !== null){
        if(fileNumber === 'file1'){
          console.log('data1', data)
          console.log('file1', this.data.details)
          this.data.details.files.label.title = data.title
          this.data.details.files.label.url = data.url
          this.updateProduct()
          // this.retrieve()
          // this.isEdit = true
        }else{
          console.log('file2s', this.data.details)
          this.data.details.files.sds.title = data.title
          this.data.details.files.sds.url = data.url
          this.updateProduct()
          // this.retrieve()
          // this.isEdit = true
        }
      }
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.code,
          column: 'code',
          clause: '='
        }],
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        console.log('[DATAS]', response.data)
        if(response.data.length > 0){
          this.data = response.data[0]
          this.tagChecker(null)
          if(this.data.tags === null){
            this.tempTags = null
            this.tags = null
          }else{
            this.tempTags = this.data.tags
          }
          let group = {
            group: null
          }
          if(Array.isArray(this.data.details.group)){
            this.listGroup = this.data.details.group != null ? this.data.details.group : []
          }else{
            group.group = this.data.details.group
            group.group !== null ? this.listGroup.push(group) : this.listGroup = []
            // this.listGroup.push(group.group !== null ? group : null)
          }
          if(Array.isArray(this.data.details.active)){
            if(this.data.details.active[0].active_name !== null){
              if(this.data.details.active[0].attribute2 === undefined){
                this.data.details.active[0]['attribute2'] = null
                this.actives = this.data.details.active
              }
              this.actives = this.data.details.active
              let temp1 = []
              let temp2 = []
              temp1.push(this.data.details.active[0].attribute)
              temp2.push(this.data.details.active[0].attribute2)
              this.formulations.ACTIVE_UNITS1.splice(0, this.formulations.ACTIVE_UNITS1.length, ...temp1)
              this.formulations.ACTIVE_UNITS2.splice(0, this.formulations.ACTIVE_UNITS2.length, ...temp2)
            }else{
              this.actives = []
            }
            console.log('=====================', this.formulations.ACTIVE_UNITS1)
          }else{
            if(this.data.details.active.active_name !== null){
              if(this.data.details.active.attribute2 === undefined || this.data.details.active.attribute2 === null){
                this.data.details.active['attribute2'] = null
                this.actives.push(this.data.details.active)
              }else{
                this.actives.push(this.data.details.active)
                let temp1 = []
                let temp2 = []
                temp1.push(this.data.details.active.attribute)
                temp2.push(this.data.details.active.attribute2)
                this.formulations.ACTIVE_UNITS1.splice(0, this.formulations.ACTIVE_UNITS1.length, ...temp1)
                this.formulations.ACTIVE_UNITS2.splice(0, this.formulations.ACTIVE_UNITS2.length, ...temp2)
              }
            }else{
              this.actives = []
            }
          }
          if(this.data.details.hracs !== undefined){
            this.listOfHracs = this.data.details.hracs
            this.showHrac = true
          }else{
            this.data.details['hracs'] = []
          }
        }
      })
    },
    retrieveFeturedImage(){
      let parameter = {
        condition: [{
          value: this.code,
          column: 'code',
          clause: '='
        }],
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data.featured = response.data[0].featured
        console.log('[DATAS]', response.data)
      })
    },
    retrieveBundled(){
      let parameter = {
        condition: [{
          value: this.code,
          column: 'code',
          clause: '='
        }],
        account_id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve_bundled', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data[0].bundled !== null){
          response.data[0].bundled = response.data[0].bundled.sort(this.getSortOrderBundled('payload_value'))
        }
        this.bundledData = response.data[0]
        console.log('BUNDLED DATA', this.bundledData)
      })
    },
    retrieveVariation(){
      let parameter = {
        condition: [{
          value: this.code,
          column: 'code',
          clause: '='
        }],
        account_id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve_variation', parameter).then(response => {
        $('#loading').css({display: 'none'})
        response.data[0].variation = response.data[0].variation.sort(this.getSortOrder('payload_value'))
        this.variationData = response.data[0]
        console.log('[Variation Data]', this.variationData)
      })
    },
    getSortOrder(prop) {
      return function(a, b) {
        if (a[prop] > b[prop]) {
          return 1
        } else if (a[prop] < b[prop]) {
          return -1
        }
        return 0
      }
    },
    getSortOrderBundled(prop) {
      return function(a, b) {
        if (a.variation[0][prop] > b.variation[0][prop]) {
          return 1
        } else if (a.variation[0][prop] < b.variation[0][prop]) {
          return -1
        }
        return 0
      }
    },
    deleteProduct(id){
      let parameter = {
        id: id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        ROUTER.push('/products')
      })
    },
    tagChecker(data){
      // console.log('[TARGET]', data.target.value)
      console.log('[DATA]', this.data.tags)
      this.tags = data !== null ? data.target.value : this.data.tags !== null
      if(data === null){
        if(this.data.tags === 'Insecticide'){
          this.groups = GROUP.INSECTICIDE
          this.showHrac = false
        }else if(this.data.tags === 'Herbicide'){
          this.groups = GROUP.HERBICIDE
          this.showHrac = true
        }else if(this.data.tags === 'Fungicide'){
          this.groups = GROUP.FUNGICIDE
          this.showHrac = false
        }else if(this.data.tags === 'Other'){
          this.groups = GROUP.ADJUVANT
          this.showHrac = false
        }else{
          this.groups = []
          this.showHrac = false
        }
      }else{
        if(data.target.value.includes('Insecticide')){
          this.groups = GROUP.INSECTICIDE
          this.showHrac = false
        }else if(data.target.value.includes('Herbicide')){
          this.groups = GROUP.HERBICIDE
          this.showHrac = true
        }else if(data.target.value.includes('Fungicide')){
          this.groups = GROUP.FUNGICIDE
          this.showHrac = false
        }else if(data.target.value.includes('Other')){
          this.groups = GROUP.OTHERS
          this.showHrac = false
        }else{
          this.groups = []
          this.showHrac = false
        }
      }
    },
    validate(){
      this.errorMessage = null
      if(this.data.title === null || this.data.title === ''){
        this.errorMessage = 'Title is required.'
        return false
      }
      if(this.data.description === '' || this.data.description === null){
        this.errorMessage = 'Description is required.'
        return false
      }
      if(typeof this.common.ecommerce.productTitleLimit !== undefined && typeof this.common.ecommerce.productTitleLimit !== 'undefined' && this.data.title.length > this.common.ecommerce.productTitleLimit){
        this.errorMessage = 'Product title length should not exceed to ' + this.common.ecommerce.productTitleLimit + ' characters.'
        return false
      }
      if(parseInt(this.data.details.active.value) <= 0 || parseInt(this.data.details.shelf_life) <= 0){
        this.errorMessage = 'Fields should be greater than 0'
        return false
      }
      return true
    },
    updateProduct(){
      if(this.validate() === false){
        return
      }
      if(this.data.details.hrac === undefined){
        this.data.details['hracs'] = this.listOfHracs
      }
      this.data.details.group = this.listGroup
      this.data.details.active = this.actives
      this.data.tags = this.tags
      this.data.details = JSON.stringify(this.data.details)
      console.log(this.data.details)
      $('#loading').css({display: 'block'})
      this.APIRequest('products/update', this.data).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve()
        this.retrieveBundled()
        this.retrieveVariation()
        this.errorMessageHracs = null
        this.isEdit = true
      })
    },
    createAttribute(){
      if(this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== '' && parseInt(this.newAttribute.payload_value) > 0){
        this.newAttribute.product_id = this.data.id
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          if(response.data > 0){
            this.newAttribute.payload_value = null
            this.errorMessage = null
            this.retrieve()
          }
        })
      }else{
        this.retrieve()
      }
    },
    updateAttribute(item){
      if(item.payload_value !== null && item.payload_value !== '' && parseInt(item.payload_value) > 0){
        this.APIRequest('product_attributes/update', item).then(response => {
          if(response.data === true){
            this.retrieve()
          }else{
            this.retrieve()
          }
          this.$router.go(this.$router.currentRoute)
        })
      }else{
        this.retrieve()
      }
    },
    showImages(status){
      this.imageStatus = status
      $('#browseImagesModal').modal('show')
    },
    createPhoto(url){
      if(this.imageStatus === 'featured'){
        this.newImage.status = 'featured'
        if(this.data.featured === null){
          this.newImage.product_id = this.data.id
          this.newImage.url = url
          console.log('new')
          this.createRequest(this.newImage)
        }else{
          console.log('old')
          this.data.featured[0].url = url
          this.updateRequest(this.data.featured[0])
        }
      }else if(this.imageStatus === 'images'){
        this.newImage.status = 'others'
        this.newImage.product_id = this.data.id
        this.newImage.url = url
        console.log(this.newImage)
        this.createRequest(this.newImage)
      }
    },
    createRequest(parameter){
      $('#loading').css({display: 'block'})
      this.APIRequest('product_images/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieveFeturedImage()
      })
    },
    updateRequest(parameter){
      $('#loading').css({display: 'block'})
      this.APIRequest('product_images/update', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieveFeturedImage()
      })
    },
    manageImageUrl(url, status){
      console.log('fsdafs')
      this.imageStatus = status
      this.createPhoto(url)
    },
    removeImage(id){
      let parameter = {
        id: id
      }
      this.APIRequest('product_images/delete', parameter).then(response => {
        this.featured()
        this.selectedImage = null
      })
    },
    filterKey(e){
      const key = e.key
      // If is '.' key, stop it
      if(key === '-'){
        return e.preventDefault()
      }
      // OPTIONAL
      // If is 'e' key, stop it
      if(key === 'e'){
        return e.preventDefault()
      }
    },
    filterInput(e){
      // This can also prevent copy + paste invalid character
      e.target.value = e.target.value.replace(/[^0-9]+/g, '')
    }
  }
}
</script>
<style scoped>
  .title{
    width: 95%;
    float: left;
    margin-left: 2%;
    font-size: 16px;
  }
  .product-item-holder{
    width: 98%;
    float: left;
    margin-left: 2%;
    min-height: 10px;
    overflow-y: hidden;
  }
  .product-image{
    width: 36%;
    float: left;
    margin-left: 2%;
    margin-right: 2%;
    min-height: 410px;
    overflow-y: hidden;
    text-align: center;
  }
  .product-image .main-image{
    height: 350px;
    max-width: 100%;
  }
  .product-image .fa-image{
    font-size: 250px;
    line-height: 350px;
  }
  .product-image .image-item{
    height: 60px;
    float: left;
    width: 80px;
    text-align: center;
  }
  .product-image .other-image{
    height: 60px;
    max-width: 100%;
  }
  .product-image .image-item:hover{
    cursor: pointer;
    background: #ffaa81;
  }
  .images-holder .overlay{
    height: 60px;
    z-index: 2;
    width: 80px;
    margin-top: -60px;
    float: left;
    background: rgba(0, 0, 0, 0);
  }
  .images-holder{
    width: 100%;
    float: left;
    min-height: 60px;
    overflow-y: hidden;
  }
  .product-item-details{
    min-height: 50px;
    width: 60%;
    float: left;
    overflow-y: hidden;
    border: 0px;
  }
  .product-item-title{
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
    margin-top: 15px;
  }
  .product-item-title label{
    font-weight: 600;
  }
  .product-row{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
  }
  .product-row-tags{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-weight: 600;
    line-height: 40px;
  }
  .product-row-rating{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-size: 16px;
    line-height: 40px;
  }
  .product-row label{
    float: left;
    width: 15%;
  }
  .qty-input{
    width: 50px;
    height: 40px;
    float: left;
    border-radius: 5px;
    border: solid 1px #ffaa81;
    text-align: center !important;
  }
  .product-row-tags label{
    float: left;
  }
  .tag-label{
    height: 35px;
    line-height: 35px;
    background: #ffaa81;
    padding-left: 10px;
    padding-right: 10px;
    color: #fff;
    margin-right: 5px;
    border-radius: 5px;
    margin-top: 2px;
  }
  .attribute{
    width: 50px;
    height: 40px;
    float: left;
    border-radius: 5px;
    border: solid 1px #ffaa81;
    margin-right: 5px;
  }
  .attribute:hover{
    cursor: pointer;
  }
  .product-more-details{
    width: 96%;
    float: left;
    margin-bottom: 100px;
    min-height: 50px;
    overflow-y: hidden;
    margin-left: 2%;
    margin-right: 2%;
    border-top: solid 1px #ffaa81;
    margin-top: 25px;
  }
  .product-more-details .details-holder{
    width: 60%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
    margin-top: 25px;
  }

  .product-more-details .details-holder-bundled{
    width: 100%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
    margin-top: 25px;
  }

  .product-menu{
    list-style: none;
    padding: 0px;
    margin: 0;
    width: 60%;
    margin-right: 40%;
    float: left;
    color: #fff;
  }
  .product-menu li{
    height: 50px;
    float: left;
    width: 25%;
    line-height: 50px;
    padding-left: 10px;
    font-weight: 600;
    border-right: solid 1px #fff;
    background: #ffaa81;
  }
  .product-menu li:hover{
    cursor: pointer;
    color: #000;
  }
  .menu-active{
    color: #000;
  }
  .show-prices:hover{
    cursor: pointer;
    color: #ffaa81;
  }
  .form-control-custom{
    height: 50px !important;
  }

  .remove-image{
    position: absolute;
  }

  #featured-image-remove{
    top: 50px;
    right: 5px;
    z-index: 1000;
    font-size: 24px;
  }

  #other-images-remove{
    top: -20px;
    right: 0px;
    z-index: 1000;
    font-size: 18px;
  }

  .remove-image:hover{
    cursor: pointer;
  }

  @media (max-width: 992px){
    .product-item-details, .product-image, .product-more-details .details-holder, .product-menu{
      width: 100%;
    }
  }
</style>
