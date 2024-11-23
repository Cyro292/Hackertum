"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Headphones, FileText } from "lucide-react";
import { newsService } from "@/services/newsService";
import type { Story } from "@/types/news";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Footer from "@/components/ui/footer";

export default function StoryDetail() {
	const router = useRouter();
	const params = useParams();
	const [story, setStory] = useState<Story | null>(null);
	const [loading, setLoading] = useState(true);
	// const [activeTab, setActiveTab] = useState("article");

	useEffect(() => {
		const loadStory = async () => {
			try {
				const storyId = Number(params.id);
				const storyData = await newsService.getStoryById(storyId);
				setStory(storyData);
			} catch (error) {
				console.error("Failed to load story:", error);
			} finally {
				setLoading(false);
			}
		};

		loadStory();
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
					onClick={() => router.back()}
					className="mb-8 hover:scale-105 transition-transform"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>

				<article className="max-w-4xl mx-auto">
					<Badge className="mb-4">{story.category}</Badge>
					<h1 className="text-4xl font-bold mb-6">{story.title}</h1>

					{story.image && (
						<img
							src={story.image}
							alt={story.title}
							className="w-full h-[500px] object-cover rounded-lg mb-8"
						/>
					)}

					<div className="mb-6 text-lg text-gray-600 italic leading-relaxed">
						<p>{story.description}</p>
					</div>

					<div className="flex items-center gap-4 mb-8 text-gray-600">
						<div>
							<p className="text-sm">
								Published on {new Date(story.publishedAt).toLocaleDateString()}
							</p>
							<p className="text-sm">
								{story.author ? `By ${story.author}` : "Anonymous"}
							</p>
						</div>
					</div>

					<Tabs defaultValue="article" className="mb-8">
						<TabsList className="grid w-full grid-cols-2 mb-8">
							<TabsTrigger value="article" className="flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Article
							</TabsTrigger>
							<TabsTrigger value="podcast" className="flex items-center gap-2">
								<Headphones className="h-4 w-4" />
								Podcast
							</TabsTrigger>
						</TabsList>

						<TabsContent value="article" className="space-y-6">
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="prose prose-lg max-w-none">
									<div>
										<div className="space-y-6 text-gray-700">
											<p className="leading-relaxed">{story.content}</p>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="podcast" className="space-y-6">
							<div className="bg-white p-6 rounded-lg shadow-sm">
								{/* Audio Player Section */}
								<div className="flex items-center gap-4 mb-6">
									<Headphones className="h-6 w-6 text-gray-≈" />
									<div>
										<h3 className="font-semibold">Listen to this article</h3>
										<p className="text-sm text-gray-500">
											Available in audio format
										</p>
									</div>
								</div>
								{story.audio && (
									<audio controls className="w-full mb-8">
										<source src={story.audio} type="audio/mpeg" />
										Your browser does not support the audio element.
									</audio>
								)}

								{/* Transcript Section */}
								<div className="border-t pt-6">
									<div className="space-y-6 text-gray-700">
										<p className="leading-relaxed">{story.content}</p>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					<div className="mt-8 pt-8 border-t">
						<h2 className="text-2xl font-bold mb-4">Related Stories</h2>
						{/* Add related stories component here */}
					</div>
				</article>
			</div>
			<Footer />
		</div>
	);
}
