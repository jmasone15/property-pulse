import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/messages/unread-count
export const GET = async (request, { params }) => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser) {
			return new Response('User ID is required.', {
				status: 401
			});
		}

		const count = await Message.countDocuments({
			recipient: sessionUser.id,
			read: false
		});

		return new Response(JSON.stringify(count), {
			status: 200
		});
	} catch (error) {
		console.error(error);
		return new Response('Something went wrong...', { status: 500 });
	}
};
