<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from "vue";
import { verify } from "../../api/verify";

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

type State = "loading" | "success" | "fail";

const state: Ref<State> = ref("loading");

onBeforeMount(async () => {
  if (token !== null) {
    const result = await verify(token);
    if (!result.ok) {
      state.value = "fail";
    } else {
      state.value = "success";
    }
  }
});
</script>

<template>
  <div v-if="token === null">Invalid verification link</div>
  <div v-else>Verifying Email</div>
  <p>{{ state }}</p>
</template>

<style scoped></style>
