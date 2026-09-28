<script setup>
defineProps({ number: String, caption: String, en: Boolean });
</script>
<template>
 <div class="captioned-table" role="group" :aria-labelledby="`table-caption-${number}`" :id="`table-${number}`">
  <p class="table-caption" :id="`table-caption-${number}`"><strong>{{ en ? 'Table' : '表' }} {{ number }}：{{ caption }}</strong></p>
  <slot />
 </div>
</template>
<style scoped>
.captioned-table{margin:24px 0;scroll-margin-top:110px}.table-caption{color:var(--vp-c-text-1);line-height:1.7;margin-bottom:12px}.captioned-table :deep(table){margin-top:0}
</style>
