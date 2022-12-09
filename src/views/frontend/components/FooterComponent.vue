<template>
  <div class="section-footer">
    <v-container>
      <v-row>
        <v-col :cols="device.desktop ? `5`:`12`">
          <img
            :src="info.app_logo"
            width="56px"
            height="60px"
            alt=""
            class=" mr-5 mt-1"
          >
          <div class="footer-title">{{info.app_company}}</div>
          <div class="address">{{ info.app_address }}</div>
        </v-col>
        <v-col :cols="device.desktop ? `4`:`12`">
          <div class="konten-kontak">
            <div class="kontak">Kontak</div>
            <div class="kontak-item">
              <v-icon color="white">mdi-map</v-icon>&nbsp; {{ info.app_address }}
            </div>
            <div class="kontak-item">
              <v-icon color="white">mdi-phone</v-icon>&nbsp; {{ info.app_wa }}
            </div>
          </div>
        </v-col>
        <v-col :cols="device.desktop ? `3`:`12`">
          <div class="sosial-media">Sosial Media</div>
          <div class="sosial-media-item">
            <v-icon
              @click="openLink('https://www.facebook.com/pemkabtangerang')"
              color="
              blue"
            >mdi-facebook</v-icon>&nbsp;Facebook
          </div>
          <div class="sosial-media-item">
            <v-icon
              @click="openLink('https://www.instagram.com/pemkabtangerang/?hl=id')"
              color="pink"
            >mdi-instagram</v-icon>&nbsp;Instagram
          </div>
        </v-col>

      </v-row>
      <v-row class="justify-center">
        <v-col
          cols="12"
          class="copyright mt-10"
        >
          <v-row class="justify-center">
            {{ info.app_company }} &copy; 2022
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "FooterComponent",
  data: () => ({}),
  mounted() {},
  computed: {
    ...mapState(["device", "theme", "info"]),
  },
  methods: {
    openLink: function (val) {
      window.open(val, "__blank");
    },
  },
  watch: {},
};
</script>

<style>
.section-footer {
  background-color: #c58804;
  padding-top: 15px;
}
.footer-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}
.copyright.col.col-12 {
  font-size: 8pt;
  color: white;
}
.address {
  font-size: 10pt;
  font-family: none;
  font-weight: 200;
  color: white;
}
.kontak {
  margin-bottom: 5px;
  color: white;
}
.kontak-item {
  font-size: 14px;
  color: white;
  padding: 2px;
}
.sosial-media {
  margin-bottom: 5px;
  color: white;
}
.sosial-media-item {
  font-size: 14px;
  color: white;
  padding: 2px;
}
</style>