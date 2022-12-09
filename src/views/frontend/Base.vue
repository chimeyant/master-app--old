 <template>
  <v-app>
    <HeaderComponentVue />
    <v-main>
      <router-view></router-view>
    </v-main>
    <FooterComponentVue />

    <v-snackbar
      v-model="snackbar.state"
      :color="snackbar.color"
      :timeout="3500"
      multi-line
    >
      <v-row>
        <v-col :cols="device.desktop ? 2: 2">
          <div style="background-color">
            <img
              :src="info.app_logo"
              width="32px"
              height="32px"
              alt=""
              class="mt-1"
            >
          </div>
        </v-col>
        <v-col cols="10">

          {{ snackbar.text }}
        </v-col>
      </v-row>

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbarClose"
        >
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import HeaderComponentVue from "./components/HeaderComponent.vue";
import FooterComponentVue from "./components/FooterComponent.vue";

export default {
  name: "BaseFrontend",
  components: {
    HeaderComponentVue,
    FooterComponentVue,
  },
  data: () => ({}),
  mounted() {
    this.setPage({
      crud: true,
    }).then(() => {
      this.getAppInfo().then(() => {
        this.getAppInfo().then(() => {
          window.document.title = this.info.app_company;
          const favicon = window.document.getElementById("favicon");
          favicon.href = this.info.apps_logo;
        });
      });
    });
  },
  computed: {
    ...mapState(["device", "theme", "info", "snackbar"]),
  },
  methods: {
    ...mapActions(["setPage", "getAppInfo", "snackbarClose"]),
  },
  watch: {},
};
</script>

<style lang="sass">
@import "../../assets/css/wow.css"
</style>