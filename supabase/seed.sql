-- Optional canonical content for a fresh local database. Run after all
-- migrations. This mirrors the verified public website fixtures.

insert into research_domains (id, name, slug, description, "order", visible) values
  ('11111111-1111-1111-1111-111111111101', 'Hybrid Physical–Digital Systems', 'hybrid-physical-digital-systems',
   'We study how physical environments, human presence, sensing, and digital decision layers can operate as one system, then test those relationships through future prototypes and pilots.', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Autonomous & Intelligent Platforms', 'autonomous-intelligent-platforms',
   'Our research develops shared decision layers for coordinating autonomous and semi-autonomous units, including aerial and distributed platforms, with an emphasis on failure-mode testing.', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'Cyber-Physical Interaction & Decision Systems', 'cyber-physical-interaction-decision-systems',
   'We study the interpretation layer that lets intelligent systems read human behavior and environmental signals and turn that reading into a real-world response.', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'Hybrid Marketing Science', 'hybrid-marketing-science',
   'We connect physical marketing with measurement, analytics, and adaptive decision-making to develop campaigns that can learn from real-world interaction.', 4, true)
on conflict (slug) do nothing;

insert into projects (
  id, title, slug, status, research_domain_id, short_description, overview,
  patent_number, patent_number_kind, readiness_stage, featured, visible
) values
  (
    '22222222-2222-2222-2222-222222222201',
    'Autonomous Aerial Marketing Platform',
    'autonomous-aerial-advertising-system',
    'pending',
    '11111111-1111-1111-1111-111111111104',
    'A patent-pending multi-UAV platform for persistent aerial advertising, anonymous audience measurement, and adaptive campaign execution.',
    'Depth X is developing the system as its first commercialization priority. The project is currently pre-prototype, with the four-UAV MVP architecture and roadmap defined. emQopter GmbH is the external technical collaborator prepared to build the complete prototype. The related German and international patent applications are currently filed in founder Marwen Ayadi''s name and are intended to be assigned to Depth X after formal grant.',
    null, 'application', 2, true, true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'AI-Powered Smart Vending System for Virtual Clothing Try-On',
    'smart-vending-virtual-clothing-try-on',
    'pending',
    '11111111-1111-1111-1111-111111111104',
    'A smart retail concept combining automated vending with AI-enabled virtual clothing try-on and an adaptive customer experience.',
    'This technology is the second commercialization project in the Depth X pipeline. Development and launch will follow the UAV platform so resources remain focused on one market entry at a time. The related application is currently filed in founder Marwen Ayadi''s name and is intended to be assigned to Depth X after formal grant, before licensing to a specialized operating company.',
    'DE 10 2025 004 854.8', 'application', 2, false, true
  )
on conflict (slug) do nothing;

insert into team_members (name, role, bio, "order", visible) values
  ('Marwen Ayadi', 'Founder', 'Leads Depth X research, patent strategy, product direction, system concepts, customer discovery, and commercialization planning.', 1, true);

insert into faq_items (question, answer, category, "order", visible) values
  ('Who currently owns the patent applications?', 'Both applications are currently filed in founder Marwen Ayadi''s name. Following formal grant, the patents are intended to be assigned to Depth X.', 'licensing', 1, true),
  ('Do you require an NDA before sharing technical details?', 'Yes — full technical documentation is shared only after a mutual NDA is signed, following an initial inquiry and fit assessment.', 'licensing', 2, true),
  ('How will the technologies reach the market?', 'Depth X plans to validate each technology first and then license it to a specialized operating company. The UAV platform is the first commercialization priority.', 'licensing', 3, true),
  ('What is the current stage of the UAV platform?', 'The platform is currently pre-prototype. The next milestones are prototype construction with emQopter, technical validation, and a controlled exhibition pilot.', 'general', 4, true);

insert into partnership_types (name, description, visible) values
  ('Research Collaboration', 'Explore research questions, experimental methods, and evidence needed to advance a technology concept.', true),
  ('Prototype & Validation', 'Contribute specialist engineering, testing environments, or data for a defined prototype and validation scope.', true),
  ('Commercial Operation', 'Operate a validated technology under a future license while Depth X retains ownership of the assigned intellectual property.', true);

update site_settings set
  hero_headline = 'Research. Develop. Protect.',
  hero_headline_accent = 'Prepare for commercialization.',
  hero_subtext = 'Depth X develops research-driven technologies, protects them through intellectual property, and validates them before commercialization through specialized operating companies. The autonomous aerial marketing platform is the first commercialization priority.',
  stats = '[{"label":"Patent Applications Filed","value":"02"},{"label":"Technologies in Development","value":"02"},{"label":"Active Prototype Priority","value":"01"},{"label":"Research Domains","value":"04"}]'::jsonb,
  trust_bar_logos = '[]'::jsonb,
  footer_text = 'Depth X is a founder-led research, technology development, and IP commercialization company.',
  contact_email_investor = 'invest@depthx.co.uk',
  contact_email_researcher = 'research@depthx.co.uk',
  contact_email_company = 'partnerships@depthx.co.uk',
  section_visibility = (
    select jsonb_object_agg(key, true) from jsonb_array_elements_text('[
      "home.flagshipProject","home.featuredProjects","home.whatWeDo","home.contactToggle",
      "investors.faq","investors.portfolioTable","projects.filters",
      "global.newsInNav","global.teamInNav"
    ]'::jsonb) as key
  )
where id = 1;
