<template>
  <span
    :class="computedClass"
    :style="computedStyle"
    @click="handleClick"
    :title="tooltipText"
  >
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: "TextComponent",
  props: {
    style: {
      type: Object,
      default: () => ({}),
    },
    numberOfLines: {
      type: Number,
      default: null,
    },
    ellipsizeMode: {
      type: String,
      default: null,
      validator: (value) => ["head", "middle", "tail", "clip"].includes(value),
    },
    variant: {
      type: String,
      default: "medium",
      validator: (value) => ["medium", "bold", "extra-bold"].includes(value),
    },
  },
  computed: {
    computedClass() {
      return `text-${this.variant}`;
    },
    computedStyle() {
      return {
        ...this.style,
      };
    },
    tooltipText() {
      if (this.ellipsizeMode && this.numberOfLines) {
        return this.$slots.default()[0].children;
      }
      return undefined;
    },
  },
  methods: {
    handleClick(e) {
      if (this.onClick) {
        this.onClick(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/text-styles.scss";

.text-medium,
.text-bold,
.text-extra-bold {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
