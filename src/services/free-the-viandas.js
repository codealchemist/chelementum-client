import axios from "axios";

const baseUrl = "/rest/free-the-viandas";
const me = {};
me.get = () => axios.get(baseUrl);
me.set = user => axios.post(baseUrl, user);
me.remove = () => axios.delete(baseUrl);
me.list = () => axios.get(`${baseUrl}/list`);

export default me;
