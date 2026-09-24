-- Align the live CMS with the verified Depth X company, IP, and
-- commercialization story used across the website and investor deck.

update site_settings
set hero_headline = 'Research. Develop. Protect.',
    hero_headline_accent = 'Prepare for commercialization.',
    hero_subtext = 'Depth X develops research-driven technologies, protects them through intellectual property, and validates them before commercialization through specialized operating companies. The autonomous aerial marketing platform is the first commercialization priority.',
    stats = '[{"label":"Patent Applications Filed","value":"02"},{"label":"Technologies in Development","value":"02"},{"label":"Active Prototype Priority","value":"01"},{"label":"Research Domains","value":"04"}]'::jsonb,
    footer_text = 'Depth X is a founder-led research, technology development, and IP commercialization company.'
where id = 1;

insert into research_domains (name, slug, description, "order", visible)
values (
  'Hybrid Marketing Science',
  'hybrid-marketing-science',
  'We connect physical marketing with measurement, analytics, and adaptive decision-making to develop campaigns that can learn from real-world interaction.',
  4,
  true
)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    "order" = excluded."order",
    visible = true;

insert into projects (
  title, slug, status, research_domain_id, short_description, overview,
  patent_number, patent_number_kind, readiness_stage, development_stage,
  ip_status, commercial_status, next_milestone, featured, visible
)
values (
  'Autonomous Aerial Marketing Platform',
  'autonomous-aerial-advertising-system',
  'pending',
  (select id from research_domains where slug = 'hybrid-marketing-science'),
  'A patent-pending multi-UAV platform for persistent aerial advertising, anonymous audience measurement, and adaptive campaign execution.',
  'The autonomous multi-UAV platform is Depth X Ltd''s first commercialization priority. It is currently at the pre-prototype stage, with the engineering build as the next milestone. emQopter has confirmed its capability to engineer and build the complete four-UAV physical prototype. Its role is that of an external engineering collaborator.',
  null,
  'application',
  2,
  'system_architecture',
  'patent_pending',
  'commercialization_planning',
  'Engineering Build Next',
  true,
  true
), (
  'AI-Powered Smart Vending System for Virtual Clothing Try-On',
  'smart-vending-virtual-clothing-try-on',
  'pending',
  (select id from research_domains where slug = 'hybrid-marketing-science'),
  'A smart retail concept combining automated vending with AI-enabled virtual clothing try-on and an adaptive customer experience.',
  'The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.',
  null,
  'application',
  2,
  'research_concept',
  'patent_pending',
  'not_offered',
  'Planned After UAV Validation',
  false,
  true
)
on conflict (slug) do update
set title = excluded.title,
    status = excluded.status,
    research_domain_id = excluded.research_domain_id,
    short_description = excluded.short_description,
    overview = excluded.overview,
    patent_number = excluded.patent_number,
    patent_number_kind = excluded.patent_number_kind,
    granted_date = null,
    readiness_stage = excluded.readiness_stage,
    development_stage = excluded.development_stage,
    ip_status = excluded.ip_status,
    commercial_status = excluded.commercial_status,
    next_milestone = excluded.next_milestone,
    featured = excluded.featured,
    visible = true;

update projects
set visible = false,
    featured = false
where slug in ('adaptive-interaction', 'aerial-coordination', 'behavioral-engine');

update testimonials set visible = false;

update team_members set visible = false;
insert into team_members (name, role, bio, "order", visible)
values (
  'Marwen Ayadi',
  'Founder',
  'Leads Depth X research, patent strategy, product direction, system concepts, customer discovery, and commercialization planning.',
  1,
  true
);

update faq_items set visible = false;
insert into faq_items (question, answer, category, "order", visible)
values
  (
    'Who currently owns the patent applications?',
    'Both applications are currently filed in founder Marwen Ayadi''s name. Following formal grant, the patents are intended to be assigned to Depth X.',
    'licensing', 1, true
  ),
  (
    'Do you require an NDA before sharing technical details?',
    'Yes — full technical documentation is shared only after a mutual NDA is signed, following an initial inquiry and fit assessment.',
    'licensing', 2, true
  ),
  (
    'How will the technologies reach the market?',
    'Depth X plans to validate each technology first and then license it to a specialized operating company. The UAV platform is the first commercialization priority.',
    'licensing', 3, true
  ),
  (
    'What is the current stage of the UAV platform?',
    'The platform is currently pre-prototype. The next milestones are prototype construction with emQopter, technical validation, and a controlled exhibition pilot.',
    'general', 4, true
  );

update partnership_types set visible = false;
insert into partnership_types (name, description, visible)
values
  ('Research Collaboration', 'Explore research questions, experimental methods, and evidence needed to advance a technology concept.', true),
  ('Prototype & Validation', 'Contribute specialist engineering, testing environments, or data for a defined prototype and validation scope.', true),
  ('Commercial Operation', 'Operate a validated technology under a future license while Depth X retains ownership of the assigned intellectual property.', true);
