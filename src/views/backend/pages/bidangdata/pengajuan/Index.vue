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
              <span>Tambah Foto</span>
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
                  <v-list-item @click="openFormVerifikasi(value)">
                    <v-list-item-title>
                      <v-icon :color="theme.color">mdi-account-tie</v-icon>
                      Verifikasi Pengajuan
                    </v-list-item-title>
                  </v-list-item>
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
              v-model="settings"
              multiple
              active-class=""
            >
              <v-list-item
                v-for="item in filterItems"
                :key="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-title>{{ item.name }}</v-list-title>
                    <v-list-sub-title>{{ item.opd }}</v-list-sub-title>
                    <v-list-sub-title>{{ item.tanggal }}</v-list-sub-title>
                    <v-list-sub-title>
                      <v-chip
                        small
                        :color="item.status.color"
                      >{{ item.status.text }}</v-chip>
                    </v-list-sub-title>
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
                        <v-list-item
                          @click="editRecord(item.id)"
                          v-show="page.actions.edit"
                        >
                          <v-list-item-title>
                            <v-icon color="orange">mdi-pencil-circle</v-icon>
                            Ubah
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
      >,
        <v-card class="rounded-0">
          <v-toolbar
            :color="theme.color + ` lighten-1`"
            dark
          >
            <div class="box-icon-dialog">
              <v-icon class="mr-1">mdi-circle</v-icon>
            </div>
            Galllery Video
          </v-toolbar>
          <div :class="device.desktop ? `box-dialog-content `:``">
            <v-card-title class="justify-center">FORMULIR GALLERY VIDEO</v-card-title>
            <v-card-text style="border-">
              <v-row :no-gutters="device.mobile">
                <v-col cols="12">
                  <v-text-field
                    label="Judul"
                    :color="theme.color"
                    :hide-details="device.desktop"
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
                    label="Ulasan/Keterangan"
                    :color="theme.color"
                    v-model="record.description"
                    :hide-details="device.desktop"
                    outlined
                    :dense="device.desktop"
                    :filled="record.description"
                  >
                    {{ record.description }}
                  </v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Url Video"
                    :color="theme.color"
                    :hide-details="device.desktop"
                    autocomplete="off"
                    v-model="record.video_url"
                    outlined
                    :dense="device.desktop"
                    :filled="record.video_url"
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
              @click="postUpdateRecord"
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
  name: "page-pengajuan",
  data: () => ({
    num: 1,

    headers: [
      {
        text: "NIP",
        align: "start",
        sortable: false,
        value: "nip",
      },
      {
        text: "NAMA",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "OPD",
        value: "opd",
        sortable: false,
        width: 300,
        align: "left",
      },
      {
        text: "TGL. PNJ",
        value: "tanggal",
        sortable: false,
        width: 150,
        align: "center",
      },
      {
        text: "STATUS",
        value: "status",
        sortable: false,
        width: 150,
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
    foto: "/",
  }),
  computed: {
    ...mapState([
      "page",
      "form",
      "theme",
      "http",
      "device",
      "record",
      "records",
      "loading",
      "event",
      "table",
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
      dataUrl: "api/bidang-data/pengajuan",
      pagination: false,
      title: "DAFTAR PENGAJUAN",
      subtitle: "Berikut Daftar Seluruh Pengajuan Yang Tersedia",
      tableshow: true,
      breadcrumbs: [
        {
          text: "Daftar Pengajuan",
          disabled: true,
          href: "halaman-depan-video",
        },
      ],
      actions: {
        refresh: true,
        add: false,
        edit: false,
        delete: false,
        bulkdelete: false,
        print: false,
        export: false,
        help: false,
      },
    });
    this.fetchRecords().then(() => {
      setTimeout(() => {
        this.table.options.itemsPerPage =
          this.$route.params.itemsPerPage || this.table.options.itemsPerPage;
        this.table.options.page =
          this.$route.params.page || this.table.options.page;
      }, 100);
    });
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
      "setForm",
      "setRecord",
    ]),
    openForm: function () {
      this.setForm({
        add: true,
        edit: false,
      });
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
      this.foto = "#";
    },

    postAddNewRecord: function () {
      this.postAddNew(this.record).then(() => {
        this.closeForm();
      });
    },
    editRecord: function (val) {
      this.postEdit(val).then(() => {
        this.foto = this.record.path_url;
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
    playVideo() {
      this.player.playVideo();
    },
    playing() {
      console.log("o/ we are watching!!!");
    },
    openFormVerifikasi: function (val) {
      this.$router.push({
        name: "bidang-data-pengajuan-form-verifikasi",
        params: {
          pengajuan_uuid: val,
          itemsPerPage: this.table.options.itemsPerPage,
          page: this.table.options.page,
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
    