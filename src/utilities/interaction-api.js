
import sendRequest from './send-request';

const BASE_URL = '/api/interactions';

// Get all interactions ---index
export function getInteractions() {
	return sendRequest(`${BASE_URL}`);
}

// Get a single interaction by ID
export function getInteractions(id) {
	return sendRequest(`${BASE_URL}/${id}`);
}

// Create a new interaction
export function createInteraction(interactionData) {
	return sendRequest(BASE_URL, 'POST', interactionData);
}

// Update an interaction by ID
export function updateInteraction(id, interactionData) {
	return sendRequest(`${BASE_URL}/${id}`, 'PUT', interactionData);
}

// Delete an interaction by ID
export function deleteInteraction(id) {
	return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}
