import type { User } from '../types/user';

export const mockUser: User = {
  id: 'usr_01',
  name: 'Aarav Sharma',
  email: 'aarav@landed.ai',
  role: 'Job seeker'
};

export const activityItems = [
  { id: 'a1', label: 'Applied to Google', timestamp: 'Today, 9:15 AM' },
  { id: 'a2', label: 'Completed Amazon OA', timestamp: 'Yesterday, 6:00 PM' },
  { id: 'a3', label: 'Interview scheduled with Razorpay', timestamp: 'Mon, 11:30 AM' },
  { id: 'a4', label: 'Uploaded Resume v5', timestamp: 'Jun 10, 5:00 PM' }
];

export const interviewNotes = [
  {
    company: 'Google',
    notes: [
      { round: 'Round 1', text: 'Graph questions, BFS variations, and follow-up on complexity.' },
      { round: 'Round 2', text: 'System design for collaborative documents and offline sync.' }
    ]
  },
  {
    company: 'Razorpay',
    notes: [
      { round: 'Round 1', text: 'Payments domain modeling, idempotency, and reconciliation.' },
      { round: 'Round 2', text: 'Frontend architecture, dashboard performance, and API ergonomics.' }
    ]
  }
];
