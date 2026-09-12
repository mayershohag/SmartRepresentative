export const login = async (credentials, role = "distributor") => {
      if(role === "super-admin"){
            role = "admin"
      }
      try {
            const response = await fetch(`https://smartrepresentative.onrender.com/api/auth/${role}/login`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(credentials),
            });
            const data = await response.json();
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