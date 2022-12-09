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
                    @click="openForm"
                  >add_circle</v-icon>
                </v-btn>
              </template>
              <span>Tambah Slider</span>
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
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pencarian"
              single-line
              hide-details
              dense
              solo
              :color="theme.color + ` lighten-1`"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-show="device.desktop"
            :headers="headers"
            :items="records"
            :items-per-page="table.options.itemsPerPage"
            :page.sync="table.options.page"
            class="elevation-2 mb-1"
            :color="theme.color"
            :loading="loading.table"
            loading-text="Loading... Please wait"
            :search="search"
            hide-default-footer
            @page-count="table.options.pageCount = $event"
            show-select
          >
            <v-progress-linear
              slot="progress"
              :color="theme.color"
              height="1"
              indeterminate
            ></v-progress-linear>

            <template v-slot:item.status="{ value }">
              <v-chip
                small
                :color="value.color"
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
                  >
                    mdi-dots-vertical-circle-outline
                  </v-icon>
                </template>

                <v-list>
                  <v-list-item
                    @click="editRecord(value)"
                    v-show="page.actions.edit"
                  >
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>
                      Ubah
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
              multiple
              active-class=""
            >
              <v-list-item
                v-for="item in filterItems"
                :key="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-content>
                    <v-list-sub-title>
                      {{ item.name }}
                    </v-list-sub-title>
                  </v-list-content>
                  <v-spacer></v-spacer>
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
                        <v-list-item
                          @click="editRecord(item.id)"
                          v-show="page.actions.edit"
                        >
                          <v-list-item-title>
                            <v-icon color="orange">mdi-pencil-circle</v-icon>
                            Edit
                          </v-list-item-title>
                        </v-list-item>

                        <v-list-item
                          @click="postDeleteRecord(item.id)"
                          v-show="page.actions.delete"
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
        v-model="form.add"
        :max-width="device.desktop ? `600px` : `100%`"
        persistent
        :fullscreen="device.mobile"
      >
        <v-card class="rounded-0">
          <v-toolbar
            :color="theme.color + ` lighten-1`"
            dark
          >
            <div class="box-icon-dialog">
              <v-icon class="mr-1">mdi-circle</v-icon>
              DAFTAR KEGIATAN
            </div>

          </v-toolbar>
          <div :class="device.desktop ? `box-dialog-content `:``">
            <v-card-title class="justify-center">FORMULIR KEGIATAN</v-card-title>
            <v-card-text style="border-">

              <v-col cols="12">
                <v-text-field
                  label="Nama Kegiatan"
                  :color="theme.color"
                  hide-details
                  autocomplete="off"
                  v-model="record.name"
                  outlined
                  :dense="device.desktop"
                  :filled="record.name"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Keterangan/Penjelasan Kegiatan"
                  :color="theme.color"
                  v-model="record.description"
                  hide-details
                  outlined
                  :dense="device.desktop"
                  :filled="record.description"
                >
                  {{ record.description }}
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Tanggal Mulai"
                      :color="theme.color"
                      hide-details
                      autocomplete="off"
                      v-model="record.start_date"
                      outlined
                      :dense="device.desktop"
                      :filled="record.start_date"
                      type="date"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Tanggal Selesai"
                      :color="theme.color"
                      hide-details
                      autocomplete="off"
                      v-model="record.end_date"
                      outlined
                      :dense="device.desktop"
                      :filled="record.end_date"
                      type="date"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Lokasi"
                  :color="theme.color"
                  hide-details
                  autocomplete="off"
                  v-model="record.location"
                  outlined
                  :dense="device.desktop"
                  :filled="record.location"
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-switch
                  label="Aktif"
                  :color="theme.color"
                  outlined
                  dense
                  hide-details
                  v-model="record.status"
                ></v-switch>
              </v-col>

            </v-card-text>
          </div>
          <v-card-actions class="flex flex-row-reverse">
            <v-btn
              outlined
              :color="theme.color"
              @click="postAddNewRecord"
              v-show="!form.edit"
            >TAMBAH</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              @click="postUpdateRecord"
              v-show="form.edit"
            >UBAH</v-btn>
            <v-btn
              outlined
              class="mr-2"
              color="grey dark-3"
              @click="closeForm"
            >BATAL</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
  
  <script>
import { mapActions, mapState } from "vuex";

export default {
  name: "page-kegiatan",
  data: () => ({
    num: 1,

    headers: [
      {
        text: "NAMA KEGIATAN",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "WAKTU",
        value: "waktu",
        sortable: false,
        width: 300,
        align: "center",
      },
      {
        text: "LOKASI",
        value: "location",
        sortable: false,
        align: "left",
      },
      {
        text: "STATUS",
        value: "status",
        sortable: false,
        align: "center",
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
    filename: null,

    add: false,
    edit: false,
  }),
  computed: {
    ...mapState([
      "page",
      "form",
      "table",
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
      dataUrl: "api/operator/kegiatans",
      pagination: false,
      title: "DAFTAR KEGIATAN",
      subtitle: "Berikut Daftar Seluruh Kegiatan Yang Tersedia Yang Tersedia",
      tableshow: true,
      breadcrumbs: [
        {
          text: "Daftar Kegiatan",
          disabled: true,
          href: "",
        },
      ],
      actions: {
        refresh: true,
        add: true,
        edit: true,
        delete: true,
        bulkdelete: false,
        print: false,
        export: false,
        help: false,
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
      "setRecord",
      "setForm",
    ]),
    openForm: function () {
      this.setForm({
        add: true,
        edit: false,
      });
      this.setRecord({});
    },
    closeForm: function () {
      this.setForm({
        add: false,
        edit: false,
      });
    },
    addNewRecord: function () {
      this.setPage({
        add: true,
        edit: false,
      });
      this.setRecord({});
      this.filename = null;
    },

    postAddNewRecord: function () {
      this.postAddNew(this.record).then(() => {
        this.closeForm();
      });
    },
    editRecord: function (val) {
      this.postEdit(val).then(() => {
        this.filename = this.record.filename;
      });
      this.setForm({
        add: true,
        edit: true,
      });
    },

    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.closeForm();
      });
    },

    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },

    uploadFile: function () {
      this.assignFileBrowse({
        fileType: [
          ".jpg",
          ".jpeg",
          ".png",
          ".pdf",
          ".doc",
          "docx",
          ".xls",
          ".xlsx",
        ],
        query: {
          doctype: "documents",
        },
        callback: (response) => {
          setTimeout(() => {
            this.filename = response.name;
            this.record.filename = response.name;
          }, 1000);
        },
      });
    },

    download: function (val) {
      window.open(val, "__blank");
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
  