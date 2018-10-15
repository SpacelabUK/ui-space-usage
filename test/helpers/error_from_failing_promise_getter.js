
const getErrorFromFailingPromise = async (failingPromise) => {
  try {
    return await failingPromise;
  } catch (error) {
    return error;
  }
};

export default getErrorFromFailingPromise;
