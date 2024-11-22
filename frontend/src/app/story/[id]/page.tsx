"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { newsService } from "@/services/newsService";
import type { Story } from "@/types/news";

export default function StoryDetail() {
	const router = useRouter();
	const params = useParams();
	const [story, setStory] = useState<Story | null>(null);
	const [loading, setLoading] = useState(true);

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

					<div className="prose prose-lg max-w-none">
						<p className="text-lg leading-relaxed text-gray-700">
							{story.content}
						</p>
					</div>

					<div className="mt-8 pt-8 border-t">
						<h2 className="text-2xl font-bold mb-4">Related Stories</h2>
						{/* Add related stories component here */}
					</div>
				</article>
			</div>
		</div>
	);
}
