// src/services/newsService.ts
import storiesData from "@/data/stories.json";
import { Story, NewsResponse } from "@/types/news";

class NewsService {
	private stories: Story[] = storiesData.stories;

	async getFeaturedStory(): Promise<Story> {
		try {
			const featured =
				this.stories.find((story) => story.isFeature) || this.stories[0];
			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 100));
			return featured;
		} catch (error) {
			console.error("Error fetching featured story:", error);
			throw error;
		}
	}

	async getStories(page: number, limit: number = 6): Promise<NewsResponse> {
		try {
			const start = (page - 1) * limit;
			const end = start + limit;
			const paginatedStories = this.stories.slice(start, end);
			const hasMore = end < this.stories.length;

			// Simulate network delay
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

	async getStoriesByCategory(category: string): Promise<Story[]> {
		try {
			const filteredStories = this.stories.filter(
				(story) => story.category.toLowerCase() === category.toLowerCase()
			);
			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 100));
			return filteredStories;
		} catch (error) {
			console.error("Error fetching category stories:", error);
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
}

export const newsService = new NewsService();
