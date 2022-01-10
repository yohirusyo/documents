<template>
  <div style="width: max-content">
    <div class="row items-center">
      <q-btn
        class="col col-shrink q-mr-md"
        icon="mdi-dots-horizontal"
        flat
        dense
      />
      <div
        contenteditable
        @input="nameChanged"
        class="page_name col"
        :class="{ page_name_empty: page.name.length == 0 }"
        :data-index="index + 1"
        @click.self="setActiveAddition({ activeAddition: null, id: null })"
      >
        {{ pageName }}
      </div>
    </div>
    <div
      class="shadow-6 A4 q-pa-md q-mx-auto"
      ref="page"
      @click.self="setActiveAddition({ activeAddition: null, id: null })"
    >
      <div
        class="pagewrapper fit"
        :data-page="page.id"
        ref="pagewrapper"
        @click.self="setActiveAddition({ activeAddition: null, id: null })"
      >
        <div
          class="fit grid-stack"
          :id="'grid-stack-page-' + page.id"
          @click.self="setActiveAddition({ activeAddition: null, id: null })"
        >
          <div
            class="grid-stack-item"
            v-for="item of getPageLayout(page.id)"
            :key="item.id"
            v-bind:gs-w="item.w"
            v-bind:gs-h="item.h"
            v-bind:gs-x="item.x"
            v-bind:gs-y="item.y"
            v-bind:gs-id="item.id"
            v-bind:gs-content="page.id"
            gs-auto-position="false"
          >
            <BaseAddition :additionId="item.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import BaseAddition from "components/Additions/BaseAddition.vue";

import "gridstack/dist/gridstack.min.css";
import { GridStack } from "gridstack";
import "gridstack/dist/h5/gridstack-dd-native";

import { dpi } from "src/helpers/dpi.js";

export default {
  props: {
    page: {
      type: Object,
      required: true,
    },
    previewMode: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  components: {
    BaseAddition,
  },
  computed: {
    ...mapState("document", ["additionIndex"]),
    ...mapGetters("document", ["getPageLayout"]),
  },
  data() {
    return {
      // Getting dpi
      pageName: this.page.name,
      dpi: 0,
      // Page size
      pageSize: {
        height: 0,
        width: 0,
      },
      // Grid size
      wrapperSize: {
        height: 0,
        width: 0,
      },
      // Editor
      textEditor: null,
      activeAddition: null,
      // Grid itself
      grid: null,
      // Grid settings
      gridOptions: {
        disableOneColumnMode: true,
        float: true,
        column: 12,
        row: 36,
        cellHeight: -1,
        margin: 8,
        minRow: 1,
        resizable: { handles: "all" },
        styleInHead: false,
        acceptWidgets: ".grid-stack-item",
        dragIn: ".selectable",
        dragOut: true,
        alwaysShowResizeHandle: true,
        draggable: {
          handle: ".mover",
          scroll: false,
          appendTo: "body",
        },
        dragInOptions: {
          revert: "invalid",
          scroll: false,
          appendTo: "body",
          helper: "clone",
        },
      },
    };
  },
  mounted() {
    this.initGridStack();
    this.grid.on("change", this.change);
    this.grid.on("dropped", this.drop);
    this.grid.on("removed", this.removed);
  },
  methods: {
    ...mapActions("document", [
      "addAddition",
      "updatePageName",
      "moveAddition",
    ]),
    nameChanged(e) {
      this.updatePageName({ pageId: this.page.id, name: e.target.innerText });
    },
    removed(event, items) {},
    change(event, items) {
      try {
        const { x, y, w, h } = items[0];
        this.moveAddition({
          x,
          y,
          w,
          h,
          additionId: Number(items[0].id),
          pageId: this.page.id,
        });
        this.$root.$emit("change", {
          type: "move-addition",
          id: Number(items[0].id),
          x,
          y,
          w,
          h,
        });
      } catch (error) {
        console.warn(error);
      }
    },
    drop(event, previousWidget, newWidget) {
      const fromSidebar =
        event.dataTransfer &&
        event.dataTransfer.types &&
        event.dataTransfer.types.length != 0;
      if (fromSidebar) {
        // Sidebar
        const addition = JSON.parse(event.dataTransfer.types[0]);
        const { x, y } = newWidget;
        const node = {
          x,
          y,
          w: addition.w,
          h: addition.h,
          id: this.additionIndex,
          pageId: this.page.id,
        };
        newWidget.el.remove();
        this.addAddition({
          addition: {
            component: addition.component,
          },
          layout: node,
        });
        this.$nextTick(() => {
          this.grid.makeWidget(`[gs-id='${this.additionIndex - 1}']`); // addition init additionIndex increments then - 1
          this.$root.$emit("change", {
            type: "add-addition",
            id: this.additionIndex - 1,
          });
        });
      } else {
        // New list
        const { x, y, w, h } = newWidget;
        this.moveAddition({
          x,
          y,
          w,
          h,
          additionId: Number(newWidget.id),
          pageId: this.page.id,
        });
        this.$nextTick(() => {
          const item = this.grid.makeWidget(`[gs-id='${Number(newWidget.id)}']`);
          console.warn(item)
          this.$root.$emit("change", {
            type: "move-addition",
            id: this.additionIndex - 1,
            x,
            y,
            w,
            h,
          });
        });
      }
    },
    initGridStack() {
      this.initSizes();
      this.grid = GridStack.init(
        this.gridOptions,
        `#grid-stack-page-${this.page.id}`
      );
    },
    initSizes() {
      this.dpi = dpi("1mm");
      this.pageSize = {
        height: dpi("277mm"),
        width: dpi("210mm"),
      };
      this.$refs.page.style.width = this.pageSize.width + "px";
      this.$refs.page.style.height = this.pageSize.height + "px";
      this.wrapperSize = {
        width: this.$refs.pagewrapper.offsetWidth,
        height: this.$refs.pagewrapper.offsetHeight,
      };
      this.gridOptions.cellHeight = Math.floor(
        this.wrapperSize.height / this.gridOptions.row
      );
    },
    setActiveAddition(args) {
      this.$root.$emit("editorChanged", args);
    },
  },
};
</script>

<style lang="scss">
.A4 {
  background-color: white;
  box-sizing: border-box;
}
.pagewrapper {
  box-sizing: border-box;
  position: relative;
}

$ui-item-size: 0.3rem;
$resizers-padding: 0%;

.ui-resizable-handle {
  // border: 1px solid black;
  transform: rotate(0deg) !important;
  width: $ui-item-size !important;
  height: $ui-item-size !important;
  box-sizing: border-box;
  background: none !important;
}

.ui-resizable-ne {
  top: 0 !important;
  right: 0 !important;
  transform: translate($resizers-padding, -$resizers-padding) !important;
}

.ui-resizable-se {
  bottom: 0 !important;
  right: 0 !important;
  transform: translate($resizers-padding, $resizers-padding) !important;
}

.ui-resizable-nw {
  top: 0 !important;
  left: 0 !important;
  transform: translate(-$resizers-padding, -$resizers-padding) !important;
}

.ui-resizable-sw {
  bottom: 0 !important;
  left: 0 !important;
  transform: translate(-$resizers-padding, $resizers-padding) !important;
}

.ui-resizable-n {
  top: 0 !important;
  left: $ui-item-size !important;
  width: calc(100% - #{$ui-item-size} * 2) !important;
  transform: translateY(-$resizers-padding) !important;
}

.ui-resizable-s {
  bottom: 0 !important;
  left: $ui-item-size !important;
  width: calc(100% - #{$ui-item-size} * 2) !important;
  transform: translateY($resizers-padding) !important;
}

.ui-resizable-e {
  top: $ui-item-size !important;
  right: 0 !important;
  height: calc(100% - #{$ui-item-size} * 2) !important;
  transform: translateX($resizers-padding) !important;
}

.ui-resizable-w {
  top: calc(#{$ui-item-size} + 2rem) !important;
  left: 0 !important;
  height: calc(100% - #{$ui-item-size} * 2 - 2rem) !important;
  transform: translateX(-$resizers-padding) !important;
}

.ui-resizable-handle:hover {
  background: aqua !important;
}

.ui-resizable-resizing > .addition_border {
  background-color: aqua !important;
}

.page_name {
  outline: none !important;
  cursor: text;
}

.page_name_empty {
  position: relative;
}

.page_name_empty::after {
  content: "Page " " " attr(data-index);
  position: absolute;
  left: 0;
  top: 0;
  color: gray;
}

</style>
