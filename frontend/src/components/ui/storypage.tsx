// components/story-page.tsx
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Badge } from "@/components/ui/badge";
import { StoryCard } from "@/components/ui/storycard";
import type { Story } from "@/types/news";
import Footer from "@/components/ui/footer";

interface StoryPageProps {
	stories: Story[];
	showBadges?: boolean;
}

export function StoryPage({ stories, showBadges = true }: StoryPageProps) {
	const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
	const [currentstories, setCurrentStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFeaturedStory = async () => {
			try {
				if (stories.length === 0) {
					return;
				}
				const featured = await stories[0];
				setCurrentStories(stories.slice(1));
				setFeaturedStory(featured);
			} catch (error) {
				console.error("Failed to load featured story:", error);
			} finally {
				setLoading(false);
			}
		};

		loadFeaturedStory();
	}, []);

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br">
			<Navigation />
			<main className="flex-1">
				<div className="container mx-auto px-4 py-12">
					{showBadges && (
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
					)}

					{!loading && featuredStory && (
						<div className="transform hover:scale-[1.01] transition-transform duration-200 mb-12">
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

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{currentstories.map((story) => (
							<StoryCard
								key={story.id}
								id={story.id}
								category={story.category}
								title={story.title}
								description={story.description}
								image={story.image}
								likes={story.likes}
							/>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
