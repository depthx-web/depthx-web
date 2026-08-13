import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient, hasServiceRoleConfig } from "@/lib/supabase/admin";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";
import { ManageForm } from "@/app/newsletter/manage/manage-form";
import type { NewsletterInterest } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "Manage Subscription · Depth X" };

export default async function ManageSubscriptionPage(
  props: PageProps<"/newsletter/manage">,
) {
  const searchParams = await props.searchParams;
  const id = typeof searchParams.id === "string" ? searchParams.id : undefined;

  let email: string | null = null;
  let interests: NewsletterInterest[] = [];
  let notFound = false;

  if (id && hasServiceRoleConfig) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("newsletter_subscribers")
      .select("email, interests")
      .eq("id", id)
      .single();
    if (data) {
      email = data.email;
      interests = data.interests;
    } else {
      notFound = true;
    }
  }

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Manage Subscription" }]} />
      <PageHero
        eyebrow="// YOUR PREFERENCES"
        title="Manage your subscription"
        description={
          email
            ? `Choose what you'd like to hear about at ${email}.`
            : "Choose what you'd like to hear about from Depth X."
        }
      />
      <section className="px-8 pb-25 md:px-25">
        <div className="max-w-xl">
          {!id && (
            <p className="text-sm text-muted">
              This link is missing its subscriber reference — use the management link from one of
              our emails, or{" "}
              <Link href="/#newsletter" className="text-blue underline hover:text-text">
                subscribe here
              </Link>
              .
            </p>
          )}
          {id && !hasServiceRoleConfig && (
            <p className="text-sm text-muted">
              Preference management isn&apos;t configured on this site yet. Please contact us
              directly to update your subscription.
            </p>
          )}
          {id && hasServiceRoleConfig && notFound && (
            <p className="text-sm text-muted">
              We couldn&apos;t find a subscription for this link — it may have already been
              unsubscribed.
            </p>
          )}
          {id && hasServiceRoleConfig && !notFound && (
            <ManageForm id={id} currentInterests={interests} />
          )}
        </div>
      </section>
    </>
  );
}
