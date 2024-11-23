// components/ui/search-bar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Story } from "@/types/news";
import { newsService } from "@/services/newsService";

export function SearchBar() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Story[]>([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = async (searchQuery: string) => {
		setQuery(searchQuery);
		if (searchQuery.length < 2) {
			setResults([]);
			setIsOpen(false);
			return;
		}

		setLoading(true);
		try {
			const searchResults = await newsService.searchStories(searchQuery);
			setResults(searchResults);
			setIsOpen(true);
		} catch (error) {
			console.error("Search error:", error);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleSelectStory = (story: Story) => {
		setIsOpen(false);
		setQuery("");
		router.push(`/story/${story.id}`);
	};

	return (
		<div className="relative w-full" ref={searchRef}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
				<Input
					type="search"
					value={query}
					onChange={(e) => handleSearch(e.target.value)}
					placeholder="Search EV news..."
					className="w-full pl-10 focus-visible:ring-1"
				/>
			</div>

			{isOpen && results.length > 0 && (
				<div className="absolute mt-2 w-full bg-white rounded-md shadow-lg max-h-96 overflow-auto z-50">
					{results.map((story) => (
						<button
							key={story.id}
							onClick={() => handleSelectStory(story)}
							className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-start space-x-3"
						>
							{story.image && (
								<img
									src={story.image}
									alt={story.title}
									className="w-12 h-12 object-cover rounded"
								/>
							)}
							<div>
								<p className="font-medium">{story.title}</p>
								<p className="text-sm text-gray-500">{story.description}</p>
							</div>
						</button>
					))}
				</div>
			)}

			{loading && (
				<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
					<div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
				</div>
			)}
		</div>
	);
}
