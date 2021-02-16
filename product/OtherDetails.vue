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

            <div v-if="isSuccessLabel">
              <button class="customButton" :download="myfilename">
                <i class="far fa-file-alt fa-2x" style="color: green"></i>
              </button>
            </div>
            <!-- File is with value -->

            <div v-if="!file1Null">
              <div v-if="isEditLabel">
                <button class="customButton" :download="myfilename">
                  <i class="far fa-file-alt fa-2x" style="color: green"></i>
                </button>
              </div>
            </div>
            
            <!-- File has no value -->
              <div v-if="file1Null">
                <div v-if="isEditLabel">
                  <div class="image-upload">
                    <label for="file-input">
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
                      v-on:change="uploadFile1($e)" />
                  </div>
                </div>
              </div>

            <!-- File has value but want to update or edit -->
            <div v-if="isCancelLabel">
                <div class="image-upload">
                  <label for="file-input">
                    <i class="far fa-file-alt fa-2x" style="color: green;cursor: pointer;"></i>
                  </label>
                  <input id="file-input"
                    ref="upload" 
                    name="upload" 
                    type="file"
                    v-on:change="uploadFile1($e)"
                  />
              </div>
            </div>
          </b-col>
          <b-col>
            <div v-if="isEditLabel">
              <div v-if="!file1Null">
              {{ this.file_title }}
            </div>
            </div>
            <div v-if="isCancelLabel">
              <b-form-input v-model="file_title" class="w-100" value="this.file_title"></b-form-input>
            </div> 
          </b-col>
          <b-col>
            <div v-if="!file1Null">
              <div v-if="isEditLabel">
                <button class="customButton" v-on:click="editLabel()">
                  <i class="fas fa-pencil-alt fa-2x"></i>
                </button>
              </div>
              <div v-else-if="isCancelLabel">
                <button class="customButton" v-on:click="cancelLabel()">
                  <span style="color: red">
                    <i class="fas fa-times fa-2x"></i>
                  </span>
                </button>
              </div>
              <div v-else-if="isSuccessLabel">
                <button class="customButton" v-on:click="successfulLabel()">
                  <span style="color: black">
                    <i class="fas fa-check-alt fa-2x"></i>
                  </span>
                </button>
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
            <!-- File is with value -->
                <div v-if="!file2Null">
                  <div v-if="isEditSds">
                  <button class="customButton" :download="myfilename">
                    <i class="far fa-file-alt fa-2x" style="color: green"></i>
                  </button>
                </div>
              </div>
            <!-- </div> -->

            <div v-if="isSuccessSds">
              <button class="customButton" :download="myfilename">
                <i class="far fa-file-alt fa-2x" style="color: green"></i>
              </button>
            </div>
            
            <!-- File has no value -->
                <div v-if="file2Null">
                  <div v-if="isEditSds">
                  <div class="image-upload">
                    <label for="file-input">
                      <i
                        class="far fa-file-alt fa-2x"
                        style="color: red; cursor: pointer"
                      ></i>
                    </label>
                    <input id="file-input" ref="file1" type="file" v-on:change="uploadFile2($e)" />
                  </div>
                </div>
              </div>
            

            <!-- File has value but want to update or edit -->
            <div v-if="isCancelSds">
                <div class="image-upload">
                  <label for="file-input">
                    <i class="far fa-file-alt fa-2x" style="color: green;cursor: pointer;"></i>
                  </label>
                  <input id="file-input" type="file"/>
              </div>
            </div>
            <!-- <div v-if="file2Null">
              <div class="image-upload">
                <label for="file-input">
                  <i
                    class="far fa-file-alt fa-2x"
                    style="color: red; cursor: pointer"
                  ></i>
                </label>
                <input id="file-input" type="file" />
              </div>
            </div>
            <div v-if="!file2Null">
              <button class="customButton" :download="myfilename">
                <i class="far fa-file-alt fa-2x" style="color: green"></i>
              </button>
            </div> -->
          </b-col>
          <b-col>
            <div v-if="!file2Null">
              <button class="btn btn-warning">Update PDF</button>
            </div>
          </b-col>
          <b-col>
            <div v-if="!file2Null">
              <div v-if="isEditSds">
                <button class="customButton" v-on:click="editSds()">
                  <i class="fas fa-pencil-alt fa-2x"></i>
                </button>
              </div>
              <div v-else-if="isCancelSds">
                <button class="customButton" v-on:click="cancelSds()">
                  <span style="color: red">
                    <i class="fas fa-times fa-2x"></i>
                  </span>
                </button>
              </div>
              <div v-else-if="isSuccessSds">
                <button class="customButton" v-on:click="successfulSds()">
                  <span style="color: black">
                    <i class="fas fa-check-alt fa-2x"></i>
                  </span>
                </button>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <hr />
    <br />
    <div>
      <label for="documentation" style="font-weight: 600"
        >Product Variations</label
      >
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              {{ item.Product_Name }}
            </td>
            <td>
              {{ item.Size }}
            </td>
            <td>
              {{ item.Availabel }}
            </td>
            <td>
              <button class="btn btn-warning" v-on:click="navBatchPagePending()">View Batches</button>
            </td>
          </tr>
        </tbody>
      </table>
      <center>
        <button class="btn btn-primary" v-on:click="isOpen = !isOpen">
          Create New Product Variation
        </button>
      </center>
    </div>
    <br /><br />
    <div v-show="isOpen">
      <label for="newproductvariation" style="font-weight: 600"
        >New Product Variation</label
      >
      <br />
      <label for="name" style="font-weight: 400"
        >Name: {{ this.items[0].Product_Name }}</label
      >
      <br />
      <div class="wrapper">
        <label class="pull-right" style="font-weight: 400; font-size: 25px"
          >L</label
        >
        <b-form-input
          v-model="productVariationNew"
          type="text"
          id="textbox"
          class="form-control"
          v-on:keyup.enter="addNewProductVariation()"
        />
      </div>
      <br />
    </div>
    <br />
    <div>
      <label for="bundledtransportconfigurations" style="font-weight: 600"
        >Bundled Transport Configurations</label
      >
      <br />
      <label for="name" style="font-weight: 400"
        >Name: {{ this.items[0].Product_Name }}</label
      >
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Bundle name</th>
            <!-- <th></th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              {{ item.Product_Name }}
            </td>
            <!-- <td>
              <button class="btn btn-warning">View Batches</button>
            </td> -->
          </tr>
        </tbody>
      </table>
      <center>
        <button class="btn btn-primary" v-on:click="open = !open">
          Create New Bundle Configuration
        </button>
      </center>
      <br /><br />
      <div v-show="open">
        <label for="newproductvariation" style="font-weight: 600"
          >New Bundle Configuration</label
        >
        <br />
        <label for="name" style="font-weight: 400"
          >Name: {{ this.items[0].Product_Name }}</label
        >
        <br />
        <b-row>
          <b-col>
            <b-form-select
              v-model="selectedOption"
              :options="options"
              class="w-75"
              value-field="item"
              text-field="name"
            ></b-form-select>
          </b-col>
          <b-col>
            <b-form-group
              label="Quantity"
              label-for="nested-quantity"
              label-cols-sm="3"
            >
              <b-form-input
                v-model="quantity"
                class="w-100"
                id="nested-quantity"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>
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
      props: ['data'],
      config: CONFIG,
      errorMessage: null,
      isOpen: false,
      open: false,
      isEditLabel: true,
      isCancelLabel: false,
      isSuccessLabel: false,
      isEditSds: true,
      isCancelSds: false,
      isSuccessSds: false,
      file1Null: true,
      file1: '',
      quantity: '',
      file2Null: true,
      productVariationNew: '',
      options: [
        { item: 'A', name: 'Option A' },
        { item: 'B', name: 'Option B' },
        { item: 'C', name: 'Option C' },
        { item: 'D', name: 'Option D' }
      ],
      selected: 'Option A',
      myUrl: '#',
      myFilename: this.image,
      documentLabel: ['Label', 'Safety Data Sheet (SSDS)'],
      file_title: 'Temporary Title',
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
    uploadFile1: function (e) {
      e.preventDefault()
      this.file1 = this.$refs.file1.files[0]
      console.log('niagi')
      this.file1Null = !this.file1Null
      this.successLabel()
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
