import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
//import "./plugins/bootstrap-vue";
import { mapActions } from "vuex";
import tinymce from "vue-tinymce-editor";
Vue.component("tinymce", tinymce);
import VueYoutube from "vue-youtube";
import AOS from "aos";
import "aos/dist/aos.css";
import Flicking from "@egjs/vue-flicking";
import "@egjs/vue-flicking/dist/flicking.css";
// Or, if you have to support IE9
import "@egjs/vue-flicking/dist/flicking-inline.css";
import VueAgile from "vue-agile";

Vue.use(VueAgile);

Vue.use(Flicking);

Vue.use(VueYoutube);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  mounted() {
    this.deviceResize();
    AOS.init();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.deviceResize, {
        passive: true,
      });
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.deviceResize, {
        passive: true,
      });
    }
  },
  data: () => ({}),
  methods: {
    ...mapActions(["deviceResize"]),
  },
  render: (h) => h(App),
}).$mount("#app");
