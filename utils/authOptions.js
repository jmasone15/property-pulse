import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				// Prompts the user to select a google account everytime they login.
				// Good for testing.
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	callbacks: {
		// Invoked on successful signin
		async signIn({ profile }) {
			// 1. Connect to database
			// 2. Check if user logging in exists
			// 3. If not, then add user to database
			// 4. Return true to allow signin
		},
		// Modifies the session object
		async session({ session }) {
			// 1. Get user from database
			// 2. Assign the user id to the session
			// 3. Return session
		}
	}
};
