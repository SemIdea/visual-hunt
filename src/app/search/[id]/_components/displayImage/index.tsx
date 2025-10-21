"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ISearchEntity } from "@/server/entities/search/DTO";
import { useSession } from "next-auth/react";

const DisplayImage = ({ search }: { search: ISearchEntity }) => {
  const { data } = useSession();

  const user = data?.user;

  return (
    <div className="lg:sticky">
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.image || undefined} alt="User" />
          <Skeleton className="h-10 w-10 rounded-full" />
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
