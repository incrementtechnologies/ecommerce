<template>
  <div class="product-image" style="position: relative;">
        <div class="product-row" style="text-align: left !important;">
          <label style="width: 100%">
            <label style="width: 70%">Featured Image</label>
            <!-- <button class="btn btn-primary pull-right" @click="showImages('featured')">Select</button> -->
          </label>
        </div>
        <img :src="config.BACKEND_URL + selectedImage" class="main-image" v-if="selectedImage !== null">
        <img :src="`${config.BACKEND_URL}${data.featured !== null  ? data.featured[0].url : null}`" class="main-image" v-if="selectedImage === null && data.featured !== null">
        <i class="fa fa-image" v-if="selectedImage === null && data.featured === null"></i>
        <label class="remove-image text-danger" id="featured-image-remove" @click="removeImage(data.featured !== null ? data.featured[0].id : null)" v-if="selectedImage === null && data.featured !== null">
          <i class="fa fa-times" :hidden="isEditing===false"></i>
        </label>
       <div class="images-holder">
        <div class="product-row" style="text-align: left !important;">
          <label style="width: 100%">
            <label style="width: 20%">Other Images</label>
            <!-- <button class="btn btn-primary pull-right" @click="showImages('images')">Select</button> -->
            <label v-if="hasError === true" style="color: red;font-size:10px;width: 20%">Image already existed</label>
          </label>
        </div>
        <div>
          <div class="other-image">
          </div>
           <!-- <div class="row"> -->
             <div class="scrolling-wrapper d-flex" style="height: 150px">
               <div style="height:100px !important;width:100px !important; border:2px solid gray" id="imageCont" @click="addImage()" :hidden="isEditing===false">
                 <i class="fa fa-plus plusIcon" style="font-size:40px;padding:10px; vertical-align:middle;margin-top: 20px;margin-right:1%"></i>
                 <input type="file" id="Image" accept="image/*" @change="setUpFileUpload($event)">
                 <!-- <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfTMy2AHYJpPh-4Eojkm_s5QX6_emLxwfZeg&usqp=CAU" style="width:100px;height:100px;border:2px solid black"> -->
               </div>
              <div  v-for="item in returnImageList" :key="item.id" :group="item" style="height:100px;width:100px" :class="isEditing===false ? null : 'imageContainer p-10'">
                  <img :src="config.BACKEND_URL + item.url" class="image" @click="selectImage(item.url)">
                  <label class="middle"  @click="deleteImage(item.id)" v-if="item.status !== 'featured'">
                    <i class="fa fa-times-circle text" :hidden="isEditing===false"></i>
                  </label>
                  <div v-if="data.featured !== null">
                    <p style="position:relative;font-weight:bold" :class="{'ImageLabel': item.url !== data.featured[0].url}"><i class="fa fa-check" style="color: #cae166"></i> Featured</p>
                  </div>
              </div>
             <!-- </div> -->
           </div>
           <div style="float:right">
            <button class="btn btn-danger" @click="cancel()" :hidden="isEditing===false">Cancel</button>
            <button class="btn btn-primary" @click="apply()" :hidden="isEditing===false">Apply</button>
           </div>
        </div>
       </div>
      </div>
</template>

<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import Image from '../../generic/modal/Image.vue'
import axios from 'axios'
export default {
  components: { Image },
  props: ['data', 'isEditing'],
  data: () => ({
    user: AUTH.user,
    config: CONFIG,
    common: COMMON,
    selectedImage: null,
    imagesList: [],
    errorMessage: null,
    idImage: null,
    file: null,
    productId: null,
    hasError: false
  }),
  mounted(){
    this.retrieveImage()
    if(this.imagesList.length > 0){
      this.imagesList.map(el => {
        console.log('true')
        if(el.id === this.data.featured[0].id){
          $(`.${el.id}image`).removeAttr('hidden')
        }
      })
    }
  },
  computed: {
    returnImageList(){
      return this.imagesList
    }
  },
  methods: {
    addImage(){
      $('#Image')[0].click()
    },
    selectImage(url){
      this.selectedImage = url
    },
    apply(){
      this.$parent.manageImageUrl(this.selectedImage, 'featured')
    },
    cancel(){
      this.retrieveImage()
      this.$parent.retrieve()
      this.selectedImage = null
    },
    setUpFileUpload(event){
      let files = event.target.files || event.dataTransfer.files
      console.log(files)
      if(!files.length){
        return false
      }else{
        this.file = files[0]
        console.log('fdsafdsf', this.file)
        let filename = this.file.name.toLowerCase()
        if(filename.substring(filename.lastIndexOf('.')) === '.png' || filename.substring(filename.lastIndexOf('.')) === '.jpg' || filename.substring(filename.lastIndexOf('.')) === '.jpeg' || filename.substring(filename.lastIndexOf('.')) === '.gif' || filename.substring(filename.lastIndexOf('.')) === '.tif' || filename.substring(filename.lastIndexOf('.')) === '.bmp'){
          this.createFile(files[0])
        }else{
          this.errorMessage = 'Upload images only!'
          this.file = null
        }
      }
    },
    createFile(file){
      let fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      this.upload()
    },
    upload(){
      console.log('upload', this.productId)
      if(parseInt(this.file.size / 1024) > 1024){
        this.errorMessage = 'Allowed size is up to 1 MB only'
        this.file = null
        return
      }
      console.log('fdsfadsfds', this.file.name)
      this.validateImage(this.file.name)
      if(this.hasError === true){
        return
      }
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('file_url', this.file.name.replace(' ', '_'))
      formData.append('account_id', this.user.userID)
      formData.append('category', `product${this.productId}`)
      $('#loading').css({'display': 'block'})
      console.log('imageRoute', formData)
      axios.post(this.config.BACKEND_URL + '/images/upload?token=' + AUTH.tokenData.token, formData).then(response => {
        $('#loading').css({'display': 'none'})
        this.hasError = false
        this.retrieveImage()
        this.$parent.retrieve()
        if(response.data.data !== null){
          this.retrieveImage()
          this.$parent.retrieve()
        }
      })
      this.prevIndex = null
    },
    removeImage(id){
      let parameter = {
        id: id
      }
      this.APIRequest('product_images/delete', parameter).then(response => {
        this.retrieveImage()
        this.$parent.retrieve()
        this.selectedImage = null
      })
    },
    deleteImage(id){
      let params = {
        id: id
      }
      $('#loading').css({display: 'block'})
      axios.post(this.config.BACKEND_URL + '/images/delete?token=' + AUTH.tokenData.token, params).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieveImage()
        this.$parent.retrieve()
      })
    },
    retrieveImage(){
      this.productId = this.data.id
      const parameter = {
        condition: [{
          value: this.user.userID,
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
          this.imagesList = response.data
          this.filteredData = response.data
        }else{
          this.data = null
          this.filteredData = null
        }
      })
    },
    validateImage(imageName){
      this.imagesList.map(el => {
        console.log('efdsafdsfsd', el)
        let name = el.url.substring(el.url.lastIndexOf('_') + 1)
        if(imageName === name){
          this.hasError = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .ImageLabel{
      display: none;
    }
    .row:after {
      content: "";
      display: table;
      clear: both;
    }
    /* Six columns side by side */
    .column {
      float: left;
      width: 16.66%;
    }
    .scrolling-wrapper {
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      position: relative;
      .demo {
        display: inline-block;
      }
    }
    #imageCont:hover{
      background-color: #cae166;
      cursor: pointer;
    }
    ::-webkit-scrollbar-thumb{
      background: #555;
      width: 10px;
      height: 10px;
    }
    #imageCont:active, #imageCont:focus{
      cursor: pointer;
      color: #a3c026;
    }
    .image{
      width:100px;
      height:100px;
      transition: .5s ease; 
      backface-visibility: hidden;
      opacity: 1;
    }
    .imageContainer .image{
      // margin-left: 20px;
    }
    .imageContainer:hover .image {
      opacity: 0.3;
      background: #ffaa81;
      display: block;
    }
    .imageContainer:hover .middle {
      opacity: 1;
    }

    .imageContainer:hover .ImageLabel {
      opacity: 1;
      position: absolute;
      bottom: 50px;
    }

    .text {
      color: red;
      cursor: pointer;
      font-size: 20px;
      padding: 16px 32px;
    }
    
    .imageContainer:hover .middle:hover .text{
      color: blue !important;
    }
    .middle {
      transition: .5s ease;
      opacity: 0;
      transform: translate(45%, -220%);
      -ms-transform: translate(-50%, -50%);
      text-align: center;
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
    .product-image .other-image{
      height: 60px;
      max-width: 100%;
    }
    .images .overlay{
      height: 60px;
      z-index: 500;
      width: 80px;
      margin-top: -60px;
      float: left;
      background: rgba(0, 0, 0, 0);
    }
    #Image{
      display: none;
      height: 200px;
      width: 200px;
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
