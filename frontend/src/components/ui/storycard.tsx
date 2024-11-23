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
	isFeature?: boolean;
	likes?: Like[];
}

export function StoryCard({
	id,
	category,
	title,
	description,
	image,
	isFeature = false,
	likes = [],
}: StoryCardProps) {
	const router = useRouter();

	const handleNavigate = () => {
		router.push(`/story/${id}`);
	};

	if (isFeature) {
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
							<Badge>{category}</Badge>
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

	return (
		<Card
			className="cursor-pointer hover:scale-[1.02] transition-all duration-200"
			onClick={handleNavigate}
		>
			<CardHeader>
				<Badge className="w-fit">{category}</Badge>
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