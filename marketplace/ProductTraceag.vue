<template>
<div class="row p-0 m-0">
  <div class="col-sm-6">
    <div v-if="data !== null" class="">
      <div class="title">
        <br>
        <h3>{{data.title}}</h3>
        <div class="product-row-merchant" v-if="data.merchant !== null">
            <label class="product-row-labels">Merchant:</label>
            <label>&nbsp;{{data.merchant.name}}&nbsp;</label>
            <label class="product-row-labels">SKU:</label>
            <label>&nbsp;{{data.sku}} &nbsp;</label>
            <label class="product-row-labels">Tags:</label>
            <label>&nbsp;{{data.tags}}</label>
            <div class="col-sm-12 product-image">
              <div class="product-image-content">
                <img :src="config.BACKEND_URL + selectedImage" class="main-image mb-2" v-if="imagesList !== null">
                <img :src="config.BACKEND_URL + data.featured[0].url" class="main-image mb-2" v-if="imagesList === null && data.featured !== null">
                <i class="fa fa-image mb-2" v-if="imagesList === null && data.featured === null"></i>
                <div class="images-holder mb-2" v-if="imagesList !== null">
                  <div v-for="(item, index) in imagesList" :key="index" class="image-item" @click="selectImage(item.url)" style="margin-left:5px">
                    <img :src="config.BACKEND_URL + item.url" class="other-image">
                    <div class="overlay"></div>
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
        <span class="p-0" >{{data.description}}...<a @click="seeMore = !seeMore" style="text-decoration:underline;cursor:pointer;">See Less</a></span>
      </div>
      <div v-else>
        <div v-if="data.description.length < 1000">
          <p>{{data.description}}</p>
        </div>
        <div class="p-0" v-if="data.description.length > 1000">
          <span class="p-0" >{{data.description.substring(0,999)}}...<a @click="seeMore = !seeMore" style="text-decoration:underline;cursor:pointer;">See More</a></span>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-sm-5">
        <p><b>Website:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p>{{data.merchant.website}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Shelf Life:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <p>{{data.details.shelf_life}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Active/s:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <ul class="p-0" style="list-style:none;">
          <li v-for="(active, index) in active" :key="index">{{active.active_name}}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Group/s:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color: grey;">
        <ul class="p-0" style="list-style:none;">
          <li v-for="(group, index) in groups" :key="index">{{group.group}}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Approval Date:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p>{{data.details.approval_date}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Approval Number:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p>{{data.details.approval_number}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Formulation:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p>{{data.details.formulation}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Mixing Order:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p>{{data.details.mixing_order}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Other Ingredients:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <p>{{data.details.other_ingredient}}</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-5">
        <p><b>Safety Equipment:</b></p>
      </div>
      <div class="col-sm-7 p-0" style="color:grey;">
        <ul class="p-0" style="list-style:none;">
          <li v-for="(equip, index) in data.details.safety_equipment" :key="index">{{equip}}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-6">
        <p><b>Label:</b></p>
      </div>
      <div class="col-sm-6">
        <p><b>Safety Date (SDS):</b></p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-6">
         <i class="fa fa-file-pdf-o" id="icon" :style="data.details.files.label.title !== null ? 'color: #cae166' : 'color: red'" @click="download('data1')"></i>
          <a :href="config.BACKEND_URL + data.details.files.label.url" id="data1" target="__blank"></a>
          <label>&nbsp;{{data.details.files.label.title}}</label>
      </div>
      <div class="col-sm-6">
        <i class="fa fa-file-pdf-o" id="icon" :style="data.details.files.sds.title !== null ? 'color: #cae166' : 'color: red'" @click="download('data2')"></i>
        <a :href="config.BACKEND_URL + data.details.files.sds.url" id="data2" target="__blank"></a>
        <label>&nbsp;{{data.details.files.sds.title}}</label>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
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
    margin-left:2%;
    float: left;
    min-height: auto;
    overflow-y: hidden;
    text-align: center;
    background: white;
    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
    padding-bottom: 2%;
    padding-top: 2%;
  }
  .product-image-content .main-image{
    height: 350px;
    max-width: 100%;
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
