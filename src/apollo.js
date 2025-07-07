import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_ULTRA_GRAPHQL_URL,
});

const fetchUltraToken = async () => {
  const res = await fetch(process.env.REACT_APP_ULTRA_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.REACT_APP_ULTRA_CLIENT_ID,
      client_secret: process.env.REACT_APP_ULTRA_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error('Failed to authenticate with Ultra');
  const data = await res.json();
  return data.access_token;
};

const authLink = setContext(async (_, { headers }) => {
  const token = await fetchUltraToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { ApolloProvider }; 