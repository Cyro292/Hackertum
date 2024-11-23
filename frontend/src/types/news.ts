// src/types/news.ts
export interface Like {
	id: string;
	name: string;
	image: string;
}

export interface Story {
	id: number;
	category: string;
	title: string;
	description: string;
	content: string;
	image?: string;
	readtime?: string;
	isFeature?: boolean;
	likes: Like[];
	publishedAt: string;
	author?: string;
}

export interface NewsResponse {
	stories: Story[];
	hasMore: boolean;
}
