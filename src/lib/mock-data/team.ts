import type { TeamMember } from "@/lib/types";

export const teamMembers: TeamMember[] = [
  {
    _id: "team-a-karim",
    name: "Dr. A. Karim",
    role: "Founder & Research Director",
    bio: "Leads the hybrid physical–digital systems programme and oversees IP strategy across all active projects.",
    order: 1,
    visible: true,
  },
  {
    _id: "team-s-mensah",
    name: "S. Mensah",
    role: "Head of Autonomous Systems",
    bio: "Directs research on distributed and semi-autonomous aerial platforms, with a focus on urban safety validation.",
    order: 2,
    visible: true,
  },
  {
    _id: "team-r-lindqvist",
    name: "Dr. R. Lindqvist",
    role: "Head of Cyber-Physical Systems",
    bio: "Focuses on real-time behavioral interpretation and decision systems, bridging academic and applied research.",
    order: 3,
    visible: true,
  },
  {
    _id: "team-j-tanaka",
    name: "J. Tanaka",
    role: "IP & Partnerships Lead",
    bio: "Manages the patent pipeline and serves as the primary point of contact for licensing and investment inquiries.",
    order: 4,
    visible: true,
  },
];
