<template>
  <div class="other-details-holder">
      <h6>Other Detals</h6><br>
      <h6 style="color: red">{{errorMessage}}</h6>
      <div class="row">
          <div class="col-sm-3">
              <p>Label</p>
          </div>
          <div class="col-sm-3" v-if="item.details.files.label.url !== null && isEdit === false">
              <i class="fa fa-file-pdf-o" style="color: #cae166" @click="download('data1')"></i>
              <a :href="config.BACKEND_URL + item.details.files.label.url" id="data1" target="__blank"></a>
          </div>
          <div class="col-sm-3" v-else>
              <i class="fa fa-file-pdf-o" :style="file1 === null || errorMessage !== null ? 'color: red' : 'color: #cae166'" @click="showInput('file1')"></i>
              <input type="file" name="" id="file1" hidden @change="getFile1($event, 'file1')" :disabled="isEditing===false">
          </div>
          <div class="col-sm-3">
              <p>{{item.details.files.label.url !== null && isEdit === false ? item.details.files.label.title : filetitle1}}</p>
          </div>
          <div class="col-sm-3" v-if="isEditing===false">
              <div>
                <i :class="file1 === null ? null : 'fa fa-check'" v-if="errorMessage === null"></i>
                <i :class="errorMessage === null ? null : 'fa fa-close'" style="color:red" v-else></i>
              </div>
              <div>
                <i :class="item.details.files.label.url !== null ? 'fa fa-pencil' : null" style="color:black" @click="editFile()" v-if="isEdit === false && file1 === null"></i>
                <i :class="isEdit === true && file1 !== null ? null : 'fa fa-close'" style="color:red" @click="editFile()" v-else></i>
              </div>
              <div>
              </div>
          </div>
      </div>
      <hr>
      <div class="row">
          <div class="col-sm-3">
              <p>Safety Data Sheet (SDS)</p>
          </div>
          <div class="col-sm-3" v-if="item.details.files.sds.url !== null && isEdit2 === false">
                   <i class="fa fa-file-pdf-o" style="color: #cae166" @click="download('data2')"></i>
              <a :href="config.BACKEND_URL + item.details.files.sds.url" id="data2" target="__blank"></a>
          </div>
          <div class="col-sm-3" v-else>
              <i class="fa fa-file-pdf-o" :style="file2 === null || errorMessage !== null ? 'color: red' : 'color: #cae166'" @click="showInput('file2')"></i>
              <input type="file" name="" id="file2" hidden @change="getFile2($event, 'file2')" :disabled="isEditing===false">
          </div>
          <div class="col-sm-3">
              <p>{{item.details.files.sds.url !== null && isEdit2 === false ? item.details.files.sds.title : filetitle2}}</p>
          </div>
         <div class="col-sm-3" v-if="isEditing===false">
              <div>
                <i :class="file2 === null ? null : 'fa fa-check'" v-if="errorMessage === null"></i>
                <i :class="errorMessage === null ? null : 'fa fa-close'" style="color:red" v-else></i>
              </div>
              <div>
                <i :class="item.details.files.sds.url !== null ? 'fa fa-pencil' : null" style="color:black" @click="editFile2()" v-if="isEdit2 === false"></i>
                <i :class="isEdit2 !== true ? null : 'fa fa-close'" style="color:red" @click="editFile2()" v-else></i>
              </div>
              <div>

              </div>
          </div>
      </div>
      <hr>
  </div>
</template>

<script>
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import axios from 'axios'
export default {
  props: ['item', 'isEditing'],
  data: () => ({
    file1: null,
    file2: null,
    filetitle1: null,
    filetitle2: null,
    user: AUTH.user,
    config: CONFIG,
    common: COMMON,
    errorMessage: null,
    isEdit: false,
    isEdit2: false
  }),
  mounted(){
    console.log('item=================', this.item)
  },
  methods: {
    showInput(id){
      $(`#${id}`)[0].click()
    },
    getFile1(event, fileNumber){
      this.file1 = event.target.files[0]
      this.filetitle1 = this.file1.name.toLowerCase()
      console.log('file1', fileNumber)
      if(this.filetitle1.substring(this.filetitle1.lastIndexOf('.')) === '.pdf'){
        this.createFile(this.file1, fileNumber)
        this.errorMessage = null
      }else{
        this.errorMessage = 'PDF only'
      }
    },
    getFile2(event, fileNumber){
      this.file2 = event.target.files[0]
      this.filetitle2 = this.file2.name.toLowerCase()
      console.log('file2', this.file2)
      if(this.filetitle2.substring(this.filetitle2.lastIndexOf('.')) === '.pdf'){
        this.createFile(this.file2, fileNumber)
        this.errorMessage = null
      }else{
        this.errorMessage = 'PDF only'
      }
    },
    uploadFile(){
      let files = {
        file1: this.file1,
        file2: this.file2
      }
      this.$emit('files', files)
    },
    createFile(file, fileNumber){
      let fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      this.upload(fileNumber)
    },
    upload(fileNumber){
      let formData = new FormData()
      if(fileNumber === 'file1'){
        formData.append('file', this.file1)
        formData.append('file_url', this.file1.name.replace(' ', '_'))
      }else{
        formData.append('file', this.file2)
        formData.append('file_url', this.file2.name.replace(' ', '_'))
      }
      formData.append('account_id', this.user.userID)
      formData.append('category', 'files')
      axios.post(this.config.BACKEND_URL + '/files/upload_file?token=' + AUTH.tokenData.token, formData).then(response => {
        $('#loading').css({'display': 'none'})
        console.log(response.data)
        if(fileNumber === 'file1'){
          let file1 = {
            title: this.filetitle1,
            url: response.data.data
          }
          this.$emit('file1', file1)
          this.$emit('file2', null)
          this.file1 = null
          this.file2 = null
          this.isEdit = false
          this.isEdit2 = false
        }else{
          let file2 = {
            title: this.filetitle2,
            url: response.data.data
          }
          this.$emit('file1', null)
          this.$emit('file2', file2)
          this.file1 = null
          this.file2 = null
          this.isEdit = false
          this.isEdit2 = false
        }
      })
    },
    download(id){
      $(`#${id}`)[0].click()
    },
    editFile(){
      this.isEdit = !this.isEdit
      console.log(this.isEdit)
    },
    editFile2(){
      this.isEdit2 = !this.isEdit2
      console.log(this.isEdit)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/colors.scss";

    .fa{
        font-size: 30px;
        cursor: pointer;
    }
    .fa-check{
      color: $primary;
    }
</style>

