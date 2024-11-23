"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { StoryCard } from "@/components/ui/storycard";
import { newsService } from "@/services/newsService";
import type { Story } from "@/types/news";

export default function Home() {
	const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadStories = async () => {
			try {
				const [featured, storiesData] = await Promise.all([
					newsService.getFeaturedStory(),
					newsService.getStories(1),
				]);

				setFeaturedStory(featured);
				setStories(storiesData.stories);
			} catch (error) {
				console.error("Failed to load stories:", error);
			} finally {
				setLoading(false);
			}
		};

		loadStories();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br">
			<Navigation />
			<main className="flex-1">
				<div className="container mx-auto px-4 py-12">
					<div className="flex gap-4 mb-8 animate-fade-in">
						<Badge
							variant="secondary"
							className="animate-pulse bg-red-500 text-white hover:bg-red-600 transition-colors"
						>
							BREAKING NEWS
						</Badge>
						<Badge
							variant="outline"
							className="hover:scale-105 transition-transform"
						>
							MARKET UPDATE
						</Badge>
					</div>

					{featuredStory && (
						<div className="transform hover:scale-[1.01] transition-transform duration-200">
							<StoryCard
								isFeature
								id={featuredStory.id}
								category={featuredStory.category}
								title={featuredStory.title}
								description={featuredStory.description}
								image={featuredStory.image}
								likes={featuredStory.likes}
							/>
						</div>
					)}

					<div className="grid md:grid-cols-3 gap-6">
						{stories.map((story) => (
							<div
								key={story.id}
								className="transform hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
							>
								<StoryCard
									id={story.id}
									category={story.category}
									title={story.title}
									description={story.description}
									image={story.image}
									likes={story.likes}
								/>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
