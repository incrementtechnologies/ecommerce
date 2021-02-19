<template>
  <div class="other-details-holder">
    <label for="documentation" style="font-weight: 600">Documentation</label>
    <br /><br />
    <div>
      <b-container class="bv-example-row">
        <b-row>
          <b-col>
            <label for="fileLabel" style="font-weight: 400">Label</label>
          </b-col>
          <b-col>
            <!-- If file was confirmed to upload -->
            <div v-if="isSuccessLabel">
              <button class="customButton" :download="myfilename">
                <i class="far fa-file-alt fa-2x" style="color: green"></i>
              </button>
            </div>

            <!-- If wether file has value or not but visited this page newly -->
            <div v-if="!isSuccessLabel">

              <!-- If file has no value -->
              <div v-if="file1Null === null">

                <!-- If you already picked a temporary file to upload
                the file_title1 will be the storage for the current title name of the file you have chosen -->

                <div v-if="file_title1 !== null">
                  <div class="image-upload">
                    <label for="file-input">
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: green; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input"
                      ref="upload" 
                      name="upload" 
                      type="file" 
                      accept="application/pdf,application/vnd.ms-excel" 
                      @change="uploadFile1('file-input', $event)" 
                    />
                  </div>
                </div>
                
                <!-- file_title1 is a temporary storage for the uploaded file
                and if it is null -->

                <div v-if="file_title1 === null">
                  <div class="image-upload">
                    <label for="file-input" >
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: red; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input"
                      ref="upload" 
                      name="upload" 
                      type="file" 
                      accept="application/pdf,application/vnd.ms-excel" 
                      @change="uploadFile1('file-input', $event)" 
                    />
                  </div>
                </div>
              </div>

              <!-- If file already have a value while newly visited -->
              <div v-if="file1Null !== null">

                <!-- When pencil was clicked -->
                <div v-if="isCancelLabel">
                  <div class="file-upload">
                    <label for="file-input">
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: green; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input"
                      ref="upload" 
                      name="upload" 
                      type="file" 
                      accept="application/pdf,application/vnd.ms-excel" 
                      @change="uploadFile1('file-input', $event)" 
                    />
                  </div>

                </div>
                <!-- When cancelled to edit -->
                <div v-if="isEditLabel"> 
                  <button class="customButton" :download="myfilename">
                    <i class="far fa-file-alt fa-2x" style="color: green"></i>
                  </button>
                </div>
              </div>
            </div>
          </b-col>
          <b-col>
            <div>
              <div>
              {{ this.file_title1 }}
              </div>
            </div>
            <div v-if="isCancelLabel">
              <b-form-input v-model="file_title1" class="w-100" :value="this.file_title1"></b-form-input>
            </div> 
          </b-col>
          <b-col>
            <div v-if="isSuccessLabel">
              <span style="color: green">
                <i class="fas fa-check fa-2x"></i>
              </span>
            </div>
            <div v-if="!isSuccessLabel">
              <div v-if="file1Null !== null">
                <div v-if="isEditLabel">
                  <button class="customButton" v-on:click="editLabel()">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                  </button>
                </div>
                <div v-if="isCancelLabel">
                  <button class="customButton" v-on:click="cancelLabel()">
                    <span style="color: red">
                      <i class="fas fa-times fa-2x"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <hr />
    <div>
      <b-container class="bv-example-row">
        <b-row>
          <b-col>
            <label for="fileLabel" style="font-weight: 400"
              >Safety Data Sheet (SDS)</label
            >
          </b-col>
          <b-col>
            <!-- If file was confirmed to upload -->
            <div v-if="isSuccessSds">
              <button class="customButton" :download="myfilename">
                <i class="far fa-file-alt fa-2x" style="color: green"></i>
              </button>
            </div>

            <!-- If wether file has value or not but visited this page newly -->
            <div v-if="!isSuccessSds">

              <!-- If file has no value -->
              <div v-if="file2Null === null">

                <!-- If you already picked a temporary file to upload
                the file_title2 will be the storage for the current title name of the file you have chosen -->

                <div v-if="file_title2 !== null">
                  <div class="image-upload">
                    <label for="file-input2">
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: green; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input2"
                      ref="upload" 
                      name="upload" 
                      type="file" 
                      accept="application/pdf,application/vnd.ms-excel" 
                      @change="uploadFile2('file-input2', $event)" 
                    />
                  </div>
                </div>
                
                <!-- file_title2 is a temporary storage for the uploaded file
                and if it is null -->

                <div v-if="file_title2 === null">
                  <div class="image-upload">
                    <label for="file-input2">
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: red; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input2"
                      ref="upload" 
                      name="upload" 
                      type="file" 
                      accept="application/pdf,application/vnd.ms-excel" 
                      @change="uploadFile2('file-input2', $event)" 
                    />
                  </div>
                </div>
              </div>

              <!-- If file already have a value while newly visited -->
              <div v-if="file2Null !== null">

                <!-- When pencil was clicked -->
                <div v-if="isCancelSds">
                  <div class="file-upload">
                    <label for="file-input2">
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: green; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input2"
                      ref="upload" 
                      name="upload" 
                      type="file" 
                      accept="application/pdf,application/vnd.ms-excel" 
                      @change="uploadFile2('file-input2', $event)" 
                    />
                  </div>

                </div>
                <!-- When cancelled to edit -->
                <div v-if="isEditSds"> 
                  <button class="customButton" :download="myfilename">
                    <i class="far fa-file-alt fa-2x" style="color: green"></i>
                  </button>
                </div>
              </div>
            </div>
          </b-col>
          <b-col>
            <div v-if="file_title2">
              <button class="btn btn-warning" v-on:click="uploadAll()">Update PDF</button>
            </div>
          </b-col>
          <b-col>
            <div v-if="isSuccessSds">
              <span style="color: green">
                <i class="fas fa-check fa-2x"></i>
              </span>
            </div>
            <div v-if="!isSuccessSds">
              <div v-if="file2Null !== null">
                <div v-if="isEditSds">
                  <button class="customButton" v-on:click="editSds()">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                  </button>
                </div>
                <div v-if="isCancelSds">
                  <button class="customButton" v-on:click="cancelSds()">
                    <span style="color: red">
                      <i class="fas fa-times fa-2x"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <hr />
  </div>
</template>

<script>
import ROUTER from '../../../../router'
import AUTH from '../../../../services/auth'
import CONFIG from '../../../../config.js'
import image from 'assets/img/about1.png'
import axios from 'axios'
export default {
  data() {
    return {
      user: AUTH.user,
      config: CONFIG,
      isOpen: false,
      open: false,
      isEditLabel: true,
      isCancelLabel: false,
      isSuccessLabel: false,
      isEditSds: true,
      isCancelSds: false,
      isSuccessSds: false,
      file1Null: null,
      file2Null: null,
      file_title1: null,
      file_title2: null,
      quantity: '',
      productVariationNew: '',
      temp_file1: '',
      temp_file2: '',
      options: [
        { item: 'A', name: 'Option A' },
        { item: 'B', name: 'Option B' },
        { item: 'C', name: 'Option C' },
        { item: 'D', name: 'Option D' }
      ],
      selected: 'Option A',
      myUrl: '#',
      myfilename: this.image,
      documentLabel: ['Label', 'Safety Data Sheet (SSDS)'],
      headers: ['Product Name', 'Size', 'Availabel', ' '],
      items: [
        { Product_Name: 'Thrillogy', Size: '110L', Availabel: '12' },
        { Product_Name: 'Thrillogy', Size: '100L', Availabel: '8' },
        { Product_Name: 'Thrillogy', Size: '20L', Availabel: '64' }
      ]
    }
  },
  methods: {
    downloadFile1: function () {
      console.log('try')
    },
    uploadFile1: function (id, event) {
      $(`#${id}`)[0].click()
      this.temp_file1 = event.target.files
      this.file_title1 = this.temp_file1[0].name
      console.log('File1', event)
    },

    uploadFile2: function (id, event) {
      $(`#${id}`)[0].click()
      this.temp_file2 = event.target.files
      this.file_title2 = this.temp_file2[0].name
      console.log('File2', event)
    },

    uploadAll(){
      this.successLabel()
      this.successSds()
      let file = {
        file1: this.temp_file1,
        file2: this.temp_file2
      }
      console.log(this.isSuccessLabel)
      this.file1Null = false
      this.file2Null = false
      this.$emit('files', file)
    },

    addNewProductVariation: function() {
      console.log('added')
    },

    navBatchPagePending: function() {
      console.log('redirect')
    },

    editLabel: function () {
      this.isEditLabel = false
      this.isCancelLabel = true
    },
    cancelLabel: function () {
      this.isEditLabel = true
      this.isCancelLabel = false
    },
    successLabel: function () {
      this.isEditLabel = false
      this.isCancelLabel = false
      this.isSuccessLabel = true
    },

    editSds: function () {
      this.isEditSds = false
      this.isCancelSds = true
    },
    cancelSds: function () {
      this.isEditSds = true
      this.isCancelSds = false
    },
    successSds: function () {
      this.sEditSds = false
      this.isCancelSds = false
      this.isSuccessSds = true
    },
    updatePDF: function () {},
    inputLabelFile: function () {}
  }
}
</script>

<style scoped>
.other-details-holder {
  width: 100%;
  float: left;
  min-height: 100px;
  overflow-y: hidden;
}
.btn-primary {
  background-color: "#FFAC62" !important;
}

text {
  display: inline-block;
  width: 140px;
  text-align: right;
}

.image-upload > input {
  display: none;
}

.wrapper {
  position: absolute;
}
#textbox {
  width: 200px;
}

.customButton {
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
}
</style>
