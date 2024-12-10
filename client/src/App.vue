<script setup>
import UserManager from './components/UserManager.vue'
</script>
client/src/components/UserManger.vue
<template>

  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <UserManager />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
