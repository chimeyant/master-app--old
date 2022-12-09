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
            src="/images/register.png"
            height="400px"
            alt=""
          >
        </v-row>
      </v-col>
      <v-col
        :cols="device.desktop ?`6`:`12`"
        class="animated animate__fadeInRight"
      >

        <div class="login-title">
          FORMULIR REGISTRASI
          <br>
          (KHUSUS UNTUK DELEGASI)
        </div>
        <div class="login-subtitle">
          Silahkan isi formulir pendaftaran dibawah ini dengan benar...!
        </div>
        <div :class="device.desktop ? `mt-10 pl-15 pr-15`: `mt-5`">
          <v-col cols="12">
            <v-autocomplete
              label="Provinsi"
              outlined
              dense
              hide-details
              v-model="province_uuid"
              :items="provinces"
              @change="fetchRegencies"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Kabupaten"
              outlined
              dense
              hide-details
              v-model="regency_uuid"
              :items="regencies"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              label="Lokasi Kunjungan"
              outlined
              dense
              hide-details
              v-model="lokasi_uuid"
              :items="lokasis"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Nama Instansi"
              outlined
              placeholder="DISKOMIFO KAB. TANGERANG"
              dense
              hide-details
              v-model="instansi"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Pilih Jabatan Anda"
              outlined
              dense
              hide-details
              v-model="kode_jabatan"
              :items="jabatans"
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            v-if="kode_jabatan=='lainnya' ? true:false"
          >
            <v-text-field
              label="Tulis Jabatan"
              outlined
              placeholder="Lainnya"
              dense
              hide-details
              v-model="jabatan"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Nama Lengkap"
              outlined
              placeholder="Nama Lengkap"
              dense
              hide-details
              v-model="name"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Email"
              outlined
              placeholder="Email"
              dense
              hide-details
              v-model="email"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Nomor Telpon (HP/WA)"
              outlined
              placeholder="Contoh: 081280008XXX"
              dense
              hide-details
              v-model="phone"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-row class="pr-4 pt-5 pb-5">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                dense
                :color="theme.color"
                @click="postRegister"
              >Kirim</v-btn>
            </v-row>
          </v-col>

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import "animate.css";
export default {
  name: "LoginComponent",
  data: () => ({
    name: null,
    email: null,
    phone: null,
    province_uuid: null,
    regency_uuid: null,
    instansi: null,
    kode_jabatan: null,
    jabatan: null,
    lokasi_uuid: null,

    //data bind
    provinces: [],
    regencies: [],
    lokasis: [],
    jabatans: [
      { text: "Kepala Daerah", value: "kepala-daerah" },
      { text: "Sekretaris Daerah", value: "sekretaris-daerah" },
      { text: "Kepala Dinas/Badan", value: "kepala-dinas" },
      { text: "Lainnya", value: "lainnya" },
    ],
  }),
  mounted() {
    this.setPage({
      crud: false,
    });
    this.fetchProvinces();
    this.fetchLokasis();
    window.scrollTo(0, top);
  },
  computed: {
    ...mapState(["device", "theme", "info", "http", "snackbar", "auth"]),
  },
  methods: {
    ...mapActions(["setPage", "signIn"]),
    fetchProvinces: async function () {
      try {
        let { data } = await this.http.post("api/combo/province");
        this.provinces = data;
      } catch (error) {}
    },
    fetchRegencies: async function () {
      try {
        let { data } = await this.http.post("api/combo/regency", {
          province_uuid: this.province_uuid,
        });
        this.regencies = data;
      } catch (error) {}
    },
    fetchLokasis: async function () {
      try {
        let { data } = await this.http.post("api/combo/lokasi");
        this.lokasis = data;
      } catch (error) {}
    },
    postRegister: async function () {
      try {
        let {
          data: { code, success, response, errors },
        } = await this.http.post("api/auth/register", {
          province_uuid: this.province_uuid,
          regency_uuid: this.regency_uuid,
          lokasi_uuid: this.lokasi_uuid,
          instansi: this.instansi,
          name: this.name,
          email: this.email,
          phone: this.phone,
          jabatan: this.kode_jabatan,
        });
        if (!success) {
          this.snackbar.color = "red";
          this.snackbar.text = response.message;
          this.snackbar.state = true;
          return;
        }
        this.snackbar.color = "green";
        this.snackbar.text = response.message;
        this.snackbar.state = true;
        this.$router.push({
          name: "registrasi-berhasil",
          params: { uuid: response.uuid },
        });
      } catch (error) {
        this.snackbar.color = "red";
        this.snackbar.text = error.response.data.errors[0].message;
        this.snackbar.state = true;
      }
    },
  },
};
</script>

<style>
.login-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  padding-top: 25px;
  padding-bottom: 10px;
  color: grey;
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
</style>