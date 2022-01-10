import Vue from "vue";
import axios from "axios";
Vue.prototype.$axios = axios;

const api = axios.create({ baseURL: "http://localhost:8081/api" });

axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
Vue.prototype.$api = api;
export { axios, api };
