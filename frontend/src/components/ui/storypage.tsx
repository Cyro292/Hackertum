// components/story-page.tsx
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Badge } from "@/components/ui/badge";
import { StoryCard } from "@/components/ui/storycard";
import type { Story } from "@/types/news";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/ui/footer";

interface StoryPageProps {
	stories: Story[];
	showBadges?: boolean;
}

export function StoryPage({ stories, showBadges = true }: StoryPageProps) {
	const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
	const [currentStories, setCurrentStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		try {
			if (stories.length === 0) {
				setFeaturedStory(null);
				setCurrentStories([]);
				return;
			}
			// No need for await as this is direct array access
			const featured = stories[0];
			setFeaturedStory(featured);
			setCurrentStories(stories.slice(1));
		} catch (error) {
			console.error("Failed to load featured story:", error);
		} finally {
			setLoading(false);
		}
	}, [stories]); // Add stories to dependency array

	if (loading) {
		return (
			<div className="w-full space-y-8 animate-in fade-in-50">
				{/* Featured Story Skeleton */}
				<div className="space-y-4">
					<div className="flex items-center space-x-4">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
					<Skeleton className="h-[300px] w-full rounded-xl" />
					<Skeleton className="h-4 w-[90%]" />
					<Skeleton className="h-4 w-[80%]" />
				</div>

				{/* Regular Stories Skeletons */}
				{[1, 2, 3].map((i) => (
					<div key={i} className="space-y-4">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[200px]" />
								<Skeleton className="h-4 w-[150px]" />
							</div>
						</div>
						<Skeleton className="h-[200px] w-full rounded-lg" />
						<Skeleton className="h-4 w-[70%]" />
					</div>
				))}
			</div>
		);
	}

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
						{currentStories.map((story) => (
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
