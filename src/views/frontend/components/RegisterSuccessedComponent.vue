<template>
  <v-container>
    <v-row>
      <v-col
        class="mt-10"
        cols="6"
        v-show="device.desktop"
      >
        <v-row class="justify-content-center animated animate__fadeInLeft">
          <img
            class="mt-10"
            src="/images/register-succesed.svg"
            height="400px"
            alt=""
          >
        </v-row>
      </v-col>
      <v-col
        :cols="device.desktop ?`6`:`12`"
        class="animated animate__fadeInRight"
      >

        <div :class="device.desktop ?`register-berhasil-title`:`register-berhasil-title-mobile`">
          Selamat..!, Registrasi Berhasil
          <br>
          <div class="register-berhasil-subtitle">
            Proses Registrasi anda telah berhasil, adapun untuk mengikuti informasi, jadwal dan lainhya yang terdapat dalam kegiatan City Sanitation Summit XXX Kabupaten Tangerang, silahkan anda login ke aplikasi yang telah kamu siapkan.
          </div>
          <div class="mt-10">
            <v-btn
              outlined
              :color="theme.color"
              @click="downloadBuktiPendaftaran"
            >DOWNLOAD BUKTI REGISTRASI</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { jsPDF } from "jspdf";
import QRious from "qrious";
import "jspdf-barcode";
import { mapState, mapActions } from "vuex";
import "animate.css";

export default {
  name: "LoginComponent",
  data: () => ({
    name: null,
    email: null,
    phone: null,
    password: null,
    password_confirmation: null,
    province_uuid: null,
    regency_uuid: null,
    instansi: null,
    jabatan: null,
    lokasi_uuid: null,

    //data bind
    provinces: [],
    regencies: [],
    lokasis: [],
    data: {},
  }),
  mounted() {
    this.setPage({
      crud: false,
    });
    this.fetchRegistrasiBerhasil();
    window.scrollTo(0, top);
  },
  computed: {
    ...mapState(["device", "theme", "info", "http", "snackbar", "auth"]),
  },
  methods: {
    ...mapActions(["setPage", "signIn"]),
    fetchRegistrasiBerhasil: async function () {
      try {
        let { data } = await this.http.get(
          "api/registrasi-berhasil/" + this.$route.params.uuid
        );

        this.data = data;
      } catch (error) {}
    },
    downloadBuktiPendaftaran: function () {
      let newLogoProv = new Image();
      newLogoProv.src = "/images/css.png";

      var qr = new QRious({
        value: this.data.noreg,
      });

      var qrimage = qr.toDataURL();

      var doc = new jsPDF();

      var centeredText = function (text, y) {
        var textWidth =
          (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, y, text);
      };
      //doc.addImage(newLogoProv, "JPEG", 10, 15, 15, 17);
      doc.setFontSize(10);
      doc.setDrawColor(102, 153, 255);
      doc.setFillColor(102, 153, 255);
      doc.roundedRect(10, 10, 190, 10, 1, 1, "FD");
      doc.text(
        "Mohon tunjukan bukti konfirmasi ini pada saat acara berlangsung.",
        20,
        16
      );
      doc.setLineWidth(1);
      doc.setDrawColor(128, 128, 128);
      doc.rect(10, 25, 190, 100);
      doc.rect(15, 25, 0, 100);
      doc.rect(150, 25, 0, 100);
      doc.rect(15, 45, 135, 0);
      doc.rect(80, 45, 0, 35);
      doc.rect(15, 80, 185, 0);
      doc.rect(15, 100, 135, 0);
      //TEXT
      doc.setFontSize(12);
      doc.setTextColor(128, 128, 128);
      doc.setFont("times", "", "bold");
      doc.text("Acara", 20, 30);
      doc.setTextColor(0);
      doc.text("6-9 SEPTEMBER 2022 - CITY SANITATION SUMMIT XX", 20, 38);
      doc.setFontSize(12);
      doc.setTextColor(128, 128, 128);
      doc.setFont("times", "", "bold");
      doc.text("Waktu", 20, 50);
      doc.text("Lokasi", 83, 50);
      doc.setTextColor(0);
      doc.text("Selasa, 6 September 2022", 20, 55);
      doc.text("19.00 WIB", 20, 60);
      doc.text("ICE BSD", 83, 55);
      doc.setFontSize(8);
      doc.setFont("times", "", "normal");
      doc.text("Jl. BSD Grand Boulevard No.1, Pagedangan,", 83, 60);
      doc.text("Kec. Pagedangan, Kabupaten Tangerang, Banten 15339", 83, 65);

      //kolom peserta
      doc.setFontSize(12);
      doc.setTextColor(128, 128, 128);
      doc.setFont("times", "", "bold");
      doc.text("Peserta", 20, 85);
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(this.data.name.toUpperCase(), 20, 90);
      doc.setFont("times", "", "normal");
      doc.setFontSize(10);
      doc.text(this.data.instansi.toUpperCase(), 20, 95);
      doc.text(
        "- Konfirmasi kehadiran dan informasi acara dapat menghubungi sdr/i " +
          this.data.lo.name +
          " - " +
          this.data.lo.phone +
          "",
        10,
        140
      );

      doc.addImage(newLogoProv, "JPEG", 160, 30, 35, 40);
      doc.addImage(qrimage, "JPEG", 160, 90, 30, 30);
      doc.text(this.data.noreg, 70, 120);

      doc.barcode(this.data.noreg, {
        fontSize: 40,
        textColor: "#000000",
        x: 50,
        y: 115,
      });

      doc.save("Bukti-Pendaftaran" + ".pdf");
    },
  },
};
</script>

<style>
.register-berhasil-title {
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  padding-top: 25px;
  padding-bottom: 10px;
  color: grey;
  margin-top: 20px;
}
.register-berhasil-title-mobile {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  padding-top: 25px;
  padding-bottom: 10px;
  color: grey;
  margin-top: 20px;
}
.login-subtitle {
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: gray;
}
.other-sign-in-red {
  border: red solid;
  border-radius: 5px;
  margin: 5px;
}
.other-sign-in-blue {
  border: blue solid;
  border-radius: 5px;
  margin: 5px;
}

.row.forget-password {
  font-size: 12px;
  font-weight: 400;
  justify-content: end;
  margin-top: 30px;
  margin-right: 2px;
  color: grey;
}

.register-berhasil-subtitle {
  font-size: 15px;
  margin-top: 20px;
  font-weight: 500;
}
</style>