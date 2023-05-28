import { Anime } from './anime';
import { api } from './api';

export interface Recommendations {
	[key: string]: Anime[];
}

interface RecommendationRequest {
	search_words: string[];
	count: number;
}

export interface Recommendation {
	id: string;
	data: Recommendations;
	search_words: string[];
	user_id: string;
}

export const animeApi = api.injectEndpoints({
	endpoints: build => ({
		createRecommendation: build.mutation<
			Recommendations,
			RecommendationRequest
		>({
			query(body) {
				return {
					url: `/api/recommendations`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: [{ type: 'User', id: 'RECOMMENDATIONS' }],
		}),
		getRecommendation: build.query<Recommendation, string>({
			query: id => `/api/recommendations/${id}`,
		}),
	}),
});

export const { useCreateRecommendationMutation, useGetRecommendationQuery } =
	animeApi;
