<script>
import { Pie } from "vue-chartjs";
import { mapActions, mapState } from "vuex";

export default {
  extends: Pie,
  data: () => ({
    jmll: 0,
    jmlp: 0,
    data: [],
  }),
  computed: {
    ...mapState(["http"]),
  },
  created() {
    //this.fetchdata();
  },
  mounted() {
    this.fetchdata();
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 255,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 255, 0, 0.25)");

    this.gradient2.addColorStop(0, "rgba(0, 255, 0, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0,255, 0, 0.25)");
  },
  methods: {
    fetchdata: async function () {
      try {
        /*
                let {
                  data: { jmll, jmlp },
                } = await this.http.get("api/dashboard-perjeniskelamin");
        */
        this.data = [10, 30, 10, 5, 12, 20];

        this.renderChart(
          {
            labels: [
              "Sangat Baik",
              "Baik",
              "Cukup",
              "Kurang",
              "Buruk",
              "Belum Isi SKP",
            ],
            datasets: [
              {
                backgroundColor: [
                  "rgb(153, 0, 204)",

                  "rgb(0, 102, 255)",
                  "rgb(0, 153, 51)",
                  "rgb(255, 255, 0)",
                  "rgb(255, 153, 0)",
                  "rgb(255, 0, 0)",
                ],

                data: this.data,
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
              display: false,
            },
          }
        );
      } catch (error) {}
    },
  },
};
</script>