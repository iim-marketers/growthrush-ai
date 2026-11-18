import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AccountLeadsBoard } from "@/components/admin/account-leads-board";
import { AddLeadDialog } from "@/components/admin/add-lead-dialog";
import { ImportLeadsDialog } from "@/components/admin/import-leads-dialog";
import { PageHeader } from "@/components/app/primitives";
import { requireAdmin } from "@/lib/admin/auth";
import { formatAdminDate } from "@/lib/admin/leads";
import { getAccountLeads, getLeadAccount } from "@/lib/admin/queries";

export async function generateMetadata({
  params,
}: PageProps<"/admin/leads/[accountId]">): Promise<Metadata> {
  const account = await getLeadAccount((await params).accountId);
  return { title: account ? account.name || account.phone : "Account" };
}

export default async function AdminAccountLeadsPage({
  params,
}: PageProps<"/admin/leads/[accountId]">) {
  await requireAdmin();
  const account = await getLeadAccount((await params).accountId);
  if (!account) notFound();

  const leads = await getAccountLeads(account.id);
  const details = [
    account.email,
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
        title={account.name || account.phone}
        subtitle={details.join(" · ")}
        action={
          <div className="flex items-center gap-2">
            <ImportLeadsDialog
              accountId={account.id}
              existingPhones={leads.map((lead) => lead.phone)}
            />
            <AddLeadDialog accountId={account.id} />
          </div>
        }
      />
      <AccountLeadsBoard accountId={account.id} leads={leads} />
    </>
  );
}
