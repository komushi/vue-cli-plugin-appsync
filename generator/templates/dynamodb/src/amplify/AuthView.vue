<template>
  <div :style="theme.container">
    <router-view></router-view>
  </div>
</template>

<script>
import { AmplifyTheme } from '../amplify'

export default {
  name: 'AuthView',
  data () {
    return {
      theme: AmplifyTheme
    }
  }
}
</script>