import { createRouter, createWebHistory } from "vue-router";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import App from "./views/app/App.vue";
import AppHome from "./views/app/AppHome.vue";
import AppDirectMessageChannel from "./views/app/AppDirectMessageChannel.vue";
import AppFriends from "./views/app/AppFriends.vue";
import Verify from "./views/app/Verify.vue";

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
      path: "/verify",
      name: "verify",
      component: Verify,
      meta: {
        skipAuth: true,
      }
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
          meta: {
            title: "Home",
          },
        },
        {
          path: "friends",
          component: AppFriends,
          meta: {
            title: "Friends",
          },
        },
        {
          path: "stuff",
          component: AppHome,
          meta: {
            title: "Stuff",
          },
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
    return next({ path: "/app" });
  }

  if (!authenticated && !to.meta.skipAuth) {
    return next({ name: "login" });
  }

  const title = to.meta?.title as string | undefined;

  document.title = title ? `Bonfire | ${title}` : "Bonfire";

  return next();
});

export default router;
