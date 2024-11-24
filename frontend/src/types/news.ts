// src/types/news.ts
export interface Like {
	id: string;
	name: string;
	image: string;
}

export interface Story {
	id: string;
	category: string;
	title: string;
	description: string;
	content: string;
	image?: string;
	readtime?: string;
	likes: Like[];
	publishedAt: string;
	author?: string;
	audio?: string;
	tags?: string[];
	sources?: string[];
}

export interface NewsResponse {
	stories: Story[];
	hasMore: boolean;
}
