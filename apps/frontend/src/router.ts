import { createRouter, createWebHistory } from "vue-router";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import App from "./views/app/App.vue";
import AppHome from "./views/app/AppHome.vue";
import AppChannel from "./views/app/AppChannel.vue";

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
      children: [
        {
          path: "home",
          component: AppHome,
        },
        {
          path: "channel/:channelId",
          component: AppChannel,
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
