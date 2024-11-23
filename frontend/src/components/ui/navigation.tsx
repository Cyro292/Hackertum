import { Button } from "@/components/ui/button";
import { StockTicker } from "@/components/ui/stockticker";
import Link from "next/link";
import { SearchBar } from "@/components/ui/searchbar";

export function Navigation() {
	return (
		<header className="border-b">
			<StockTicker />
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<h1 className="text-2xl font-bold">EVNews Daily</h1>
				<div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
					<div className="relative w-full">
						<SearchBar />
					</div>
				</div>
				<nav className="space-x-4">
					<Button variant="ghost">Latest Models</Button>
					<Button variant="ghost">Technology</Button>
					<Button variant="ghost">Reviews</Button>
					<Button variant="ghost">Industry</Button>
					<Link href="/subscribe">
						<Button variant="default">Subscribe</Button>
					</Link>
				</nav>
			</div>
		</header>
	);
}
