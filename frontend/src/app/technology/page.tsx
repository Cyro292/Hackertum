"use client";

import { StoryPage } from "@/components/ui/storypage";
import { newsService } from "@/services/newsService";
import { useEffect, useState } from "react";
import type { Story } from "@/types/news";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";

export default function Technology() {
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);

	const fetchStories = async (pageNum: number) => {
		try {
			setLoading(true);
			const data = await newsService.getStories(pageNum, 7, "Technologie");
			setStories((prev) =>
				pageNum === 1 ? data.stories : [...prev, ...data.stories]
			);
			setHasMore(data.hasMore);
		} catch (err) {
			console.error("Failed to fetch stories:", err);
			setError("Failed to load stories");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStories(1);
	}, []);

	const handleLoadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchStories(nextPage);
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="space-y-8">
			<div>
				<StoryPage stories={stories} />

				{loading && <div>Loading...</div>}

				{!loading && hasMore && (
					<div className="flex justify-center mb-12">
						<Button onClick={handleLoadMore} variant="outline">
							Load More
						</Button>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
