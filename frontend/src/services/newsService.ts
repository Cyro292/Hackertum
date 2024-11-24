// src/services/newsService.ts
import { Story, Like, NewsResponse } from "@/types/news";

class NewsService {
	private likes: Like[] = [];
	private stories: Story[] = [];

	constructor() {
		this.initializeStories();
	}

	private async initializeStories(): Promise<void> {
		this.stories = await this.getStoryData();
		this.likes = await this.getLikedData();
	}

	private async getLikedData(): Promise<Like[]> {
		return [];
	}

	private async getStoryData(): Promise<Story[]> {
		const url = "http://188.245.176.254:8000/api/v1/stories/get_all_stories";

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return data.map((story: any) => ({
				id: story.id,
				category: story.category,
				title: story.title,
				description: story.description,
				content: story.content,
				image: story.image,
				readtime: story.readtime,
				isFeature: story.isFeature,
				publishedAt: story.publishedAt,
				author: story.author,
				audio: story.audio,
				tags: story.tags,
				sources: story.sources,
			}));
		} catch (error) {
			console.error("Failed to fetch stories:", error);
			return [];
		}
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
				return !exclude.includes(story.id);
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
				return !exclude.includes(story.id);
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
