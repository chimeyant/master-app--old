<template>
  <div :class="device.desktop ? `home pa-6`:`home pa-0`">
    <v-row>
      <v-col :cols="device.desktop ? `12` : `12`">
        <v-card class="animated animate__fadeInUp rounded-0">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
            <v-tooltip
              :color="theme.color + ` draken-4`"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                  v-show="page.actions.add"
                >
                  <v-icon
                    color="white"
                    @click="addNewRecord"
                  >add_circle</v-icon>
                </v-btn>
              </template>
              <span>Tambah</span>
            </v-tooltip>

            <v-tooltip
              :color="theme.color + ` draken-4`"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                  v-show="page.actions.refresh"
                >
                  <v-icon
                    color="white"
                    @click="fetchRecords"
                  >mdi-refresh-circle</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-col
              :cols="device.desktop ? 3 :12"">
                <v-text-field
                  v-model="
              search"
              append-icon="mdi-magnify"
              label="Pencarian"
              single-line
              hide-details
              dense
              solo
              :color="theme.color + ` lighten-1`"
            >
              </v-text-field>
            </v-col>

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
            show-select
            v-show="device.desktop"
          >
            <v-progress-linear
              slot="progress"
              :color="theme.color"
              height="1"
              indeterminate
            ></v-progress-linear>

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
                  >
                    mdi-dots-vertical-circle-outline
                  </v-icon>
                </template>

                <v-list>
                  <v-list-item @click="">
                    <v-list-item-title>
                      <v-icon :color="theme.color">mdi-wheel-barrow</v-icon>
                      Riwayat SKP
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="">
                    <v-list-item-title>
                      <v-icon :color="theme.color">mdi-chart-gantt</v-icon>
                      Kompetensi
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="">
                    <v-list-item-title>
                      <v-icon :color="theme.color">mdi-chart-bar</v-icon>
                      Potensi
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    @click="editRecord(value)"
                    v-show="false"
                  >
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>
                      Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="postDeleteRecord(value)"
                    v-show="page.actions.delete"
                  >
                    <v-list-item-title>
                      <v-icon color="red">mdi-delete-circle</v-icon>
                      Hapus
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

            </template>
          </v-data-table>
          <v-list
            subheader
            v-show="device.mobile"
          >

            <v-list-item-group
              v-model="settings"
              multiple
              active-class=""
            >
              <v-list-item
                v-for="item in filterItems"
                :key="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.nama }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.ttl }} </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-spacer></v-spacer>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu
                      bottom
                      origin="
                          center
                          center"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          :color="theme.color"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-dots-vertical-circle-outline
                        </v-icon>
                      </template>

                      <v-list>
                        <v-list-item @click="">
                          <v-list-item-title>
                            <v-icon :color="theme.color">mdi-wheel-barrow</v-icon>
                            Riwayat SKP
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="">
                          <v-list-item-title>
                            <v-icon :color="theme.color">mdi-chart-gantt</v-icon>
                            Kompetensi
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="">
                          <v-list-item-title>
                            <v-icon :color="theme.color">mdi-chart-bar</v-icon>
                            Potensi
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="editRecord(item.id)"
                          v-if="false"
                        >
                          <v-list-item-title>
                            <v-icon color="orange">mdi-pencil-circle</v-icon>
                            Edit
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="postDeleteRecord(item.id)"
                          v-show="false"
                        >
                          <v-list-item-title>
                            <v-icon color="red">mdi-delete-circle</v-icon>
                            Hapus
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

    </v-row>
    <v-col col="12">

      <v-dialog
        transition="dialog-bottom-transition"
        v-model="page.add"
        :max-width="device.desktop ? `600px` : `100%`"
        persistent
        :fullscreen="device.mobile"
      >,
        <v-card class="rounded-0">
          <v-toolbar
            :color="theme.color + ` lighten-1`"
            dark
          >
            <div class="box-icon-dialog">
              <v-icon class="mr-1">mdi-circle</v-icon>
            </div>
            Daftar LO
          </v-toolbar>
          <div :class="device.desktop ? `box-dialog-content `:``">
            <v-card-title class="justify-center">FORMULIR DAFTAR LO</v-card-title>
            <v-card-text style="border-">
              <v-row :no-gutters="device.mobile">
                <v-col cols="12">
                  <v-text-field
                    label="NAMA"
                    :color="theme.color"
                    :hide-details="device.desktop"
                    autocomplete="off"
                    v-model="record.name"
                    outlined
                    :dense="device.desktop"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="PHONE"
                    :color="theme.color"
                    :hide-details="device.desktop"
                    autocomplete="off"
                    v-model="record.phone"
                    outlined
                    :dense="device.desktop"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
          <v-card-actions class="flex flex-row-reverse">
            <v-btn
              outlined
              :color="theme.color"
              @click="postAddNewRecord"
              v-show="!event.update"
            >TAMBAH</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              @click="postUpdateRecord"
              v-show="event.update"
            >UBAH</v-btn>
            <v-btn
              outlined
              class="mr-2"
              color="grey dark-3"
              @click="setPage({add:false})"
            >BATAL</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
    
    <script>
import { th } from "vuetify/lib/locale";
import { mapActions, mapState } from "vuex";

export default {
  name: "LO",
  data: () => ({
    num: 1,

    headers: [
      {
        text: "TH. NILAI",
        align: "center",
        sortable: false,
        value: "thnilai",
        width: 120,
      },
      {
        text: "PERATURAN",
        align: "center",
        sortable: false,
        value: "peraturan",
        width: 120,
      },
      {
        text: "N. SKP",
        align: "start",
        sortable: false,
        value: "nskp",
        width: 100,
      },
      {
        text: "N.INT",
        align: "start",
        sortable: false,
        value: "nintegritas",
        width: 100,
      },
      {
        text: "N.KOM",
        align: "start",
        sortable: false,
        value: "nkomitmen",
        width: 100,
      },
      {
        text: "N.DSP",
        align: "start",
        sortable: false,
        value: "ndisiplin",
        width: 100,
      },
      {
        text: "N.KJRS",
        align: "start",
        sortable: false,
        value: "nkerjasama",
        width: 100,
      },
      {
        text: "N.PIM",
        align: "start",
        sortable: false,
        value: "npimpin",
        width: 100,
      },
      {
        text: "N.PER",
        align: "start",
        sortable: false,
        value: "nperilaku",
        width: 100,
      },

      {
        text: "AKSI",
        value: "id",
        sortable: false,
        width: 75,
        align: "center",
      },
    ],
    status: [
      { text: "Aktif", value: 0 },
      { text: "Non Aktif", value: 1 },
    ],

    search: null,
    foto: "/",

    add: false,
    edit: false,
    kunit: null,
    unitkerjas: [],
  }),
  computed: {
    ...mapState([
      "page",
      "theme",
      "http",
      "device",
      "record",
      "records",
      "loading",
      "event",
    ]),
    filterItems() {
      if (this.search != null) {
        return this.records.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      } else {
        return this.records;
      }
    },
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/data/riw-skp/" + this.$route.params.nip,
      pagination: false,
      title: "DATA RIWAYAT SKP",
      subtitle:
        "Berikut Daftar Seluruh Riwayat SKP Yang Tersedia Yang Tersedia",
      edit: false,
      breadcrumbs: [
        {
          text: "DATA TALENTA",
          disabled: false,
          href: "",
        },
        {
          text: "Pegawai",
          disabled: false,
          href: "",
        },
        {
          text: "Riwayat SKP",
          disabled: false,
          href: "data-pegawai",
        },
      ],
      actions: {
        refresh: true,
        add: true,
        edit: false,
        delete: false,
        bulkdelete: false,
        help: false,
      },
      form: {
        add: false,
        edit: false,
      },
    });
    this.fetchRecords();
  },
  mounted() {},
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
    ]),
    addNewRecord: function () {
      this.setPage({
        add: true,
        edit: false,
      });
      this.foto = "#";
    },

    postAddNewRecord: function () {
      this.postAddNew(this.record).then(() => {
        this.fetchRecords();
        this.setPage({
          add: false,
          edit: false,
        });
      });
    },
    editRecord: function (val) {
      this.postEdit(val).then(() => {
        this.foto = this.record.path_url;
      });
      this.add = true;
      this.edit = true;
    },

    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.fetchRecords();
        this.add = false;
        this.edit = false;
      });
    },

    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },

    fetchUnitKerjas: async function () {
      try {
        let { data } = await this.http.post("api/combo/unitkerja");
        this.unitkerjas = data;
      } catch (error) {}
    },

    localFetchRecords: function () {
      this.setPage({
        dataUrl: "api/data/data-pegawai/" + this.kunit,
      });
    },

    uploadFoto: function () {
      this.assignFileBrowse({
        fileType: [".jpg", ".jpeg", ".png"],
        query: {
          doctype: "gallery",
        },
        callback: (response) => {
          setTimeout(() => {
            this.foto = response.path;
            this.record.filename = response.name;
          }, 1000);
        },
      });
    },
  },
};
</script>
    <style>
.box-dialog-content {
  margin-top: 20px;
  height: 50vh;
  overflow-y: scroll;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
    