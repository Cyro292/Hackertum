// src/services/newsService.ts
import storiesData from "@/data/stories.json";
import { Story, Like, NewsResponse } from "@/types/news";

class NewsService {
	private likes: Like[] = this.getLikedData();
	private stories: Story[] = this.getStoryData();

	private getLikedData(): Like[] {
		return storiesData.likes;
	}

	private getStoryData(): Story[] {
		const stories = storiesData.stories;

		return stories.map((story) => {
			if (!story.likes)
				return {
					...story,
					likes: [],
					publishedAt: new Date().toISOString(),
				};
			return {
				...story,
				publishedAt: new Date().toISOString(),
				likes: story.likes
					.map((like) => {
						const newLike = this.likes.find((l) => l.id === like.id);
						return newLike || like;
					})
					.filter((like): like is Like => like !== undefined),
			};
		});
	}

	async getStories(
		page: number,
		limit: number = 7,
		category: string | null = null
	): Promise<NewsResponse> {
		try {
			const start = (page - 1) * limit;
			const end = start + limit;
			const categoryStories = this.stories.filter((s) => {
				if (!category) return true;
				return s.category.toLowerCase() === category.toLowerCase();
			});
			const paginatedStories = categoryStories.slice(start, end);

			const hasMore = end < categoryStories.length;

			await new Promise((resolve) => setTimeout(resolve, 100));

			return {
				stories: paginatedStories,
				hasMore,
			};
		} catch (error) {
			console.error("Error fetching stories:", error);
			throw error;
		}
	}

	async getStoryById(id: number): Promise<Story | null> {
		try {
			const story = this.stories.find((s) => s.id === id);
			await new Promise((resolve) => setTimeout(resolve, 100));
			return story || null;
		} catch (error) {
			console.error("Error fetching story:", error);
			throw error;
		}
	}

	async searchStories(query: string): Promise<Story[]> {
		const searchTerms = query.toLowerCase().split(" ");

		return this.stories.filter((story) => {
			const searchableText = `
			${story.title.toLowerCase()} 
			${story.description.toLowerCase()} 
			${story.category.toLowerCase()}
		  `;

			return searchTerms.every((term) => searchableText.includes(term));
		});
	}

	async getRelatedStories(
		exclude: number[],
		category: string,
		tags: string[],
		number: number = 3
	): Promise<Story[]> {
		const relatedStories = this.stories
			.filter((story) => {
				// const hasCategory =
				// 	story.category.toLowerCase() === category.toLowerCase();
				// const hasTags = tags.every((tag) => story.tags?.includes(tag));
				return !exclude.includes(story.id) 
						// && (hasCategory || hasTags);
			})
			.slice(0, number);

		return relatedStories;
	}

	async getInlineStories(
		exclude: number[],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		category: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		tags: string[]
	): Promise<Story[]> {
		const inlineStories = this.stories
			.filter((story) => {
				// const hasCategory =
				// 	story.category.toLowerCase() === category.toLowerCase();
				// const hasTags = tags.every((tag) => story.tags?.includes(tag));
				return !exclude.includes(story.id) 
						// && (hasCategory || hasTags);
			})
			.slice(0, 2);

		return inlineStories;
	}

	async getFeaturedStory(category: string): Promise<Story | null> {
		const featured = this.stories.find((story) => story.category === category);

		return featured || null;
	}
}

export const newsService = new NewsService();
