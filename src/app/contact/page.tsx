import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero, SectionHead } from "@/components/ui/page-hero";
import { ContactSection } from "@/components/contact/contact-section";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell us who you are and what you're looking for — we'll route your message to the right person.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const visibility = settings.sectionVisibility;
  const showRoleToggle = isSectionVisible(visibility, "contact.roleToggle");
  const showForm = isSectionVisible(visibility, "contact.form");

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <PageHero
        eyebrow="// ENGAGE WITH US"
        title="Get in Touch"
        description="Tell us who you are and what you're looking for — we'll route your message to the right person."
      />
      {(showRoleToggle || showForm) && (
        <section className="px-8 pb-25 md:px-25">
          <div className="mb-14">
            {showForm && (
              <SectionHead eyebrow="// OR SEND A MESSAGE" title="Contact Form" bordered={false} />
            )}
            <ContactSection
              emails={settings.contactEmails}
              showRoleToggle={showRoleToggle}
              showForm={showForm}
            />
          </div>
        </section>
      )}
    </>
  );
}
