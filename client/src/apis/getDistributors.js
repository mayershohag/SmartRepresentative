export const getDistributors = async () => {
      try {
            const response = await fetch(`https://smartrepresentative.onrender.com/api/distributors`);
            const data = await response.json();
            const { distributors } = data;
            return {
                  status: response.status,
                  ok: response.ok,
                  data: distributors,
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