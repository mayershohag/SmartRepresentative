export const getDistributors = async () => {
      try {
            const response = await fetch(`https://smartrepresentative.onrender.com/api/distributors`);
            const distributorData = await response.json();
            const { data } = distributorData;
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