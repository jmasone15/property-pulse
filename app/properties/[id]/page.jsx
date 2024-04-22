'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProperty } from '@/utils/requests';

const PropertyPage = () => {
	const { id } = useParams();
	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) return;

			try {
				const property = await getProperty(id);
				setProperty(property);
			} catch (error) {
				console.error('Error fetching property: ', error);
			} finally {
				setLoading(false);
			}
		};

		if (property === null) {
			fetchData();
		}
	}, [id, property]);

	return <div>Property Page</div>;
};
export default PropertyPage;
