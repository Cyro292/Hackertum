"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/userService";
import { Mail, Check } from "lucide-react";

export default function SubscribePage() {
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		await userService.subscribeEmail(email);
		router.push("/thank-you");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto text-center mb-12">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
						Stay Updated with EV News
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Join our community of EV enthusiasts and get the latest news,
						updates, and insights delivered to your inbox.
					</p>
				</div>

				<div className="items-center max-w-5xl mx-auto">
					<div className="space-y-6 p-8 bg-white rounded-2xl shadow-xl">
						<form onSubmit={handleSubscribe} className="space-y-4">
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<Input
									type="email"
									placeholder="Enter your email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="pl-10 h-12 text-lg"
								/>
							</div>
							<Button
								type="submit"
								className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:opacity-90 transition-opacity"
							>
								Subscribe Now
							</Button>
						</form>
						<div className="pt-6 border-t">
							<p className="text-sm text-gray-500 mb-4">
								Join 10,000+ subscribers who trust our newsletter
							</p>
							<div className="grid grid-cols-2 gap-4">
								{[
									"Free Weekly Updates",
									"Exclusive Content",
									"Industry Insights",
									"Early Access",
								].map((feature) => (
									<div key={feature} className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-green-500" />
										<span className="text-sm text-gray-600">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-16 text-center">
					<p className="text-sm text-gray-500">
						By subscribing, you agree to our Privacy Policy and Terms of Service
					</p>
				</div>
			</div>
		</div>
	);
}
