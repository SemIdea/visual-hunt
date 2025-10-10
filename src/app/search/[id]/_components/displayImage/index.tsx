import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ISearchEntity } from "@/server/entities/search/DTO";
import { User } from "next-auth";

const DisplayImage = ({
  user,
  search,
}: {
  user: NonNullable<User>;
  search: ISearchEntity;
}) => {
  const initials = (user.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image!} alt="User" />
          <AvatarFallback>{initials || "JD"}</AvatarFallback>
        </Avatar>
        <span className="text-lg font-medium text-foreground">
          Your Search Results
        </span>
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
            <div className="relative w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="max-w-full max-h-[70vh] w-auto h-auto"
                src={search.source}
                alt="Source image"
              />
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayImage;