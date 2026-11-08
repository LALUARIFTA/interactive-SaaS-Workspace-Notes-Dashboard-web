// Template seed data. Reset button restores this exact shape.
export function seedState() {
  return {
    user: { name: 'James' },
    theme: 'light',
    selectedDay: 18,
    typographyChecks: 3,
    assignmentIndex: 0,
    activeNoteId: 1,
    kanbanFilter: 'all',
    boardMeeting: { time: 'March 24 at 4:00 PM', accepted: false },
    assignments: [
      { tag1: 'Motion design', tag2: 'Logo', title: 'Design a packaging concept for a new product', priority: 'High', pill: 'Package design', author: 'Rachel Lee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
      { tag1: 'UX/UI design', tag2: 'System', title: 'Create interactive micro-animations for onboarding', priority: 'High', pill: 'Prototype', author: 'Ken Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
      { tag1: 'Data Research', tag2: 'Q2', title: 'Synthesize user interview notes for Board Meeting', priority: 'Medium', pill: 'Marketing', author: 'James', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80' }
    ],
    todayTasks: [
      { id: 1, title: 'Conduct research', date: '4 May, 09:20 AM', duration: '02 h 45 m', progress: 90, attachments: 4, metaIcon: 'chat', metaText: '16', elevated: true },
      { id: 2, title: 'Schedule a meeting', date: '14 May, 12:45 AM', duration: '06 h 55 m', progress: 50, attachments: 4, metaIcon: 'calendar', metaText: '3 June', elevated: false },
      { id: 3, title: 'Send out reminders', date: '21 May, 10:30 AM', duration: '01 h 30 m', progress: 10, attachments: 16, metaIcon: 'calendar', metaText: '3 June', elevated: false }
    ],
    calendarDays: [
      { name: 'Mon', num: 14, slot1Time: '09:00-10:00 AM', slot1Title: 'Design Sprint Kickoff', slot1Tag: 'Motion design', slot2Time: '02:00-03:00 PM', slot2Title: 'Note Architecture Sync', slot2Tag: 'Product' },
      { name: 'Tue', num: 15, slot1Time: '10:30-11:30 AM', slot1Title: 'Typography Audit', slot1Tag: 'UX/UI design', slot2Time: '03:30-04:15 PM', slot2Title: 'Marketing Copy Review', slot2Tag: 'Marketing' },
      { name: 'Wed', num: 16, slot1Time: '01:00-02:00 PM', slot1Title: 'Packaging Mockup Lab', slot1Tag: 'Package design', slot2Time: '04:00-05:00 PM', slot2Title: 'Stakeholder Demo', slot2Tag: 'Executive' },
      { name: 'Thu', num: 17, slot1Time: '11:00-12:00 PM', slot1Title: 'Research Synthesis', slot1Tag: 'Data Research', slot2Time: '02:30-03:30 PM', slot2Title: 'Frontend Polish', slot2Tag: 'Engineering' },
      { name: 'Fri', num: 18, slot1Time: '04:30-05:00 PM', slot1Title: 'Team meeting', slot1Tag: 'UX/UI design', slot2Time: '11:30-12:30 PM', slot2Title: 'Meeting with new client', slot2Tag: 'Job interview' },
      { name: 'Sat', num: 19, slot1Time: '11:00-11:45 AM', slot1Title: 'Landing design meeting', slot1Tag: 'UX/UI design', slot2Time: '01:00-02:00 PM', slot2Title: 'Weekly Portfolio Backup', slot2Tag: 'Cloud Sync' },
      { name: 'Sun', num: 20, slot1Time: '05:00-05:30 PM', slot1Title: 'Weekly Plan Prep', slot1Tag: 'Personal', slot2Time: '06:00-06:30 PM', slot2Title: 'Archive Completed Notes', slot2Tag: 'Organization' }
    ],
    kanbanCards: [
      { id: 101, title: 'Design a packaging concept for a new product', tag: 'Motion design', status: 'inprogress', priority: 'High', assignee: 'Rachel Lee' },
      { id: 102, title: 'Landing page hero & SVG illustrations', tag: 'UX/UI design', status: 'review', priority: 'High', assignee: 'James' },
      { id: 103, title: 'Conduct Q2 competitor research analysis', tag: 'Marketing', status: 'done', priority: 'Medium', assignee: 'Ken Smith' },
      { id: 104, title: 'Typography scale & dark mode tokens', tag: 'UX/UI design', status: 'todo', priority: 'Medium', assignee: 'Rachel Lee' },
      { id: 105, title: 'Board meeting slide deck preparation', tag: 'Marketing', status: 'inprogress', priority: 'High', assignee: 'John Smith' }
    ],
    integrations: [
      { name: 'Figma', desc: 'Sync artboards & packaging design comments directly into Notes.', icon: 'ph-figma-logo', color: '#6558f5', connected: true },
      { name: 'Slack', desc: 'Send instant notifications & reminders to #product-design.', icon: 'ph-slack-logo', color: '#e0536c', connected: true },
      { name: 'Google Calendar', desc: 'Two-way sync with schedule & room bookings.', icon: 'ph-calendar-check', color: '#68cfa3', connected: true },
      { name: 'Notion', desc: 'Import legacy markdown workspaces and structured databases.', icon: 'ph-notebook', color: '#181b2c', connected: true },
      { name: 'GitHub', desc: 'Link pull requests and engineering issues to workflow boards.', icon: 'ph-github-logo', color: '#6558f5', connected: true },
      { name: 'Dropbox Cloud', desc: 'Automated hourly backup for exports and PDF assets.', icon: 'ph-cloud-arrow-up', color: '#3b82f6', connected: false },
      { name: 'Linear', desc: 'Streamline sprint velocity and automated issue tracking.', icon: 'ph-kanban', color: '#8b5cf6', connected: false },
      { name: 'Miro', desc: 'Embed collaborative whiteboards inside your daily notes.', icon: 'ph-chalkboard-simple', color: '#f59e0b', connected: false }
    ],
    studioNotes: [
      { id: 1, title: 'Packaging Concept & Brand Guidelines 2021', category: 'Product Design', updated: '2 mins ago', body: "Key objectives for today's Landing & Packaging meeting:\n\n1. Finalize tactile matte finish for the primary product box.\n2. Align typography hierarchy with our UX/UI Design sprint.\n3. Export Q2 research data for the Board Meeting in Room 159." },
      { id: 2, title: 'Q2 Data Research — Marketing Summary', category: 'Marketing', updated: '1 hour ago', body: "Data Research is now at 90% completion.\n\n• Customer retention increased by 24% after introducing Cloud Note Sync.\n• Ready to export CSV/XLS dataset for executive review." },
      { id: 3, title: 'Board Meeting Agenda — Room 159', category: 'Executive', updated: 'Yesterday', body: "Meeting with John Smith, 4th floor, room 159.\n\nAgenda:\n- Review Premium tier adoption metrics.\n- Approve Q3 hiring for Motion Design & UX/UI." }
    ],
    teamMembers: [
      { name: 'James Anderson', role: 'Workspace Lead & Product Architect', status: 'Online', tasks: '12 Active', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { name: 'Rachel Lee', role: 'Senior Motion & Packaging Designer', status: 'In Flow', tasks: '8 Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Ken Smith', role: 'Product Design Manager', status: 'Online', tasks: '6 Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'John Smith', role: 'Board Director & Strategy', status: 'In Meeting', tasks: '4 Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { name: 'Elena Rostova', role: 'UX/UI Typography Specialist', status: 'Online', tasks: '9 Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
      { name: 'Marcus Vance', role: 'Data Research Analyst', status: 'Online', tasks: '5 Active', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' }
    ],
    notifications: [
      { id: 'n1', kind: 'event', title: 'Upcoming event', subtitle: 'Landing design meeting', duration: 'Time: 120 min', date: 'Sat, 10 May', time: '11 AM - 11:45 AM', read: false },
      { id: 'n2', kind: 'message', title: 'Message', tag: 'Product design', from: 'Ken Smith', preview: 'Hey team, just wanted to check in and see how is the new packaging layout progressing?', read: false },
      { id: 'n3', kind: 'feed', author: 'Ken Smith', topic: 'Product design', when: '12m ago', text: 'Hey team, just wanted to check in and see how is the packaging concept coming along?', color: '#6558f5', read: false },
      { id: 'n4', kind: 'feed', author: 'Rachel Lee', topic: 'Motion design', when: '1h ago', text: 'Uploaded v2 of the new product logo & packaging mockups to Notes Studio.', color: '#68cfa3', read: false },
      { id: 'n5', kind: 'feed', author: 'John Smith', topic: 'Executive Board', when: '3h ago', text: 'Invitation: Board meeting on March 24 at 4:00 PM (4th floor, room 159).', color: '#e0536c', read: false }
    ],
    events: [
      { id: 'e1', color: '#68cfa3', when: 'Sat, 10 May • 11:00 AM', title: 'Landing design meeting', desc: 'Duration: 120 min • Design Systems Team', meta: 'Room: Figma Huddle', action: 'join' },
      { id: 'e2', color: '#6558f5', when: 'Fri, 18 May • 12:00 PM', title: 'Team meeting — UX/UI design', desc: 'Sprint velocity & Typography check-in', meta: 'Lead: Rachel Lee', action: 'notes' },
      { id: 'e3', color: '#e0536c', when: 'March 24 • 04:00 PM', title: 'Board meeting with John Smith', desc: '4th floor, room 159 • Q2 Strategy', meta: 'Status: Pending RSVP', action: 'accept' }
    ],
    inbox: [
      { id: 1, from: 'Ken Smith', self: false, text: 'Hey team, just wanted to check in and see how is the packaging concept and landing page research going?' },
      { id: 2, from: 'James', self: true, text: 'Research is at 90%! Rachel and I are wrapping up the High-priority packaging concept today.' }
    ],
    weeklyHours: [
      { day: 'Mon', hours: 5.4 }, { day: 'Tue', hours: 6.8 }, { day: 'Wed', hours: 4.5 },
      { day: 'Thu', hours: 7.6 }, { day: 'Fri', label: 'Fri 18', hours: 8.5 }, { day: 'Sat', hours: 4.0 }, { day: 'Sun', hours: 2.1 }
    ]
  };
}
