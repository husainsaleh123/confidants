import sendRequest from './send-request';
const BASE_URL = '/api/friends';
// Get logged-in user's friends
export function getUserFriends() {
  return sendRequest(BASE_URL);
}
// Create a friend (pass friend data in body)
export function createFriend(friendData) {
  return sendRequest(BASE_URL, 'POST', friendData);
}
// Update a friend (needs storyId + updated data)
export function updateFriend(friendId, friendData) {
  return sendRequest(`${BASE_URL}/${friendId}`, 'PUT', friendData);
}
// Delete a friend (needs storyId)
export function deleteFriend(friendId) {
  return sendRequest(`${BASE_URL}/${friendId}`, 'DELETE');
}
// Get a single friend
export function getFriend(friendId) {
  return sendRequest(`${BASE_URL}/${friendId}`);
}