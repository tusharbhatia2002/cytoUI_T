import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Credentials({
      // The name to display on the sign-in form (e.g., "Sign in with...")
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Implement your own authentication logic here
        const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  secret: 'SUPER_SECRET',
  session: {
    jwt: true,
  },
};

export default (req, res) => NextAuth(req, res, options);

