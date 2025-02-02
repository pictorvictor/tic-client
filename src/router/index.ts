import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { auth, onAuthStateChanged } from "@/utils/firebase";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AlbumDetailView from "../views/AlbumDetailView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/album/:id",
    name: "album-detail",
    component: AlbumDetailView,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next();
      } else {
        next("/login");
      }
    });
  } else {
    next();
  }
});

export default router;
