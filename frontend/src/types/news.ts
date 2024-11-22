// src/types/news.ts
export interface Story {
	id: number;
	category: string;
	title: string;
	description: string;
	content: string;
	image?: string;
	isFeature?: boolean;
}

export interface NewsResponse {
	stories: Story[];
	hasMore: boolean;
}
