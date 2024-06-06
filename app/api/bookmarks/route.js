import connectDB from '@/config/database';
import User from '@/models/User';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/bookmarks
export const GET = async () => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();
		if (!sessionUser || !sessionUser.id) {
			return new Response('User ID is required.', { status: 401 });
		}

		// Find user in database
		const user = await User.findById(sessionUser.id);

		// Get user bookmarks
		const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });

		return new Response(JSON.stringify(bookmarks), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Something went wrong', { status: 500 });
	}
};

export const POST = async (request) => {
	try {
		await connectDB();
		const { propertyId } = await request.json();

		const sessionUser = await getSessionUser();
		if (!sessionUser || !sessionUser.id) {
			return new Response('User ID is required.', { status: 401 });
		}

		const { id } = sessionUser;

		// Find user in database
		const user = await User.findById(id);

		// Check if property is already bookmarked
		let isBookmarked = user.bookmarks.includes(propertyId);
		let message;

		if (isBookmarked) {
			// If already bookmarked, remove it
			user.bookmarks.pull(propertyId);
			message = 'Bookmark removed successfully';
			isBookmarked = false;
		} else {
			// If not bookmarked, add it
			user.bookmarks.push(propertyId);
			message = 'Bookmark added successfully';
			isBookmarked = true;
		}

		await user.save();
		return new Response(JSON.stringify({ message, isBookmarked }), {
			status: 200
		});
	} catch (error) {
		console.error(error);
		return new Response('Something went wrong', { status: 500 });
	}
};
