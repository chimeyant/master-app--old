<template>
  <div :class="device.desktop ? `home pa-6`:`home pa-0`">

    <v-row>
      <v-col :cols="device.desktop ?12:12">
        <v-card class="animated animate__fadeInUp rounded-0">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
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
                    @click="openForm"
                  >add_circle</v-icon>
                </v-btn>
              </template>
              <span>Tambah Pengguna</span>
            </v-tooltip>

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
                    @click="fetchRecords"
                  >mdi-refresh-circle</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
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
            v-show="device.desktop"
            :headers="headers"
            :items="records"
            :items-per-page="table.options.itemsPerPage"
            :page.sync="table.options.page"
            class="elevation-2 mb-1"
            :color="theme.color"
            :loading="loading.table"
            loading-text="Loading... Please wait"
            :search="search"
            hide-default-footer
            @page-count="table.options.pageCount = $event"
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
    </v-row>
    <v-col col="12">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="form.add"
        :max-width="device.desktop ? `600px` : `100%`"
        persistent
      >
        <v-card class="rounded-0">
          <v-toolbar
            :color="theme.color"
            dark
          >
            <v-icon class="mr-1">mdi-circle</v-icon>Manajemen Pengguna
          </v-toolbar>
          <v-card-title class="justify-center">Formulir Manajemen Pengguna</v-card-title>
          <v-card-text>

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
            <v-col cols="12">
              <v-row>
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
            </v-col>

          </v-card-text>
          <v-card-actions class="flex flex-row-reverse">
            <v-btn
              outlined
              :color="theme.color"
              @click="postAddNewRecord"
              v-show="!form.edit"
            >TAMBAH</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              @click="postUpdateRecord"
              v-show="form.edit"
            >UBAH</v-btn>
            <v-btn
              outlined
              class="mr-2"
              color="grey dark-3"
              @click="closeForm"
            >BATAL</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "manajemen-user",
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
      {
        text: "AKSI",
        value: "id",
        align: "center",
        sortable: false,
        width: 85,
        sortable: false,
      },
    ],
    status: [
      { text: "Aktif", value: 0 },
      { text: "Non Aktif", value: 1 },
    ],
    authents: [
      { text: "Administrator", value: "administrator" },
      {
        text: "User",
        value: "user",
      },
    ],
    search: null,
  }),
  computed: {
    ...mapState([
      "page",
      "table",
      "form",
      "theme",
      "http",
      "device",
      "record",
      "records",
      "loading",
      "event",
    ]),
    filterItems() {
      if (this.search != null) {
        return this.records.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      } else {
        return this.records;
      }
    },
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/utility/users",
      pagination: false,
      title: "MANAJEMEN PENGUNA",
      subtitle: "Berikut Daftar Pengguna Yang Sedia",
      tableshow: true,
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

    this.fetchRecords();
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
      "setForm",
    ]),
    openForm: function () {
      this.setForm({
        add: true,
        edit: false,
      });
      this.setRecord({});
    },
    closeForm: function () {
      this.setForm({
        add: false,
        edit: false,
      });
    },

    postAddNewRecord: function () {
      this.postAddNew(this.record).then(() => {
        this.closeForm();
      });
    },
    editRecord: function (val) {
      this.postEdit(val).then(() => {
        this.setForm({
          add: true,
          edit: true,
        });
      });
    },

    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.closeForm();
      });
    },

    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },
  },
  watch: {},
};
</script>
