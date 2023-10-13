const env = process.env;
const axios = require(`axios`);
axios.defaults.withCredentials = true;

async function login(username, password) {
  try {
    const res = await axios.post(`${env.BACKEND_URL}/user/login`, {
      credentials: { username, password },
    });
    console.log(res.status);

    const info = await axios.get(`${env.BACKEND_URL}/user/info`);
    console.log(info.status);
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  login(`A101`, `A101-triallists-optimizations`);
}
