<template>
  <div :class="device.desktop ? `home pa-6`:`home pa-0`">
    <v-row class="pa-1">
      <v-spacer></v-spacer>
      <v-col :cols="device.desktop ? `12` : `12`">
        <v-card class="animated animate__fadeInUp rounded-0">
          <v-card-title :class="`white--text ` + theme.color + ` Plighten-1`">FORMULIR VERIFIKASI
            <v-spacer></v-spacer>
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
                    @click="$router.push({name:'bidang-renatur-pengajuan', params:{itemsPerPage: $route.params.itemsPerPage, page: $route.params.page}})"
                  >mdi-close-circle</v-icon>
                </v-btn>
              </template>
              <span>Tutup</span>
            </v-tooltip>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="10">
                <v-col cols="12">
                  <h3>IDENTITAS PEGAWAI</h3>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="NIP"
                    outlined
                    dense
                    hide-details
                    v-model="record.nip"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nama"
                    outlined
                    dense
                    hide-details
                    v-model="record.nama"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Gelar Depan"
                        outlined
                        dense
                        hide-details
                        v-model="record.gldepan"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Gelar Belakang"
                        outlined
                        dense
                        hide-details
                        v-model="record.glblk"
                        disabled
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Tempat Tgl. Lahir"
                    outlined
                    dense
                    hide-details
                    v-model="record.ttl"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="OPD/Dinas"
                    outlined
                    dense
                    hide-details
                    v-model="record.opd"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Bidang"
                    outlined
                    dense
                    hide-details
                    v-model="record.nunker"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Jabatan"
                    outlined
                    dense
                    hide-details
                    v-model="record.njab"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Pesan/Catatan"
                    outlined
                    dense
                    hide-details
                    :color="theme.color"
                    v-model="record.keterangan"
                    :filled="record.keterangan"
                    rows="3"
                  >{{ record.keterangan }}</v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                    label="Hasil Verifikasi"
                    :color="theme.color"
                    outlined
                    dense
                    hide-details
                    v-model="record.status"
                    :items="status"
                    :filled="record.status"
                  ></v-select>
                </v-col>

              </v-col>
              <v-col cols="2">
                <v-img
                  class="mr-10 mt-15"
                  :src="record.fotourl"
                  :lazy-src="record.fotourl"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-5">
            <v-col class="text-right">
              <v-btn
                outlined
                color="red"
                @click="$router.push({name:'bidang-renatur-pengajuan', params:{itemsPerPage: $route.params.itemsPerPage, page: $route.params.page}})"
                class="mr-2"
              >BATAL</v-btn>
              <v-btn
                outlined
                :color="theme.color"
                @click="postUpdate"
              >SIMPAN</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>
    
    <script>
import { mapActions, mapState } from "vuex";
export default {
  name: "perusahaan-index",
  data: () => ({
    foto: "/",
    status: [
      { text: "Diterima", value: "3" },
      { text: "Ditolak", value: "4" },
    ],
  }),
  computed: {
    ...mapState([
      "theme",
      "http",
      "device",
      "records",
      "record",
      "loading",
      "event",
      "snackbar",
    ]),
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/",
      title: "FORMULIR VERIFIKASI",
      subtitle: "Berikut Formulir Verifikasi",
      tableshow: false,
      breadcrumbs: [
        {
          text: "Daftar Permohonan",
          disabled: true,
          href: "halama-depan-slider",
        },
        {
          text: "Formulir Verifikasi",
          disabled: true,
          href: "profil-akun",
        },
      ],
    });

    this.fetchRecord().then(() => {
      setTimeout(() => {
        this.foto =
          "https://simasn.tangerangkab.go.id/foto/" +
          this.record.nip +
          "/" +
          this.record.nip +
          ".jpg";
      }, 100);
    });
  },
  mounted() {},
  methods: {
    ...mapActions([
      "setPage",
      "assignFileBrowse",
      "getUserInfo",
      "initUploadLibrary",
      "setRecord",
    ]),
    fetchRecord: async function () {
      let { data } = await this.http.get(
        "api/bidang-renatur/verifikasi/" + this.$route.params.pengajuan_uuid
      );

      this.setRecord(data);

      this.foto = data.avatar_path;
    },
    postUpdate: async function () {
      try {
        let {
          data: { success, response },
        } = await this.http.put(
          "api/bidang-renatur/verifikasi/" +
            this.$route.params.pengajuan_uuid +
            "/" +
            this.record.id,
          this.record
        );

        this.snackbar.color = "green";
        this.snackbar.text = response.message;
        this.snackbar.state = true;

        //this.record = data;
        //this.fetchRecord();
        this.$router.push({
          name: "bidang-renatur-pengajuan",
          params: {
            itemsPerPage: this.$route.params.itemsPerPage,
            page: this.$route.params.page,
          },
        });
        return;
      } catch (error) {
        this.snackbar.color = "red";
        this.snackbar.text =
          "Opps..., terjadi kesalahan " + error.response.data.errors[0].message;
        this.snackbar.state = true;
      }
    },

    uploadFoto: function () {
      this.assignFileBrowse({
        fileType: [".jpg", ".jpeg", ".png"],
        query: {
          doctype: "avatars",
        },
        callback: (response) => {
          setTimeout(() => {
            this.foto = response.path;
            this.record.avatar = response.name;
          }, 1000);
        },
      });
    },
  },
};
</script>
    
<style></style>
    