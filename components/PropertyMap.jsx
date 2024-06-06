'use client';

import { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker } from 'react-map-gl';
import { setDefaults, fromAddress } from 'react-geocode';
import Spinner from './Spinner';
import Image from 'next/image';
import pin from '@/assets/images/pin.svg';

const PropertyMap = ({ property }) => {
	const [lat, setLat] = useState(null);
	const [lon, setLon] = useState(null);
	const [viewport, setViewport] = useState({
		latitude: 0,
		longitude: 0,
		zoom: 12,
		width: '100%',
		height: '500px'
	});
	const [loading, setLoading] = useState(true);
	const [geoCodeError, setGeoCodeError] = useState(false);

	setDefaults({
		key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
		language: 'en',
		region: 'us'
	});

	useEffect(() => {
		const fetchCoords = async () => {
			try {
				const res = await fromAddress(
					`${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
				);

				// Check for successful results
				if (res.results.length === 0) {
					// No results found
					setGeoCodeError(true);
				} else {
					const { lat, lng } = res.results[0].geometry.location;

					setLat(lat);
					setLon(lng);
					setViewport({
						...viewport,
						latitude: lat,
						longitude: lng
					});
				}
			} catch (error) {
				console.error(error);
				setGeoCodeError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchCoords();
	}, []);

	if (loading) {
		return <Spinner loading={loading} />;
	}

	// Handle case where geocoding failed
	if (geoCodeError) {
		return <div className='text-xl text-center'>No location data found</div>;
	}

	return (
		!loading && (
			<Map
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				mapLib={import('mapbox-gl')}
				initialViewState={{
					longitude: lon,
					latitude: lat,
					zoom: 15
				}}
				style={{ width: '100%', height: 500 }}
				mapStyle='mapbox://styles/mapbox/streets-v9'>
				<Marker longitude={lon} latitude={lat} anchor='bottom'>
					<Image src={pin} alt='location' width={30} height={30} />
				</Marker>
			</Map>
		)
	);
};
export default PropertyMap;
