import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold">EVNews Daily</h1>
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