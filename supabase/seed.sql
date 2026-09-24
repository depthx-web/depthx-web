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

insert into projects (
  id, title, slug, status, research_domain_id, short_description, overview,
  research_collaboration, engineering_collaboration,
  patent_number, filed_date, granted_date, development_stage, ip_status,
  commercial_status, next_milestone, readiness_stage, featured, visible
) values
  ('22222222-2222-2222-2222-222222222201', 'Adaptive interaction system for smart commercial environments', 'adaptive-interaction', 'pending',
   '11111111-1111-1111-1111-111111111101',
   'A research-led platform concept for integrating physical presence and digital decision-making inside commercial environments.',
  'This system is the second technology in the pipeline. It will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation; the two technologies are not planned for simultaneous launch.',
   null, null,
   null, '2024-01-15', null, 'research_concept', 'patent_pending',
   'not_offered', 'Planned After UAV Validation', 2, true, true),
  ('22222222-2222-2222-2222-222222222202', 'Distributed semi-autonomous aerial coordination platform', 'aerial-coordination', 'pending',
   '11111111-1111-1111-1111-111111111102',
   'A coordination concept for distributed aerial platforms capable of operating safely and efficiently within complex urban and public environments.',
  'This is the first commercialization priority: a patent-pending autonomous multi-UAV platform at the pre-prototype stage, with the engineering build as the next milestone. emQopter has confirmed its capability to engineer and build the complete four-UAV physical prototype. Its role is that of an external engineering collaborator.',
   null, 'emQopter has confirmed its capability to engineer and build the complete four-UAV physical prototype. Its role is that of an external engineering collaborator.',
   null, '2026-03-01', null, 'system_architecture', 'patent_pending',
   'commercialization_planning', 'Engineering Build Next', 2, false, true),
  ('22222222-2222-2222-2222-222222222203', 'Real-time behavioral interpretation engine for intelligent systems', 'behavioral-engine', 'pending',
   '11111111-1111-1111-1111-111111111103',
   'A research concept focused on interpreting behavioral and environmental signals in real time within cyber-physical systems.',
   'This concept explores how intelligent systems can interpret behavioral and environmental signals in real time while preserving a clear distinction between research development, patent filing, and any future commercialization pathway.',
   null, null,
   null, '2023-06-01', null, 'research_concept', 'not_filed',
   'not_offered', 'Research Definition', 2, false, true);

insert into publications (title, venue, year, abstract, related_project_id) values
  ('Real-time behavioral signal interpretation in cyber-physical environments', 'Journal of Applied Systems Research', 2026,
   'This paper presents a framework for interpreting behavioral and environmental signals in real time within cyber-physical systems, combining sensor fusion with decision models validated under controlled operating conditions. We show the proposed interpretation layer reduces response latency while maintaining accuracy under variable environmental conditions.',
   '22222222-2222-2222-2222-222222222203'),
  ('Coordination models for distributed semi-autonomous aerial platforms', 'International Conference on Autonomous Systems', 2025,
   'We introduce a coordination model for distributed semi-autonomous aerial platforms operating in constrained urban airspace. The model uses a shared decision layer to manage multi-unit coordination and failure-mode recovery, with results reported from controlled urban trials during the systems-architecture and validation phase.',
   '22222222-2222-2222-2222-222222222202'),
  ('Hybrid physical–digital interaction: a framework for commercial environments', 'Techno-Economic Systems Review', 2025,
   'This work proposes a framework for hybrid physical–digital interaction in commercial environments, integrating sensor fusion with real-time behavioral modeling to adapt physical spaces to visitor context. Findings from controlled system studies show measurable improvements in space utilization and visitor engagement.',
   '22222222-2222-2222-2222-222222222201');

insert into team_members (name, role, bio, "order") values
  ('Dr. A. Karim', 'Founder & Research Director', 'Leads the hybrid physical–digital systems programme and oversees IP strategy across all active projects.', 1),
  ('S. Mensah', 'Head of Autonomous Systems', 'Directs research on distributed and semi-autonomous aerial platforms, with a focus on urban safety validation.', 2),
  ('Dr. R. Lindqvist', 'Head of Cyber-Physical Systems', 'Focuses on real-time behavioral interpretation and decision systems, bridging academic and applied research.', 3),
  ('J. Tanaka', 'IP & Partnerships Lead', 'Manages the patent pipeline and serves as the primary point of contact for licensing and investment inquiries.', 4);

insert into news_posts (title, slug, tag, excerpt, body, date, published) values
  ('Why Depth X began', 'why-we-started-depth-x', 'COMPANY',
   'Depth X Ltd began with founder Marwen Ayadi''s marketing background and his development of an autonomous UAV advertising concept.',
   'Depth X Ltd began with founder Marwen Ayadi''s marketing background and his development of an autonomous UAV advertising concept. Designing the system and preparing the patent applications raised broader questions about the relationship between traditional and digital marketing. Those questions led to the theoretical research that shaped Depth X Ltd as an R&D and technology commercialization company.',
   '2026-08-01', true),
  ('Concept update: hybrid physical–digital systems', 'concept-update-hybrid-physical-digital-systems', 'RESEARCH',
   'Our research programme continues to refine system architecture and early-stage concept validation across physical and digital interaction models.',
   'Our research programme continues to refine system architecture and early-stage concept validation across physical and digital interaction models.',
   '2024-11-01', true),
  ('Aerial systems architecture review', 'aerial-systems-architecture-review', 'RESEARCH',
   'The distributed aerial platform programme is advancing through architecture and failure-mode review before any physical prototype or field pilot work.',
   'The distributed aerial platform programme is advancing through architecture and failure-mode review before any physical prototype or field pilot work.',
   '2026-03-01', true),
  ('Systems research note', 'systems-research-note', 'PUBLICATION',
   'Our current research notes continue to document the architecture and concept work behind new cyber-physical and autonomous system models.',
   'Our current research notes continue to document the architecture and concept work behind new cyber-physical and autonomous system models.',
   '2025-06-01', true),
  ('Research collaboration update', 'research-collaboration-update', 'PARTNERSHIP',
   'We continue to explore collaborative research engagement across cyber-physical decision systems and early-stage validation work.',
   'We continue to explore collaborative research engagement across cyber-physical decision systems and early-stage validation work.',
   '2025-09-01', true);

insert into testimonials (quote, attribution_name, attribution_role) values
  ('The technical review process was rigorous and provided a clear view of the research direction and technical challenges.', 'Industrial Partner', 'Research Review'),
  ('Depth X''s documentation of IP status made our investment committee review straightforward — every project''s stage was clear from day one.', 'Early-Stage Investor', ''),
  ('A rare combination of academic rigor and systems thinking in the same research team.', 'Research Laboratory Partner', '');

insert into faq_items (question, answer, category, "order") values
  ('What does "Available for Licensing" mean exactly?', 'The technology may be at a research, architecture, or early validation stage, and Depth X is open to discussing future technology-transfer and commercialization pathways with qualified partners.', 'licensing', 1),
  ('Do you require an NDA before sharing technical details?', 'Yes — full technical documentation is shared only after a mutual NDA is signed, following an initial inquiry and fit assessment.', 'licensing', 2),
  ('Can licenses be exclusive?', 'Exclusivity is negotiable and depends on the project, market, and proposed terms. This is discussed during the term sheet stage.', 'licensing', 3),
  ('What stage should a project be at before you''ll discuss investment?', 'We''re open to conversations at any project stage — from concept and systems architecture through prototype engineering and later commercialization pathways — but documentation and terms differ by stage.', 'general', 4);

insert into partnership_types (name, description) values
  ('Joint Research', 'Co-develop new research questions and share experimental infrastructure with our lab.'),
  ('Experimental Validation', 'Provide real-world environments or data to help validate a system under development.'),
  ('Technology Licensing', 'Discuss future research transfer or commercialization pathways once a technology reaches the appropriate technical and legal milestones.');

update site_settings set
  hero_headline = 'Researching technologies.',
  hero_headline_accent = 'Building protected systems. Preparing them for market.',
  hero_subtext = 'Depth X is an R&D and technology commercialization company. Our first commercialization priority is a patent-pending autonomous multi-UAV platform for adaptive outdoor advertising and anonymous audience measurement. The platform is currently at the pre-prototype stage, with the engineering build as the next milestone.',
  stats = '[
    {"label": "Research domains", "value": "03"},
    {"label": "Current focus", "value": "Concept & architecture"},
    {"label": "Next sequence", "value": "IP → prototype → validation"},
    {"label": "Portfolio stage", "value": "Pre-prototype"}
  ]'::jsonb,
  trust_bar_logos = '[
    {"name": "Univ. Research Lab"},
    {"name": "Innovation Agency"},
    {"name": "Industrial Partner Co."},
    {"name": "Applied Systems Institute"}
  ]'::jsonb,
  footer_text = 'Bridging science and real-world systems through deep innovation — from research concepts to protected systems and future commercialization pathways.',
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
