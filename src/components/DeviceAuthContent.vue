<script setup>
import { ref } from 'vue'
import IconClipboard from '~icons/bi/clipboard'
import IconClipboardCheck from '~icons/bi/clipboard-check'

const props = defineProps({
  deviceAuth: {
    type: Object,
    required: true,
  },
})

const copied = ref(false)

const copyDeviceCode = async () => {
  try {
    await navigator.clipboard.writeText(props.deviceAuth.userCode)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <p v-html="$t('GIST_AUTH_PROMPT', { verificationUri: deviceAuth.verificationUri })"></p>
  <div class="d-flex align-items-center justify-content-center gap-2">
    <strong class="fs-1">{{ deviceAuth.userCode }}</strong>
    <button
      class="btn btn-sm btn-outline-secondary"
      :aria-label="$t('GIST_AUTH_COPY_CODE')"
      :title="$t('GIST_AUTH_COPY_CODE')"
      @click="copyDeviceCode()"
    >
      <icon-clipboard-check v-if="copied" />
      <icon-clipboard v-else />
    </button>
  </div>
  <p class="text-muted mt-3 mb-0 d-flex align-items-center gap-2">
    {{ $t('GIST_AUTH_WAITING') }}
  </p>
</template>

<style scoped></style>
