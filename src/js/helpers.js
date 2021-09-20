import { timeout_sec } from './config';

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Timeout after ${s} second`));
		}, s * 1000);
	});
};

export const ajax = async function (url, uploadData = undefined) {
	try {
		const fetchPro = uploadData
			? fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(uploadData),
			  })
			: fetch(url);
		const res = await Promise.race([fetchPro, timeout(timeout_sec)]);
		const data = await res.json();
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	} catch (err) {
		throw err;
	}
};

/*
export const getJSON = async function (url) {
	try {
		const fetchPro = fetch(url);
		const res = await Promise.race([fetchPro, timeout(timeout_sec)]);
		const data = await res.json();
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	} catch (err) {
		throw err;
	}
};

export const sendJSON = async function (url, uploadData) {
	try {
		const fetchPro = fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(uploadData),
		});
		const res = await Promise.race([fetchPro, timeout(timeout_sec)]);
		const data = await res.json();
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	} catch (err) {
		throw err;
	}
};
*/
