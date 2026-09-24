<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
const { page, lang } = useData()
const en = computed(() => lang.value === 'en')
const path = computed(() => page.value.relativePath.replace(/^en\//, '').replace(/index\.md$/, '').replace(/\.md$/, '.html'))
</script>
<template><nav class="language-tabs" aria-label="Language"><a :href="withBase('/'+path)" lang="ja" :aria-current="!en?'page':undefined">日本語</a><a :href="withBase('/en/'+path)" lang="en" :aria-current="en?'page':undefined">EN</a></nav></template>
