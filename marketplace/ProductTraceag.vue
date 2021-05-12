<template>
<div class="row p-0 m-0">
  <div class="col-sm-6 m-0 p-0">
    <div v-if="data !== null" class="">
      <div class="title">
        <i class="fa fa-reply" style="color:#cae166; font-size:20px;cursor:pointer;" title="Back" @click="$router.push('/product/edit/' + $route.params.code)"></i>
        <br>
        <h3>{{data.title}}</h3>
        <div class="product-row-merchant w-100" v-if="data.merchant !== null">
            <label class="product-row-labels">Manufacturer:</label>
            <label style="color:grey;">&nbsp;{{data.merchant.name}}&nbsp;</label>
            <label class="product-row-labels">Classification:</label>
            <label v-if="data.tags !== null || data.tags !== '' " style="color:grey;">&nbsp;{{data.tags}}</label>
            <label v-if="data.tags === null || data.tags === ''" style="color:grey;">&nbsp;No Data</label>
            <div class="col-sm-12 product-image w-100">
              <div class="product-image-content w-100">
                  <img :src="config.BACKEND_URL + selectedImage" class="main-image mb-3" v-if="imagesList !== null">
                  <img :src="config.BACKEND_URL + data.featured[0].url" class="main-image mb-3 " v-if="imagesList === null && data.featured !== null">
                  <div style="margin:auto;">
                    <i class="fa fa-image mb-3" v-if="imagesList === null && data.featured === null"></i>
                  </div>
                <div class="images-holder m-0" style="margin-top: 15%;" v-if="imagesList !== null">
                  <div v-if="imagesList.length < 5" class="d-flex">
                    <div v-for="(item, index) in imagesList" :key="index" class="image-item" @click="selectImage(item.url)">
                      <img
                        :src="config.BACKEND_URL + item.url"
                        :style="[ selectedImage === item.url ? { 'border': '3px solid grey'} : {'border':'1px solid grey'}]"
                        class="other-image"
                      >
                    </div>
                  </div>
                  <div v-else class="scrolling-wrapper">
                    <center>
                      <img v-for="(item, index) in imagesList" 
                        :key="index" 
                        @click="selectImage(item.url)"
                        :src="config.BACKEND_URL + item.url"
                        :style="[{ 'width': '75px', 'height': '75px', 'cursor': 'pointer'}, selectedImage === item.url ? { 'border': '3px solid grey'} : {'border':'1px solid grey'}]"
                        class="images mb-1"
                      />
                    </center>
                    <!-- <div v-for="(item, index) in imagesList" :key="index" class="image-item holder" @click="selectImage(item.url)">
                      <img
                        :src="config.BACKEND_URL + item.url"
                        :style="[ selectedImage === item.url ? { 'border': '3px solid grey'} : {'border':'1px solid grey'}]"
                        class="other-image slide"
                      >
                    </div> -->
                  </div>
                </div>
              </div>
              <div class="product-details">
                <div class="product-title"></div>
                <div class="product-row" v-if="errorMessage !== null">
                  <span class="alert alert-danger">
                    {{errorMessage}}
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div style="margin-top: 12.5%;">
      <div v-if="seeMore">
        <span class="p-0" style="color:grey;">{{data.description}}...<a @click="seeMore = !seeMore" style="text-decoration:underline;cursor:pointer;">See Less</a></span>
      </div>
      <div v-else>
        <div v-if="data.description.length < 300">
          <p style="color:grey;">{{data.description}}</p>
        </div>
        <div class="p-0" v-if="data.description.length > 300">
          <span class="p-0" style="color:grey;">{{data.description.substring(0,299)}}...<a @click="seeMore = !seeMore" style="text-decoration:underline;cursor:pointer;">See More</a></span>
        </div>
      </div>
    </div>
    
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Active/s:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="active.length === 0">No Data</p>
        <ul v-else class="p-0" style="list-style:none;">
          <li v-for="(actives, index) in active" :key="index">
            <div v-if="actives.active_name !== null">
              <span style="padding: 0px 0px 0px 0px;display:flex;">{{actives.active_name}}&nbsp;{{actives.value}}
                <span style="padding: 0px 0px 0px 0px;" v-if="actives.attribute[0] === 'G'">g/</span>
                <span style="padding: 0px 0px 0px 0px;" v-else>mg/</span>
                <span style="padding: 0px 0px 0px 0px;" v-if="actives.attribute2[0] === 'K'">kg</span>
                <span style="padding: 0px 0px 0px 0px;" v-if="actives.attribute2[0] === 'G'">g</span>
                <span style="padding: 0px 0px 0px 0px;" v-if="actives.attribute2[0] === 'L'">L</span>
                <span style="padding: 0px 0px 0px 0px;" v-if="actives.attribute2[0] === 'M'">mL</span>
              </span>
            </div>
            <p v-else>No Data</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Solvent:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.solvent === null || !data.details.solvent">No Data</p>
        <p v-else>{{data.details.solvent}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Other Scheduled Ingredients:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.other_ingredient === null">No Data</p>
        <p v-else>{{data.details.other_ingredient}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Activity Group/s:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="data.details.group === null">No Data</p>
        <ul v-if="data.details.group !== null" class="p-0" style="list-style:none;">
          <li v-for="(group, index) in groups" :key="index">{{group.group}}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-4" v-if="data.tags === 'Herbicide' || data.tags === 'herbicide'">
      <div class="col-sm-5">
        <p><b>HRAC Mode of Action:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
          <li style="list-style: none" v-if="data.details.hracs.length === 0 || data.details.hracs === null">No Data</li>
          <li v-else style="list-style: none" v-for="(hracs, index) in data.details.hracs" :key="index">{{hracs}}</li>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Formulation:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.formulation === null">No Data</p>
        <p v-else>{{data.details.formulation}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Mixing Order:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.mixing_order === null">No Data</p>
        <p v-else>{{data.details.mixing_order}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Safety Equipment:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.safety_equipment === null || data.details.safety_equipment.length === 0">No Data</p>
        <ul v-else class="p-0" style="list-style:none;">
          <li v-for="(equip, index) in data.details.safety_equipment" :key="index">{{equip}}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>APVMA&nbsp;Approval Number:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.approval_number === null">No Data</p>
        <p v-else>{{data.details.approval_number}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>APVMA&nbsp;Approval Date:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p v-if="data.details.approval_date === null">No Data</p>
        <p v-else>{{data.details.approval_date}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Shelf Life:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="data.details.shelf_life === null">No Data</p>
        <p v-else>{{data.details.shelf_life}}&nbsp;Month/s</p>
      </div>
    </div>
    <!-- <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Variations:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="data.variation === null">No Data</p>
        <ul v-else class="p-0" style="list-style:none;">
          <li v-for="(variation, index) in data.variation" :key="index">{{data.title}}-{{variation.payload_value}}&nbsp;{{variation.payload}}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Bundled Products:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="data.bundled === null || data.bundled.length === 0">No Data</p>
        <ul v-else class="p-0" style="list-style:none;">
          <li v-for="(bundle, index) in data.bundled" :key="index">
            {{bundle.qty}}&nbsp;X&nbsp;{{data.title}}{{bundle.variation[0].payload}}-{{bundle.variation[0].payload_value}}
          </li>
        </ul>
      </div>
    </div> -->
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Label:</b></p>
      </div>
      <div class="col-sm-7 pl-0">
        <p><b>Safety Data Sheet (SDS):</b></p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
         <i class="fa fa-file-pdf-o" id="icon" :style="data.details.files.label.title !== null ? 'color: #cae166' : 'color: red'" @click="download('data1')"></i>
          <a :href="config.BACKEND_URL + data.details.files.label.url" id="data1" target="__blank"></a>
          <label v-if="data.details.files.label.title !== null" style="color:grey;">&nbsp;{{data.details.files.label.title}}</label>
          <label v-else style="color:grey;">&nbsp;No uploaded Label file</label>

      </div>
      <div class="col-sm-7 pl-0">
        <i class="fa fa-file-pdf-o" id="icon" :style="data.details.files.sds.title !== null ? 'color: #cae166' : 'color: red'" @click="download('data2')"></i>
        <a :href="config.BACKEND_URL + data.details.files.sds.url" id="data2" target="__blank"></a>
        <label v-if="data.details.files.sds.title !== null" style="color:grey;">&nbsp;{{data.details.files.sds.title}}</label>
        <label v-else style="color:grey;">&nbsp;No uploaded SDS file</label>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-sm-5">
        <p><b>SKU:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="data.sku === null">No Data</p>
        <p v-else>{{data.sku}}</p>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-sm-5">
        <p><b>Website:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p v-if="data.merchant.website === null">No Data</p>
        <p v-else>{{data.merchant.website}}</p>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
  div.scrolling-wrapper {
    overflow-x: scroll;
    white-space: nowrap !important;
    width: 80%;
  }
  div.scrolling-wrapper::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: grey; 
    width: 50px;
  }
  div.scrolling-wrapper::-webkit-scrollbar {
    height: 10px;
    width: 50px;
  }
  .images {
    flex: 0 0 auto;
  }
  .card-header{
    cursor: pointer;
  }
  .card-header:hover{
    background-color: #cae166;
  }
  .card-header.active a:before{
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .card-header a:before{
    content: "\25BC"; /*25B2 */
    float: right;
    transition: all 0.5s;
  }
  ul{
    margin-bottom: 0px;
    padding-left:100px;
    display:inline;
    list-style-type:none;
    /* margin-top: -5%; */
  }
  p{
    display:flex;
  }
  span{
    padding-left:100px;
  }
  #icon{
    font-size: 30px;
    cursor: pointer;
  }
  .title{
    width: 100%;
    float: left;
    font-size: 20px;
  }
  .product-item-holder{
    width: 100%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
  }
  .product-image{
    width: auto;
    float: left;
    min-height: auto;
    overflow-y: hidden;
    text-align: center;
    
  }
  .product-image-content{
    width: auto;
    float: left;
    min-height: auto;
    overflow-y: hidden;
    text-align: center;
    background: white;
    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
    padding-bottom: 2%;
    padding-top: 2%;
    margin-left: -5%;
  }
  .product-image-content .main-image{
    min-height: 500px;
    max-width: 500px;
    width: 100%;
  }

  .holder {
    overflow: visible;
    white-space:nowrap;
}

  .holder .slide {
    display: inline-block;
}


  .product-image-content .fa-image{
    font-size: 250px;
    line-height: 350px;
  }
  .product-image-content .image-item{
    height: 60px;
    float: left;
    width: 80px;
    text-align: center;
  }
  .product-image-content .other-image{
    height: 60px;
    max-width: 80px;
  }
  .product-image-content .image-item:hover{
    cursor: pointer;
    background: #ffaa81;
  }
  .images-holder{
    height: auto;
    z-index: 2;
    width: auto;
    margin-top: -60px;
    float: left;
    background: rgba(0, 0, 0, 0);
  }
  .images-holder{
    width: 100%;
    float: left;
    display:flex;
    text-align:center;
    justify-content: center;
    min-height: 60px;
    overflow-y: hidden;
  }
  .product-row-labels{
    font-weight: 600;
  }
  .product-details{
    min-height: 50px;
    width: 50%;
    margin-left: 5%;
    float: left;
    overflow-y: hidden;
  }
  .product-title{
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
  }
  .product-row{
    width: 100%;
    float: left;
    min-height: 30px;
    overflow-y: hidden;
    font-size: 16px;
    line-height: 50px;
  }

    .product-row-merchant{
    float: left;
    overflow-y: hidden;
    font-size: 14px;
    line-height: 25px;
  }
  .product-row-tags{
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-size: 16px;
    line-height: 50px;
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
    /* width: 5%; */
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 2%;
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
    margin-top: 0px;
    margin-bottom: 0px;
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
    font-weight: 100;
  }
  .attribute{
    width: 50px;
    height: 36px;
    float: left;
    margin-top: 2px;
    margin-bottom: 2px;
    border-radius: 5px;
    margin-right: 5px;
    line-height: 36px;
  }

  .active-color{
    border: solid 2px #ffaa81;
  }

  .attribute-flexible{
    width: auto;
    padding-right: 10px;
    padding-left: 10px;
    border: solid 1px #ffaa81;
  }
  .attribute:hover{
    cursor: pointer;
  }
  .product-more-details{
    width: 100%;
    float: left;
    margin-bottom: 100px;
    min-height: 50px;
    overflow-y: hidden;
    border-top: solid 1px #ffaa81;
    margin-top: 1rem;
  }
  .product-more-details .details-holder{
    width: 60%;
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
  @media (max-width: 991px){
    .product-details, .product-image{
      width: 100%;
    }
    
    .product-menu, .product-more-details .details-holder{
      width: 100%;
    }

  }
  button.btn.btn-primary.two {
    min-width: 133px;
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import CURRENCY from 'src/services/currency.js'
import axios from 'axios'
import COMMON from 'src/common.js'
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
      code: this.$route.params.code,
      status: this.$route.params.status,
      productMenu: [
        {title: 'Details', flag: true},
        {title: 'Other Details', flag: false}
        // {title: 'Supplier', flag: false},
        // {title: 'Shippings', flag: false},
        // {title: 'Reviews', flag: false}
      ],
      prevMenuIndex: 0,
      selectedImage: null,
      qty: 1,
      priceFlag: false,
      activeSize: null,
      activeColor: null,
      currency: CURRENCY,
      productCode: null,
      groups: [],
      active: [],
      transform: false,
      readMoreActive: false,
      seeMore: false,
      imagesList: null
    }
  },
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    'product-comments': require('components/increment/generic/comment/Comments.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    seeMore(){
      this.seeMore = !this.seeMore
    },
    collapsed(id){
      this.transform = !this.transform
      if(this.transform === true){
        $(`#${id}`).addClass('active')
      }else{
        $(`#${id}`).removeClass('active')
      }
    },
    redirectBack(){
      ROUTER.go(-1)
    },
    download(id){
      $(`#${id}`)[0].click()
    },
    selectMenu(index){
      if(this.prevMenuIndex !== index){
        this.productMenu[this.prevMenuIndex].flag = false
        this.productMenu[index].flag = true
        this.prevMenuIndex = index
      }
    },
    selectImage(url){
      this.selectedImage = url
    },
    retrieveImage(){
      this.productId = this.data.id
      const parameter = {
        condition: [{
          value: this.data.account_id,
          column: 'account_id',
          clause: '='
        }],
        sort: {
          created_at: 'desc'
        },
        category: `product${this.data.id}`
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('images/retrieve_with_category', parameter).done(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          console.log('RESPONSE IMAGE', response.data)
          this.imagesList = response.data
          this.selectedImage = this.imagesList[0].url
          console.log('[IMAGE LIST]', this.imagesList)
        }
      })
    },
    retrieve(){
      let parameter = null
      if(this.status === 'preview'){
        parameter = {
          condition: [{
            value: this.code,
            column: 'code',
            clause: '='
          }],
          account_id: this.user.userID,
          inventory_type: COMMON.ecommerce.inventoryType
        }
      }else{
        parameter = {
          condition: [{
            value: 'published',
            column: 'status',
            clause: '='
          }, {
            value: this.code,
            column: 'code',
            clause: '='
          }],
          account_id: this.user.userID,
          inventory_type: COMMON.ecommerce.inventoryType
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          console.log('[DATAS]', response.data)
          this.data = response.data[0]
          let group = {
            group: null
          }
          if(Array.isArray(this.data.details.active)){
            this.active = this.data.details.active
          }else{
            this.active.push(this.data.details.active)
          }
          if(Array.isArray(this.data.details.group)){
            this.groups = this.data.details.group
          }else{
            group.group = this.data.details.group
            this.groups.push(group)
          }
        }
        this.retrieveImage()
      })
    }
  }
}
</script>
