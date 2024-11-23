import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Like } from "@/types/news";

interface AvatarGroupProps {
  likes?: (Like | string)[] | null;
}

const colors = [
  "bg-red-100 text-red-700 hover:bg-red-200",
  "bg-blue-100 text-blue-700 hover:bg-blue-200",
  "bg-green-100 text-green-700 hover:bg-green-200",
  "bg-purple-100 text-purple-700 hover:bg-purple-200",
  "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
];

const getDisplayName = (like: Like | string): string => {
  if (!like) return 'Unknown';
  if (typeof like === 'string') return `User ${like.slice(0, 4)}`;
  return like.name || `User ${like.id.slice(0, 4)}`;
};

const getInitial = (like: Like | string): string => {
  if (!like) return '?';
  if (typeof like === 'string') return '#';
  if (like.name) return like.name.charAt(0).toUpperCase();
  return '#';
};

export function AvatarGroup({ likes = [] }: AvatarGroupProps) {
  if (!likes || likes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {likes.map((like, index) => {
        if (!like) return null;
        const likeObj = typeof like === 'string' ? { id: like } : like;
        
        return (
          <Badge 
            key={likeObj.id} 
            variant="secondary"
            className={`
              flex items-center gap-1.5 
              px-2 py-0.5 
              rounded-full 
              transition-colors 
              cursor-pointer
              ${colors[index % colors.length]}
            `}
          >
            <Avatar className="h-4 w-4">
              <AvatarImage 
                src={typeof like !== 'string' ? like.image : undefined} 
                alt={getDisplayName(like)} 
              />
              <AvatarFallback className="text-xs">
                {getInitial(like)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">
              {getDisplayName(like)}
            </span>
          </Badge>
        );
      })}
    </div>
  );
}
