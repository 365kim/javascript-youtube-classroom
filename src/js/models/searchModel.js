import VideoLocalStorage from './models/localStorage.js';
import { API_SEARCH_ENDPOINT } from './constants.js';
import { formatDateKR } from './utils/formatDate.js';
import { YOUTUBE_API_KEY } from './env.js';
import { request } from '../utils/request.js';

export default class SearchModel {
  constructor() {
    this.videoStorage = new VideoLocalStorage();
  }

  getKeyword() {
    return this.keyword;
  }

  setKeyword(keyword) {
    this.keyword = keyword;
  }

  getRequestURL(queryStrings) {
    const queryStringFlattened = Object.keys(queryStrings)
      .map((key) => `&${key}=${queryStrings[key]}`)
      .join('');

    return `${API_SEARCH_ENDPOINT}?key=${YOUTUBE_API_KEY}`.concat(queryStringFlattened);
  }

  processJSON(rawData) {
    this.nextPageToken = rawData.nextPageToken;

    return rawData.items.map((item) => ({
      videoId: item.id.videoId,
      videoTitle: item.snippet.title,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: formatDateKR(item.snippet.publishedAt),
    }));
  }

  storeVideoData(element, videoData) {
    element.dataset.videoId = videoData.videoId;
    element.dataset.videoTitle = videoData.videoTitle;
    element.dataset.channelId = videoData.channelId;
    element.dataset.channelTitle = videoData.channelTitle;
    element.dataset.publishedAt = videoData.publishedAt;
  }
}
