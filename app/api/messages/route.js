import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/messages
export const GET = async () => {
	try {
		await connectDB();
		const sessionUser = await getSessionUser();

		if (!sessionUser) {
			return new Response('User ID is required.', {
				status: 401
			});
		}

		const messages = await Message.find({ recipient: sessionUser.id })
			.populate('sender', 'username')
			.populate('property', 'name');

		return new Response(JSON.stringify(messages), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Something went wrong...', {
			status: 500
		});
	}
};

// POST /api/messages
export const POST = async (request) => {
	try {
		await connectDB();

		const { name, email, phone, message, property, recipient } =
			await request.json();
		const sessionUser = await getSessionUser();

		if (!sessionUser) {
			return new Response(
				JSON.stringify({ message: 'You must be logged in to send a message.' }),
				{
					status: 401
				}
			);
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
