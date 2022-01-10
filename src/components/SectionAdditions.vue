<template>
  <div class="full-height bg-white q-pa-md column justify-between">
    <div class="col">
      <div class="text-center text-h6">Additions</div>
      <q-separator spaced />
      <div class="column q-ma-none q-gutter-y-sm">
        <SelectableAddition
          v-for="selectableAddition of selectableAdditions"
          :key="selectableAddition.component"
          :selectableAddition="selectableAddition"
        />
      </div>
    </div>
    
  </div>
</template>

<script>
import SelectableAddition from "./SelectableAddition.vue";
export default {
  components: {
    SelectableAddition,
  },
  data() {
    return {
      selectableAdditions: [
        {
          component: "text",
          label: "Text",
          w: 4,
          h: 4,
          icon: "fas fa-i-cursor",
        },
        {
          component: "table",
          label: "Table",
          w: 5,
          h: 5,
          icon: "fas fa-table",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.trashcan {
  transition: color 400ms ease;
}
.trashcan:hover {
  color: red;
}
</style>
