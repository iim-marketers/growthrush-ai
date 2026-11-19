import type { Metadata } from "next";
import { CreateAccountDialog } from "@/components/admin/create-account-dialog";
import { LeadAccountsTable } from "@/components/admin/lead-accounts-table";
import { PageHeader } from "@/components/app/primitives";
import { requireAdmin } from "@/lib/admin/auth";
import { getLeadAccounts } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage() {
  await requireAdmin();
  const accounts = await getLeadAccounts();

  return (
    <>
      <PageHeader
        eyebrow="Leads"
        title="Lead accounts"
        subtitle="Customer accounts that receive leads. Open one to add and manage its leads."
        action={<CreateAccountDialog />}
      />
      <LeadAccountsTable accounts={accounts} />
    </>
  );
}
