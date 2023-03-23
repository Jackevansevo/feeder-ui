import Link from 'next/link'
import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://127.0.0.1:5000/graphql",
	}),
	cache: new InMemoryCache(),
});

const GET_SUBSCRIPTION = gql`
query getSubscription($subscriptionId: ID!) {
	subscription(id: $subscriptionId) {
		id
		unreadCount
		feed {
				title
				link
		}
		entries {
			read
			entry {
				id
				title
			}
		}
	}
}

`
export default async function Entry({ params }: { params: { feedId: number } }) {
	const { data } = await client.query({
		query: GET_SUBSCRIPTION,
		variables: {
			subscriptionId: params.feedId
		}
	});

	return (
		<div>
			<h1 className="text-4xl pb-5">{data.subscription.feed.title}</h1>
			<button className="py-2 mb-3 px-3 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-md shadow focus:outline-none"><Link href={data.subscription.feed.link}>View Site</Link></button>
			<ul className="list-disc list-inside hover:list-inside">
				{data.subscription.entries.map((userEntry) => (
					<li><Link className="text-blue-600 visited:text-purple-600" href={`/feeds/${data.subscription.id}/entry/${userEntry.entry.id}`}>{userEntry.entry.title}</Link></li>
				))}
			</ul>
		</div>
	)
}
