export const request = async (url) => {
  // url = 'https://silly-pare-91b3f2.netlify.app/.netlify/functions/fetchYoutubeAPI/';

  try {
    const response = await fetch(url, {
      headers: {
        origin: 'https://suspicious-tesla-29e2bd.netlify.app/.netlify/functions/search',
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
