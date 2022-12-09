<template>
  <div :class="device.desktop ? `home pa-6`:`home pa-0`">

    <v-row>
      <v-col :cols="device.desktop ?7:12">
        <v-card class="animated animate__fadeInUp rounded-0">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
            <v-btn
              icon
              @click="fetchRecords"
            >
              <v-icon color="white">autorenew</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="table.options.search"
              append-icon="mdi-magnify"
              label="Pencarian"
              single-line
              hide-details
              dense
              solo
              :color="theme.color"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="records"
            :options.sync="table.options"
            :server-items-length="table.total"
            class="elevation-2"
            :color="theme.color"
            :loading="loading.table"
            :search="table.options.search"
            loading-text="Loading... Please wait"
            show-select
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
                  >
                    mdi-dots-vertical-circle-outline
                  </v-icon>
                </template>

                <v-list>
                  <v-list-item @click="editRecord(value)">
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>
                      Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="postDeleteRecord(value)">
                    <v-list-item-title>
                      <v-icon color="red">mdi-delete-circle</v-icon>
                      Hapus
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col :cols="device.desktop ? 5:12">
        <v-card class="animated animate__fadeInUp rounded-0">
          <v-card-title :class="theme.color + ` lighten-1 white--text`">
            Formulir Akun Aplikasi
          </v-card-title>
          <v-card-subtitle :class="theme.color + ` lighten-1 white--text`">
            Formulir untuk mendaftarkan/merubah akun aplikasi
          </v-card-subtitle>
          <v-divider></v-divider>

          <v-card-text>
            <v-row :no-gutters="device.mobile">
              <v-col cols="12">
                <v-text-field
                  label="Nama Pengguna"
                  :color="theme.color"
                  hide-details="device.desktop"
                  autocomplete="off"
                  outlined
                  dense
                  v-model="record.name"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  :color="theme.color"
                  type="email"
                  hide-details="device.desktop"
                  autocomplete="off"
                  v-model="record.email"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Level"
                  :color="theme.color"
                  v-model="record.authent"
                  :items="authents"
                  :hide-details="device.desktop"
                  outlined
                  dense
                ></v-select>
              </v-col>

              <v-col cols="5">
                <v-switch
                  label="Status"
                  :color="theme.color"
                  v-model="record.status"
                  :hide-details="device.desktop"
                ></v-switch>
              </v-col>

              <v-col cols="5">
                <v-switch
                  label="Reset Kata Sandi"
                  :color="theme.color"
                  v-model="record.reset"
                  :hide-details="device.desktop"
                ></v-switch>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions class="flex flex-row-reverse">

            <v-btn
              outlined
              :color="theme.color"
              @click="postAddNewRecord"
              v-show="!event.update"
            >TAMBAH</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              @click="postUpdateRecord"
              v-show="event.update"
            >UBAH</v-btn>

            <v-col>
              <div class="subtitle-2 font-sm ml-1 grey--text">
                * Kata Sandi Bawaan (12345678)
              </div>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  data: () => ({
    num: 1,
    headers: [
      {
        text: "NAMA",
        align: "start",
        sortable: true,
        value: "name",
      },
      { text: "EMAIL", value: "email" },
      { text: "AKSI", value: "id", align: "center", sortable: false },
    ],
    status: [
      { text: "Aktif", value: 0 },
      { text: "Non Aktif", value: 1 },
    ],
    authents: [
      { text: "Administrator", value: "administrator" },
      { text: "Assesor", value: "assesor" },
      { text: "Admin Bangrir", value: "admin-bangrir" },
      { text: "Pimpinan Bidang Renatur", value: "pimpinan-bidang-renatur" },
      {
        text: "Pimpinan Bidang Data dan Pembinaan",
        value: "pimpinan-bidang-data",
      },
      {
        text: "Pimpinan Bidang Mutasi",
        value: "pimpinan-bidang-mutasi",
      },
      {
        text: "Bidang PSDM",
        value: "bidang PSDM",
      },
      {
        text: "Pimpinan OPD",
        value: "pimpinan-opd",
      },
      {
        text: "Peserta",
        value: "peserta",
      },
    ],
    search: null,
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
      "table",
    ]),
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/utility/users",
      pagination: true,
      title: "MANAJEMEN PENGUNA",
      subtitle: "Berikut Daftar Pengguna Yang Sedia",
      breadcrumbs: [
        {
          text: "Pengguna",
          disabled: false,
          href: "halama-depan-slider",
        },
        {
          text: "Penguna",
          disabled: false,
          href: "user",
        },
      ],
    });

    // this.fetchRecords();
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
    ]),

    postAddNewRecord: function () {
      this.postAddNew(this.record).then(() => {
        this.fetchRecords();
      });
    },
    editRecord: function (val) {
      this.postEdit(val);
    },

    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.fetchRecords();
      });
    },

    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },
  },
  watch: {
    "table.options": {
      handler() {
        this.fetchRecords();
      },
      deep: true,
    },
  },
};
</script>
