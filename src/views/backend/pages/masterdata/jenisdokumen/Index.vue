<template>
  <div class="home pa-6">
    <v-flex
      row
      class="pb-2"
    >
      <v-icon :color="theme.color">mdi-file-document-multiple</v-icon>
      <v-subheader class="text-h6">
        <h4>JENIS DOKUMEN</h4>
      </v-subheader>
    </v-flex>
    <v-flex class="pb-5 pl-7">
      <div class="grey--text mb-2">Seluruh Daftar Jenis Dokumen Persyaratan Yang Tersedia</div>
    </v-flex>

    <v-row>
      <v-col cols="12">
        <v-card class="animated animate__fadeInUp">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
            <v-tooltip
              :color="theme.color"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                >
                  <v-icon
                    :color="theme.mode == 'dark' ? `white` : `black`"
                    @click="openNewForm"
                  >add_circle</v-icon>
                </v-btn>
              </template>
              <span>Tambah Data</span>
            </v-tooltip>
            <v-tooltip
              :color="theme.color"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                >
                  <v-icon
                    :color="theme.mode == 'dark' ? `white` : `black`"
                    @click="fetchRecords"
                  >refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Data</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pencarian"
              single-line
              hide-details
              solo
              dense
              :color="theme.color"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="records"
            :items-per-page="10"
            class="elevation-2"
            :color="theme.color"
            :loading="loading.table"
            loading-text="Loading... Please wait"
            :search="search"
          >
            <v-progress-linear
              slot="progress"
              :color="theme.color"
              height="1"
              indeterminate
            ></v-progress-linear>
            <template v-slot:item.progress="{ value }">
              <v-progress-linear
                :color="theme.color"
                v-model="value"
                height="25"
              >
                <strong>{{ value }}%</strong>
              </v-progress-linear>
            </template>

            <template v-slot:item.status="{ value }">
              <v-chip
                :color="value.color"
                small
              >{{ value.text }}</v-chip>
            </template>
            <template v-slot:item.id="{ value }">
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    :color="theme.color"
                    v-bind="attrs"
                    v-on="on"
                  >mdi-dots-vertical-circle-outline</v-icon>
                </template>

                <v-list>
                  <v-list-item @click="openManajemenPersyaratan(value)">
                    <v-list-item-title>
                      <v-icon color="green">mdi-file-document-multiple</v-icon>Manajemen Persyaratan
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="editRecord(value)">
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="postDeleteRecord(value)">
                    <v-list-item-title>
                      <v-icon color="red">mdi-delete-circle</v-icon>Hapus
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="form.new"
        :max-width="device.desktop ? `600px` : `100%`"
        persistent
      >
        <v-card>
          <v-toolbar
            :color="theme.color"
            :dark="theme.mode"
          >
            <v-icon class="mr-1">mdi-circle</v-icon>Formulir Jenis Dokumen
          </v-toolbar>
          <v-card-text class="mt-2">
            <v-col col="12">
              <v-text-field
                outlined
                :color="theme.color"
                :hide-details="device.desktop"
                label="Kode"
                v-model="form.record.kode"
                :filled="form.record.kode ? true:false"
                dense
              ></v-text-field>
            </v-col>

            <v-col col="12">
              <v-text-field
                outlined
                :color="theme.color"
                :hide-details="device.desktop"
                label="Nama Dokumen"
                v-model="form.record.name"
                :filled="form.record.name ? true:false"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                label="Deskripsi"
                :color="theme.color"
                dense
                outlined
                v-model="form.record.description"
                hide-details
                :filled="form.record.description ? true:false"
              >{{ form.record.description }}</v-textarea>
            </v-col>

          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn
              outlined
              :color="theme.color"
              v-show="!form.edit"
              @click="postAddNewRecord"
            >Kirim</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              v-show="form.edit"
              @click="postUpdateRecord"
            >Kirim</v-btn>
            <v-btn
              outlined
              color="grey"
              @click="closeNewForm"
            >Batal</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>

<script lang="vue">
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  data: () => ({
    num: 1,
    headers: [
      { text: "#", value: "num", width:75 },
      {
        text: "KODE",
        align: "start",
        sortable: false,
        value: "kode",
        width:100
      },
     
      { text: "JENIS", value: "name", align:'left', sortable:false,},
      { text: "AKSI", value: "id", width:100, sortable:false, align:'center' },
    ],
    form: {
      new: false,
      edit: false,
      record:{
        id:null,
        kode:null,
        name:null,
        description:null,
        path:"/"
      }
    },
    search: null,
    path: null,
  }),
  computed: {
    ...mapState([
      "theme",
      "http",
      "device",
      "record",
      "records",
      "loading",
      "event",
      "snackbar"
    ]),
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/master-data/jenis-document",
      pagination: false,
    })
    this.fetchRecords();
    
  },
  mounted() {
    
  },
  methods: {
    ...mapActions([
      "setPage",
      "fetchRecords",
      "postAddNew",
      "postEdit",
      "postUpdate",
      "postConfirmDelete",
      "assignFileBrowse",
      "setLoading",
      "setRecord"
    ]),
    openNewForm: function () {
      this.setRecord({})
      this.form.new = true;
      this.form.edit = false;
    },
    closeNewForm: function () {
      this.form.new = false;
      this.form.edit = false;
    },
    openEditForm: function () {
      this.form.new = true;
      this.form.edit = true;
    },
    postAddNewRecord: function (){
      this.setRecord(this.form.record)
      this.postAddNew(this.record).then(()=>{
        this.fetchRecords()
        this.form.new= false
      })
    },
    editRecord: async function(val) {
      await this.postEdit(val);

      this.form.record.id = this.record.id
      this.form.record.kode = this.record.kode
      this.form.record.name = this.record.name
      this.form.record.description = this.record.description      
      
      this.form.new = true;
      this.form.edit = true;
    },
     postUpdateRecord: function() {
       this.setRecord(this.form.record)
      this.postUpdate(this.record).then(() => {
        this.fetchRecords();
        this.form.new = false;
        this.form.edit = false;
      });
    },
    postDeleteRecord: function(val) {
      this.postConfirmDelete(val);
    },
    postDownload(val) {
      window.open(val, "__blank");
    },
    uploadFile: function () {
      this.assignFileBrowse({
        fileType: [".pdf"],
        query: {
          doctype: "documents",
        },
        callback: (response) => {
          setTimeout(() => {
            this.path = response.name;
            this.form.record.path = response.name;
          }, 500);
        },
      });
    },

    //custome function
    openManajemenPersyaratan: function (val) {
      this.$router.push({name:'master-document-persyaratan', params:{
        jenis_dokumen_id:val
      }})
    }

  },

};
</script>