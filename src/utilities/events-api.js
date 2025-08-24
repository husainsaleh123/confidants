
import sendRequest from './send-request';

const BASE_URL = '/api/events';

// Get all events ---index
export function getEvents() {
	return sendRequest(`${BASE_URL}`);
}

// Get a single event by ID
export function getEvent(id) {
	return sendRequest(`${BASE_URL}/${id}`);
}

// Create a new event
export function createEvent(eventData) {
	return sendRequest(BASE_URL, 'POST', eventData);
}

// Update an event by ID
export function updateEvent(id, eventData) {
	return sendRequest(`${BASE_URL}/${id}`, 'PUT', eventData);
}

// Delete an event by ID
export function deleteEvent(id) {
	return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}
