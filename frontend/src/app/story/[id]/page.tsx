"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Headphones } from "lucide-react";
import { newsService } from "@/services/newsService";
import type { Story } from "@/types/news";
import Footer from "@/components/ui/footer";
import { StoryCard } from "@/components/ui/storycard";

export default function StoryDetail() {
	const router = useRouter();
	const params = useParams();
	const [paragraphs, setParagraphs] = useState<string[]>([]);
	const [story, setStory] = useState<Story | null>(null);
	const [loading, setLoading] = useState(true);
	// const [article1, setArticle1] = useState<Story>();
	const [article2, setArticle2] = useState<Story>();
	const [relatedStories, setRelatedStories] = useState<Story[]>([]);

	useEffect(() => {
		const loadStory = async () => {
			try {
				const storyId = params.id as string;
				const storyData = await newsService.getStoryById(storyId);
				if (!storyData) {
					throw new Error("Story not found");
				}
				setParagraphs(storyData.content.split(/\n\s*\n/));
				setStory(storyData);

				// set inlineData
				const newInlineStorys = await newsService.getInlineStories(
					[storyId],
					storyData.category,
					storyData.tags || []
				);
				if (newInlineStorys.length > 0) {
					setArticle2(newInlineStorys[0]);
				}

				// set relatedData
				const newRelatedStories = await newsService.getRelatedStories(
					[storyId, ...newInlineStorys.map((s) => s.id)],
					storyData.category,
					storyData.tags || []
				);
				setRelatedStories(newRelatedStories);
			} catch (error) {
				console.error("Failed to load story:", error);
			} finally {
				setLoading(false);
			}
		};
		const loadArticles = async () => {
			try {
			} catch (error) {
				console.error("Failed to load articles:", error);
			}
		};
		loadStory();
		loadArticles();
	}, [params.id]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
			</div>
		);
	}

	if (!story) {
		return <div>Story not found</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<Button
					variant="ghost"
					onClick={() => router.push("/")}
					className="mb-8 hover:scale-105 transition-transform"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>

				<article className="max-w-4xl mx-auto">
					<div className="flex items-center gap-4 mb-4">
						<Badge>{story.category}</Badge>
						{story.tags && story.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{story.tags.map((tag, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="px-2 py-0.5 text-xs rounded-full"
									>
										{tag}
									</Badge>
								))}
							</div>
						)}
					</div>
					<h1 className="text-4xl font-bold mb-6">{story.title}</h1>

					<div className="mb-6 text-lg text-gray-600 italic leading-relaxed">
						<p>{story.description}</p>
					</div>

					<div className="flex items-center gap-4 mb-8 text-gray-600">
						<div>
							<p className="text-sm">
								Published on {new Date(story.publishedAt).toLocaleDateString()}{" "}
								| {story.readtime ? story.readtime : "5"}min readtime
							</p>
						</div>
					</div>

					{story.image && (
						<img
							src={story.image}
							alt={story.title}
							className="w-full h-[500px] object-cover rounded-lg mb-8"
						/>
					)}

					<div>
						{story.audio && (
							<div className="border-b mb-8 pb-4">
								<div className="flex items-center gap-4 mb-4">
									<Headphones className="h-6 w-6 text-gray-600" />
									<div>
										<h3 className="font-semibold">Listen to this article</h3>
										<p className="text-sm text-gray-500">
											Available in audio format
										</p>
									</div>
								</div>

								<audio controls className="w-full">
									<source src={story.audio} type="audio/mpeg" />
									Your browser does not support the audio element.
								</audio>
							</div>
						)}

						<div className="flex flex-col gap-4">
							<div className="prose dark:prose-invert">
								<p className="text-lg leading-relaxed">{paragraphs[0]}</p>
							</div>
							{/* {article1 && (
								<StoryCard
									id={article1.id}
									category={article1.category}
									title={article1.title}
									description={article1.description}
									image={article1.image}
									likes={article1.likes}
									tags={article1.tags}
									style="picture"
								/>
							)} */}
							<div className="prose dark:prose-invert">
								<p className="text-lg leading-relaxed">{paragraphs[1]}</p>
							</div>
							{article2 && (
								<StoryCard
									id={article2.id}
									category={article2.category}
									title={article2.title}
									description={article2.description}
									image={article2.image}
									likes={article2.likes}
									tags={article2.tags}
									style="picture"
								/>
							)}
							<div className="prose dark:prose-invert">
								<p className="text-lg leading-relaxed">
									{paragraphs.slice(2).join("\n\n")}
								</p>
							</div>
							{story.sources && story.sources.length > 0 && (
								<div className="mt-8">
									<h2 className="text-xl font-semibold mb-4">Sources</h2>
									<ul className="list-disc list-inside">
										{story.sources.map((source, index) => (
											<li key={index} className="mb-2">
												<a
													href={source}
													target="_blank"
													rel="noopener noreferrer"
												>
													{source}
												</a>
											</li>
										))}
									</ul>
								</div>
							)}
							{story.author && (
								<div>
									<div className="flex items-center gap-4 text-sm font-thin italic">
										Written by {story.author}
									</div>
								</div>
							)}
							<div className="flex items-center gap-4 mt-8">
								<Button
									onClick={() => router.push("/")}
									className="hover:scale-105 transition-transform"
								>
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back to Home
								</Button>
							</div>
						</div>
					</div>

					{relatedStories.length > 0 && (
						<div className="mt-8 pt-8 border-t">
							<h2 className="text-2xl font-bold mb-4">Related Stories</h2>
							{/* Add related stories component here */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
								{relatedStories.map((story) => (
									<StoryCard
										key={story.id}
										id={story.id}
										category={story.category}
										title={story.title}
										description={story.description}
										image={story.image}
										likes={story.likes}
										tags={story.tags}
										style="compact"
									/>
								))}
							</div>
						</div>
					)}
				</article>
			</div>
			<Footer />
		</div>
	);
}
