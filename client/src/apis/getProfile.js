const BASE_AUTH_URL = "https://smartrepresentative.onrender.com/api/auth";
const getProfile = async () => {
      try {
            const response = await fetch(`${BASE_AUTH_URL}/profile`, {
                  method: "GET",
                  credentials: "include",
            });
            const data = await response.json();
            return {
                  status: response.status,
                  ok: response.ok,
                  data,
            };
      } catch (err) {
            console.log(err);
            return {
                  status: 400,
                  ok: false,
                  err,
            };
      }
};

export default getProfile