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
                >
                  <v-icon
                    color="white"
                    @click="addNewRecord"
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
            <template v-slot:item.video="{ value }">

              <youtube
                class="mt-2 mb6"
                :video-id="value"
                ref="youtube"
                @playing="playing"
                :width="device.desktop?  90:`100%`"
                :height="device.desktop? '50':`100%`"
              />
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
                    v-show="false"
                  >
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>
                      Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="postDeleteRecord(value)">
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
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.phone }} </v-list-item-subtitle>
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
                        <v-list-item
                          @click="editRecord(item.id)"
                          v-if="false"
                        >
                          <v-list-item-title>
                            <v-icon color="orange">mdi-pencil-circle</v-icon>
                            Edit
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="postDeleteRecord(item.id)">
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
import { mapActions, mapState } from "vuex";

export default {
  name: "pengaturan-nomor",
  data: () => ({
    num: 1,

    headers: [
      {
        text: "NAMA",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "PHONE",
        value: "phone",
        sortable: false,
        width: 300,
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

    add: false,
    edit: false,
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
      dataUrl: "api/superadmin/master-data/lo",
      pagination: false,
      title: "DAFTAR LO",
      subtitle: "Berikut Daftar Seluruh LO Yang Tersedia Yang Tersedia",
      edit: false,
      breadcrumbs: [
        {
          text: "DAFTAR",
          disabled: false,
          href: "master-lo",
        },
        {
          text: "LO",
          disabled: false,
          href: "master-lo",
        },
      ],
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
