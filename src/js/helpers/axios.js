import axios from 'axios';

export default {

  async axiosGet(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async axiosPost(url, body, options) {
    try {
      const response = await axios.post(url, body, options);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async axiosPut(url, body) {
    try {
      const response = await axios.put(url, body);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async axiosDelete(url) {
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  extractSingleResult(data) {
    return data && data.results ? data.results[0] : {};
  },

  extractMultipleResults(data) {
    return data ? data.results : [];
  }
};
