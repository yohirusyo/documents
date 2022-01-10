<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> Documents </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: "MainLayout",
  components: {},
  computed: {
    _pages: {
      get() {
        return [
          {
            title: "Documents",
            icon: "book",
            href: "/",
          },
        ];
      },
    },
  },
  data() {
    return {
      drawer: true,
      link: "Documents",
      left: false,
      right: false,
      miniState: true,
    };
  },
};
</script>
