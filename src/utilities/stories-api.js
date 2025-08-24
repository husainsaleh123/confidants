import sendRequest from './send-request';

const BASE_URL = '/api/stories';

// ✅ Get logged-in user's stories
export function getUserStories() {
  return sendRequest(BASE_URL);
}

// ✅ Get all stories
export function getAllStories() {
  return sendRequest(`${BASE_URL}/all`);
}

// ✅ Create a story (pass story data in body)
export function createStory(storyData) {
  return sendRequest(BASE_URL, 'POST', storyData);
}

// ✅ Update a story (needs storyId + updated data)
export function updateStory(storyId, storyData) {
  return sendRequest(`${BASE_URL}/${storyId}`, 'PUT', storyData);
}

// ✅ Delete a story (needs storyId)
export function deleteStory(storyId) {
  return sendRequest(`${BASE_URL}/${storyId}`, 'DELETE');
}

// ✅ Get a single story (needs storyId)
export function getStory(storyId) {
  return sendRequest(`${BASE_URL}/${storyId}`);
}
