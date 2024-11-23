"use client";

import { StoryPage } from "@/components/ui/storypage";
import { newsService } from "@/services/newsService";
import { useEffect, useState } from "react";
import type { Story } from "@/types/news";

export default function IndustryPage() {
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStories = async () => {
			try {
				setLoading(true);
				const data = await newsService.getStories(1, 7, "reviews");
				setStories(data.stories);
			} catch (err) {
				console.error("Failed to fetch stories:", err);
				setError("Failed to load stories");
			} finally {
				setLoading(false);
			}
		};

		fetchStories();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return <StoryPage stories={stories} />;
}
