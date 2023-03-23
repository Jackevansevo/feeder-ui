'use client';

import { useRouter } from 'next/navigation';

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { gql } from "@apollo/client";

const ADD_SUBSCRIPTION = gql`
mutation addSubscription($url: String!, $userId: Int!, $category: String!) {
  addSubscription(url: $url, userId: $userId, category: $category) {
		feed { title }
		category { name }
  }
}
`

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://127.0.0.1:5000/graphql",
	}),
	cache: new InMemoryCache(),
});

export default function AddFeedForm() {
	const router = useRouter();

	function handleSubmit(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());

		console.log(formJson);


		client.mutate({
			mutation: ADD_SUBSCRIPTION,
			variables: {
				url: formJson.url,
				category: formJson.category,
				userId: 1,
			}
		}).then(response => {
			console.log(response);
		}).finally(() => {
			console.log('redirect to main')
			router.push('/');
		});
	}
	return (
		<form method="post" onSubmit={handleSubmit}>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
					url
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="url" id="url" type="text" placeholder="https://thisweek.gnome.org/posts/index.xml" />
			</div>
			<div className="mb-6">
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
					category
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="category" id="category" type="text" />
			</div>
			<div className="flex items-center justify-between">
				<button className="bg-cyan-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
					Submit
				</button>
			</div>
		</form>
	)
}
