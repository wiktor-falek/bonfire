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
      },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        skipAuth: true,
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
  if (to.meta.skipAuth === true) {
    return next();
  }

  if (localStorage.getItem("authenticated") === "true") {
    return next();
  }

  next({ name: "login" });
});

export default router;
