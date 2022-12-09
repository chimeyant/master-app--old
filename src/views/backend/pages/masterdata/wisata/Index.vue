<template>
  <div :class="device.desktop ? `home pa-6 grey lighten-4`:`home pa-0 grey lighten-4`">
    <v-row>
      <v-col cols="12">
        <v-card class="animated animate__backInUp rounded-0 ">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
            <v-tooltip
              :color="theme.color "
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
                  >mdi-help-circle</v-icon>
                </v-btn>
              </template>
              <span>Petunjuk Modul</span>
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
                    @click="openNewForm"
                  >mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Hapus Data</span>
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
              style="max-width: 350px"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-show="device.desktop"
            :headers="headers"
            :items="records"
            :items-per-page="10"
            class="elevation-2"
            :color="theme.color"
            :loading="loading.table"
            loading-text="Loading... Please wait"
            :search="search"
            show-select
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
                  >
                    mdi-dots-vertical-circle-outline
                  </v-icon>
                </template>

                <v-list>
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
          <v-list
            subheader
            single-line
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
                style="border: ;1px solid"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
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
                  </v-list-item-action>

                </template>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="form.new"
        :max-width="device.desktop ? `600px` : `100%`"
        persistent
        :fullscreen="device.mobile"
      >
        <v-card class="rounded-0">
          <v-toolbar
            :color="theme.color"
            :dark="theme.mode"
          >
            <v-icon class="mr-1">mdi-circle</v-icon> Formulir Pengaturan Hotel
          </v-toolbar>
          <v-card-text class="mt-2">
            <v-col col="12">
              <v-text-field
                outlined
                :color="theme.color"
                hide-details
                label="Daerah Wisatan"
                v-model="record.name"
                :filled="record.name"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                label="Profil/Keterangan"
                :color="theme.color"
                dense
                outlined
                v-model="record.description"
                :filled="record.description"
                hide-details
              >
                {{ record.description }}
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Alamat"
                :color="theme.color"
                dense
                outlined
                v-model="record.address"
                :filled="record.address"
                hide-details
                rows="2"
              >
                {{ record.address }}
              </v-textarea>
            </v-col>

            <v-col col="12">
              <v-text-field
                outlined
                :color="theme.color"
                hide-details
                label="Youtube Video ID"
                v-model="record.video_url"
                :filled="record.video_url"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols=12>
              <v-card>
                <v-card-title style="font-size:12pt ;">Upload Foto
                  <v-spacer></v-spacer>
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
                          :color="theme.color"
                          @click="uploadFile"
                        >add_circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Tambah Foto</span>
                  </v-tooltip>
                </v-card-title>

                <v-data-table
                  :headers="foto.headers"
                  :items="foto.records"
                  :items-per-page="10"
                  class="elevation-2"
                  :color="theme.color"
                  :loading="loading.table"
                  loading-text="Loading... Please wait"
                  :search="search"
                  hide-default-header
                  hide-default-footer
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
                        >mdi-dots-vertical-circle-outline</v-icon>
                      </template>

                      <v-list>
                        <v-list>
                          <v-list-item @click="deleteFoto(value)">
                            <v-list-item-title>
                              <v-icon color="red">mdi-delete-circle</v-icon>Hapus
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>

                      </v-list>
                    </v-menu>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-row class="justify-center mb-5 mt-5 title">PETA LOKASI</v-row>
            <v-col>
              <v-img
                height="100%"
                width="100%"
              >

                <l-map
                  style="height: 300px;width: 100%;z-index:9999; "
                  :zoom="zoom"
                  :center="center"
                  @update:center="centerUpdated"
                >
                  <v-geosearch
                    :options="geosearchOptions"
                    style="width:100px; border: 1px;"
                  ></v-geosearch>
                  <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                  ></l-tile-layer>
                  <l-marker
                    :key="marker.id"
                    :visible="marker.visible"
                    :draggable="marker.draggable"
                    :lat-lng.sync="marker.position"
                  >

                    <l-icon
                      iconSize=32
                      icon-url="/images/icon-marker-merah.png"
                    />
                    <l-popup :content="marker.tooltip" />
                    <l-tooltip :content="marker.tooltip" />
                  </l-marker>
                </l-map>

              </v-img>

            </v-col>

            <v-col cols="12">
              <v-row>

                <v-col :cols="device.desktop ? `6`:`12`">
                  <v-text-field
                    label="Garis Lintang"
                    outlined
                    dense
                    hide-details
                    v-model="record.lat"
                  ></v-text-field>
                </v-col>
                <v-col :cols="device.desktop ? `6`:`12`">
                  <v-text-field
                    label="Garis Bujur"
                    outlined
                    dense
                    hide-details
                    v-model="record.lng"
                  ></v-text-field>
                </v-col>

              </v-row>
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

<script>
import { mapActions, mapState } from "vuex";
import "animate.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
  LTooltip,
} from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import "leaflet/dist/leaflet.css";

export default {
  name: "Lokasi",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    VGeosearch,
    LIcon,
    LPopup,
    LTooltip,
  },
  data: () => ({
    num: 1,
    headers: [
      {
        text: "DAERAH WISATA",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "ALAMAT", value: "address", align: "left" },
      {
        text: "AKSI",
        value: "id",
        width: 100,
        sortable: false,
        align: "center",
      },
    ],
    form: {
      new: false,
      edit: false,
    },
    search: null,
    path: null,

    //foto proerty
    foto: {
      filename: null,
      headers: [
        {
          text: "FOTO",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "AKSI",
          value: "id",
          width: 50,
          sortable: false,
          align: "right",
        },
      ],
      records: [],
    },

    //maps property
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 13,
    //-6.1716001, 106.6405384
    center: [-6.1716001, 106.6405384],

    geosearchOptions: {
      // Important part Here
      provider: new OpenStreetMapProvider(),
    },
    marker: {
      id: "m1",
      position: { lat: -6.1716001, lng: 106.6405384 },
      tooltip: "Pilih lokasi daerah wisata",
      draggable: true,
      visible: true,
    },
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
      "snackbar",
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
      dataUrl: "api/superadmin/master-data/wisata",
      pagination: false,
      title: "MANAJEMEN DAERAH WISATA",
      subtitle: "Berikut Daftar Seluruh Daerah Wisata Yang Tersedia",
      breadcrumbs: [
        {
          text: "Manajemen Daerah Wisata",
          disabled: false,
          href: "wisata",
        },
        {
          text: "Daerah Wisata",
          disabled: false,
          href: "master-wisata",
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
      "setLoading",
      "setRecord",
    ]),
    openNewForm: function () {
      this.setRecord({});
      this.form.new = true;
      this.form.edit = false;
      this.foto.records = [];
      this.getUserPosition();
      this.centerUpdated([-6.1716001, 106.6405384]);
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 250);
    },
    closeNewForm: function () {
      this.form.new = false;
      this.form.edit = false;
    },
    openEditForm: function () {
      this.form.new = true;
      this.form.edit = true;
    },
    postAddNewRecord: function () {
      this.record.foto_files = this.foto.records;
      this.postAddNew(this.record).then(() => {
        this.fetchRecords();
        this.form.new = false;
      });
    },
    editRecord: function (val) {
      this.postEdit(val).then(() => {
        this.foto.records = this.record.foto_files;
        this.marker.position = { lat: this.record.lat, lng: this.record.lng };
        this.centerUpdated([this.record.lat, this.record.lng]);
      });
      this.form.new = true;
      this.form.edit = true;
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 250);
    },
    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.fetchRecords();
        this.form.new = false;
        this.form.edit = false;
      });
    },
    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },
    uploadFile: function () {
      this.assignFileBrowse({
        fileType: [".png", ".jpg", ".jpeg"],
        query: {
          doctype: "documents",
        },
        callback: (response) => {
          setTimeout(() => {
            const row = {};
            row["id"] = response.name;
            row["name"] = response.name;
            this.foto.records.push(row);
          }, 500);
        },
      });
    },
    postDownload(val) {
      window.open(val, "__blank");
    },
    deleteFoto: function (val) {
      var index = this.foto.records.findIndex(function (o) {
        return o.id === val;
      });
      if (index !== -1) this.foto.records.splice(index, 1);
    },
    openRegency: function (val) {
      this.$router.push({
        name: "master-regency",
        params: {
          province_id: val,
        },
      });
    },
    getUserPosition: async function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.center = [pos.coords.latitude, pos.coords.longitude];
          this.marker.position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        });
      }
    },
    centerUpdated(center) {
      this.center = center;
    },
  },
  watch: {
    "marker.position": {
      handler() {
        this.record.lat = this.marker.position.lat;
        this.record.lng = this.marker.position.lng;
      },
      deep: true,
    },
  },
};
</script>