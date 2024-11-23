"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/userService";
import { Mail, Zap, Globe, Clock, Shield } from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function SubscribePage() {
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		await userService.subscribeEmail(email);
		router.push("/thank-you");
	};

	const features = [
		{
			icon: Zap,
			title: "Instant Updates",
			description: "Be the first to know about EV breakthroughs",
		},
		{
			icon: Globe,
			title: "Global Coverage",
			description: "News from every major EV market",
		},
		{
			icon: Clock,
			title: "Weekly Digest",
			description: "Curated content delivered to your inbox",
		},
		{
			icon: Shield,
			title: "Premium Access",
			description: "Exclusive industry insights",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
			<div className="container mx-auto px-4 py-16 space-y-16">
				{/* Hero Section */}
				<div>
					<div className="max-w-4xl mx-auto text-center space-y-6">
						<span className="px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-700 rounded-full">
							Join 10,000+ EV enthusiasts
						</span>
						<h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Stay Ahead in the Electric Revolution
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Get exclusive insights, breaking news, and expert analysis on the
							future of electric vehicles.
						</p>
					</div>

					{/* Main Content */}
					<div className="grid lg:grid-rows-2 items-center max-w-6xl mx-auto">
						<div className="space-y-8">
							<div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
								<form onSubmit={handleSubscribe} className="space-y-6">
									<div className="relative group">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-600" />
										<Input
											type="email"
											placeholder="Enter your email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="pl-10 h-12 text-lg border-gray-200 focus:border-gray-400 focus:ring-gray-400 transition-all"
										/>
									</div>
									<Button
										type="submit"
										className="w-full h-12 text-lg bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all duration-300"
									>
										Subscribe Now
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</form>
							</div>
						</div>
						<div className="grid sm:grid-cols-2 gap-6">
							{features.map((feature, index) => (
								<div
									key={index}
									className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
								>
									<feature.icon className="h-8 w-8 text-gray-700 mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Testimonial */}
				<div className="max-w-3xl mx-auto text-center">
					<blockquote className="text-xl text-gray-600 italic">
						&ldquo;The most comprehensive EV newsletter I&apos;ve subscribed to. A
						must-have for anyone interested in the future of transportation.&ldquo;
					</blockquote>
					<cite className="mt-4 block text-gray-700 font-semibold">
						— John Smith, Tesla Monthly
					</cite>
				</div>
			</div>
		</div>
	);
}
