import VideoLocalStorage from './models/localStorage.js';
import { PART_TYPE, SEARCH_TYPE_VIDEO, MAX_RESULT_COUNT, REGION_CODE, RECENT_KEYWORDS } from './constants.js';
import {
  getThumbnailTemplate,
  getChannelTitleTemplate,
  resultNotFoundTemplate,
  getRecentKeywordTemplate,
} from './layout/searchResult.js';
import { getSkeletonTemplate } from './layout/skeleton.js';
import { $ } from './utils/DOM.js';
import { request } from './utils/request.js';

export default class SearchView {
  constructor() {
    this.videoStorage = new VideoLocalStorage();
  }

  init() {
    this.selectDOMs();
  }

  selectDOMs() {
    this.$searchResultWrapper = $('#search-result-wrapper');
    this.$recentKeyword = $('#recent-keyword');
    this.$storedVideoCount = $('#stored-video-count');
    this.$snackbar = $('#snackbar');
  }

  showSnackbar(message) {
    this.$snackbar.innerText = message;
    this.$snackbar.classList.add('show');
    setTimeout(() => {
      this.$snackbar.classList.remove('show');
    }, 2000);
  }

  showCurrentStoredVideoCount() {
    this.$storedVideoCount.innerText = this.videoStorage.getStoredVideoCount();
  }

  renderSkeleton() {
    this.groupIndex += 1;
    this.$searchResultWrapper.innerHTML += getSkeletonTemplate(this.groupIndex);
  }

  renderSearchResult(videoList) {
    this.$currentGroup = $(`[data-group-index="${this.groupIndex}"]`);
    this.$currentGroup.classList.remove('skeleton');

    if (videoList.length === 0) {
      this.$searchResultWrapper.innerHTML = resultNotFoundTemplate;
      return;
    }
    this.$currentGroup.querySelectorAll('article').forEach(($article, i) => {
      const video = videoList[i];
      const $saveButton = $article.querySelector('.save-button');

      $article.querySelector('.preview-container').innerHTML = getThumbnailTemplate(video.videoId);
      $article.querySelector('.video-title').innerText = video.videoTitle;
      $article.querySelector('.channel-title').innerHTML = getChannelTitleTemplate(video.channelId, video.channelTitle);
      $article.querySelector('.published-at').innerText = video.publishedAt;
      this.storeVideoData($saveButton, video);

      if (!this.videoStorage.isStoredVideo(video.videoId)) {
        $saveButton.classList.remove('stored');
        return;
      }

      $saveButton.classList.add('stored');
    });
  }

  renderRecentKeyword() {
    const recentKeywords = this.videoStorage.getList(RECENT_KEYWORDS);

    this.$recentKeyword.innerHTML = getRecentKeywordTemplate(recentKeywords);
  }

  renderFirstSearchGroup() {
    this.groupIndex = -1;
    this.nextPageToken = '';
    this.$searchResultWrapper.innerHTML = '';
    this.renderSearchGroup();
  }

  renderSearchGroup() {
    this.renderSkeleton();
    const url = this.model.getRequestURL({
      part: PART_TYPE,
      q: this.keyword,
      type: SEARCH_TYPE_VIDEO,
      maxResults: MAX_RESULT_COUNT,
      regionCode: REGION_CODE,
      pageToken: this.nextPageToken,
    });

    request(url)
      .then((response) => {
        return this.processJSON(response);
      })
      .then((videoList) => this.renderSearchResult(videoList))
      .catch((error) => console.error(error));
  }
}
