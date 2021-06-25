<template>
  <div class="triangle" :style="style"></div>
</template>
<script>
import { capitalize } from "./common";

export default {
  props: {
    size: {
      type: Number,
      default: 8,
    },
    color: {
      type: String,
      default: "black",
    },
    direction: {
      type: String,
      default: "top",
    },
  },
  computed: {
    style() {
      let obj = {};
      let directions = ["top", "bottom", "left", "right"];
      let rDirections = ["bottom", "top", "right", "left"];
      let index = directions.findIndex((item) => this.direction === item);
      for (let i = 0; i < directions.length; i++) {
        let direction = directions[i];
        if ((i % 2 == 0 && i + 1 != index) || (i % 2 == 1 && i - 1 != index)) {
          obj[`border${this.capitalize(rDirections[i])}`] =
            direction !== this.direction
              ? `${this.size}px solid transparent`
              : `${this.size}px solid ${this.color}`;
        }
      }
      return obj;
    },
  },
  methods: {
    capitalize,
  },
};
</script>
<style lang="scss">
.triangle {
  width: 0;
  height: 0;
  position: relative;
}
</style>