import { createRouter, createWebHistory } from "vue-router";
import Landing from "./views/Landing.vue";
import App from "./views/App.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

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
