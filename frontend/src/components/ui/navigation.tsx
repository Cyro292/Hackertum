import { Button } from "@/components/ui/button";
import { StockTicker } from "@/components/ui/stockticker";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Navigation() {
	return (
		<header className="border-b">
			<StockTicker />
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<h1 className="text-2xl font-bold">EVNews Daily</h1>
				<div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
						<Input
							type="search"
							placeholder="Search EV news..."
							className="w-full pl-10 focus-visible:ring-1"
						/>
					</div>
				</div>
				<nav className="space-x-4">
					<Button variant="ghost">Latest Models</Button>
					<Button variant="ghost">Technology</Button>
					<Button variant="ghost">Reviews</Button>
					<Button variant="ghost">Industry</Button>
					<Button variant="default">Subscribe</Button>
				</nav>
			</div>
		</header>
	);
}
