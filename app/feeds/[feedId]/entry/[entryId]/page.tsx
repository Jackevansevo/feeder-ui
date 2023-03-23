import Link from 'next/link'
import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://127.0.0.1:5000/graphql",
	}),
	cache: new InMemoryCache(),
});

const GET_ENTRY = gql`
query getUserEntry($userEntryId: ID!) {
	userEntry(id: $userEntryId) {
		id
		entry {
			title
			published
			content
			link
		}
	}
}
`
export default async function Entry({ params }: { params: { entryId: number } }) {
	const { data } = await client.query({
		query: GET_ENTRY,
		variables: {
			userEntryId: params.entryId
		}
	});
	const userEntry = data.userEntry;
	const entry = userEntry.entry;

	const markup = { __html: entry.content }
	return (
		<div>
			<h1 className="text-4xl pb-5">{entry.title}</h1>
			<h2 className="text-2xl pb-2">{entry.published}</h2>
			<button className="py-2 mb-3 px-3 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-md shadow focus:outline-none"><Link href={entry.link}>View Original</Link></button>
			<hr />
			<article className="prose prose-stone" dangerouslySetInnerHTML={markup} />
		</div>
	)
}
