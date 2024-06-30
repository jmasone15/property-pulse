import connectDB from '@/config/database';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

// GET /api/properties/search
export const GET = async (request) => {
	try {
		await connectDB();

		const location = request.nextUrl.searchParams.get('location');
		const propertyType = request.nextUrl.searchParams.get('propertyType');

		// Match locationPattern against database fields.
		const locationPattern = new RegExp(location, 'i');
		let query = {
			$or: [
				{ name: locationPattern },
				{ description: locationPattern },
				{ 'location.street': locationPattern },
				{ 'location.city': locationPattern },
				{ 'location.state': locationPattern },
				{ 'location.zipcode': locationPattern }
			]
		};

		// Only check for property if not 'All'.
		if (propertyType && propertyType !== 'All') {
			const typePattern = new RegExp(propertyType, 'i');
			query.type = typePattern;
		}

		const properties = await Property.find(query);

		return new Response(JSON.stringify(properties), {
			status: 200
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify('Something went wrong...'), {
			status: 500
		});
	}
};
