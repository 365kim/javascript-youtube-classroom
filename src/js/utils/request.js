export const request = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      'Content-Type': 'text/*; charset=utf-8',
    });
    const json = await response.json();
    console.log(json);
    console.log(response);

    if (!response.ok) {
      throw Error(response.statusText);
    }
    return json;
  } catch (e) {
    console.log(response);
    console.error(e);
  }
};
