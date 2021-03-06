export const request = async (url, method) => {
  try {
    const response = await fetch(url, { method });
    console.log('res', response);
    console.log('res.txt', response.statusText);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    console.log('return json', response.json());
    return response.json();
  } catch (e) {
    console.error(e);
  }
};
