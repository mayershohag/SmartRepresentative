export const login = async (credentials, role = "distributor") => {
      try {
            const response = await fetch(`https://smartrepresentative.onrender.com/api/auth/${role}/login`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(credentials),
            });
            const data = await response.json();
            console.log(data);
            return {
                  status: response.status,
                  ok: response.ok,
                  data,
            };
      }
      catch (err) {
            console.log(err);
            return {
                  status: 400,
                  ok: false,
                  err,
            }
      }
};