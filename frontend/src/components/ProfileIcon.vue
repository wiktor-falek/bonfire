<script setup lang="ts">
import { UserStatus } from "../api/users";

const props = defineProps<{
  src?: string;
  status?: UserStatus;
  size?: number;
}>();

function statusToIconColor(status?: UserStatus) {
  const map: Record<UserStatus, string> = {
    online: "#21b007",
    away: "#bfe310",
    dnd: "#eb442f",
    offline: "gray",
  };
  return status === undefined ? "gray" : map[status];
}
</script>

<template>
  <div
    class="profile-icon"
    :style="{
      height: `${props.size ?? 32}px`,
    }"
  >
    <img v-if="props.src" :src="props.src" alt="" />
    <div class="profile-icon__status">
      <div
        class="profile-icon__status__icon"
        :style="{
          'background-color': statusToIconColor(props.status),
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.profile-icon {
  aspect-ratio: 1 / 1;
  background-color: #47484b;
  border-radius: 50%;
  position: relative;
}

.profile-icon > img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.profile-icon__status {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-clip: padding-box;
}

.profile-icon__status__icon {
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
</style>
