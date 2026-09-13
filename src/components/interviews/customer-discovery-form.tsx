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
  const answer = (value: string) => answerTranslations[lang][value] || value;

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
    setForm((current) => ({ ...current, [key]: value }));
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
    const requiredMap: Record<number, string[]> = {
      0: ["exhibition", "type"],
      1: activeType === "V" ? [] : ["adaptability"],
      2: ["mostValuable"],
      3: ["measurementPain", "conceptInterest", "pilotPotential", "keyInsight", "biggestObjection", "nextAction"],
    };
    return requiredMap[index] ?? [];
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </>
  );
}
