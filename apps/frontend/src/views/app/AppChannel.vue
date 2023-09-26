<script setup lang="ts">
import { defineProps, onBeforeMount } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";

const { channelId } = defineProps<{ channelId: string }>();

onBeforeMount(() => {
  // load conversation from the db
});
</script>

<template>
  <HamburgerMenu></HamburgerMenu>
  <h1>/channel/{{ channelId }}</h1>
</template>
