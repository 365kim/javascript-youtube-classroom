export const request = async (url, method) => {
  try {
    const response = await fetch(url, { method });
    console.log('res', response);
    console.log('res.txt', response.statusText);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    console.log(json);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return json;
  } catch (e) {
    console.error(e);
  }
};
