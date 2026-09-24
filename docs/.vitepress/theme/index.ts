import DefaultTheme from "vitepress/theme";
import Home from "./Home.vue";
import Languages from "./Languages.vue";
import { h } from "vue";
import "./style.css";
export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "nav-bar-content-after": () => h(Languages),
    }),
  enhanceApp({ app }) {
    app.component("CommunityHome", Home);
  },
};
