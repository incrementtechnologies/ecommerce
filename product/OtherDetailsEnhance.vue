<template>
  <div class="other-details-holder">
      <h6>Approved Documents</h6><br>
      <h6 style="color: red">{{errorMessage}}</h6>
      <div class="table table-hover">
        <tbody>
          <tr>
            <td>
              <label>Label</label>
            </td>
            <td>
              <div class="" v-if="item.details.files.label.url !== null && isEdit === false">
                <i class="fa fa-file-pdf-o" style="color: #cae166" @click="download('data1')" title="View Document"></i>
                <a :href="config.BACKEND_URL + item.details.files.label.url" id="data1" target="__blank"></a>
              </div>
              <div class="" v-else>
                  <i class="fa fa-file-pdf-o" :style="file1 === null || errorMessage !== null ? 'color: red' : 'color: #cae166'"></i>
              </div>
            </td>
            <td>
              <div>
                <button type="file" :class="item.details.files.label.url !== null ? 'btn btn-primary' : 'btn btn-danger'" class="btn btn-primary" @click="showInput('file1')" v-if="item.details.files.label.url !== null" :disabled="isEditing===false">Update PDF</button>
                <button type="file" :class="item.details.files.label.url !== null ? 'btn btn-primary' : 'btn btn-danger'" @click="showInput('file1')" v-if="item.details.files.label.url === null" :disabled="isEditing===false">Upload PDF</button>
                <input type="file" name="" id="file1" hidden @change="getFile1($event, 'file1')" :disabled="isEditing===false">
              </div>
            </td>
            <td>
              <p>{{item.details.files.label.url !== null && isEdit === false ? item.details.files.label.title : filetitle1}}</p>
            </td>
            <td>
              <i :class="file1 === null ? null : 'fa fa-check'" v-if="errorMessage === null"></i>
              <i :class="errorMessage === null ? null : 'fa fa-close'" style="color:red" v-else></i>
            </td>
          </tr>
          <tr>
            <td>
              <label>SDS (Safety Data Sheet)</label>
            </td>
            <td>
              <div class="" v-if="item.details.files.sds.url !== null">
                <i class="fa fa-file-pdf-o" style="color: #cae166" @click="download('data2')" title="View Document"></i>
                <a :href="config.BACKEND_URL + item.details.files.sds.url" id="data2" target="__blank"></a>
              </div>
              <div class="" v-else>
                  <i class="fa fa-file-pdf-o" :style="file2 === null || errorMessage !== null ? 'color: red' : 'color: #cae166'"></i>
              </div>
            </td>
            <td>
              <div>
                <button type="file" :class="item.details.files.sds.title !== null ? 'btn btn-primary' : 'btn btn-danger'" @click="showInput('file2')" v-if="item.details.files.sds.title !== null" :disabled="isEditing===false">Update PDF</button>
                <button :class="item.details.files.sds.title !== null ? 'btn btn-primary' : 'btn btn-danger'" @click="showInput('file2')" v-if="item.details.files.sds.title === null" :disabled="isEditing===false">Upload PDF</button>
                <input type="file" name="file2" id="file2" hidden @change="getFile2($event, 'file2')" :disabled="isEditing===false">
              </div>
            </td>
            <td>
              <p>{{item.details.files.sds.url !== null ? item.details.files.sds.title : filetitle2}}</p>
            </td>
            <td>
              <i :class="file2 === null ? null : 'fa fa-check'" v-if="errorMessage === null" ></i>
              <i :class="errorMessage === null ? null : 'fa fa-close'" style="color:red" v-else></i>
            </td>
          </tr>
        </tbody>
      </div>
      <!-- <div class="row">
          <div class="col-sm-2">
              <p>Label</p>
          </div>
          <div class="col-sm-2" v-if="item.details.files.label.url !== null && isEdit === false">
              <i class="fa fa-file-pdf-o" style="color: #cae166" @click="download('data1')" title="View Document"></i>
              <a :href="config.BACKEND_URL + item.details.files.label.url" id="data1" target="__blank"></a>
          </div>
          <div class="col-sm-2" v-else>
              <i class="fa fa-file-pdf-o" :style="file1 === null || errorMessage !== null ? 'color: red' : 'color: #cae166'"></i>
          </div>
          <div class="col-sm-2">
              <div>
                <button type="file" :class="item.details.files.label.url !== null ? 'btn btn-primary' : 'btn btn-danger'" class="btn btn-primary" @click="showInput('file1')" v-if="item.details.files.label.url !== null" :disabled="isEditing===false">Update PDF</button>
                <button type="file" :class="item.details.files.label.url !== null ? 'btn btn-primary' : 'btn btn-danger'" @click="showInput('file1')" v-if="item.details.files.label.url === null" :disabled="isEditing===false">Upload PDF</button>
                <input type="file" name="" id="file1" hidden @change="getFile1($event, 'file1')" :disabled="isEditing===false">
              </div>
              <div>
              </div>
          </div>
          <div class="col-sm-2">
              <p>{{item.details.files.label.url !== null && isEdit === false ? item.details.files.label.title : filetitle1}}</p>
          </div>
          <div class="col-sm-2">
            <i :class="file1 === null ? null : 'fa fa-check'" v-if="errorMessage === null"></i>
            <i :class="errorMessage === null ? null : 'fa fa-close'" style="color:red" v-else></i>
          </div>
      </div>
      <hr>
      <div class="row">
          <div class="col-sm-2">
              <p>Safety Data Sheet (SDS)</p>
          </div>
          <div class="col-sm-2" v-if="item.details.files.sds.url !== null">
              <i class="fa fa-file-pdf-o" style="color: #cae166" @click="download('data2')" title="View Document"></i>
              <a :href="config.BACKEND_URL + item.details.files.sds.url" id="data2" target="__blank"></a>
          </div>
          <div class="col-sm-2" v-else>
              <i class="fa fa-file-pdf-o" :style="file2 === null || errorMessage !== null ? 'color: red' : 'color: #cae166'"></i>
          </div>
         <div class="col-sm-2">
              <div>
                <button type="file" :class="item.details.files.sds.title !== null ? 'btn btn-primary' : 'btn btn-danger'" @click="showInput('file2')" v-if="item.details.files.sds.title !== null" :disabled="isEditing===false">Update PDF</button>
                <button :class="item.details.files.sds.title !== null ? 'btn btn-primary' : 'btn btn-danger'" @click="showInput('file2')" v-if="item.details.files.sds.title === null" :disabled="isEditing===false">Upload PDF</button>
                <input type="file" name="file2" id="file2" hidden @change="getFile2($event, 'file2')" :disabled="isEditing===false">
              </div>
              <div>
              </div>
          </div>
          <div class="col-sm-2">
              <p>{{item.details.files.sds.url !== null ? item.details.files.sds.title : filetitle2}}</p>
          </div>
          <div class="col-sm-2">
              <i :class="file2 === null ? null : 'fa fa-check'" v-if="errorMessage === null" ></i>
              <i :class="errorMessage === null ? null : 'fa fa-close'" style="color:red" v-else></i>
          </div>
      </div> -->
      <!-- <hr> -->
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
    console.log('item=================', this.isEditing)
  },
  methods: {
    showInput(id){
      console.log($(`#${id}`))
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

