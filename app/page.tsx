import { Suspense } from 'react';

import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import Link from 'next/link';

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://127.0.0.1:5000/graphql",
	}),
	cache: new InMemoryCache(),
});

const GET_USER = gql`
query getUser($userId: ID!) {
	user(id: $userId) {
		email
		categories {
			id
			name
			subscriptions {
				id
				unreadCount
				entries {
					id
					read
					entry {
						id
						title
						published
					}
				}
				feed {
					id
					title
					link
				}
			}
		}
	}
}
`

export default async function Home() {
	const { data } = await client.query({
		query: GET_USER,
		variables: {
			userId: 1
		}
	});
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<User promise={data} />
			</Suspense>
		</>
	)
}


async function User({ promise }) {
	const data = await promise;
	return (
		<div>
			<ul className="list-disc list-inside hover:list-inside">
				{data.user.categories.map((category) => (
					<li key={category.id}>{category.name}
						<ul className="list-disc list-inside hover:list-inside">
							{category.subscriptions.map((subscription) => (
								<li key={subscription.id} className="pl-5"><Link className="text-blue-600 visited:text-purple-600" href={`/feeds/${subscription.feed.id}`}>{subscription.feed.title} - {subscription.unreadCount}</Link></li>
							))}
						</ul>
					</li >
				))
				}
			</ul >
		</div>
	)
}
