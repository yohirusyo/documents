<template>
  <div class="addition_border">
    <q-icon
      name="drag_indicator"
      size="sm"
      tag="div"
      class="mover"
      color="primary"
    />
    <q-scroll-area
      class="addition_content full-height"
      ref="addition"
      @click.prevent.self
      @drag.prevent.self
    >
      <TextAddition
        v-if="addition && addition.component == 'text'"
        :addition="addition"
      />
      <TableAddition
        v-if="addition && addition.component == 'table'"
        :addition="addition"
      />
    </q-scroll-area>
  </div>
</template>

<script>
import TextAddition from "components/Additions/TextAddition.vue";
import TableAddition from "components/Additions/TableAddition.vue";
import { mapGetters } from "vuex";
export default {
  name: "BaseAddition",
  props: {
    additionId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("document", ["getAdditionById"]),
  },
  components: {
    TextAddition,
    TableAddition,
  },
  data() {
    return {
      resizeObserver: null,
      addition: null,
    };
  },
  methods: {
    getHeight() {
      this.$emit("resized", this.$refs.addition.$el.offsetHeight);
    },
    initObserver() {
      this.resizeObserver = new ResizeObserver(this.getHeight);
      this.resizeObserver.observe(this.$refs.addition.$el);
    },
    destroyObserver() {
      this.resizeObserver.unobserve(this.$refs.addition.$el);
      this.resizeObserver = null;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.addition = this.getAdditionById(this.additionId);
      this.initObserver();
    });
  },
  beforeDestroy() {
    this.destroyObserver();
  },
};
</script>

<style lang="scss">
.addition_border {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 255, 255, 0.356);
  padding: 0.3rem;
  transition: background-color 400ms ease;
  position: relative;
}

.addition_border:active {
  background-color: aqua;
}

.mover {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0.3rem;
  left: 0;
  transform: translateX(0.3rem);
  background: aqua;
  height: 2rem;
  width: 0;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  transition: all 400ms ease;
  cursor: move !important;
  opacity: 0;
}

.addition_border:hover > .mover {
  transform: translateX(-100%);
  z-index: 200;
  width: 1.5rem;
  opacity: 1;
}

.addition_border:active > .mover {
  transform: translateX(-100%);
  z-index: 200;
  width: 1.5rem;
  opacity: 1;
}

.addition_content {
  cursor: pointer;
  background-color: #fff;
  width: 100%;
  height: 100%;
}

.scroll > div {
  height: 100%;
}
</style>
