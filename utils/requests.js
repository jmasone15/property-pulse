const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// GET all properties
const getProperties = async () => {
	try {
		// Handle the case where the domain is not available yet
		if (!apiDomain) {
			console.log('API Domain not available.');
			return [];
		}

		const res = await fetch(`${apiDomain}/properties`);

		if (!res.ok) {
			throw new Error('Failed to fetch data.');
		} else {
			return res.json();
		}
	} catch (error) {
		console.log(error);
		return [];
	}
};

// GET one property
const getProperty = async (id) => {
	try {
		// Handle the case where the domain is not available yet
		if (!apiDomain) {
			console.log('API Domain not available.');
			return null;
		}

		const res = await fetch(`${apiDomain}/properties/${id}`);

		if (!res.ok) {
			throw new Error('Failed to fetch data.');
		} else {
			return res.json();
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};

export { getProperties, getProperty };
