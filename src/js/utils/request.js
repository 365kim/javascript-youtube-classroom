export const request = async (url, method) => {
  // url = 'https://silly-pare-91b3f2.netlify.app/.netlify/functions/fetchYoutubeAPI/';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        origin: 'https://silly-pare-91b3f2.netlify.app/.netlify/functions/fetchYoutubeAPI/',
      },
    });
    const json = await response.json();
    console.log(json);
    console.log(response);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return json;
  } catch (e) {
    console.error(e);
  }
};
