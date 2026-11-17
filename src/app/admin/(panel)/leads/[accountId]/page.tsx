import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AccountLeadsBoard } from "@/components/admin/account-leads-board";
import { AddLeadDialog } from "@/components/admin/add-lead-dialog";
import { PageHeader } from "@/components/app/primitives";
import { requireAdmin } from "@/lib/admin/auth";
import { formatAdminDate } from "@/lib/admin/leads";
import { getAccountLeads, getLeadAccount } from "@/lib/admin/queries";

export async function generateMetadata({
  params,
}: PageProps<"/admin/leads/[accountId]">): Promise<Metadata> {
  const account = await getLeadAccount((await params).accountId);
  return { title: account ? account.name || account.email : "Account" };
}

export default async function AdminAccountLeadsPage({
  params,
}: PageProps<"/admin/leads/[accountId]">) {
  await requireAdmin();
  const account = await getLeadAccount((await params).accountId);
  if (!account) notFound();

  const leads = await getAccountLeads(account.id);
  const details = [
    account.name ? account.email : null,
    account.phone || null,
    `Created ${formatAdminDate(account.createdAt.toISOString())}`,
    // `${leads.length} ${leads.length === 1 ? "lead" : "leads"}`,r4
  ].filter(Boolean);

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-subtle hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All accounts
      </Link>
      <PageHeader
        eyebrow="Lead account"
        title={account.name || account.email}
        subtitle={details.join(" · ")}
        action={<AddLeadDialog accountId={account.id} />}
      />
      <AccountLeadsBoard accountId={account.id} leads={leads} />
    </>
  );
}
