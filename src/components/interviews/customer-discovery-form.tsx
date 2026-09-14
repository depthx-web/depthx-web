"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";

type Lang = "en" | "de" | "zh";
type FormState = Record<string, string | string[] | boolean>;

const translations = {
  en: {
    title: "Customer Discovery",
    subtitle: "Interview system for exhibitions and audience discovery",
    navNew: "New Interview",
    navDashboard: "Dashboard",
    navInterviews: "Interviews",
    save: "Save Interview",
    next: "Next",
    back: "Back",
    required: "Required",
    select: "Select…",
    thankYou: "Interview saved successfully.",
    step1: "1. Profile",
    step2: "2. Discovery",
    step3: "3. Concept Test",
    step4: "4. Review",
    profile: "Profile",
    company: "Company / Organization (optional)",
    role: "Role / Position (optional for visitors)",
    exhibition: "Exhibition",
    interviewType: "Interviewee type",
    e: "Exhibitor / Brand",
    o: "Exhibition Organizer",
    a: "Advertising / Marketing Agency",
    v: "Visitor / Audience",
    q1: "How do you currently attract visitors or promote your company during exhibitions?",
    q2: "How do you currently measure whether your physical advertising is working?",
    q3: "What audience information would be most useful but difficult to measure today?",
    q4: "If a campaign is not performing well during an event, how easily can you identify that and change it?",
    q5: "How important would better measurement and adaptability of physical advertising be for you?",
    q6: "Which part of the concept would create the most value for you — if any?",
    q7: "What would be your biggest concern about using a system like this?",
    q8: "If the system were successfully built, technically validated and appropriately approved, would you consider exploring a controlled pilot?",
    qV1: "What usually attracts your attention most at an exhibition?",
    conceptDescription: "Depth X is developing an autonomous aerial marketing platform designed to combine mobile advertising with anonymous audience measurement and real-time campaign adaptation.",
    optionalComment: "Optional comment",
    review: "Interviewer Review",
    pain: "Measurement / Need Pain (1–5)",
    interest: "Concept Interest (1–5)",
    pilot: "Pilot / Interaction Potential (1–5)",
    insight: "Most important insight",
    objection: "Biggest objection / concern",
    nextAction: "Next step",
    followUp: "Open to follow-up conversation?",
    contact: "Contact details (optional)",
    consent: "Agreed to be contacted for follow-up / future pilot.",
    statusReady: "Ready",
    statusPending: "Pending",
    statusOffline: "Offline",
    noData: "No interviews saved yet.",
  },
  de: {
    title: "Kundenerkundung",
    subtitle: "Interviewsystem für Ausstellungen und Publikumserfassung",
    navNew: "Neues Interview",
    navDashboard: "Dashboard",
    navInterviews: "Interviews",
    save: "Interview speichern",
    next: "Weiter",
    back: "Zurück",
    required: "Pflicht",
    select: "Auswählen…",
    thankYou: "Interview lokal gespeichert.",
    step1: "1. Profil",
    step2: "2. Bedarfsermittlung",
    step3: "3. Konzepttest",
    step4: "4. Bewertung",
    profile: "Profil",
    company: "Unternehmen / Organisation (optional)",
    role: "Rolle / Position (optional für Besucher)",
    exhibition: "Messe / Veranstaltung",
    interviewType: "Interviewtyp",
    e: "Aussteller / Marke",
    o: "Messeveranstalter",
    a: "Werbe- / Marketingagentur",
    v: "Besucher / Publikum",
    q1: "Wie gewinnen Sie derzeit Besucher oder bewerben Ihr Unternehmen auf Messen?",
    q2: "Wie messen Sie derzeit, ob Ihre physische Werbung funktioniert?",
    q3: "Welche Informationen über das Publikum wären besonders nützlich, aber heute schwer zu messen?",
    q4: "Wenn eine Kampagne nicht gut funktioniert, wie leicht können Sie das erkennen und anpassen?",
    q5: "Wie wichtig wären für Sie bessere Messbarkeit und Anpassungsfähigkeit physischer Werbung?",
    q6: "Welcher Teil des Konzepts würde für Sie den größten Mehrwert schaffen?",
    q7: "Was wäre Ihre größte Sorge bei der Nutzung eines solchen Systems?",
    q8: "Wenn das System technisch validiert und genehmigt wäre, würden Sie einen kontrollierten Pilotversuch prüfen?",
    qV1: "Was zieht Ihre Aufmerksamkeit auf einer Messe normalerweise am meisten auf sich?",
    conceptDescription: "Depth X entwickelt eine autonome Luftmarketing-Plattform, die mobile Werbung mit anonymer Publikumsmessung und Echtzeit-Anpassung von Kampagnen verbinden soll.",
    optionalComment: "Optionaler Kommentar",
    review: "Bewertung durch Interviewer",
    pain: "Messproblem / Bedarf (1–5)",
    interest: "Interesse am Konzept (1–5)",
    pilot: "Pilot- / Interaktionspotenzial (1–5)",
    insight: "Wichtigste Erkenntnis",
    objection: "Größter Einwand / größte Sorge",
    nextAction: "Nächster Schritt",
    followUp: "Offen für Folgegespräch?",
    contact: "Kontaktdaten (optional)",
    consent: "Einverstanden mit Kontaktaufnahme für Follow-up / zukünftigen Pilot.",
    statusReady: "Bereit",
    statusPending: "Ausstehend",
    statusOffline: "Offline",
    noData: "Noch keine Interviews gespeichert.",
  },
  zh: {
    title: "客户探索",
    subtitle: "展会与受众研究访谈系统",
    navNew: "新访谈",
    navDashboard: "仪表板",
    navInterviews: "访谈记录",
    save: "保存访谈",
    next: "下一步",
    back: "上一步",
    required: "必答",
    select: "请选择…",
    thankYou: "访谈已保存到本地。",
    step1: "1. 基本信息",
    step2: "2. 需求探索",
    step3: "3. 概念测试",
    step4: "4. 评估",
    profile: "基本信息",
    company: "公司 / 组织（可选）",
    role: "职位 / 角色（访客可选）",
    exhibition: "展会 / 活动",
    interviewType: "受访者类型",
    e: "参展商 / 品牌",
    o: "展会主办方",
    a: "广告 / 营销代理商",
    v: "访客 / 受众",
    q1: "您目前在展会期间如何吸引访客或推广您的公司？",
    q2: "您目前如何衡量实体广告是否有效？",
    q3: "哪些受众信息对您最有用，但目前最难衡量？",
    q4: "如果活动期间广告效果不佳，您能多容易发现并进行调整？",
    q5: "对您而言，提高实体广告的可衡量性和可调整性有多重要？",
    q6: "这个概念的哪一部分对您最有价值？",
    q7: "使用这类系统时，您最大的顾虑是什么？",
    q8: "如果系统已成功构建并获得批准，您是否愿意考虑受控试点？",
    qV1: "在展会上，通常什么最能吸引您的注意力？",
    conceptDescription: "Depth X 正在开发一个自主空中营销平台，将移动广告与匿名受众测量和实时活动调整结合起来。",
    optionalComment: "可选备注",
    review: "访谈者评估",
    pain: "需求痛点（1–5）",
    interest: "概念兴趣（1–5）",
    pilot: "试点 / 互动潜力（1–5）",
    insight: "最重要的洞察",
    objection: "最大的异议 / 顾虑",
    nextAction: "下一步",
    followUp: "是否愿意接受后续沟通？",
    contact: "联系方式（可选）",
    consent: "同意在后续沟通 / 未来试点中联系我。",
    statusReady: "就绪",
    statusPending: "待处理",
    statusOffline: "离线",
    noData: "尚未保存任何访谈。",
  },
} as const;

const interviewTypes = [
  { value: "E", label: "E — Exhibitor / Brand" },
  { value: "O", label: "O — Exhibition Organizer" },
  { value: "A", label: "A — Advertising / Marketing Agency" },
  { value: "V", label: "V — Visitor / Audience" },
] as const;

const stepLabels = ["Profile", "Discovery", "Concept", "Review"];
const languageOptions: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
];

const answerTranslations: Record<Lang, Record<string, string>> = {
  en: {},
  de: {
    "Booth / stand": "Messestand",
    "Digital screens": "Digitale Bildschirme",
    "Banners / signage": "Banner / Beschilderung",
    "Flyers / printed media": "Flyer / Printmedien",
    "Promotional staff": "Promotion-Personal",
    "QR / digital interaction": "QR / digitale Interaktion",
    "Social media / online promotion": "Social Media / Online-Werbung",
    Other: "Sonstiges",
    "Booth visits": "Standbesuche",
    "QR scans": "QR-Scans",
    "Leads / registrations": "Leads / Registrierungen",
    "Sales / conversions": "Verkäufe / Conversions",
    "Staff observation": "Beobachtung durch Personal",
    "Digital analytics": "Digitale Analysen",
    "Very limited / not measured": "Sehr begrenzt / nicht gemessen",
    Attention: "Aufmerksamkeit",
    Engagement: "Interaktion / Engagement",
    "Traffic / location patterns": "Besucherströme / Standortmuster",
    "Interaction duration": "Interaktionsdauer",
    "Response to different messages": "Reaktion auf unterschiedliche Botschaften",
    "Conversion to booth / action": "Konversion zum Stand / zur Aktion",
    "Nothing important missing": "Keine wichtigen Daten fehlen",
    "Yes, easily": "Ja, problemlos",
    "Yes, but with limitations": "Ja, aber mit Einschränkungen",
    Difficult: "Schwierig",
    "Usually not possible": "Normalerweise nicht möglich",
    "1 — Not important": "1 — Nicht wichtig",
    "4 — Important": "4 — Wichtig",
    "5 — Very important": "5 — Sehr wichtig",
    "Large displays / screens": "Große Displays / Bildschirme",
    "Movement / unusual displays": "Bewegung / ungewöhnliche Displays",
    "Offers / promotions": "Angebote / Werbeaktionen",
    "Interactive experiences": "Interaktive Erlebnisse",
    "People / demonstrations": "Menschen / Vorführungen",
    "Mobile / aerial advertising": "Mobile / luftgestützte Werbung",
    "Audience measurement": "Publikumsmessung",
    "Real-time analytics": "Echtzeitanalysen",
    "Campaign adaptation": "Kampagnenanpassung",
    "Continuous operation": "Dauerbetrieb",
    "Multiple media formats": "Mehrere Medienformate",
    "I do not currently see significant value": "Derzeit sehe ich keinen wesentlichen Wert",
    Safety: "Sicherheit",
    Regulation: "Regulierung",
    Noise: "Lärm",
    Privacy: "Datenschutz",
    Cost: "Kosten",
    "Technical reliability": "Technische Zuverlässigkeit",
    Weather: "Wetter",
    "Audience acceptance": "Akzeptanz beim Publikum",
    "No major concern": "Keine großen Bedenken",
    "1 — Definitely not": "1 — Definitiv nicht",
    "2 — Probably not": "2 — Wahrscheinlich nicht",
    "3 — Maybe": "3 — Vielleicht",
    "4 — Yes": "4 — Ja",
    "5 — Strong interest": "5 — Starkes Interesse",
    "Follow up": "Nachfassen",
    "Potential pilot": "Potenzieller Pilot",
    "Introduction to another person": "Vorstellung bei einer anderen Person",
    "Useful insight only": "Nur nützliche Erkenntnis",
    "No action": "Keine Aktion",
    Yes: "Ja",
    Maybe: "Vielleicht",
    No: "Nein",
  },
  zh: {
    "Booth / stand": "展位 / 展台",
    "Digital screens": "数字屏幕",
    "Banners / signage": "横幅 / 标牌",
    "Flyers / printed media": "传单 / 印刷媒体",
    "Promotional staff": "推广人员",
    "QR / digital interaction": "二维码 / 数字互动",
    "Social media / online promotion": "社交媒体 / 在线推广",
    Other: "其他",
    "Booth visits": "展位访问量",
    "QR scans": "二维码扫描",
    "Leads / registrations": "潜在客户 / 注册",
    "Sales / conversions": "销售 / 转化",
    "Staff observation": "工作人员观察",
    "Digital analytics": "数字分析",
    "Very limited / not measured": "非常有限 / 未测量",
    Attention: "注意力",
    Engagement: "互动参与",
    "Traffic / location patterns": "人流 / 位置模式",
    "Interaction duration": "互动时长",
    "Response to different messages": "对不同信息的反应",
    "Conversion to booth / action": "转化到展位 / 行动",
    "Nothing important missing": "没有重要信息缺失",
    "Yes, easily": "是的，很容易",
    "Yes, but with limitations": "是的，但有限制",
    Difficult: "困难",
    "Usually not possible": "通常不可能",
    "1 — Not important": "1 — 不重要",
    "4 — Important": "4 — 重要",
    "5 — Very important": "5 — 非常重要",
    "Large displays / screens": "大型展示 / 屏幕",
    "Movement / unusual displays": "动态 / 非常规展示",
    "Offers / promotions": "优惠 / 促销",
    "Interactive experiences": "互动体验",
    "People / demonstrations": "人员 / 演示",
    "Mobile / aerial advertising": "移动 / 空中广告",
    "Audience measurement": "受众测量",
    "Real-time analytics": "实时分析",
    "Campaign adaptation": "活动调整",
    "Continuous operation": "持续运行",
    "Multiple media formats": "多种媒体形式",
    "I do not currently see significant value": "目前看不到明显价值",
    Safety: "安全",
    Regulation: "法规",
    Noise: "噪音",
    Privacy: "隐私",
    Cost: "成本",
    "Technical reliability": "技术可靠性",
    Weather: "天气",
    "Audience acceptance": "受众接受度",
    "No major concern": "没有重大顾虑",
    "1 — Definitely not": "1 — 肯定不会",
    "2 — Probably not": "2 — 可能不会",
    "3 — Maybe": "3 — 也许",
    "4 — Yes": "4 — 是",
    "5 — Strong interest": "5 — 非常感兴趣",
    "Follow up": "后续跟进",
    "Potential pilot": "潜在试点",
    "Introduction to another person": "介绍给其他联系人",
    "Useful insight only": "仅作为有用洞察",
    "No action": "无需行动",
    Yes: "是",
    Maybe: "也许",
    No: "否",
  },
};

type InterviewType = "E" | "O" | "A" | "V";
type QuestionKind = "text" | "scale" | "radio" | "yesNo" | "choices";
type QuestionSpec = {
  key: string;
  prompt: string;
  kind: QuestionKind;
  options?: { value: string; label: string }[];
  reasonKey?: string;
  commentKey?: string;
};

const categoryQuestions: Record<Lang, Record<InterviewType, QuestionSpec[]>> = {
  en: {
    E: [
      { key: "e1_attraction", prompt: "How do you currently attract visitors' attention to your booth or campaign?", kind: "text" },
      { key: "e2_measurement", prompt: "How do you currently measure the performance of your advertising or visitor engagement?", kind: "text" },
      { key: "e3_missing_engagement_data", prompt: "What information about audience engagement would you like to know but cannot currently measure?", kind: "text" },
      { key: "e4_campaign_adaptation", prompt: "Can you adapt your campaign during an exhibition based on audience response? How?", kind: "text" },
      { key: "e5_data_importance", prompt: "How important is better audience engagement data to you?", kind: "scale" },
      { key: "e6_solution_value", prompt: "Which part of the solution would be most valuable to you?", kind: "text" },
      { key: "e7_barrier", prompt: "What is your biggest concern or barrier to using such a system?", kind: "text" },
      { key: "e8_pilot_interest", prompt: "If the system were built, validated and received the necessary approvals, how interested would you be in testing it in a campaign or exhibition?", kind: "scale", reasonKey: "e8_pilot_reason" },
      { key: "e9_use_case", prompt: "Could you imagine using this system at your booth or in one of your campaigns?", kind: "yesNo" },
      { key: "e10_willingness_to_pay", prompt: "If the system demonstrated improved engagement and useful analytics, would that provide enough value for you to pay for the service?", kind: "yesNo" },
      { key: "e11_pilot_contact", prompt: "May we contact you later regarding a potential pilot?", kind: "yesNo" },
    ],
    O: [
      { key: "o1_exhibitor_visibility", prompt: "How do you currently help exhibitors increase visibility and attract visitors?", kind: "text" },
      { key: "o2_exhibitor_data", prompt: "What data do you currently provide exhibitors to measure audience engagement?", kind: "text" },
      { key: "o3_missing_insights", prompt: "What data or insights do you think are currently missing?", kind: "text" },
      { key: "o4_event_adaptation", prompt: "To what extent can activities or campaigns at the event be adapted based on visitor behavior?", kind: "text" },
      { key: "o5_measurement_importance", prompt: "How important is providing exhibitors with better audience engagement measurement?", kind: "scale" },
      { key: "o6_solution_value", prompt: "Which part of the solution would be most valuable for exhibitions or events?", kind: "text" },
      { key: "o7_uav_concern", prompt: "What would be your biggest concern about operating UAVs inside or around an event venue?", kind: "text" },
      { key: "o8_pilot_interest", prompt: "If the system were built, validated and received the necessary approvals, how interested would you be in hosting a pilot?", kind: "scale", reasonKey: "o8_pilot_reason" },
      { key: "o9_pilot_location", prompt: "Where inside or around the event do you think such a pilot would be most useful?", kind: "text" },
      { key: "o10_pilot_requirement", prompt: "What is the most important requirement that would need to be met before allowing a pilot at your event?", kind: "text" },
      { key: "o11_pilot_contact", prompt: "May we contact you later to discuss a possible pilot?", kind: "yesNo" },
    ],
    A: [
      { key: "a1_physical_offerings", prompt: "What types of physical advertising or campaigns do you currently offer your clients?", kind: "text" },
      { key: "a2_campaign_measurement", prompt: "How do you currently measure the performance of these campaigns?", kind: "text" },
      { key: "a3_client_data_requests", prompt: "What data do clients ask for that is difficult to provide for physical advertising?", kind: "text" },
      { key: "a4_campaign_adaptation", prompt: "To what extent can you adapt campaigns while they are running based on audience response?", kind: "text" },
      { key: "a5_measurement_importance", prompt: "How important is making physical advertising more measurable and adaptable?", kind: "scale" },
      { key: "a6_solution_value", prompt: "Which part of the solution would be most valuable to your agency or clients?", kind: "text" },
      { key: "a7_service_barrier", prompt: "What is the biggest concern or barrier that could prevent your agency from offering this service?", kind: "text" },
      { key: "a8_pilot_interest", prompt: "If the system were built, validated and received the necessary approvals, how interested would you be in testing it with one of your clients?", kind: "scale", reasonKey: "a8_pilot_reason" },
      { key: "a9_service_offering", prompt: "Could you imagine offering Depth X as part of your services to clients?", kind: "yesNo" },
      { key: "a10_proof_required", prompt: "What would we need to prove technically or commercially before you would be willing to offer this to a client?", kind: "text" },
      { key: "a11_pilot_contact", prompt: "May we contact you later regarding a pilot or possible partnership?", kind: "yesNo" },
    ],
    V: [
      { key: "v1_attention", prompt: "What usually attracts your attention at exhibitions?", kind: "choices", options: [{ value: "Screens", label: "Screens" }, { value: "Moving displays", label: "Moving displays" }, { value: "Lighting", label: "Lighting" }, { value: "Sound", label: "Sound" }, { value: "People", label: "People" }, { value: "Other", label: "Other" }] },
      { key: "v2_moving_aerial_attention", prompt: "If you saw a moving aerial advertising display compared with a fixed banner or screen, which would attract your attention more?", kind: "text" },
      { key: "v3_uav_discomfort", prompt: "What might make you uncomfortable about a UAV-based display?", kind: "choices", options: [{ value: "Safety", label: "Safety" }, { value: "Noise", label: "Noise" }, { value: "Privacy", label: "Privacy" }, { value: "UAVs flying close to people", label: "UAVs flying close to people" }, { value: "No major concern", label: "No major concern" }, { value: "Other", label: "Other" }] },
      { key: "v4_anonymous_measurement", prompt: "Would you be comfortable if the system measured audience engagement anonymously and in aggregate, without identifying individuals?", kind: "yesNo" },
      { key: "v5_interaction", prompt: "If the display caught your attention, would you be willing to interact with it, for example by scanning a QR code?", kind: "yesNo" },
      { key: "v6_like", prompt: "What do you like most about the idea?", kind: "text" },
      { key: "v7_concern", prompt: "What is your biggest concern about the idea?", kind: "text" },
    ],
  },
  de: {
    E: [
      { key: "e1_attraction", prompt: "Wie gewinnen Sie derzeit die Aufmerksamkeit von Besuchern für Ihren Messestand oder Ihre Kampagne?", kind: "text" },
      { key: "e2_measurement", prompt: "Wie messen Sie derzeit die Leistung Ihrer Werbung oder die Interaktion der Besucher?", kind: "text" },
      { key: "e3_missing_engagement_data", prompt: "Welche Informationen über die Interaktion des Publikums würden Sie gerne kennen, können diese derzeit aber nicht messen?", kind: "text" },
      { key: "e4_campaign_adaptation", prompt: "Können Sie Ihre Kampagne während einer Messe anhand der Reaktion des Publikums anpassen? Wie?", kind: "text" },
      { key: "e5_data_importance", prompt: "Wie wichtig sind bessere Daten über die Interaktion des Publikums für Sie?", kind: "scale" },
      { key: "e6_solution_value", prompt: "Welcher Teil der Lösung wäre für Sie am wertvollsten?", kind: "text" },
      { key: "e7_barrier", prompt: "Was wäre Ihre größte Sorge oder Hürde bei der Nutzung eines solchen Systems?", kind: "text" },
      { key: "e8_pilot_interest", prompt: "Wenn das System entwickelt, validiert und entsprechend genehmigt wäre, wie interessiert wären Sie daran, es in einer Kampagne oder Messe zu testen?", kind: "scale", reasonKey: "e8_pilot_reason" },
      { key: "e9_use_case", prompt: "Könnten Sie sich vorstellen, dieses System an Ihrem Messestand oder in einer Ihrer Kampagnen einzusetzen?", kind: "yesNo" },
      { key: "e10_willingness_to_pay", prompt: "Wenn das System nachweislich mehr Interaktion und nützliche Analysen liefert, wäre dieser Mehrwert ausreichend, um für den Service zu bezahlen?", kind: "yesNo" },
      { key: "e11_pilot_contact", prompt: "Dürfen wir Sie später bezüglich eines möglichen Pilotprojekts kontaktieren?", kind: "yesNo" },
    ],
    O: [
      { key: "o1_exhibitor_visibility", prompt: "Wie unterstützen Sie Aussteller derzeit dabei, ihre Sichtbarkeit zu erhöhen und Besucher anzuziehen?", kind: "text" },
      { key: "o2_exhibitor_data", prompt: "Welche Daten stellen Sie Ausstellern derzeit zur Verfügung, um die Interaktion des Publikums zu messen?", kind: "text" },
      { key: "o3_missing_insights", prompt: "Welche Daten oder Erkenntnisse fehlen Ihrer Meinung nach derzeit?", kind: "text" },
      { key: "o4_event_adaptation", prompt: "In welchem Umfang können Aktivitäten oder Kampagnen auf der Veranstaltung anhand des Besucherverhaltens angepasst werden?", kind: "text" },
      { key: "o5_measurement_importance", prompt: "Wie wichtig ist es, Ausstellern bessere Möglichkeiten zur Messung der Publikumsinteraktion anzubieten?", kind: "scale" },
      { key: "o6_solution_value", prompt: "Welcher Teil der Lösung wäre für Messen oder Veranstaltungen am wertvollsten?", kind: "text" },
      { key: "o7_uav_concern", prompt: "Was wäre Ihre größte Sorge beim Betrieb von UAVs innerhalb oder im Umfeld eines Veranstaltungsortes?", kind: "text" },
      { key: "o8_pilot_interest", prompt: "Wenn das System entwickelt, validiert und entsprechend genehmigt wäre, wie interessiert wären Sie daran, ein Pilotprojekt zu ermöglichen?", kind: "scale", reasonKey: "o8_pilot_reason" },
      { key: "o9_pilot_location", prompt: "Wo innerhalb oder im Umfeld der Veranstaltung wäre ein solches Pilotprojekt Ihrer Meinung nach am sinnvollsten?", kind: "text" },
      { key: "o10_pilot_requirement", prompt: "Welche wichtigste Voraussetzung müsste erfüllt sein, bevor Sie ein Pilotprojekt auf Ihrer Veranstaltung zulassen würden?", kind: "text" },
      { key: "o11_pilot_contact", prompt: "Dürfen wir Sie später kontaktieren, um ein mögliches Pilotprojekt zu besprechen?", kind: "yesNo" },
    ],
    A: [
      { key: "a1_physical_offerings", prompt: "Welche Arten von physischer Werbung oder Kampagnen bieten Sie Ihren Kunden derzeit an?", kind: "text" },
      { key: "a2_campaign_measurement", prompt: "Wie messen Sie derzeit die Leistung dieser Kampagnen?", kind: "text" },
      { key: "a3_client_data_requests", prompt: "Welche Daten verlangen Kunden, die bei physischer Werbung nur schwer bereitgestellt werden können?", kind: "text" },
      { key: "a4_campaign_adaptation", prompt: "In welchem Umfang können Sie laufende Kampagnen anhand der Reaktion des Publikums anpassen?", kind: "text" },
      { key: "a5_measurement_importance", prompt: "Wie wichtig ist es, physische Werbung messbarer und anpassungsfähiger zu machen?", kind: "scale" },
      { key: "a6_solution_value", prompt: "Welcher Teil der Lösung wäre für Ihre Agentur oder Ihre Kunden am wertvollsten?", kind: "text" },
      { key: "a7_service_barrier", prompt: "Was wäre die größte Sorge oder Hürde, die Ihre Agentur davon abhalten könnte, diesen Service anzubieten?", kind: "text" },
      { key: "a8_pilot_interest", prompt: "Wenn das System entwickelt, validiert und entsprechend genehmigt wäre, wie interessiert wären Sie daran, es mit einem Ihrer Kunden zu testen?", kind: "scale", reasonKey: "a8_pilot_reason" },
      { key: "a9_service_offering", prompt: "Könnten Sie sich vorstellen, Depth X als Teil Ihres Leistungsangebots für Kunden anzubieten?", kind: "yesNo" },
      { key: "a10_proof_required", prompt: "Was müssten wir technisch oder kommerziell nachweisen, bevor Sie bereit wären, dies einem Kunden anzubieten?", kind: "text" },
      { key: "a11_pilot_contact", prompt: "Dürfen wir Sie später bezüglich eines Pilotprojekts oder einer möglichen Partnerschaft kontaktieren?", kind: "yesNo" },
    ],
    V: [
      { key: "v1_attention", prompt: "Was zieht auf Messen normalerweise Ihre Aufmerksamkeit auf sich?", kind: "choices", options: [{ value: "Screens", label: "Bildschirme" }, { value: "Moving displays", label: "Bewegte Präsentationen" }, { value: "Lighting", label: "Beleuchtung" }, { value: "Sound", label: "Ton" }, { value: "People", label: "Personen" }, { value: "Other", label: "Sonstiges" }] },
      { key: "v2_moving_aerial_attention", prompt: "Wenn Sie eine bewegte Werbedarstellung in der Luft mit einem festen Banner oder Bildschirm vergleichen, welche würde Ihre Aufmerksamkeit stärker auf sich ziehen?", kind: "text" },
      { key: "v3_uav_discomfort", prompt: "Was könnte Ihnen bei einer UAV-basierten Präsentation unangenehm sein?", kind: "choices", options: [{ value: "Safety", label: "Sicherheit" }, { value: "Noise", label: "Lärm" }, { value: "Privacy", label: "Datenschutz" }, { value: "UAVs flying close to people", label: "UAVs, die nahe an Menschen fliegen" }, { value: "No major concern", label: "Keine großen Bedenken" }, { value: "Other", label: "Sonstiges" }] },
      { key: "v4_anonymous_measurement", prompt: "Wären Sie damit einverstanden, wenn das System die Publikumsinteraktion anonym und aggregiert misst, ohne einzelne Personen zu identifizieren?", kind: "yesNo" },
      { key: "v5_interaction", prompt: "Wenn die Präsentation Ihre Aufmerksamkeit weckt, wären Sie bereit, damit zu interagieren, zum Beispiel durch das Scannen eines QR-Codes?", kind: "yesNo" },
      { key: "v6_like", prompt: "Was gefällt Ihnen an der Idee am besten?", kind: "text" },
      { key: "v7_concern", prompt: "Was ist Ihre größte Sorge bezüglich der Idee?", kind: "text" },
    ],
  },
  zh: {
    E: [
      { key: "e1_attraction", prompt: "您目前如何吸引参观者关注您的展位或营销活动？", kind: "text" },
      { key: "e2_measurement", prompt: "您目前如何衡量广告效果或访客互动？", kind: "text" },
      { key: "e3_missing_engagement_data", prompt: "关于受众互动，您希望了解哪些目前无法衡量的信息？", kind: "text" },
      { key: "e4_campaign_adaptation", prompt: "您能否在展会期间根据观众反应调整营销活动？如果可以，是如何调整的？", kind: "text" },
      { key: "e5_data_importance", prompt: "更好的受众互动数据对您有多重要？", kind: "scale" },
      { key: "e6_solution_value", prompt: "该解决方案的哪一部分对您最有价值？", kind: "text" },
      { key: "e7_barrier", prompt: "使用这种系统时，您最大的顾虑或障碍是什么？", kind: "text" },
      { key: "e8_pilot_interest", prompt: "如果该系统完成开发、验证并获得必要许可，您有多大兴趣在营销活动或展会中进行测试？", kind: "scale", reasonKey: "e8_pilot_reason" },
      { key: "e9_use_case", prompt: "您能想象在展位或某次营销活动中使用该系统吗？", kind: "yesNo" },
      { key: "e10_willingness_to_pay", prompt: "如果该系统能够证明提升互动并提供有价值的数据分析，您是否认为其价值足以值得付费？", kind: "yesNo" },
      { key: "e11_pilot_contact", prompt: "我们以后可以就潜在的试点项目与您联系吗？", kind: "yesNo" },
    ],
    O: [
      { key: "o1_exhibitor_visibility", prompt: "您目前如何帮助参展商提高曝光度并吸引访客？", kind: "text" },
      { key: "o2_exhibitor_data", prompt: "您目前向参展商提供哪些数据来衡量受众互动？", kind: "text" },
      { key: "o3_missing_insights", prompt: "您认为目前还缺少哪些数据或洞察？", kind: "text" },
      { key: "o4_event_adaptation", prompt: "活动或营销内容在多大程度上可以根据访客行为进行调整？", kind: "text" },
      { key: "o5_measurement_importance", prompt: "为参展商提供更好的受众互动衡量方式有多重要？", kind: "scale" },
      { key: "o6_solution_value", prompt: "该解决方案的哪一部分对展会或活动最有价值？", kind: "text" },
      { key: "o7_uav_concern", prompt: "在活动场地内或周边运行无人机系统时，您最大的顾虑是什么？", kind: "text" },
      { key: "o8_pilot_interest", prompt: "如果该系统完成开发、验证并获得必要许可，您有多大兴趣承办试点项目？", kind: "scale", reasonKey: "o8_pilot_reason" },
      { key: "o9_pilot_location", prompt: "您认为在活动场地内或周边哪个位置最适合进行这种试点？", kind: "text" },
      { key: "o10_pilot_requirement", prompt: "在允许此类试点进入您的活动之前，最重要的前提条件是什么？", kind: "text" },
      { key: "o11_pilot_contact", prompt: "我们以后可以联系您讨论潜在的试点项目吗？", kind: "yesNo" },
    ],
    A: [
      { key: "a1_physical_offerings", prompt: "您目前为客户提供哪些类型的线下广告或实体营销活动？", kind: "text" },
      { key: "a2_campaign_measurement", prompt: "您目前如何衡量这些营销活动的效果？", kind: "text" },
      { key: "a3_client_data_requests", prompt: "客户通常希望获得哪些在线下广告中难以提供的数据？", kind: "text" },
      { key: "a4_campaign_adaptation", prompt: "在营销活动进行过程中，您在多大程度上能够根据受众反应进行调整？", kind: "text" },
      { key: "a5_measurement_importance", prompt: "让线下广告变得更可衡量、更具适应性有多重要？", kind: "scale" },
      { key: "a6_solution_value", prompt: "该解决方案的哪一部分对您的代理机构或客户最有价值？", kind: "text" },
      { key: "a7_service_barrier", prompt: "哪个最大顾虑或障碍可能阻止您的代理机构提供此服务？", kind: "text" },
      { key: "a8_pilot_interest", prompt: "如果该系统完成开发、验证并获得必要许可，您有多大兴趣与某个客户一起测试？", kind: "scale", reasonKey: "a8_pilot_reason" },
      { key: "a9_service_offering", prompt: "您能想象将 Depth X 作为面向客户的服务之一吗？", kind: "yesNo" },
      { key: "a10_proof_required", prompt: "在您愿意向客户提供这一方案之前，我们需要在技术或商业方面证明什么？", kind: "text" },
      { key: "a11_pilot_contact", prompt: "我们以后可以就试点项目或潜在合作与您联系吗？", kind: "yesNo" },
    ],
    V: [
      { key: "v1_attention", prompt: "在展会上，什么通常最能吸引您的注意？", kind: "choices", options: [{ value: "Screens", label: "屏幕" }, { value: "Moving displays", label: "动态展示" }, { value: "Lighting", label: "灯光" }, { value: "Sound", label: "声音" }, { value: "People", label: "人员" }, { value: "Other", label: "其他" }] },
      { key: "v2_moving_aerial_attention", prompt: "如果将移动的空中广告展示与固定横幅或屏幕相比，哪一种更能吸引您的注意？", kind: "text" },
      { key: "v3_uav_discomfort", prompt: "对基于无人机的展示，哪些因素可能让您感到不适？", kind: "choices", options: [{ value: "Safety", label: "安全" }, { value: "Noise", label: "噪音" }, { value: "Privacy", label: "隐私" }, { value: "UAVs flying close to people", label: "无人机靠近人群飞行" }, { value: "No major concern", label: "没有重大顾虑" }, { value: "Other", label: "其他" }] },
      { key: "v4_anonymous_measurement", prompt: "如果系统仅以匿名和汇总方式衡量受众互动，不识别个人身份，您是否会感到舒适？", kind: "yesNo" },
      { key: "v5_interaction", prompt: "如果该展示吸引了您的注意，您是否愿意进行互动，例如扫描二维码？", kind: "yesNo" },
      { key: "v6_like", prompt: "您最喜欢这个想法的哪一点？", kind: "text" },
      { key: "v7_concern", prompt: "您对这个想法最大的顾虑是什么？", kind: "text" },
    ],
  },
};

const categoryAnswerDefaults = Object.fromEntries(
  categoryQuestions.en.E.concat(categoryQuestions.en.O, categoryQuestions.en.A, categoryQuestions.en.V).flatMap((question) => [
    [question.key, question.kind === "choices" ? [] : ""],
    ...(question.reasonKey ? [[question.reasonKey, ""]] : []),
  ]),
) as FormState;

const categoryOptionValues: Record<string, string[]> = {
  e1_attraction: ["digital_screens", "printed_banners", "product_demonstrations", "promotional_staff", "giveaways", "interactive_experiences", "lighting_effects", "social_media_promotion", "live_presentations", "other"],
  e2_measurement: ["foot_traffic", "leads_collected", "qr_scans", "website_visits", "social_media_engagement", "surveys", "sales_conversions", "staff_observations", "event_organizer_reports", "not_measured", "other"],
  e3_missing_engagement_data: ["noticed_campaign_count", "attention_duration", "audience_engagement_level", "visitor_movement", "effective_content", "time_of_day_performance", "post_engagement_conversion", "campaign_variation_comparison", "anonymous_demographic_trends", "other"],
  e4_campaign_adaptation: ["real_time", "delayed", "minor_changes_only", "no", "not_sure"],
  e6_solution_value: ["mobile_aerial_advertising", "audience_attention_measurement", "real_time_analytics", "adaptive_campaign_content", "multi_uav_operation", "near_continuous_operation", "qr_interactive_engagement", "campaign_reporting", "other"],
  e7_barrier: ["safety", "regulation_approvals", "noise", "privacy", "cost", "technical_reliability", "audience_acceptance", "weather", "indoor_operation_constraints", "other", "no_major_concern"],
  e9_use_case: ["definitely_yes", "probably_yes", "maybe", "probably_not", "definitely_not"],
  e10_willingness_to_pay: ["definitely_yes", "probably_yes", "maybe_depends_on_price", "probably_not", "definitely_not"],
  o1_exhibitor_visibility: ["event_app", "digital_signage", "printed_signage", "sponsorship_placements", "stage_presentations", "networking_activities", "event_marketing", "booth_placement", "interactive_installations", "other"],
  o2_exhibitor_data: ["visitor_counts", "booth_traffic", "app_interactions", "qr_scans", "lead_data", "session_attendance", "survey_results", "event_statistics", "no_engagement_data", "other"],
  o3_missing_insights: ["real_time_visitor_movement", "individual_campaign_attention", "engagement_duration", "effective_locations", "effective_content", "traffic_patterns", "real_time_campaign_performance", "anonymous_audience_behavior", "other"],
  o4_event_adaptation: ["highly_adaptable_realtime", "some_adjustments", "limited_adjustments", "fixed_after_start", "not_sure"],
  o6_solution_value: ["new_advertising_format", "exhibitor_analytics", "sponsorship_inventory", "visitor_engagement", "real_time_event_analytics", "adaptive_advertising", "new_revenue_opportunity", "other"],
  o7_uav_concern: ["safety", "aviation_regulatory_approval", "venue_approval", "noise", "privacy", "insurance_liability", "visitor_acceptance", "emergency_procedures", "technical_reliability", "indoor_flight_restrictions", "other"],
  o9_pilot_location: ["entrance_area", "outdoor_exhibition_area", "hall_transition_areas", "large_open_indoor_area", "sponsor_zone", "networking_area", "demonstration_zone", "other"],
  o10_pilot_requirement: ["safety_certification", "regulatory_approval", "insurance", "low_noise", "clear_emergency_procedures", "privacy_safeguards", "proven_technical_reliability", "defined_operating_area", "successful_prior_testing", "other"],
  a1_physical_offerings: ["outdoor_advertising", "dooh", "event_advertising", "exhibition_campaigns", "experiential_marketing", "promotional_activations", "printed_advertising", "mobile_advertising", "interactive_installations", "sponsorship_campaigns", "other"],
  a2_campaign_measurement: ["foot_traffic", "leads", "qr_scans", "website_traffic", "social_media_engagement", "surveys", "sales_conversions", "brand_awareness_studies", "third_party_analytics", "client_feedback", "limited_measurement", "other"],
  a3_client_data_requests: ["attention", "engagement_duration", "real_time_performance", "audience_movement", "attribution", "interaction_rate", "content_comparison", "location_performance", "anonymous_audience_behavior", "other"],
  a4_campaign_adaptation: ["real_time_adaptation", "same_day_changes", "longer_changes", "very_limited_adaptability", "mostly_fixed"],
  a6_solution_value: ["new_advertising_format", "audience_analytics", "real_time_measurement", "adaptive_campaigns", "multi_uav_operation", "near_continuous_operation", "interactive_engagement", "client_reporting", "other"],
  a7_service_barrier: ["regulation", "safety", "cost", "client_acceptance", "privacy", "noise", "technical_reliability", "scalability", "weather", "campaign_integration", "other", "no_major_concern"],
  a9_service_offering: ["definitely_yes", "probably_yes", "maybe", "probably_not", "definitely_not"],
  a10_proof_required: ["safety", "regulatory_compliance", "technical_reliability", "audience_engagement", "measurable_roi", "client_demand", "pricing_viability", "scalability", "privacy_safeguards", "successful_pilot_results", "other"],
  v1_attention: ["screens", "moving_displays", "lighting", "sound", "people_presenters", "product_demonstrations", "interactive_experiences", "unusual_technology", "giveaways", "other"],
  v2_moving_aerial_attention: ["moving_aerial_display", "fixed_banner", "digital_screen", "no_difference", "not_sure"],
  v3_uav_discomfort: ["safety", "noise", "privacy", "flying_close_to_people", "uav_size", "unexpected_movement", "cameras_sensors", "crowded_environment", "no_major_concern", "other"],
  v4_anonymous_measurement: ["completely_comfortable", "mostly_comfortable", "neutral", "somewhat_uncomfortable", "very_uncomfortable"],
  v5_interaction: ["definitely_yes", "probably_yes", "maybe", "probably_not", "definitely_not"],
  v6_like: ["innovative", "attracts_attention", "interactive", "visually_interesting", "more_dynamic", "useful_information", "no_major_benefit", "other"],
  v7_concern: ["safety", "noise", "privacy", "reliability", "too_distracting", "too_intrusive", "flying_near_people", "no_major_concern", "other"],
};

const categoryOptionTranslations: Record<Lang, Record<string, string>> = {
  en: {},
  de: {
    digital_screens: "Digitale Bildschirme", printed_banners: "Gedruckte Banner / Beschilderung", product_demonstrations: "Produktvorführungen", promotional_staff: "Promotion-Personal", giveaways: "Giveaways", interactive_experiences: "Interaktive Erlebnisse", lighting_effects: "Licht- / visuelle Effekte", social_media_promotion: "Social-Media-Werbung", live_presentations: "Live-Präsentationen", other: "Sonstiges", foot_traffic: "Besucheraufkommen", leads_collected: "Gesammelte Leads", qr_scans: "QR-Scans", website_visits: "Website-Besuche", social_media_engagement: "Social-Media-Interaktion", surveys: "Umfragen", sales_conversions: "Verkäufe / Conversions", staff_observations: "Beobachtungen des Personals", event_organizer_reports: "Berichte des Veranstalters", not_measured: "Wir messen es nicht", noticed_campaign_count: "Anzahl der Personen, die die Kampagne bemerkt haben", attention_duration: "Aufmerksamkeitsdauer", audience_engagement_level: "Grad der Publikumsinteraktion", visitor_movement: "Besucherbewegungen / Besucherströme", effective_content: "Wirksamster Inhalt", time_of_day_performance: "Leistung nach Tageszeit", post_engagement_conversion: "Conversion nach Interaktion", campaign_variation_comparison: "Vergleich von Kampagnenvarianten", anonymous_demographic_trends: "Anonyme demografische Trends", real_time: "Ja, in Echtzeit", delayed: "Ja, aber nur mit Verzögerung", minor_changes_only: "Nur geringfügige Änderungen", no: "Nein", not_sure: "Nicht sicher", mobile_aerial_advertising: "Mobile Luftwerbung", audience_attention_measurement: "Messung der Publikumsaufmerksamkeit", real_time_analytics: "Echtzeitanalysen", adaptive_campaign_content: "Anpassbarer Kampagneninhalt", multi_uav_operation: "Betrieb mehrerer UAVs", near_continuous_operation: "Nahezu kontinuierlicher Betrieb", qr_interactive_engagement: "QR- / interaktive Interaktion", campaign_reporting: "Kampagnenberichte", safety: "Sicherheit", regulation_approvals: "Regulierung / Genehmigungen", noise: "Lärm", privacy: "Datenschutz", cost: "Kosten", technical_reliability: "Technische Zuverlässigkeit", audience_acceptance: "Akzeptanz beim Publikum", weather: "Wetter", indoor_operation_constraints: "Einschränkungen im Innenbereich", no_major_concern: "Keine großen Bedenken", definitely_yes: "Definitiv ja", probably_yes: "Wahrscheinlich ja", maybe: "Vielleicht", probably_not: "Wahrscheinlich nicht", definitely_not: "Definitiv nicht", event_app: "Veranstaltungs-App", digital_signage: "Digitale Beschilderung", printed_signage: "Gedruckte Beschilderung", sponsorship_placements: "Sponsoring-Platzierungen", stage_presentations: "Bühnen- / Präsentationsmöglichkeiten", networking_activities: "Networking-Aktivitäten", event_marketing: "Veranstaltungsmarketing", booth_placement: "Standplatzierung", interactive_installations: "Interaktive Installationen", visitor_counts: "Besucherzahlen", booth_traffic: "Standbesuche", app_interactions: "App-Interaktionen", lead_data: "Lead-Daten", session_attendance: "Teilnahme an Sitzungen", survey_results: "Umfrageergebnisse", event_statistics: "Veranstaltungsstatistiken", no_engagement_data: "Keine spezifischen Interaktionsdaten", real_time_visitor_movement: "Besucherbewegungen in Echtzeit", individual_campaign_attention: "Aufmerksamkeit für einzelne Kampagnen", engagement_duration: "Dauer der Interaktion", effective_locations: "Wirksamste Standorte", traffic_patterns: "Besucherströme", real_time_campaign_performance: "Kampagnenleistung in Echtzeit", highly_adaptable_realtime: "In Echtzeit hochgradig anpassbar", some_adjustments: "Einige Anpassungen möglich", limited_adjustments: "Nur begrenzte Anpassungen", fixed_after_start: "Nach Veranstaltungsbeginn meist festgelegt", new_advertising_format: "Neues Werbeformat", exhibitor_analytics: "Analysen für Aussteller", sponsorship_inventory: "Zusätzliche Sponsoring-Flächen", visitor_engagement: "Publikumsinteraktion", real_time_event_analytics: "Echtzeit-Eventanalysen", adaptive_advertising: "Anpassbare Werbung", new_revenue_opportunity: "Neue Umsatzmöglichkeit", aviation_regulatory_approval: "Luftfahrt- / behördliche Genehmigung", venue_approval: "Genehmigung des Veranstaltungsortes", insurance_liability: "Versicherung / Haftung", emergency_procedures: "Notfallverfahren", indoor_flight_restrictions: "Einschränkungen für Innenflüge", entrance_area: "Eingangsbereich", outdoor_exhibition_area: "Ausstellungsbereich im Freien", hall_transition_areas: "Übergangsbereiche zwischen Hallen", large_open_indoor_area: "Großer offener Innenbereich", sponsor_zone: "Sponsorenbereich", networking_area: "Networking-Bereich", demonstration_zone: "Vorführbereich", safety_certification: "Sicherheitszertifizierung", regulatory_approval: "Behördliche Genehmigung", insurance: "Versicherung", low_noise: "Geringe Geräuschentwicklung", clear_emergency_procedures: "Klare Notfallverfahren", privacy_safeguards: "Datenschutzmaßnahmen", proven_technical_reliability: "Nachgewiesene technische Zuverlässigkeit", defined_operating_area: "Definierter Betriebsbereich", successful_prior_testing: "Erfolgreiche Vorabtests", outdoor_advertising: "Außenwerbung", dooh: "DOOH", event_advertising: "Veranstaltungswerbung", exhibition_campaigns: "Messekampagnen", experiential_marketing: "Erlebnis-Marketing", promotional_activations: "Werbeaktivierungen", printed_advertising: "Printwerbung", mobile_advertising: "Mobile Werbung", sponsorship_campaigns: "Sponsoring-Kampagnen", leads: "Leads", website_traffic: "Website-Traffic", brand_awareness_studies: "Markenbekanntheitsstudien", third_party_analytics: "Analysen von Drittanbietern", client_feedback: "Kundenfeedback", limited_measurement: "Begrenzte Messung", attention: "Aufmerksamkeit", attribution: "Attribution", interaction_rate: "Interaktionsrate", content_comparison: "Inhaltsvergleich", location_performance: "Standortleistung", real_time_performance: "Leistung in Echtzeit", same_day_changes: "Änderungen am selben Tag", longer_changes: "Änderungen dauern länger", very_limited_adaptability: "Sehr begrenzte Anpassbarkeit", mostly_fixed: "Kampagnen sind meist festgelegt", audience_analytics: "Publikumsanalysen", real_time_measurement: "Echtzeitmessung", adaptive_campaigns: "Anpassbare Kampagnen", client_reporting: "Kundenberichte", client_acceptance: "Kundenakzeptanz", scalability: "Skalierbarkeit", campaign_integration: "Integration in bestehende Kampagnen", regulatory_compliance: "Einhaltung gesetzlicher Vorgaben", measurable_roi: "Messbarer ROI", client_demand: "Kundennachfrage", pricing_viability: "Tragfähige Preisgestaltung", successful_pilot_results: "Erfolgreiche Pilotresultate", screens: "Bildschirme", moving_displays: "Bewegte Displays", lighting: "Beleuchtung", sound: "Ton", people_presenters: "Personen / Präsentierende", unusual_technology: "Ungewöhnliche Technologie", moving_aerial_display: "Bewegte Luftdarstellung", fixed_banner: "Festes Banner", digital_screen: "Digitaler Bildschirm", no_difference: "Kein Unterschied", completely_comfortable: "Vollkommen wohl", mostly_comfortable: "Überwiegend wohl", neutral: "Neutral", somewhat_uncomfortable: "Etwas unwohl", very_uncomfortable: "Sehr unwohl", flying_close_to_people: "Fliegen nahe an Menschen", uav_size: "Größe des UAVs", unexpected_movement: "Unerwartete Bewegung", cameras_sensors: "Kameras / Sensoren", crowded_environment: "Belebte Umgebung", innovative: "Innovativ", attracts_attention: "Zieht Aufmerksamkeit an", visually_interesting: "Visuell interessant", more_dynamic: "Dynamischer als traditionelle Werbung", useful_information: "Könnte nützliche Informationen liefern", no_major_benefit: "Kein wesentlicher Vorteil", reliability: "Zuverlässigkeit", too_distracting: "Zu ablenkend", too_intrusive: "Zu aufdringlich", flying_near_people: "Fliegen nahe an Menschen",
  },
  zh: {
    digital_screens: "数字屏幕", printed_banners: "印刷横幅 / 标牌", product_demonstrations: "产品演示", promotional_staff: "推广人员", giveaways: "赠品", interactive_experiences: "互动体验", lighting_effects: "灯光 / 视觉效果", social_media_promotion: "社交媒体推广", live_presentations: "现场演示", other: "其他", foot_traffic: "人流量 / 访客数量", leads_collected: "收集的潜在客户", qr_scans: "二维码扫描", website_visits: "网站访问", social_media_engagement: "社交媒体互动", surveys: "调查", sales_conversions: "销售 / 转化", staff_observations: "员工观察", event_organizer_reports: "活动主办方报告", not_measured: "我们不进行测量", noticed_campaign_count: "注意到活动的人数", attention_duration: "注意持续时间", audience_engagement_level: "受众互动程度", visitor_movement: "访客移动 / 人流模式", effective_content: "最有效的内容", time_of_day_performance: "不同时段表现", post_engagement_conversion: "互动后的转化", campaign_variation_comparison: "活动版本比较", anonymous_demographic_trends: "匿名人口趋势", real_time: "是，实时", delayed: "是，但有延迟", minor_changes_only: "只能进行小幅调整", no: "否", not_sure: "不确定", mobile_aerial_advertising: "移动空中广告", audience_attention_measurement: "受众注意力测量", real_time_analytics: "实时分析", adaptive_campaign_content: "自适应活动内容", multi_uav_operation: "多无人机运行", near_continuous_operation: "接近持续运行", qr_interactive_engagement: "二维码 / 互动参与", campaign_reporting: "活动报告", safety: "安全", regulation_approvals: "法规 / 审批", noise: "噪音", privacy: "隐私", cost: "成本", technical_reliability: "技术可靠性", audience_acceptance: "受众接受度", weather: "天气", indoor_operation_constraints: "室内运行限制", no_major_concern: "没有重大顾虑", definitely_yes: "肯定是", probably_yes: "可能是", maybe: "也许", probably_not: "可能不是", definitely_not: "肯定不是", event_app: "活动应用", digital_signage: "数字标牌", printed_signage: "印刷标牌", sponsorship_placements: "赞助展示位置", stage_presentations: "舞台 / 演示机会", networking_activities: "交流活动", event_marketing: "活动营销", booth_placement: "展位位置", visitor_counts: "访客数量", booth_traffic: "展位人流", app_interactions: "应用互动", lead_data: "潜在客户数据", session_attendance: "场次参加人数", survey_results: "调查结果", event_statistics: "活动统计", no_engagement_data: "没有具体互动数据", real_time_visitor_movement: "实时访客移动", individual_campaign_attention: "对单项活动的注意力", engagement_duration: "互动持续时间", effective_locations: "最有效的位置", traffic_patterns: "人流模式", real_time_campaign_performance: "实时活动表现", highly_adaptable_realtime: "可实时高度调整", some_adjustments: "可以进行部分调整", limited_adjustments: "只能进行有限调整", fixed_after_start: "活动开始后通常固定", new_advertising_format: "新广告形式", exhibitor_analytics: "参展商分析", sponsorship_inventory: "额外赞助资源", visitor_engagement: "访客互动", real_time_event_analytics: "实时活动分析", adaptive_advertising: "自适应广告", new_revenue_opportunity: "新的收入机会", aviation_regulatory_approval: "航空 / 法规审批", venue_approval: "场地审批", insurance_liability: "保险 / 责任", emergency_procedures: "紧急程序", indoor_flight_restrictions: "室内飞行限制", entrance_area: "入口区域", outdoor_exhibition_area: "室外展区", hall_transition_areas: "展馆之间的过渡区域", large_open_indoor_area: "大型开放室内区域", sponsor_zone: "赞助商区域", networking_area: "交流区域", demonstration_zone: "特别演示区域", safety_certification: "安全认证", regulatory_approval: "法规审批", insurance: "保险", low_noise: "低噪音", clear_emergency_procedures: "明确的紧急程序", privacy_safeguards: "隐私保护措施", proven_technical_reliability: "已验证的技术可靠性", defined_operating_area: "明确的运行区域", successful_prior_testing: "成功的前期测试", outdoor_advertising: "户外广告", dooh: "数字户外广告", event_advertising: "活动广告", exhibition_campaigns: "展会活动", experiential_marketing: "体验式营销", promotional_activations: "促销活动", printed_advertising: "印刷广告", mobile_advertising: "移动广告", sponsorship_campaigns: "赞助活动", leads: "潜在客户", website_traffic: "网站流量", brand_awareness_studies: "品牌认知研究", third_party_analytics: "第三方分析", client_feedback: "客户反馈", limited_measurement: "有限的测量", attention: "注意力", attribution: "归因", interaction_rate: "互动率", content_comparison: "内容比较", location_performance: "位置表现", real_time_performance: "实时表现", same_day_changes: "当天调整", longer_changes: "调整需要更长时间", very_limited_adaptability: "适应性非常有限", mostly_fixed: "活动基本固定", audience_analytics: "受众分析", real_time_measurement: "实时测量", adaptive_campaigns: "自适应活动", client_reporting: "客户报告", client_acceptance: "客户接受度", scalability: "可扩展性", campaign_integration: "整合到现有活动", regulatory_compliance: "法规合规", measurable_roi: "可衡量的投资回报", client_demand: "客户需求", pricing_viability: "定价可行性", successful_pilot_results: "成功的试点结果", screens: "屏幕", moving_displays: "动态展示", lighting: "灯光", sound: "声音", people_presenters: "人员 / 演示者", unusual_technology: "非凡技术", moving_aerial_display: "移动空中展示", fixed_banner: "固定横幅", digital_screen: "数字屏幕", no_difference: "没有区别", completely_comfortable: "完全舒适", mostly_comfortable: "基本舒适", neutral: "中立", somewhat_uncomfortable: "有些不适", very_uncomfortable: "非常不适", flying_close_to_people: "靠近人群飞行", uav_size: "无人机大小", unexpected_movement: "意外移动", cameras_sensors: "摄像头 / 传感器", crowded_environment: "拥挤环境", innovative: "创新", attracts_attention: "吸引注意力", visually_interesting: "视觉上有趣", more_dynamic: "比传统广告更动态", useful_information: "可以提供有用信息", no_major_benefit: "看不到主要好处", reliability: "可靠性", too_distracting: "太分散注意力", too_intrusive: "太具侵扰性", flying_near_people: "在人群附近飞行"
  },
};

const categoryQuestionOverrides: Record<string, Partial<QuestionSpec>> = {
  e1_attraction: { kind: "choices", commentKey: "e1_attraction_comment" }, e2_measurement: { kind: "choices", commentKey: "e2_measurement_comment" }, e3_missing_engagement_data: { kind: "choices", commentKey: "e3_missing_engagement_data_comment" }, e4_campaign_adaptation: { kind: "radio", commentKey: "e4_campaign_adaptation_comment" }, e6_solution_value: { kind: "choices", commentKey: "e6_solution_value_comment" }, e7_barrier: { kind: "choices", commentKey: "e7_barrier_comment" }, e9_use_case: { kind: "radio" }, e10_willingness_to_pay: { kind: "radio", commentKey: "e10_willingness_to_pay_comment" }, e11_pilot_contact: { kind: "radio" },
  o1_exhibitor_visibility: { kind: "choices", commentKey: "o1_exhibitor_visibility_comment" }, o2_exhibitor_data: { kind: "choices", commentKey: "o2_exhibitor_data_comment" }, o3_missing_insights: { kind: "choices", commentKey: "o3_missing_insights_comment" }, o4_event_adaptation: { kind: "radio" }, o6_solution_value: { kind: "choices", commentKey: "o6_solution_value_comment" }, o7_uav_concern: { kind: "choices", commentKey: "o7_uav_concern_comment" }, o9_pilot_location: { kind: "choices", commentKey: "o9_pilot_location_comment" }, o10_pilot_requirement: { kind: "choices", commentKey: "o10_pilot_requirement_comment" }, o11_pilot_contact: { kind: "radio" },
  a1_physical_offerings: { kind: "choices", commentKey: "a1_physical_offerings_comment" }, a2_campaign_measurement: { kind: "choices", commentKey: "a2_campaign_measurement_comment" }, a3_client_data_requests: { kind: "choices", commentKey: "a3_client_data_requests_comment" }, a4_campaign_adaptation: { kind: "radio" }, a6_solution_value: { kind: "choices", commentKey: "a6_solution_value_comment" }, a7_service_barrier: { kind: "choices", commentKey: "a7_service_barrier_comment" }, a9_service_offering: { kind: "radio" }, a10_proof_required: { kind: "choices", commentKey: "a10_proof_required_comment" }, a11_pilot_contact: { kind: "radio" },
  v1_attention: { kind: "choices", commentKey: "v1_attention_comment" }, v2_moving_aerial_attention: { kind: "radio" }, v3_uav_discomfort: { kind: "choices", commentKey: "v3_uav_discomfort_comment" }, v4_anonymous_measurement: { kind: "radio" }, v5_interaction: { kind: "radio" }, v6_like: { kind: "choices", commentKey: "v6_like_comment" }, v7_concern: { kind: "choices", commentKey: "v7_concern_comment" },
};

export function CustomerDiscoveryForm({ adminView = false }: { adminView?: boolean }) {
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"new" | "dashboard" | "interviews">(
    adminView ? "dashboard" : "new",
  );
  const [interviews, setInterviews] = useState<FormState[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(adminView);
  const [showThankYou, setShowThankYou] = useState(false);
  const [recordFilter, setRecordFilter] = useState<"admin" | "user">("user");
  const [selectedInterviewIds, setSelectedInterviewIds] = useState<string[]>([]);
  const [resetMode, setResetMode] = useState<"selected" | "all" | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<FormState | null>(null);
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    exhibition: "",
    company: "",
    role: "",
    type: "",
    currentApproach: [],
    currentApproachComment: "",
    measurement: [],
    measurementComment: "",
    missingData: [],
    missingDataComment: "",
    adaptability: "",
    problemImportance: "",
    mostValuable: "",
    valueWhy: "",
    concernCategory: [],
    concernText: "",
    pilotInterest: "",
    followUp: "",
    contact: "",
    contactConsent: false,
    measurementPain: "",
    conceptInterest: "",
    pilotPotential: "",
    keyInsight: "",
    biggestObjection: "",
    nextAction: "",
  });

  useEffect(() => {
    if (!adminView) return;

    setIsLoadingInterviews(true);
    fetch("/api/customer-discovery")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load saved interviews.");
        return (await response.json()) as FormState[];
      })
      .then((items) => {
        setInterviews(items);
        setSaveError("");
      })
      .catch((error: unknown) => {
        setSaveError(error instanceof Error ? error.message : "Unable to load saved interviews.");
      })
      .finally(() => {
        setIsLoadingInterviews(false);
      });
  }, [adminView]);

  useEffect(() => {
    if (!adminView && view !== "new") {
      setView("new");
    }
  }, [adminView, view]);

  const t = translations[lang];
  const localizedInterviewTypes = interviewTypes.map((item) => ({
    ...item,
    label:
      item.value === "E"
        ? t.e
        : item.value === "O"
          ? t.o
          : item.value === "A"
            ? t.a
            : t.v,
  }));
  const answer = (value: string) => {
    const localized = categoryOptionTranslations[lang][value] || answerTranslations[lang][value];
    if (localized) return localized;
    return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const speakBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    const block = event.currentTarget.closest("[data-speech-block]");
    if (!block || !("speechSynthesis" in window)) return;

    const question = block.querySelector("[data-speech-question]")?.textContent
      ?.replace(/🔊/g, "")
      .trim();
    const description = block.querySelector("[data-speech-description]")?.textContent?.trim();
    const answers = Array.from(block.querySelectorAll("label span, select option:not([value=''])"))
      .map((element) => element.textContent?.trim())
      .filter((text): text is string => Boolean(text));
    const segments = [description, question, ...answers].filter(
      (text): text is string => Boolean(text),
    );
    if (!segments.length) return;

    window.speechSynthesis.cancel();
    const voiceLanguage = lang === "de" ? "de-DE" : lang === "zh" ? "zh-CN" : "en-GB";
    const utterance = new SpeechSynthesisUtterance(segments.join(". ... "));
    utterance.lang = voiceLanguage;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const speakerButton = () => (
    <button
      type="button"
      onClick={speakBlock}
      title="Play question and answers"
      aria-label="Play question and answers"
      className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-bg-2 text-base text-muted transition hover:border-green hover:text-green"
    >
      🔊
    </button>
  );

  const activeType = String(form.type || "");
  const showBranch = useMemo(
    () => activeType === "E" || activeType === "O" || activeType === "A",
    [activeType],
  );

  const handleInput = (
    key: string,
    value: string | string[] | boolean,
  ) => {
    setForm((current) => {
      if (key !== "type") return { ...current, [key]: value };
      return { ...current, ...categoryAnswerDefaults, type: value };
    });
  };

  const handleCheckbox = (key: string, value: string) => {
    setForm((current) => {
      const prev = Array.isArray(current[key]) ? [...current[key]] : [];
      const next = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      return { ...current, [key]: next };
    });
  };

  const requiredForStep = (index: number) => {
    if (index === 0) return ["exhibition", "type"];
    if (index === 1) return activeQuestions.slice(0, activeType === "V" ? 3 : 5).map((question) => question.key);
    if (index === 2) return activeQuestions.slice(activeType === "V" ? 3 : 5).map((question) => question.key);
    return ["measurementPain", "conceptInterest", "pilotPotential", "keyInsight", "biggestObjection", "nextAction"];
  };

  const validateStep = () => {
    const keys = requiredForStep(step);
    if (!keys.length) return true;
    return keys.every((key) => {
      const value = form[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      return String(value ?? "").trim().length > 0;
    });
  };

  const nextStep = () => {
    if (!validateStep()) {
      window.alert("Please answer all required questions on this page before continuing.");
      return;
    }
    if (step < stepLabels.length - 1) setStep((current) => current + 1);
  };

  const previousStep = () => {
    if (step > 0) setStep((current) => current - 1);
  };

  const saveInterview = async () => {
    if (!validateStep()) {
      window.alert("Please complete the interview before saving.");
      return;
    }

    setIsSaving(true);
    setSaveError("");

    const item: FormState = {
      ...form,
      pilotInterest:
        activeType === "E"
          ? String(form.e8_pilot_interest ?? "")
          : activeType === "O"
            ? String(form.o8_pilot_interest ?? "")
            : activeType === "A"
              ? String(form.a8_pilot_interest ?? "")
              : "",
      id: "",
      createdAt: new Date().toISOString(),
      syncStatus: "pending",
    };

    try {
      const clientUuid = crypto.randomUUID();
      const response = await fetch("/api/customer-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, clientUuid, questionLanguage: lang }),
      });
      const result = (await response.json()) as {
        error?: string;
        databaseId?: string;
        createdAt?: string;
        interviewCode?: string;
        submissionRole?: "admin" | "user";
      };

      if (!response.ok || !result.databaseId) {
        throw new Error(result.error || "The interview could not be saved.");
      }

      const savedItem: FormState = {
        ...item,
        id: result.interviewCode || result.databaseId,
        createdAt: result.createdAt || item.createdAt,
        submissionRole: result.submissionRole || (adminView ? "admin" : "user"),
        syncStatus: "synced",
      };
      const next = [...interviews, savedItem];
      if (adminView) {
        setInterviews(next);
      }
      setView(adminView ? "dashboard" : "new");
      setStep(0);
      setForm({
        exhibition: "",
        company: "",
        role: "",
        type: "",
        currentApproach: [],
        currentApproachComment: "",
        measurement: [],
        measurementComment: "",
        missingData: [],
        missingDataComment: "",
        adaptability: "",
        problemImportance: "",
        mostValuable: "",
        valueWhy: "",
        concernCategory: [],
        concernText: "",
        pilotInterest: "",
        followUp: "",
        contact: "",
        contactConsent: false,
        measurementPain: "",
        conceptInterest: "",
        pilotPotential: "",
        keyInsight: "",
        biggestObjection: "",
        nextAction: "",
      });
      if (!adminView) {
        setShowThankYou(true);
      } else {
        window.alert(t.thankYou);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "The interview could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!showThankYou) return;

    const redirectTimer = window.setTimeout(() => router.push("/"), 3200);
    return () => window.clearTimeout(redirectTimer);
  }, [router, showThankYou]);

  const renderChoiceGrid = (
    key: string,
    options: string[],
    labels: Record<string, string>,
  ) => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {options.map((option) => {
        const selected = Array.isArray(form[key]) ? (form[key] as string[]).includes(option) : false;
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
              selected ? "border-green bg-green/10 text-text" : "border-line bg-bg-2 text-muted"
            }`}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => handleCheckbox(key, option)}
              className="mt-1 h-4 w-4 accent-green"
            />
            <span>{answer(labels[option] ?? option)}</span>
          </label>
        );
      })}
    </div>
  );

  const activeQuestions = activeType === "E" || activeType === "O" || activeType === "A" || activeType === "V"
    ? categoryQuestions[lang][activeType].map((question) => {
        const override = categoryQuestionOverrides[question.key] || {};
        const values = categoryOptionValues[question.key];
        return {
          ...question,
          ...override,
          options: values
            ? values.map((value) => ({ value, label: value }))
            : override.options || question.options,
        };
      })
    : [];

  const renderCategoryQuestion = (question: QuestionSpec, index: number) => {
    const value = form[question.key];
    const questionLabel = `${activeType}${index + 1}. ${question.prompt}`;
    const options = question.options || [];

    return (
      <div key={question.key} className="rounded-xl border border-line bg-bg p-4" data-speech-block>
        <p data-speech-question className="mb-3 flex items-center text-base font-semibold">
          {questionLabel}{speakerButton()}
        </p>
        {question.kind === "text" && (
          <textarea
            value={String(value ?? "")}
            onChange={(event) => handleInput(question.key, event.target.value)}
            className="min-h-28 w-full rounded-xl border border-line bg-bg-2 px-3 py-3 text-text outline-none focus:border-green"
          />
        )}
        {(question.kind === "scale" || question.kind === "radio" || question.kind === "yesNo") && (
          <select
            value={String(value ?? "")}
            onChange={(event) => handleInput(question.key, event.target.value)}
            className="w-full rounded-xl border border-line bg-bg-2 px-3 py-3 text-text outline-none focus:border-green"
          >
            <option value="">{t.select}{question.kind === "scale" ? " 1–5…" : ""}</option>
            {question.kind === "scale"
              ? ["1", "2", "3", "4", "5"].map((score) => <option key={score} value={score}>{score}</option>)
              : (options.length ? options : [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]).map((option) => <option key={option.value} value={option.value}>{answer(option.label)}</option>)}
          </select>
        )}
        {question.kind === "choices" && renderChoiceGrid(
          question.key,
          options.map((option) => option.value),
          Object.fromEntries(options.map((option) => [option.value, option.label])),
        )}
        {question.commentKey && (
          <textarea
            value={String(form[question.commentKey] ?? "")}
            onChange={(event) => handleInput(question.commentKey!, event.target.value)}
            placeholder={t.optionalComment}
            className="mt-4 min-h-24 w-full rounded-xl border border-line bg-bg-2 px-3 py-3 text-text outline-none focus:border-green"
          />
        )}
        {question.kind === "choices" && options.some((option) => option.value === "other") &&
          Array.isArray(value) && value.includes("other") && (
            <textarea
              value={String(form[`${question.key}_other`] ?? "")}
              onChange={(event) => handleInput(`${question.key}_other`, event.target.value)}
              placeholder={t.optionalComment}
              className="mt-4 min-h-24 w-full rounded-xl border border-line bg-bg-2 px-3 py-3 text-text outline-none focus:border-green"
            />
          )}
        {question.reasonKey && (
          <textarea
            value={String(form[question.reasonKey] ?? "")}
            onChange={(event) => handleInput(question.reasonKey!, event.target.value)}
            placeholder={t.optionalComment}
            className="mt-4 min-h-24 w-full rounded-xl border border-line bg-bg-2 px-3 py-3 text-text outline-none focus:border-green"
          />
        )}
      </div>
    );
  };

  const summaryCards = [
    {
      label: "Admin forms",
      value: interviews.filter((item) => item.submissionRole === "admin").length,
    },
    {
      label: "User forms",
      value: interviews.filter((item) => item.submissionRole !== "admin").length,
    },
    {
      label: "Avg Need/Pain",
      value:
        interviews.length > 0
          ? (
              interviews.reduce((sum, item) => sum + Number(item.measurementPain || 0), 0) /
              interviews.length
            ).toFixed(1)
          : "—",
    },
    {
      label: "Avg Interest",
      value:
        interviews.length > 0
          ? (
              interviews.reduce((sum, item) => sum + Number(item.conceptInterest || 0), 0) /
              interviews.length
            ).toFixed(1)
          : "—",
    },
    {
      label: "Follow-up",
      value: interviews.filter((item) => item.followUp === "Yes").length,
    },
  ];

  const filteredInterviews = interviews.filter((item) =>
    recordFilter === "admin" ? item.submissionRole === "admin" : item.submissionRole !== "admin",
  );

  const formatInterviewValue = (value: FormState[string]) => {
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value ?? "—");
  };

  const openReset = (mode: "selected" | "all") => {
    if (mode === "selected" && !selectedInterviewIds.length) {
      setResetError("Select at least one interview first.");
      return;
    }
    setResetMode(mode);
    setResetPassword("");
    setResetError("");
  };

  const deleteInterviews = async () => {
    if (!resetMode || !resetPassword) {
      setResetError("Enter your admin password to continue.");
      return;
    }

    setIsResetting(true);
    setResetError("");
    try {
      const response = await fetch("/api/customer-discovery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: resetPassword,
          all: resetMode === "all",
          ids: resetMode === "selected" ? selectedInterviewIds : undefined,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to delete interviews.");

      if (resetMode === "all") {
        setInterviews([]);
      } else {
        setInterviews((items) => items.filter((item) => !selectedInterviewIds.includes(String(item.databaseId))));
      }
      setSelectedInterviewIds([]);
      setResetMode(null);
      setResetPassword("");
    } catch (error) {
      setResetError(error instanceof Error ? error.message : "Unable to delete interviews.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Interviews" }]} />
      <PageHero
        eyebrow="// CUSTOMER DISCOVERY"
        title={t.title}
        description={t.subtitle}
      />

      <div className="px-4 pb-20 sm:px-8 md:px-25">
        <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Question language">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Question language</span>
          {languageOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLang(option.value)}
              aria-pressed={lang === option.value}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                lang === option.value
                  ? "border-green bg-green/10 text-green"
                  : "border-line bg-bg-2 text-muted hover:text-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {showThankYou && !adminView ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-green/40 bg-green/10 px-6 py-12 text-center shadow-[0_0_60px_rgba(126,255,166,0.12)] animate-[fade-in-up_500ms_ease-out]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-green text-3xl text-green">
              ✓
            </div>
            <h2 className="font-display text-3xl font-semibold text-text">Thank you</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              Your interview has been saved successfully. You will be returned to the home page shortly.
            </p>
            <div className="mx-auto mt-8 h-1 max-w-xs overflow-hidden rounded-full bg-bg">
              <div className="h-full origin-left animate-[progress_3.2s_linear_forwards] rounded-full bg-green" />
            </div>
          </div>
        ) : (
          <>
        {adminView && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {[
              { id: "new", label: t.navNew },
              { id: "dashboard", label: t.navDashboard },
              { id: "interviews", label: t.navInterviews },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id as "new" | "dashboard" | "interviews")}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${
                  view === tab.id
                    ? "border-green bg-green/10 text-green"
                    : "border-line bg-bg-2 text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {adminView && (
          <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span className="rounded-full border border-line bg-bg-2 px-3 py-1.5">Database: Ready</span>
            <span className="rounded-full border border-line bg-bg-2 px-3 py-1.5">
              Pending: {interviews.filter((item) => item.syncStatus === "pending").length}
            </span>
          </div>
        )}

        {!adminView && (
          <div className="mb-6 rounded-xl border border-line bg-bg-2 p-4 text-sm text-muted">
            Public interview form. Only admin users can access the saved data and dashboard view.
          </div>
        )}

        {adminView && view === "new" && (
          <div className="mb-4 rounded-xl border border-line bg-bg-2 p-3 text-sm text-muted">
            Admin access: this dashboard is restricted to authenticated admin users.
          </div>
        )}

        {view === "new" && (
          <div className="rounded-2xl border border-line bg-bg-2 p-5 md:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {stepLabels.map((label, index) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      step === index
                        ? "bg-green text-[#06140F]"
                        : "border border-line bg-bg text-muted"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {index < stepLabels.length - 1 && <span className="text-line-2">/</span>}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-semibold">{t.profile}</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.exhibition}</label>
                    <input
                      value={String(form.exhibition ?? "")}
                      onChange={(e) => handleInput("exhibition", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.company}</label>
                    <input
                      value={String(form.company ?? "")}
                      onChange={(e) => handleInput("company", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.role}</label>
                    <input
                      value={String(form.role ?? "")}
                      onChange={(e) => handleInput("role", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.interviewType}</label>
                    <select
                      value={String(form.type ?? "")}
                      onChange={(e) => handleInput("type", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    >
                      <option value="">{t.select}</option>
                      {localizedInterviewTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              )}

            {step === 1 && (
              <div className="space-y-8">
                <h2 className="font-display text-2xl font-semibold">{t.step2}</h2>
                <div className="space-y-6">
                  {activeQuestions.slice(0, activeType === "V" ? 3 : 5).map(renderCategoryQuestion)}
                </div>

                {false && (<>
                {activeType !== "V" && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                      <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q1}{speakerButton()}</p>
                      {renderChoiceGrid("currentApproach", [
                        "Booth / stand",
                        "Digital screens",
                        "Banners / signage",
                        "Flyers / printed media",
                        "Promotional staff",
                        "QR / digital interaction",
                        "Social media / online promotion",
                        "Other",
                      ], {
                        "Booth / stand": "Booth / stand",
                        "Digital screens": "Digital screens",
                        "Banners / signage": "Banners / signage",
                        "Flyers / printed media": "Flyers / printed media",
                        "Promotional staff": "Promotional staff",
                        "QR / digital interaction": "QR / digital interaction",
                        "Social media / online promotion": "Social media / online promotion",
                        Other: "Other",
                      })}
                      <textarea
                        value={String(form.currentApproachComment ?? "")}
                        onChange={(e) => handleInput("currentApproachComment", e.target.value)}
                        placeholder={t.optionalComment}
                        className="mt-4 min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                      />
                    </div>

                    <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                      <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q2}{speakerButton()}</p>
                      {renderChoiceGrid("measurement", [
                        "Booth visits",
                        "QR scans",
                        "Leads / registrations",
                        "Sales / conversions",
                        "Staff observation",
                        "Digital analytics",
                        "Very limited / not measured",
                        "Other",
                      ], {
                        "Booth visits": "Booth visits",
                        "QR scans": "QR scans",
                        "Leads / registrations": "Leads / registrations",
                        "Sales / conversions": "Sales / conversions",
                        "Staff observation": "Staff observation",
                        "Digital analytics": "Digital analytics",
                        "Very limited / not measured": "Very limited / not measured",
                        Other: "Other",
                      })}
                      <textarea
                        value={String(form.measurementComment ?? "")}
                        onChange={(e) => handleInput("measurementComment", e.target.value)}
                        placeholder={t.optionalComment}
                        className="mt-4 min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                      />
                    </div>

                    <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                      <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q3}{speakerButton()}</p>
                      {renderChoiceGrid("missingData", [
                        "Attention",
                        "Engagement",
                        "Traffic / location patterns",
                        "Interaction duration",
                        "Response to different messages",
                        "Conversion to booth / action",
                        "Nothing important missing",
                        "Other",
                      ], {
                        Attention: "Attention",
                        Engagement: "Engagement",
                        "Traffic / location patterns": "Traffic / location patterns",
                        "Interaction duration": "Interaction duration",
                        "Response to different messages": "Response to different messages",
                        "Conversion to booth / action": "Conversion to booth / action",
                        "Nothing important missing": "Nothing important missing",
                        Other: "Other",
                      })}
                      <textarea
                        value={String(form.missingDataComment ?? "")}
                        onChange={(e) => handleInput("missingDataComment", e.target.value)}
                        placeholder={t.optionalComment}
                        className="mt-4 min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                      />
                    </div>

                    <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                      <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q4}{speakerButton()}</p>
                      <select
                        value={String(form.adaptability ?? "")}
                        onChange={(e) => handleInput("adaptability", e.target.value)}
                        className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                      >
                        <option value="">{t.select}</option>
                        <option value="Yes, easily">{answer("Yes, easily")}</option>
                        <option value="Yes, but with limitations">{answer("Yes, but with limitations")}</option>
                        <option value="Difficult">{answer("Difficult")}</option>
                        <option value="Usually not possible">{answer("Usually not possible")}</option>
                      </select>
                    </div>

                    <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                      <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q5}{speakerButton()}</p>
                      <select
                        value={String(form.problemImportance ?? "")}
                        onChange={(e) => handleInput("problemImportance", e.target.value)}
                        className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                      >
                        <option value="">{t.select} 1–5…</option>
                        <option value="1">{answer("1 — Not important")}</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">{answer("4 — Important")}</option>
                        <option value="5">{answer("5 — Very important")}</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeType === "V" && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                      <p data-speech-question className="mb-3 flex items-center text-base font-semibold">V1. {t.qV1}{speakerButton()}</p>
                      {renderChoiceGrid("visitorAttention", [
                        "Large displays / screens",
                        "Movement / unusual displays",
                        "Offers / promotions",
                        "Interactive experiences",
                        "People / demonstrations",
                        "Other",
                      ], {
                        "Large displays / screens": "Large displays / screens",
                        "Movement / unusual displays": "Movement / unusual displays",
                        "Offers / promotions": "Offers / promotions",
                        "Interactive experiences": "Interactive experiences",
                        "People / demonstrations": "People / demonstrations",
                        Other: "Other",
                      })}
                    </div>
                  </div>
                )}
                </>)}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h2 className="font-display text-2xl font-semibold">{t.step3}</h2>
                <div className="rounded-xl border border-line bg-bg p-4 text-sm leading-7 text-muted" data-speech-block>
                  <div className="flex items-start justify-between gap-3">
                    <p data-speech-description>{t.conceptDescription}</p>
                    {speakerButton()}
                  </div>
                </div>
                <div className="space-y-6">
                  {activeQuestions.slice(activeType === "V" ? 3 : 5).map(renderCategoryQuestion)}
                </div>
                {false && (<>
                <div className="rounded-xl border border-line bg-bg p-4 text-sm leading-7 text-muted" data-speech-block>
                  <div className="flex items-start justify-between gap-3">
                    <p data-speech-description>{t.conceptDescription}</p>
                    {speakerButton()}
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                  <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q6}{speakerButton()}</p>
                  {renderChoiceGrid("mostValuable", [
                    "Mobile / aerial advertising",
                    "Audience measurement",
                    "Real-time analytics",
                    "Campaign adaptation",
                    "Continuous operation",
                    "Multiple media formats",
                    "I do not currently see significant value",
                    "Other",
                  ], {
                    "Mobile / aerial advertising": "Mobile / aerial advertising",
                    "Audience measurement": "Audience measurement",
                    "Real-time analytics": "Real-time analytics",
                    "Campaign adaptation": "Campaign adaptation",
                    "Continuous operation": "Continuous operation",
                    "Multiple media formats": "Multiple media formats",
                    "I do not currently see significant value": "I do not currently see significant value",
                    Other: "Other",
                  })}
                  <textarea
                    value={String(form.valueWhy ?? "")}
                    onChange={(e) => handleInput("valueWhy", e.target.value)}
                    placeholder={t.optionalComment}
                    className="mt-4 min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  />
                </div>

                <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                  <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q7}{speakerButton()}</p>
                  {renderChoiceGrid("concernCategory", [
                    "Safety",
                    "Regulation",
                    "Noise",
                    "Privacy",
                    "Cost",
                    "Technical reliability",
                    "Weather",
                    "Audience acceptance",
                    "No major concern",
                    "Other",
                  ], {
                    Safety: "Safety",
                    Regulation: "Regulation",
                    Noise: "Noise",
                    Privacy: "Privacy",
                    Cost: "Cost",
                    "Technical reliability": "Technical reliability",
                    Weather: "Weather",
                    "Audience acceptance": "Audience acceptance",
                    "No major concern": "No major concern",
                    Other: "Other",
                  })}
                  <textarea
                    value={String(form.concernText ?? "")}
                    onChange={(e) => handleInput("concernText", e.target.value)}
                    placeholder={t.optionalComment}
                    className="mt-4 min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  />
                </div>

                {showBranch && (
                  <div className="rounded-xl border border-line bg-bg p-4" data-speech-block>
                    <p data-speech-question className="mb-3 flex items-center text-base font-semibold">{t.q8}{speakerButton()}</p>
                    <select
                      value={String(form.pilotInterest ?? "")}
                      onChange={(e) => handleInput("pilotInterest", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    >
                      <option value="">{t.select} 1–5…</option>
                      <option value="1">{answer("1 — Definitely not")}</option>
                      <option value="2">{answer("2 — Probably not")}</option>
                      <option value="3">{answer("3 — Maybe")}</option>
                      <option value="4">{answer("4 — Yes")}</option>
                      <option value="5">{answer("5 — Strong interest")}</option>
                    </select>
                  </div>
                )}
                </>)}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-semibold">{t.review}</h2>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.pain}</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={String(form.measurementPain ?? "")}
                      onChange={(e) => handleInput("measurementPain", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.interest}</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={String(form.conceptInterest ?? "")}
                      onChange={(e) => handleInput("conceptInterest", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-muted">{t.pilot}</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={String(form.pilotPotential ?? "")}
                      onChange={(e) => handleInput("pilotPotential", e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted">{t.insight}</label>
                  <textarea
                    value={String(form.keyInsight ?? "")}
                    onChange={(e) => handleInput("keyInsight", e.target.value)}
                    className="min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted">{t.objection}</label>
                  <textarea
                    value={String(form.biggestObjection ?? "")}
                    onChange={(e) => handleInput("biggestObjection", e.target.value)}
                    className="min-h-28 w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted">{t.nextAction}</label>
                  <select
                    value={String(form.nextAction ?? "")}
                    onChange={(e) => handleInput("nextAction", e.target.value)}
                    className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  >
                    <option value="">{t.select}</option>
                    <option value="Follow up">{answer("Follow up")}</option>
                    <option value="Potential pilot">{answer("Potential pilot")}</option>
                    <option value="Introduction to another person">{answer("Introduction to another person")}</option>
                    <option value="Useful insight only">{answer("Useful insight only")}</option>
                    <option value="No action">{answer("No action")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted">{t.followUp}</label>
                  <select
                    value={String(form.followUp ?? "")}
                    onChange={(e) => handleInput("followUp", e.target.value)}
                    className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  >
                    <option value="">{t.select}</option>
                    <option value="Yes">{answer("Yes")}</option>
                    <option value="Maybe">{answer("Maybe")}</option>
                    <option value="No">{answer("No")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted">{t.contact}</label>
                  <input
                    value={String(form.contact ?? "")}
                    onChange={(e) => handleInput("contact", e.target.value)}
                    className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-text outline-none focus:border-green"
                  />
                  <label className="mt-4 flex items-start gap-3 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={Boolean(form.contactConsent)}
                      onChange={(e) => handleInput("contactConsent", e.target.checked)}
                      className="mt-1 h-4 w-4 accent-green"
                    />
                    <span>{t.consent}</span>
                  </label>
                </div>
              </div>
            )}

            {view === "new" && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
                {saveError && (
                  <p className="mr-auto text-sm text-red-400" role="alert">
                    {saveError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={step === 0}
                  className="rounded-md border border-line bg-bg px-4 py-2 text-sm font-medium text-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t.back}
                </button>

                {step < stepLabels.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-md bg-green px-5 py-2.5 text-sm font-semibold text-[#06140F]"
                  >
                    {t.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveInterview}
                    disabled={isSaving}
                    className="rounded-md bg-green px-5 py-2.5 text-sm font-semibold text-[#06140F] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : t.save}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {adminView && view === "dashboard" && (
          <div className="space-y-6">
            {isLoadingInterviews && (
              <div className="rounded-xl border border-line bg-bg-2 p-4 text-sm text-muted">
                Loading saved interviews…
              </div>
            )}
            {saveError && !isLoadingInterviews && (
              <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300" role="alert">
                {saveError}
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-line bg-bg-2 p-5">
                  <div className="text-3xl font-display font-bold text-green">{card.value}</div>
                  <div className="mt-2 text-xs font-mono uppercase tracking-wide text-muted">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-line bg-bg-2 p-5">
              <h3 className="font-display text-2xl font-semibold">Interview Mix</h3>
              <div className="mt-5 space-y-4">
                {localizedInterviewTypes.map((item) => {
                  const count = interviews.filter((entry) => entry.type === item.value).length;
                  const percent = interviews.length ? (count / interviews.length) * 100 : 0;
                  return (
                    <div key={item.value}>
                      <div className="mb-2 flex items-center justify-between text-sm text-muted">
                        <span>{item.label}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-bg">
                        <div
                          className="h-full rounded-full bg-green"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-bg-2 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold">Latest user interviews</h3>
                <button
                  type="button"
                  onClick={() => {
                    setRecordFilter("user");
                    setView("interviews");
                  }}
                  className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:text-text"
                >
                  View all users
                </button>
              </div>
              {filteredInterviews.length === 0 ? (
                <p className="mt-5 text-muted">{t.noData}</p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-muted">
                      <tr className="border-b border-line">
                        <th className="pb-3 pr-6">ID</th>
                        <th className="pb-3 pr-6">Date</th>
                        <th className="pb-3 pr-6">Company</th>
                        <th className="pb-3 pr-6">Type</th>
                        <th className="pb-3 pr-6">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInterviews.slice(0, 5).map((item) => (
                        <tr key={`${item.id}-${item.createdAt}`} className="border-b border-line/80">
                          <td className="py-3 pr-6">{String(item.id ?? "")}</td>
                          <td className="py-3 pr-6">
                            {item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-3 pr-6">{String(item.company ?? "—")}</td>
                          <td className="py-3 pr-6">{String(item.type ?? "—")}</td>
                          <td className="py-3 pr-6">
                            <button
                              type="button"
                              onClick={() => setSelectedInterview(item)}
                              className="whitespace-nowrap rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-green hover:text-green"
                            >
                              View full data
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {adminView && view === "interviews" && (
          <div className="rounded-2xl border border-line bg-bg-2 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold">
                {recordFilter === "admin" ? "Admin interviews" : "User interviews"}
              </h3>
              <div className="flex gap-2">
                {(["admin", "user"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRecordFilter(filter)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                      recordFilter === filter
                        ? "border-green bg-green/10 text-green"
                        : "border-line text-muted hover:text-text"
                    }`}
                  >
                    {filter === "admin" ? "Admin" : "Users"} ({interviews.filter((item) =>
                      filter === "admin" ? item.submissionRole === "admin" : item.submissionRole !== "admin",
                    ).length})
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-line py-4">
              <button
                type="button"
                onClick={() => openReset("selected")}
                className="rounded-md border border-red-400/50 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/10"
              >
                Delete selected
              </button>
              <button
                type="button"
                onClick={() => openReset("all")}
                className="rounded-md bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25"
              >
                Reset all interview data
              </button>
              {selectedInterviewIds.length > 0 && (
                <span className="text-xs text-muted">{selectedInterviewIds.length} selected</span>
              )}
            </div>
            {resetMode && (
              <div className="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 p-4">
                <h4 className="font-semibold text-red-200">
                  {resetMode === "all" ? "Delete all interview data?" : "Delete selected interviews?"}
                </h4>
                <p className="mt-2 text-sm text-muted">
                  This cannot be undone. Confirm with your current admin password.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(event) => setResetPassword(event.target.value)}
                    placeholder="Admin password"
                    autoComplete="current-password"
                    className="min-w-64 rounded-md border border-line bg-bg px-3 py-2 text-sm text-text outline-none focus:border-red-300"
                  />
                  <button
                    type="button"
                    onClick={deleteInterviews}
                    disabled={isResetting}
                    className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isResetting ? "Deleting…" : "Confirm delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetMode(null)}
                    className="rounded-md border border-line px-4 py-2 text-sm text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                </div>
                {resetError && <p className="mt-3 text-sm text-red-300" role="alert">{resetError}</p>}
              </div>
            )}
            {filteredInterviews.length === 0 ? (
              <p className="mt-5 text-muted">{t.noData}</p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-muted">
                    <tr className="border-b border-line">
                      <th className="pb-3 pr-3">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="pb-3 pr-6">ID</th>
                      <th className="pb-3 pr-6">Date</th>
                      <th className="pb-3 pr-6">Company</th>
                      <th className="pb-3 pr-6">Type</th>
                      <th className="pb-3 pr-6">Pain</th>
                      <th className="pb-3 pr-6">Interest</th>
                      <th className="pb-3 pr-6">Follow-up</th>
                      <th className="pb-3 pr-6">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredInterviews].reverse().map((item) => (
                      <tr key={`${item.id}-${item.createdAt}`} className="border-b border-line/80">
                        <td className="py-3 pr-3">
                          <input
                            type="checkbox"
                            checked={selectedInterviewIds.includes(String(item.databaseId ?? ""))}
                            onChange={(event) => {
                              const id = String(item.databaseId ?? "");
                              setSelectedInterviewIds((current) =>
                                event.target.checked
                                  ? [...current, id]
                                  : current.filter((selectedId) => selectedId !== id),
                              );
                            }}
                            className="h-4 w-4 accent-green"
                            aria-label={`Select ${String(item.id ?? "interview")}`}
                          />
                        </td>
                        <td className="py-3 pr-6">{String(item.id ?? "")}</td>
                        <td className="py-3 pr-6">
                          {item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 pr-6">{String(item.company ?? "—")}</td>
                        <td className="py-3 pr-6">{String(item.type ?? "—")}</td>
                        <td className="py-3 pr-6">{String(item.measurementPain ?? "—")}</td>
                        <td className="py-3 pr-6">{String(item.conceptInterest ?? "—")}</td>
                        <td className="py-3 pr-6">{String(item.followUp ?? "—")}</td>
                        <td className="py-3 pr-6">
                          <button
                            type="button"
                            onClick={() => setSelectedInterview(item)}
                            className="whitespace-nowrap rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-green hover:text-green"
                          >
                            View full data
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {adminView && selectedInterview && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-line bg-bg p-5 shadow-2xl sm:rounded-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-muted">Complete interview record</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-text">
                    {String(selectedInterview.id ?? "Interview")}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInterview(null)}
                  className="rounded-md border border-line px-3 py-1.5 text-sm text-muted hover:text-text"
                >
                  Close
                </button>
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {Object.entries(selectedInterview)
                  .filter(([key]) => key !== "responses")
                  .map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-line bg-bg-2 p-3">
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-muted">{key}</dt>
                      <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-text">
                        {formatInterviewValue(value)}
                      </dd>
                    </div>
                  ))}
              </dl>
              {selectedInterview.responses && (
                <div className="mt-5 rounded-lg border border-line bg-bg-2 p-4">
                  <h4 className="font-mono text-xs uppercase tracking-wide text-muted">Raw response payload</h4>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-text">
                    {JSON.stringify(selectedInterview.responses, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </>
  );
}
