<template>
  <v-row>
    <v-col cols="12">
      <v-parallax
        height="78"
        src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      >
        <v-container>
          <div class="lokasi-title">MEDIA</div>
          <div>

          </div>
        </v-container>
      </v-parallax>
    </v-col>
    <v-col cols=12>
      <v-container>
        <div class="mb-5">
          Berikut adalah dokumen-dokumen yang mungkin anda perlukan selama mengikuti acara City Sanitation Summit XX Kabupaten Tangerang
        </div>
        <v-card class="grey">
          <v-list two-line>
            <v-list-item-group v-model="selected">
              <template v-for="(item, index) in medias">
                <v-list-item :key="item.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-bold mb-1"
                        v-text="item.name"
                      ></v-list-item-title>

                      <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon
                        :color="theme.color"
                        @click="openDownload(item.path)"
                      >
                        mdi-cloud-download
                      </v-icon>

                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
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
  name: "media-component",
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

    videoId: "",

    medias: [],

    items: [
      {
        action: "15 min",
        headline: "Brunch this weekend?",
        subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        title: "Ali Connors",
      },
      {
        action: "2 hr",
        headline: "Summer BBQ",
        subtitle: `Wish I could come, but I'm out of town this weekend.`,
        title: "me, Scrott, Jennifer",
      },
      {
        action: "6 hr",
        headline: "Oui oui",
        subtitle: "Do you have Paris recommendations? Have you ever been?",
        title: "Sandra Adams",
      },
      {
        action: "12 hr",
        headline: "Birthday gift",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?",
        title: "Trevor Hansen",
      },
      {
        action: "18hr",
        headline: "Recipe to try",
        subtitle:
          "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
        title: "Britta Holt",
      },
    ],
  }),
  mounted() {
    this.setPage({
      crud: false,
    });
    this.fetchShowMedia();
  },

  computed: {
    ...mapState(["device", "theme", "info", "http", "snackbar", "auth"]),
  },
  methods: {
    ...mapActions(["setPage"]),
    fetchShowMedia: async function () {
      try {
        let { data } = await this.http.get("api/show-media");
        this.medias = data;
      } catch (error) {}
    },

    openDownload: function (val) {
      window.open(val, "__blank");
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
  font-size: 20px;
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