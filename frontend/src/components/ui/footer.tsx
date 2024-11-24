import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function Footer() {
	return (
		<Card className="w-[100%] border-none rounded-none bg-slate-100">
			<div className="container px-12 py-12 mx-auto flex flex-col justify-center">
				<div className="flex flex-row justify-between gap-8">
					<div className="space-y-3">
						<h3 className="font-semibold tracking-tight">About Us</h3>
						<nav className="flex flex-col space-y-2">
							<Link
								href="/about"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Our Story
							</Link>
							<Link
								href="/team"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Team
							</Link>
							<Link
								href="/careers"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Careers
							</Link>
						</nav>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold tracking-tight">Support</h3>
						<nav className="flex flex-col space-y-2">
							<Link
								href="/contact"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Contact
							</Link>
							<Link
								href="/faq"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								FAQ
							</Link>
							<Link
								href="/help"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Help Center
							</Link>
						</nav>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold tracking-tight">Connect</h3>
						<nav className="flex flex-col space-y-2">
							<Link
								href="https://twitter.com"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Twitter
							</Link>
							<Link
								href="https://linkedin.com"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								LinkedIn
							</Link>
							<Link
								href="https://facebook.com"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Facebook
							</Link>
						</nav>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="text-center text-sm text-muted-foreground">
					© {new Date().getFullYear()} X-Slider Company. All rights reserved.
				</div>
			</div>
		</Card>
	);
}

export default Footer;
