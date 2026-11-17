import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function AccountNotFound() {
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-11 rounded-xl">
          <UserX className="size-5" />
        </EmptyMedia>
        <EmptyTitle className="font-display text-base font-bold text-ink">
          Account not found
        </EmptyTitle>
        <EmptyDescription>
          This lead account doesn&apos;t exist or has been deleted.
        </EmptyDescription>
      </EmptyHeader>
      <Button asChild variant="outline">
        <Link href="/admin/leads">
          <ArrowLeft data-icon="inline-start" />
          All accounts
        </Link>
      </Button>
    </Empty>
  );
}
