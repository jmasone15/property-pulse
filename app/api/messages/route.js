import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// POST /api/messages
export const POST = async (request) => {
	try {
		await connectDB();

		const { name, email, phone, message, property, recipient } =
			await request.json();
		const sessionUser = await getSessionUser();

		if (!sessionUser) {
			return new Response('You must be logged in to send a message.', {
				status: 401
			});
		}

		// Cannot send message to self.
		if (sessionUser.id === recipient) {
			return new Response(
				JSON.stringify({ message: 'Cannot send a message to yourself.' }),
				{ status: 400 }
			);
		}

		const newMessage = new Message({
			sender: sessionUser.id,
			recipient,
			property,
			email,
			phone,
			name,
			body: message
		});

		await newMessage.save();

		return new Response(JSON.stringify({ message: 'Message Sent.' }), {
			status: 200
		});
	} catch (error) {
		console.error(error);
		return new Response('Something went wrong...', {
			status: 500
		});
	}
};
