import { Button } from "@/components/ui/button";
import { StockTicker } from "@/components/ui/stockticker";
import Link from "next/link";
import { SearchBar } from "@/components/ui/searchbar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
	return (
		<header className="border-b">
			<StockTicker />
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/">
					<h1 className="text-2xl font-bold">X-Sider</h1>
				</Link>
				<div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
					<div className="relative w-full">
						<SearchBar />
					</div>
				</div>
				<nav className="hidden md:flex items-center space-x-4 ml-auto">
					<Link href="/latest">
						<Button variant="ghost">Latest Models</Button>
					</Link>
					<Link href="/technology">
						<Button variant="ghost">Technology</Button>
					</Link>
					<Link href="/reviews">
						<Button variant="ghost">Reviews</Button>
					</Link>
					<Link href="/industry">
						<Button variant="ghost">Industry</Button>
					</Link>
					<Link href="/subscribe">
						<Button variant="default">Subscribe</Button>
					</Link>
				</nav>
				<Sheet>
					<SheetTrigger asChild className="md:hidden ml-auto">
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Navigation</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col space-y-4 mt-4">
							<Link href="/latest">
								<Button variant="ghost" className="w-full justify-start">
									Latest Models
								</Button>
							</Link>
							<Link href="/technology">
								<Button variant="ghost" className="w-full justify-start">
									Technology
								</Button>
							</Link>
							<Link href="/reviews">
								<Button variant="ghost" className="w-full justify-start">
									Reviews
								</Button>
							</Link>
							<Link href="/industry">
								<Button variant="ghost" className="w-full justify-start">
									Industry
								</Button>
							</Link>
							<Link href="/subscribe">
								<Button variant="default" className="w-full">
									Subscribe
								</Button>
							</Link>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
