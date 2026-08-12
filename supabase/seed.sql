-- Optional: seeds a fresh database with the same placeholder content the
-- site already ships with (src/lib/mock-data/), so the Admin Panel isn't
-- empty on first connect. Run after 0001_init.sql.

insert into research_domains (id, name, slug, description, "order") values
  ('11111111-1111-1111-1111-111111111101', 'Hybrid Physical–Digital Systems', 'hybrid-physical-digital-systems',
   'We combine sensor fusion with real-time behavioral modeling to study how physical environments, human presence, and digital decision layers can operate as one system — then validate that model against live commercial deployments.', 1),
  ('11111111-1111-1111-1111-111111111102', 'Autonomous & Intelligent Platforms', 'autonomous-intelligent-platforms',
   'Our research develops shared decision layers for coordinating autonomous and semi-autonomous units — including aerial and distributed platforms — with an emphasis on failure-mode testing before any system operates in public or urban airspace.', 2),
  ('11111111-1111-1111-1111-111111111103', 'Cyber-Physical Interaction & Decision Systems', 'cyber-physical-interaction-decision-systems',
   'We build and test the interpretation layer that lets intelligent systems read human behavior and environmental signals and turn that reading into a real-time, real-world response.', 3);

insert into projects (id, title, slug, status, research_domain_id, short_description, overview, patent_number, filed_date, granted_date, readiness_stage, featured, visible) values
  ('22222222-2222-2222-2222-222222222201', 'Adaptive interaction system for smart commercial environments', 'adaptive-interaction', 'granted',
   '11111111-1111-1111-1111-111111111101',
   'A platform integrating physical presence and user behavior with real-time digital decision-making, enabling a new layer of interaction between space, technology, and commerce.',
   'This system was developed to close the gap between physical retail environments and digital decision engines. It combines sensor fusion with real-time behavioral modeling to adapt commercial spaces to visitor context, validated across three pilot deployments.',
   'GB2024-0091X', '2024-01-15', '2024-11-01', 3, true, true),
  ('22222222-2222-2222-2222-222222222202', 'Distributed semi-autonomous aerial coordination platform', 'aerial-coordination', 'pending',
   '11111111-1111-1111-1111-111111111102',
   'A coordination system for distributed aerial platforms capable of operating safely and efficiently within complex urban and public environments.',
   'The platform coordinates multiple semi-autonomous aerial units using a shared decision layer, allowing safe operation in constrained urban airspace. Current work focuses on failure-mode validation ahead of full patent grant.',
   null, '2026-03-01', null, 2, false, true),
  ('22222222-2222-2222-2222-222222222203', 'Real-time behavioral interpretation engine for intelligent systems', 'behavioral-engine', 'licensing',
   '11111111-1111-1111-1111-111111111103',
   'A system that interprets human behavior and environmental signals in real time, ready for commercial integration through direct licensing.',
   'A granted, production-validated engine for interpreting behavioral and environmental signals in real time. Already integrated in two pilot deployments and open for licensing by qualified commercial partners.',
   'GB2023-0044P', '2023-06-01', '2024-02-01', 3, false, true);

insert into publications (title, venue, year, abstract, related_project_id) values
  ('Real-time behavioral signal interpretation in cyber-physical environments', 'Journal of Applied Systems Research', 2026,
   'This paper presents a framework for interpreting behavioral and environmental signals in real time within cyber-physical systems, combining sensor fusion with decision models validated across live pilot deployments. We show the proposed interpretation layer reduces response latency while maintaining accuracy under variable environmental conditions.',
   '22222222-2222-2222-2222-222222222203'),
  ('Coordination models for distributed semi-autonomous aerial platforms', 'International Conference on Autonomous Systems', 2025,
   'We introduce a coordination model for distributed semi-autonomous aerial platforms operating in constrained urban airspace. The model uses a shared decision layer to manage multi-unit coordination and failure-mode recovery, with results reported from controlled urban trials ahead of full commercial deployment.',
   '22222222-2222-2222-2222-222222222202'),
  ('Hybrid physical–digital interaction: a framework for commercial environments', 'Techno-Economic Systems Review', 2025,
   'This work proposes a framework for hybrid physical–digital interaction in commercial environments, integrating sensor fusion with real-time behavioral modeling to adapt physical spaces to visitor context. Findings from three pilot deployments show measurable improvements in space utilization and visitor engagement.',
   '22222222-2222-2222-2222-222222222201');

insert into team_members (name, role, bio, "order") values
  ('Dr. A. Karim', 'Founder & Research Director', 'Leads the hybrid physical–digital systems programme and oversees IP strategy across all active projects.', 1),
  ('S. Mensah', 'Head of Autonomous Systems', 'Directs research on distributed and semi-autonomous aerial platforms, with a focus on urban safety validation.', 2),
  ('Dr. R. Lindqvist', 'Head of Cyber-Physical Systems', 'Focuses on real-time behavioral interpretation and decision systems, bridging academic and applied research.', 3),
  ('J. Tanaka', 'IP & Partnerships Lead', 'Manages the patent pipeline and serves as the primary point of contact for licensing and investment inquiries.', 4);

insert into news_posts (title, slug, tag, excerpt, body, date, published) values
  ('Patent granted for adaptive interaction system', 'patent-granted-adaptive-interaction-system', 'IP MILESTONE',
   'Our hybrid physical–digital systems project has received full patent protection following successful pilot validation.',
   'Our hybrid physical–digital systems project has received full patent protection following successful pilot validation.',
   '2024-11-01', true),
  ('New aerial coordination platform enters testing', 'aerial-coordination-platform-enters-testing', 'RESEARCH',
   'The distributed aerial platform has moved into its next validation phase ahead of patent filing.',
   'The distributed aerial platform has moved into its next validation phase ahead of patent filing.',
   '2026-03-01', true),
  ('Paper accepted at Autonomous Systems conference', 'paper-accepted-autonomous-systems-conference', 'PUBLICATION',
   'Our coordination model research has been accepted for presentation at this year''s international conference.',
   'Our coordination model research has been accepted for presentation at this year''s international conference.',
   '2025-06-01', true),
  ('New collaboration with a research laboratory', 'new-collaboration-with-research-laboratory', 'PARTNERSHIP',
   'We''ve begun a joint validation programme with an academic partner in cyber-physical decision systems.',
   'We''ve begun a joint validation programme with an academic partner in cyber-physical decision systems.',
   '2025-09-01', true);

insert into testimonials (quote, attribution_name, attribution_role) values
  ('The validation process was rigorous — by the time we reviewed the licensing terms, the technical due diligence was already done for us.', 'Industrial Partner', 'Pilot Deployment'),
  ('Depth X''s documentation of IP status made our investment committee review straightforward — every project''s stage was clear from day one.', 'Early-Stage Investor', ''),
  ('A rare combination of academic rigor and commercial readiness in the same research team.', 'Research Laboratory Partner', '');

insert into faq_items (question, answer, category, "order") values
  ('What does "Available for Licensing" mean exactly?', 'The technology has either a granted patent or a fully validated system, and Depth X is open to negotiating commercial licensing terms with qualified companies or investors.', 'licensing', 1),
  ('Do you require an NDA before sharing technical details?', 'Yes — full technical documentation is shared only after a mutual NDA is signed, following an initial inquiry and fit assessment.', 'licensing', 2),
  ('Can licenses be exclusive?', 'Exclusivity is negotiable and depends on the project, market, and proposed terms. This is discussed during the term sheet stage.', 'licensing', 3),
  ('What stage should a project be at before you''ll discuss investment?', 'We''re open to conversations at any project stage — from experimental validation through to granted patents — but documentation and terms differ by stage.', 'general', 4);

insert into partnership_types (name, description) values
  ('Joint Research', 'Co-develop new research questions and share experimental infrastructure with our lab.'),
  ('Experimental Validation', 'Provide real-world environments or data to help validate a system under development.'),
  ('Technology Licensing', 'License a granted patent or validated system for commercial deployment.');

update site_settings set
  hero_headline = 'Deep-tech innovation,',
  hero_headline_accent = 'protected and ready to license.',
  hero_subtext = 'Depth X converts rigorous research into patented systems — with a live portfolio currently open for licensing and investment.',
  stats = '[
    {"label": "Patents Filed", "value": "07"},
    {"label": "Patents Granted", "value": "03"},
    {"label": "Open for Licensing", "value": "02"},
    {"label": "Research Domains", "value": "03"}
  ]'::jsonb,
  trust_bar_logos = '[
    {"name": "Univ. Research Lab"},
    {"name": "Innovation Agency"},
    {"name": "Industrial Partner Co."},
    {"name": "Applied Systems Institute"}
  ]'::jsonb,
  footer_text = 'Bridging science and real-world systems through deep innovation — from theoretical research to verified, deployable technologies.',
  contact_email_investor = 'invest@depthx.co.uk',
  contact_email_researcher = 'research@depthx.co.uk',
  contact_email_company = 'partnerships@depthx.co.uk',
  section_visibility = (
    select jsonb_object_agg(key, true) from jsonb_array_elements_text('[
      "home.trustBar","home.flagshipProject","home.featuredProjects","home.whatWeDo","home.contactToggle",
      "investors.testimonials","investors.faq","investors.portfolioTable",
      "projects.filters","collaboration.partnerLogos","global.newsInNav","global.teamInNav"
    ]'::jsonb) as key
  )
where id = 1;
