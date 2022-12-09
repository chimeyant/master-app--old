<template>
  <v-row>
    <v-col cols="12">
      <v-parallax
        height="78"
        src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      >
        <v-container>
          <div class="lokasi-title">LOKASI KUNJUNGAN</div>
          <div>

          </div>
        </v-container>
      </v-parallax>
    </v-col>
    <v-col>

      <carousel-3d
        :width="device.desktop ? 500:300"
        :height="device.desktop ?400:300"
        border="0"
      >
        <slide
          v-for="(slide, i) in records"
          :index="i"
          :key="i"
        >
          <img
            :src="slide.path"
            alt=""
            :height="device.desktop ? 320:230 "
            @click="postShowLokasi(slide.id)"
          >
          <div :class="device.desktop ? `orange darken-2 slider-title-item` : `orange darken-2 slider-title-item-mobile`">
            {{ slide.name }}
          </div>
        </slide>
      </carousel-3d>
    </v-col>
    <v-col cols=12>
      <v-container>
        <v-card class="grey">
          <v-tabs
            color="deep-purple accent-4"
            center
          >
            <v-tab>INFORMASI</v-tab>
            <v-tab>LOKASI</v-tab>
            <v-tab>FOTO</v-tab>

            <v-tab-item key="1">
              <v-container>
                <v-row>
                  <v-col :cols="device.desktop ? 6:12">
                    <div class="m-3">
                      <div class="profil-title">{{ record.name }}</div>
                      <div class="profil-content">{{ record.description }}</div>
                    </div>
                  </v-col>
                  <v-col :cols="device.desktop ? 6:12">
                    <div>

                      <youtube
                        :video-id="videoId"
                        ref="youtube"
                        @playing="playing"
                        :width="device.desktop?  500:350"
                      />

                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item key="2">
              <v-container>
                <v-col cols="12">
                  <l-map
                    style="height: 500px ; z-index:0 ;"
                    :zoom="zoom"
                    :center="center"
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

                </v-col>
              </v-container>
            </v-tab-item>
            <v-tab-item key="3">
              <v-container fluid>
                <v-row>
                  <v-col
                    v-for="(item, i) in record.foto_files"
                    :key="i"
                    cols="12"
                    md="4"
                  >
                    <v-img
                      :src="record.path + item.name"
                      :lazy-src="record.path + item.name"
                      aspect-ratio="1"
                    ></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Carousel3d, Slide } from "vue-carousel-3d";
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
  name: "lokasi-component",
  components: {
    Carousel3d,
    Slide,
    LMap,
    LTileLayer,
    LMarker,
    VGeosearch,
    LIcon,
    LPopup,
    LTooltip,
  },
  data: () => ({
    //data lokasi
    records: [],
    record: {},
    //property map
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 11,
    //-6.1716001, 106.6405384
    center: [-6.1716001, 106.6405384],

    geosearchOptions: {
      // Important part Here
      provider: new OpenStreetMapProvider(),
    },

    marker: {
      id: "m1",
      position: { lat: -6.1716001, lng: 106.6405384 },
      tooltip: "Lokasi",
      draggable: false,
      visible: true,
    },
    marker2: {
      id: "m2",
      position: { lat: -6.2546, lng: 106.6405384 },
      tooltip:
        "<h4>Lampu Merah 2</h4><p>Rambu Lampu Merah Stopan Pemda Tigaraksa </p><p>Kondisi Baik</p>",
      draggable: false,
      visible: true,
    },

    markers: [],

    videoId: "",
  }),
  mounted() {
    this.setPage({
      crud: false,
    });

    this.fetchLokasi();
  },

  computed: {
    ...mapState(["device", "theme", "info", "http", "snackbar", "auth"]),
  },
  methods: {
    ...mapActions(["setPage"]),
    fetchLokasi: async function () {
      try {
        let { data } = await this.http.get("api/daftar-lokasi");
        this.records = data;
        setTimeout(function () {
          window.dispatchEvent(new Event("resize"));
        }, 250);
      } catch (error) {}
    },
    postShowLokasi: async function (val) {
      try {
        let { data } = await this.http.get("api/show-lokasi/" + val);
        this.record = data;
        this.videoId = data.video_url;
        this.marker.position = data.position;
        this.marker.tooltip = data.name;
        this.center(data.lat, data.lng);
      } catch (error) {}
    },
    centerUpdated(center) {
      this.center = center;
    },
  },
};
</script>

<style>
.lokasi-title {
  font-size: 16px;
  font-weight: 500;
}
.slider-title-item {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  padding: 20px;
  height: 100%;
  justify-content: center;
}
.slider-title-item-mobile {
  font-size: 12px;
  font-weight: bold;
  display: flex;
  padding: 20px;
  height: 100%;
  justify-content: center;
}
.profil-title {
  font-size: 20px;
  font-weight: 500;
}
.profil-content {
  margin-top: 10px;
  font-size: 10pt;
  font-weight: 400;
  text-align: justify;
}
</style>