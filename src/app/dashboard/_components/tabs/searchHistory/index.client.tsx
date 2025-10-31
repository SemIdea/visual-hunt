"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ISearchEntity } from "@/server/entities/search/DTO";
import { Trash } from "lucide-react";
import { trpc } from "../../../../_trpc/client";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "PENDING":
      return "secondary";
    case "FAILED":
      return "destructive";
    default:
      return "outline";
  }
};

const SearchHistory = ({ searches }: { searches: ISearchEntity[] }) => {
  const [searchList, setSearchList] = useState<ISearchEntity[]>(searches);
  const [deleteingId, setDeletingId] = useState<string | null>(null);

  const { mutate: deleteSearchMutation } = trpc.search.deleteSearch.useMutation(
    {
      onSuccess: () => {
        setSearchList((prev) => prev.filter((s) => s.id !== deleteingId));
      },
    }
  );

  const deleteSearch = (id: string) => {
    setDeletingId(id);
    deleteSearchMutation({ id });
  };

  if (searchList.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">
          No search history found.
        </TableCell>
      </TableRow>
    );
  }

  return searchList.map((search) => (
    <TableRow key={search.id}>
      <TableCell>
        <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={search.source || "/placeholder.svg"}
            alt="Search preview"
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">Image</TableCell>
      <TableCell>
        <Badge
          variant={getStatusVariant(search.status)}
          className="dark:text-white"
        >
          {search.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(search.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end items-center gap-3">
          <Link href={`/search/${search.id}`} prefetch={false}>
            <Button
              variant="outline"
              size="sm"
              disabled={search.status !== "COMPLETED"}
            >
              View Results
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="cursor-pointer"
            disabled={deleteingId === search.id}
            onClick={() => deleteSearch(search.id)}
          >
            {deleteingId === search.id ? <Spinner /> : <Trash size={16} />}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ));
};

export { SearchHistory };
