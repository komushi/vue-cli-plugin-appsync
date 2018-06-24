<template>
  <div class="appsync">
	<app-sync-example></app-sync-example>
  </div>
</template>

<script>
// @ is an alias to /src
import AppSyncExample from '../components/AppSyncExample.vue'

export default {
  name: 'appsync',
  components: {
    AppSyncExample
  }
}
</script>
