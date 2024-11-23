import { AvatarGroup } from "@/components/ui/avatargroup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Like } from "@/types/news";

interface StoryCardProps {
	id: number;
	category: string;
	title: string;
	description: string;
	image?: string;
	style?: string;
	likes?: Like[];
	tags?: string[];
}

export function StoryCard({
	id,
	category,
	title,
	description,
	image,
	likes = [],
	tags = [],
	style = "featured",
}: StoryCardProps) {
	const router = useRouter();

	const handleNavigate = () => {
		router.push(`/story/${id}`);
	};

	if (style === "featured") {
		return (
			<Card className="mb-12">
				<CardContent className="p-6">
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<img
								src={image || "/ev-featured.jpg"}
								alt={title}
								className="rounded-lg w-full h-[400px] object-cover"
							/>
						</div>
						<div className="space-y-4">
							<div className="flex flex-row gap-10 items-start">
								<Badge>{category}</Badge>
								{tags && tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="px-2 py-0.5 text-xs rounded-full"
											>
												{tag}
											</Badge>
										))}
									</div>
								)}
							</div>
							<h2 className="text-3xl font-bold">{title}</h2>
							<p className="text-muted-foreground">{description}</p>
							<Button onClick={handleNavigate}>Read Full Story</Button>
							{likes.length > 0 && (
								<div className="pt-4">
									<p className="text-sm text-muted-foreground mb-2">Liked by</p>
									<AvatarGroup likes={likes} />
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (style === "compact") {
		return (
			<Card
				className="cursor-pointer hover:scale-[1.02] transition-all duration-200"
				onClick={handleNavigate}
			>
				<CardHeader>
					<div className="flex flex-row gap-10 items-start">
						<Badge className="w-fit">{category}</Badge>
						{tags && tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{tags.map((tag, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="px-2 py-0.5 text-xs rounded-full"
									>
										{tag}
									</Badge>
								))}
							</div>
						)}
					</div>
					<h2 className="text-xl font-bold mt-2">{title}</h2>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">{description}</p>
					{likes.length > 0 && (
						<div className="mt-4">
							<AvatarGroup likes={likes} />
						</div>
					)}
				</CardContent>
			</Card>
		);
	}

	if (style === "picture") {
		return (
			<Card
				className="cursor-pointer hover:scale-[1.02] transition-all duration-200"
				onClick={handleNavigate}
			>
				<div className="flex">
					<div className="w-1/3">
						<img
							src={image || "/ev-featured.jpg"}
							alt={title}
							className="rounded-lg w-full h-full object-cover"
						/>
					</div>
					<div className="w-2/3 p-4">
						<CardHeader>
							<div className="flex flex-row gap-10 items-start">
								<Badge className="w-fit">{category}</Badge>
								{tags && tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="px-2 py-0.5 text-xs rounded-full"
											>
												{tag}
											</Badge>
										))}
									</div>
								)}
							</div>
							<h2 className="text-xl font-bold mt-2">{title}</h2>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{description}</p>
							{likes.length > 0 && (
								<div className="mt-4">
									<AvatarGroup likes={likes} />
								</div>
							)}
						</CardContent>
					</div>
				</div>
			</Card>
		);
	}
}
