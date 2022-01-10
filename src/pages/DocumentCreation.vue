<template>
  <q-page class="fit row">
    <div class="col-2 q-pa-sm bg-primary">
      <div class="shadow-3 q-pa-md fit bg-white">
        <q-scroll-area style="height: 100%">
          <div class="text-h6">DEBUGGER3000</div>
          <q-separator spaced />
          {{ "current addition count: " + additionIndex }}
          <q-separator spaced />
          {{ "current page count: " + pageIndex }}
          <q-separator spaced />
          {{ "history: " + currentChangeIndex + " / " + changes }}
          <pre>{{ JSON.stringify(history, null, 1) }}</pre>
          <q-separator spaced />
          {{ "layout" }}
          <pre>{{ JSON.stringify(layout, null, 1) }}</pre>
          <q-separator spaced />
          {{ "additions" }}
          <pre>{{ JSON.stringify(additions, null, 1) }}</pre>
          <q-separator spaced />
          {{ "pages" }}
          <pre>{{ JSON.stringify(pages, null, 1) }}</pre>
          <q-separator spaced />
        </q-scroll-area>
      </div>
    </div>
    <div class="col-10 column">
      <div class="col row full-height">
        <div
          class="col-9"
          @click.self="setActiveAddition({ activeAddition: null, id: null })"
        >
          <q-scroll-area style="height: 100%">
            <PageA4
              v-for="(page, index) of pages"
              :key="index"
              class="q-mx-auto q-my-md"
              :page="page"
              :index="index"
              :previewMode="previewMode"
            />
            <div
              class="row justify-center q-my-md"
              @click.self="
                setActiveAddition({ activeAddition: null, id: null })
              "
            >
              <q-btn
                text-color="black"
                class="shadow-6 bg-white"
                round
                flat
                dense
                icon="add"
                @click="addPage"
              />
            </div>
          </q-scroll-area>
        </div>
        <div class="col-3 shadow-3">
          <SectionAdditions />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import PageA4 from "src/components/PageA4.vue";
import SectionAdditions from "src/components/SectionAdditions.vue";

import { mapActions, mapState } from "vuex";
export default {
  components: {
    PageA4,
    SectionAdditions,
  },
  data() {
    return {
      previewMode: false,
      editor: {
        activeAddition: null,
      },
    };
  },
  methods: {
    ...mapActions("document", [
      "requestDocument",
      "addPage",
      "addChanges",
      "undoChanges",
      "redoChanges",
    ]),
    setEditor(editor) {
      this.editor = editor;
    },
    setActiveAddition(args) {
      this.$root.$emit("editorChanged", args);
    },
    registerChanges(changes) {
      this.addChanges({ changes });
    },
    ctrz(e) {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        console.warn("ctrlz");
        this.undoChanges();
        if (this.currentChangeIndex - 1 >= 0)
          console.warn(this.history[this.currentChangeIndex - 1]);
        return;
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        console.warn("ctrly");
        this.redoChanges();
        if (this.currentChangeIndex < this.history.length)
          console.warn(this.history[this.currentChangeIndex - 1]);
        return;
      }
    },
  },
  created() {
    this.$root.$on("editorChanged", this.setEditor);
    this.$root.$on("change", this.registerChanges);
  },
  computed: {
    ...mapState("document", [
      "pages",
      "additions",
      "additionIndex",
      "pageIndex",
      "history",
      "layout",
      "currentChangeIndex",
      "changes",
    ]),
  },
  async mounted() {
    document.addEventListener("keydown", this.ctrz);
    this.addPage();
    this.addPage();
  },
};
</script>

<style lang="scss" scoped></style>
