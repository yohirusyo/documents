<template>
  <div
    unselectable="on"
    class="col q-pa-sm selectable shadow-3 grid-stack-item"
    ref="item"
    selectable="off"
    :id="'selectable_' + selectableAddition.component"
    v-bind:gs-w="selectableAddition.w"
    v-bind:gs-h="selectableAddition.h"
  >
    <div class="row justify-start items-center">
      <q-icon :name="selectableAddition.icon" class="q-mx-sm" />
      <span>
        {{ selectableAddition.label }}
      </span>
    </div>
  </div>
</template>

<script>
import { DDElement } from "gridstack/dist/h5/dd-element";
export default {
  props: {
    selectableAddition: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ddElement: null,
    };
  },
  mounted() {
    this.initDDelement();
  },
  methods: {
    initDDelement() {
      this.ddElement = DDElement.init(this.$refs.item);
      const data = JSON.stringify({ ...this.selectableAddition });
      this.ddElement.setupDraggable({
        handle: `#selectable_${this.selectableAddition.component}`,
        revert: "invalid",
        scroll: true,
        appendTo: "body",
        helper: "clone",
        start: (event) => {
          if (event.dataTransfer) {
            event.dataTransfer.setData(data, "");
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.selectable {
  box-sizing: border-box;
  border: 1px solid black;
  // border-radius: 0.4rem;
  cursor: move;
  background-color: white;
  transition: background-color 300ms ease;
}

.selectable:hover {
  background-color: aqua;
}
</style>
