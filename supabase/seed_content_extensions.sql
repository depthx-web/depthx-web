-- Seeds legal pages + real SEO keywords for existing content (run after 0002_content_extensions.sql).

insert into legal_pages (slug, title, body) values
  ('privacy-policy', 'Privacy Policy', 'Last updated: 12 August 2026

1. Who we are

Depth X Ltd. ("Depth X", "we", "us", "our") is a company registered in England & Wales, company number 16162223, with its registered office at 71-75 Shelton Street, London, Covent Garden, London, England, WC2H 9JQ. This policy explains how we collect, use, and protect personal data when you use depthx.co.uk (the "Site").

2. What data we collect

We collect the minimum data needed to run this Site:

- Contact form submissions: your name, email address, the role you select (investor, researcher, or company), and the content of your message.
- Aggregate usage data: the page you visited and the country your visit came from, used only in aggregate to understand which parts of the Site are useful. We do not use cookies for this, and we do not track individual visitors across sessions or build profiles of you.

3. How we use your data

We use contact form submissions solely to respond to your enquiry and route it to the right team (investment, research collaboration, or commercial licensing). We use aggregate usage data solely to understand overall Site traffic and improve our content. We do not sell personal data, and we do not use it for advertising.

4. Legal basis

We process contact form data on the basis of your consent (you choose to submit the form) and our legitimate interest in responding to business enquiries. We process aggregate usage data on the basis of our legitimate interest in understanding how the Site is used, in a way that does not identify you individually.

5. Data retention

We retain contact form submissions for as long as needed to handle your enquiry and for a reasonable period afterwards for our records, after which they are deleted. Aggregate usage data is retained in aggregate form and is not linked to an identifiable individual.

6. Who we share data with

We use Supabase, Inc. as our data hosting and infrastructure provider, which stores data on our behalf under its own data processing terms. We do not share your personal data with any other third party except where required by law.

7. Your rights

Under UK GDPR, you have the right to request access to, correction of, or deletion of your personal data, to object to or restrict our processing of it, and to request a copy of it in a portable format. To exercise any of these rights, contact us at privacy@depthx.co.uk.

8. Cookies

This Site does not use tracking or advertising cookies. Any cookies used are strictly necessary for the Site''s admin panel to function (e.g. keeping you signed in).

9. Changes to this policy

We may update this policy from time to time. The date at the top of this page shows when it was last revised.

10. Contact

Questions about this policy can be sent to privacy@depthx.co.uk or by post to our registered office above.'),
  ('terms-of-service', 'Terms of Service', 'Last updated: 12 August 2026

1. Acceptance of these terms

By accessing or using depthx.co.uk (the "Site"), you agree to these Terms of Use. If you do not agree, please do not use the Site. The Site is operated by Depth X Ltd., a company registered in England & Wales, company number 16162223, registered office at 71-75 Shelton Street, London, Covent Garden, London, England, WC2H 9JQ.

2. Purpose of the Site

The Site is provided to share information about Depth X''s research, patent portfolio, and licensing opportunities, and to allow investors, researchers, and commercial partners to get in touch. Nothing on the Site constitutes an offer to license any technology, an investment solicitation, or legal or financial advice; any such arrangement would be subject to a separate, signed agreement.

3. Intellectual property

All content on the Site — including research descriptions, patent summaries, text, and design — is the property of Depth X Ltd. or its licensors and is protected by copyright and other intellectual property laws, unless otherwise stated. Patents referenced on the Site are the property of Depth X Ltd. and are protected independently of this Site''s content. You may view and share Site content for personal, non-commercial reference, but may not reproduce, redistribute, or create derivative works from it without our written permission.

4. Interactive demonstrations

Some project pages may include interactive HTML demonstrations ("product simulators") intended to illustrate a technology''s behaviour. These are provided for illustrative purposes only and do not represent a finished commercial product, warranty of functionality, or specification.

5. No warranty

The Site and its content are provided "as is" without warranties of any kind, express or implied, including as to accuracy, completeness, or fitness for a particular purpose. Patent and licensing status shown on the Site is indicative and should be independently verified before you rely on it for a commercial decision.

6. Limitation of liability

To the fullest extent permitted by law, Depth X Ltd. will not be liable for any indirect, incidental, or consequential loss arising from your use of the Site.

7. Governing law

These terms are governed by the laws of England and Wales, and any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.

8. Changes to these terms

We may update these terms from time to time. The date at the top of this page shows when it was last revised. Continued use of the Site after a change constitutes acceptance of the revised terms.

9. Contact

Questions about these terms can be sent to legal@depthx.co.uk or by post to our registered office above.');

update projects set keywords = 'smart retail technology, adaptive commercial environments, sensor fusion, behavioral modeling, patented retail technology, hybrid physical-digital systems' where slug = 'adaptive-interaction';
update projects set keywords = 'autonomous drone coordination, urban airspace management, distributed aerial platforms, multi-drone systems, UAV coordination patent' where slug = 'aerial-coordination';
update projects set keywords = 'behavioral interpretation engine, real-time behavior analysis, licensing technology, environmental signal processing, cyber-physical systems' where slug = 'behavioral-engine';

update research_domains set keywords = 'hybrid physical-digital systems, sensor fusion research, smart commercial environments, behavioral modeling, spatial computing' where slug = 'hybrid-physical-digital-systems';
update research_domains set keywords = 'autonomous systems research, aerial platform coordination, distributed robotics, urban drone safety, intelligent platforms' where slug = 'autonomous-intelligent-platforms';
update research_domains set keywords = 'cyber-physical systems, real-time decision systems, behavioral interpretation, environmental signal processing' where slug = 'cyber-physical-interaction-decision-systems';

update publications set keywords = 'behavioral signal interpretation, cyber-physical systems, real-time sensor fusion, applied systems research' where title = 'Real-time behavioral signal interpretation in cyber-physical environments';
update publications set keywords = 'aerial coordination models, distributed autonomous systems, urban airspace, multi-agent coordination' where title = 'Coordination models for distributed semi-autonomous aerial platforms';
update publications set keywords = 'hybrid physical-digital interaction, commercial environment technology, sensor fusion framework' where title = 'Hybrid physical–digital interaction: a framework for commercial environments';

update team_members set keywords = 'research director, IP strategy, hybrid physical-digital systems expert' where name = 'Dr. A. Karim';
update team_members set keywords = 'autonomous systems lead, aerial platform research, urban safety validation' where name = 'S. Mensah';
update team_members set keywords = 'cyber-physical systems researcher, behavioral interpretation, decision systems' where name = 'Dr. R. Lindqvist';
update team_members set keywords = 'IP and partnerships, patent licensing, investment inquiries' where name = 'J. Tanaka';

update news_posts set keywords = 'patent granted, adaptive interaction system, IP milestone, hybrid physical-digital systems' where slug = 'patent-granted-adaptive-interaction-system';
update news_posts set keywords = 'aerial coordination platform, drone testing, urban airspace validation' where slug = 'aerial-coordination-platform-enters-testing';
update news_posts set keywords = 'autonomous systems conference, published research, coordination models' where slug = 'paper-accepted-autonomous-systems-conference';
update news_posts set keywords = 'research collaboration, cyber-physical decision systems, academic partnership' where slug = 'new-collaboration-with-research-laboratory';

update testimonials set keywords = 'industrial partner testimonial, pilot deployment feedback, technical validation' where attribution_name = 'Industrial Partner';
update testimonials set keywords = 'investor testimonial, IP status documentation, investment due diligence' where attribution_name = 'Early-Stage Investor';
update testimonials set keywords = 'research partner testimonial, academic collaboration, commercial readiness' where attribution_name = 'Research Laboratory Partner';

update faq_items set keywords = 'licensing status, available for licensing, patent licensing terms' where question = 'What does "Available for Licensing" mean exactly?';
update faq_items set keywords = 'NDA process, technical documentation, licensing due diligence' where question = 'Do you require an NDA before sharing technical details?';
update faq_items set keywords = 'exclusive licensing, license terms, term sheet negotiation' where question = 'Can licenses be exclusive?';
update faq_items set keywords = 'investment stage, early-stage investment, patent portfolio investment' where question = 'What stage should a project be at before you''ll discuss investment?';

update partnership_types set keywords = 'joint research partnership, shared experimental infrastructure, academic collaboration' where name = 'Joint Research';
update partnership_types set keywords = 'experimental validation partnership, real-world testing, pilot deployment' where name = 'Experimental Validation';
update partnership_types set keywords = 'technology licensing partnership, patent licensing, commercial deployment' where name = 'Technology Licensing';
