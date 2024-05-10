<template>
  <MdPreview :editorId="id" :modelValue="text" />
</template>

<script setup>
import { ref } from 'vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const id = 'preview-only';
const text = ref(`# Hello Editor\n $$ a \\neq b$$`);
</script>