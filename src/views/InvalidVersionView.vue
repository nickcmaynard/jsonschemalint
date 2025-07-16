<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
</script>

<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="alert" v-for="alert in configStore.specs[route.params.version].alerts" :key="alert" :class="alert.className" v-html="$t(alert.content_tid)"> </div>
    </div>
  </div>
</template>
