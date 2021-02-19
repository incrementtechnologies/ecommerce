<template>
  <div class="other-details-holder">
      <h6>Other Detals</h6><br>
      <div class="row">
          <div class="col-sm-3">
              <p>Label</p>
          </div>
          <div class="col-sm-3">
              <i class="fa fa-file-pdf-o" :style="file1 === null ? 'color: red' : 'color: #cae166'" @click="showInput('file1')"></i>
              <input type="file" name="" id="file1" hidden @change="getFile1($event)">
          </div>
          <div class="col-sm-3">
              <p>{{filetitle1}}</p>
          </div>
          <div class="col-sm-3">
              <div>
                <i :class="file1 != null ? 'fa fa-check' : null"></i>
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
          <div class="col-sm-3">
              <i class="fa fa-file-pdf-o" :style="file1 === null ? 'color: red' : 'color: #cae166'" @click="showInput('file2')"></i>
              <input type="file" name="" id="file2" hidden @change="getFile2($event)">
          </div>
          <div class="col-sm-3">
              <button class="btn btn-primary" :hidden="file2 === null" @click="uploadFile()">Update PDF</button>
          </div>
          <div class="col-sm-3">
              <i :class="file2 != null ? 'fa fa-check' : null"></i>
          </div>
      </div>
      <hr>
  </div>
</template>

<script>
export default {
  data: () => ({
    file1: null,
    file2: null,
    filetitle1: null,
    filetitle2: null
  }),
  methods: {
    showInput(id){
      $(`#${id}`)[0].click()
    },
    getFile1(event){
      this.file1 = event.target.files[0]
      this.filetitle1 = this.file1.name
      console.log('file1', this.file1)
    },
    getFile2(event){
      this.file2 = event.target.files[0]
      console.log('file2', this.file2)
    },
    uploadFile(){
      let files = {
        file1: this.file1,
        file2: this.file2
      }
      this.$emit('files', files)
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

