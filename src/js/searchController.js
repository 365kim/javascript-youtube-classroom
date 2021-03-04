import SearchModel from './models/searchModel.js';
import SearchView from './searchView.js';
import VideoLocalStorage from './models/localStorage.js';
import { VIDEOS_TO_WATCH, STORAGE_CAPACITY_FULL, MAX_VIDEO_STORAGE_CAPACITY } from './constants.js';
import { $, isEndOfPage } from './utils/DOM.js';

export default class SearchController {
  constructor() {
    this.model = new SearchModel();
    this.view = new SearchView();
    this.storage = new VideoLocalStorage();
  }

  init() {
    this.selectDOMs();
    this.attachEvents();
  }

  onShowModal() {
    this.$searchSection.classList.add('open');
    this.view.showCurrentStoredVideoCount();
    this.view.renderRecentKeyword();
    this.keyword = this.storage.getMostRecentKeyword();

    if (this.keyword === '') {
      return;
    }
    this.view.renderFirstSearchGroup();
  }

  onCloseModal() {
    this.$searchSection.classList.remove('open');
    this.$searchKeywordForm.reset();
  }

  onRequestNextResult() {
    if (!isEndOfPage(this.$searchSection)) {
      return;
    }
    this.view.renderSearchGroup();
  }

  onSearchKeyword(e) {
    e.preventDefault();
    this.model.setKeyword(e.target.elements['search-keyword-input'].value);

    this.keyword = e.target.elements['search-keyword-input'].value;
    if (this.keyword === '') {
      return;
    }

    this.storage.addRecentKeyword(this.keyword);
    this.view.renderRecentKeyword();
    this.view.renderFirstSearchGroup();
  }

  onSaveVideo({ target }) {
    if (target.type !== 'button') {
      return;
    }

    const $saveButton = target;
    const video = {
      videoId: $saveButton.dataset.videoId,
      videoTitle: $saveButton.dataset.videoTitle,
      channelId: $saveButton.dataset.channelId,
      channelTitle: $saveButton.dataset.channelTitle,
      publishedAt: $saveButton.dataset.publishedAt,
    };

    const storedCount = this.storage.getStoredVideoCount();

    if (storedCount >= MAX_VIDEO_STORAGE_CAPACITY) {
      this.view.showSnackbar(STORAGE_CAPACITY_FULL);
      return;
    }

    this.storage.addVideo(VIDEOS_TO_WATCH, video);
    this.showCurrentStoredVideoCount();
    $saveButton.classList.add('stored');
  }

  selectDOMs() {
    this.$searchSection = $('#search-section');
    this.$searchResultWrapper = $('#search-result-wrapper');
    this.$searchKeywordForm = $('#search-keyword-form');
    this.$searchButton = $('#search-button');
    this.$recentKeyword = $('#recent-keyword');
    this.$modalCloseButton = $('#modal-close-button');
    this.$storedVideoCount = $('#stored-video-count');
    this.$snackbar = $('#snackbar');
  }

  attachEvents() {
    this.$searchButton.addEventListener('click', this.onShowModal.bind(this));
    this.$modalCloseButton.addEventListener('click', this.onCloseModal.bind(this));
    this.$searchKeywordForm.addEventListener('submit', this.onSearchKeyword.bind(this));
    this.$searchSection.addEventListener('scroll', this.onRequestNextResult.bind(this));
    this.$searchResultWrapper.addEventListener('click', this.onSaveVideo.bind(this));
  }
}
