// app/thank-you/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-4">Thank You for Subscribing!</h1>
				<p className="text-lg">We&apos;ve added your email to our mailing list.</p>

				<Button variant="link" asChild className="mt-4">
					<Link href="/">Return to Homepage</Link>
				</Button>
			</div>
		</div>
	);
}
