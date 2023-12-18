import { createRouter, createWebHistory } from "vue-router";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import App from "./views/app/App.vue";
import AppHome from "./views/app/AppHome.vue";
import AppDirectMessageChannel from "./views/app/AppDirectMessageChannel.vue";
import AppFriends from "./views/app/AppFriends.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "landing",
      component: Landing,
      meta: {
        skipAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        skipAuth: true,
        redirectToAppIfAuth: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        skipAuth: true,
        redirectToAppIfAuth: true,
      },
    },
    {
      path: "/app",
      name: "app",
      component: App,
      redirect: "app/home",
      children: [
        {
          path: "home",
          component: AppHome,
        },
        {
          path: "friends",
          component: AppFriends,
        },
        {
          path: "stuff",
          component: AppHome,
        },
        {
          path: "channel/@me/:channelId",
          component: AppDirectMessageChannel,
          props: true,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authenticated = localStorage.getItem("authenticated") === "true";

  if (authenticated && to.meta.redirectToAppIfAuth) {
    return next({ name: "app" });
  }

  if (!authenticated && !to.meta.skipAuth) {
    return next({ name: "login" });
  }

  return next();
});

export default router;
