<script setup>
// reactive state
const props = defineProps({
  messages: {
    type: Array,
    default: () => {
      return []
    },
  },
})

// Only the "error" messages
function errorMessages(messages) {
  return messages && messages.filter((a) => typeof a.instancePath !== 'undefined')
}

// Only "simple" messages
function simpleMessages(messages) {
  return messages && messages.filter((a) => typeof a.instancePath === 'undefined')
}
</script>

<template>
  <table class="table validation-messages-table table-striped" v-if="props.messages.length">
    <thead>
      <tr v-if="simpleMessages(props.messages).length">
        <th scope="col">{{ $t('MESSAGE') }}</th>
      </tr>
      <tr v-if="errorMessages(props.messages).length">
        <th scope="col">{{ $t('FIELD') }}</th>
        <th scope="col">{{ $t('ERROR') }}</th>
        <th scope="col">{{ $t('VALUE') }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="message in simpleMessages(props.messages)" :key="message">
        <td v-if="message.message">{{ message.message }}</td>
        <td v-if="message.message_tid" v-html="$t(message.message_tid, message.message_params)"></td>
      </tr>
      <tr v-for="message in errorMessages(props.messages)" :key="message">
        <td class="error-path">{{ message.instancePath }}</td>
        <td>{{ message.message }}</td>
        <td>
          <pre class="error-value">{{ JSON.stringify(message.data) }}</pre>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  table-layout: fixed;
  margin: 1em 0 0;
}
</style>
