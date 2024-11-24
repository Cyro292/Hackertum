// src/services/newsService.ts
import { Story, Like, NewsResponse } from "@/types/news";

class NewsService {
	public async getLikedData(): Promise<Like[]> {
		return [];
	}

	public async getStoryData(): Promise<Story[]> {
		const url = "https://api.veldt.nexus/api/v1/stories/get_all_stories";

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
				audio: `https://github.com/Constant-Sudo/file-bucket4132/raw/refs/heads/main/bucket/${story.audio}`, // Using proper path construction
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
			const stories = await this.getStoryData();
			const categoryStories = stories.filter((s) => {
				if (!category) return true;
				return s.category.toLowerCase().includes(category.toLowerCase());
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

	async getStoryById(id: string): Promise<Story | null> {
		try {
			const stories = await this.getStoryData();
			const story = stories.find((s) => s.id === id);
			await new Promise((resolve) => setTimeout(resolve, 100));
			return story || null;
		} catch (error) {
			console.error("Error fetching story:", error);
			throw error;
		}
	}

	async searchStories(query: string): Promise<Story[]> {
		const searchTerms = query.toLowerCase().split(" ");
		const stories = await this.getStoryData();

		return stories.filter((story) => {
			const searchableText = `
			${story.title.toLowerCase()} 
			${story.description.toLowerCase()} 
			${story.category.toLowerCase()}
		  `;

			return searchTerms.every((term) => searchableText.includes(term));
		});
	}

	async getRelatedStories(
		exclude: string[],
		category: string,
		tags: string[],
		number: number = 3
	): Promise<Story[]> {
		const stories = await this.getStoryData();
		const relatedStories = stories
			.filter((story) => {
				// const hasCategory =
				// 	story.category.toLowerCase() === category.toLowerCase();
				// const hasTags = tags.every((tag) => story.tags?.includes(tag));
				return !exclude.includes(story.id);
				// && (hasCategory || hasTags);
			})
			.sort(() => Math.random() - 0.5)
			.slice(0, number);

		return relatedStories;
	}

	async getInlineStories(
		exclude: string[],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		category: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		tags: string[]
	): Promise<Story[]> {
		const stories = await this.getStoryData();
		const inlineStories = stories
			.filter((story) => {
				// const hasCategory =
				// 	story.category.toLowerCase() === category.toLowerCase();
				// const hasTags = tags.every((tag) => story.tags?.includes(tag));
				return !exclude.includes(story.id);
				// && (hasCategory || hasTags);
			})
			.sort(() => Math.random() - 0.5)
			.slice(0, 2);

		return inlineStories;
	}

	async getFeaturedStory(category: string): Promise<Story | null> {
		const stories = await this.getStoryData();
		const categoryStories = stories.filter((story) =>
			story.category.toLowerCase().includes(category.toLowerCase())
		);
		const featured =
			categoryStories[Math.floor(Math.random() * categoryStories.length)];

		return featured || null;
	}
}

export const newsService = new NewsService();
