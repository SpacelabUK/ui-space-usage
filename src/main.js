import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/css/spacelab.css";

import * as d3 from "d3";
import * as crossfilter from "crossfilter";
import * as crossfilter2 from "crossfilter2";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
