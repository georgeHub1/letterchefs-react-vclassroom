import { userKey } from '../config';
import Http from './http';

export const hasLocalStorage = () => window && 'localStorage' in window;
export const getLocalStore = (key) =>
	hasLocalStorage() ? window.localStorage.getItem(key) : false;
export const saveToLocalStore = (key, data) => {
	if (!hasLocalStorage()) {
		return false;
	}
	window.localStorage.setItem(key, data);
};

export const getUserDetails = (raw) => {
	try {
		const jsonString = getLocalStore(userKey);
		if (raw) {
			return jsonString;
		}
		return JSON.parse(jsonString);
	} catch (err) {
		return {};
	}
};

export const saveUserDetails = (data, reload) => {
	if (!hasLocalStorage() || !data || typeof data !== 'object') {
		return false;
	}
	const newDetails = JSON.stringify(data);
	if (JSON.stringify(getUserDetails()) === newDetails) {
		return;
	}
	window.localStorage.setItem(userKey, newDetails);
	if (reload === true) {
		window.location.reload(true);
	}
};

export const signOut = (reload) => {
	if (!window) return;
	window.localStorage.removeItem(userKey);
	if (reload) {
		window.location.reload(true);
	}
};

let userID = 0;
export const userDetails = getUserDetails() || {};
if (userDetails) {
	userID = (userDetails.id || 0) * 1;
}

export const mustBeSignedIn = () => {
	if (!userID) signOut();
};

export const downloadUserDetails = (props = {}) => {
	const { errMsg, notFoundMsg, notSentMsg, reload = true } = props;
	let { userID } = props;
	return new Promise((resolve, reject) => {
		const srch = new URL(window.location.href).searchParams;
		if (!userID && window) {
			userID = srch.get('user_id');
		}
		if (!userID) {
			userID = userDetails.id;
		}
		if (!userID) {
			return resolve(null);
		}
		Http().secureRequest({
			url: `/users/${userID}?user_id=${userID}`,
			successCallback: ({ status, data, error }) => {
				if (status !== true) {
					return reject(error || errMsg || 'Error downloading user details');
				}
				saveUserDetails(data, reload);
				return resolve(data);
			},
			noContent: () => reject(notFoundMsg || 'User not found'),
			errorCallback: () => reject(notSentMsg || 'Could not'),
		});
	});
};

export { userID };
