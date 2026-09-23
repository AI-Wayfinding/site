// Content transcribed from the design handoff's DCLogic class.
export const prompt = `Help me set up Wayfinding for my team. Read these instructions and follow
them step by step. Before you install anything, create a repository or
share any data, tell me what you will do and wait for my OK.

curl -fsSL https://wayfinding.support/start.md`;

export const voiceSets = [
  { tag: 'Tension', color: '#B23A2A', items: [
    { q: 'I’m not using AI innocently; I’m actively negotiating with myself about its cost.', who: 'Team member, weighing ethical cost' },
    { q: 'Morally, ethically, it goes against everything I personally stand for.', who: 'Team member who still uses AI for bounded day-to-day tasks' },
    { q: 'There’s ethical issues to me that no organization would be able to resolve.', who: 'Team member, on why she won’t go further' }
  ]},
  { tag: 'Boundary', color: '#A55200', items: [
    { q: 'I can say that the weights were lifted and that will be true, but I will get no benefit from lifting those weights.', who: 'Team member, on keeping his own judgment' },
    { q: 'It’s a tool not a [companion]… I just find it splitting and unhealthy.', who: 'Team member, on AI as a conversation partner' },
    { q: 'I would call that a kind of religious objection.', who: 'Team member, on keeping his writing his own' }
  ]},
  { tag: 'Challenge', color: '#7D6200', items: [
    { q: 'More scared about the off-limits stuff than the world of possibility.', who: 'Team member, on what guidance he needs' },
    { q: 'I don’t know how anyone else on my team’s using AI. We haven’t had those conversations.', who: 'Team member, on working in isolation' },
    { q: '…depleting our critical thinking and creativity… scares the crap out of me.', who: 'Team member and daily user' },
    { q: 'I actually don’t know that I have an answer to this question. Maybe let’s come back to it later.', who: 'Team member, asked how she judges value' }
  ]},
  { tag: 'Learning', color: '#2F7A1F', items: [
    { q: 'I will go straight into the interface.', who: 'Team member, on how she picks up something new' },
    { q: 'What about if I try out this CSV file and ask it to do something with it?', who: 'Team member, at eleven at night with the kids asleep' },
    { q: 'A cohort or a salon or something like that. Where people can just discuss.', who: 'Team member, on learning from peers' }
  ]},
  { tag: 'Practice', color: '#1F6FA8', items: [
    { q: 'What gaps can you see in my thinking? I don’t want to tell AI my final product and then AI tells me this is how you should do it.', who: 'Team member, on thinking with AI' },
    { q: 'I get the most out of AI when I put the most into it.', who: 'Communications team member' },
    { q: 'I start with this type of weird questions until I figure out my problem.', who: 'Team member, on getting unstuck' },
    { q: 'There’s no work that isn’t done by one [model] that isn’t reviewed by the other.', who: 'Technical team member' }
  ]},
  { tag: 'Success', color: '#6B3FA0', items: [
    { q: 'Meaningfully transformed but not completely different — still tracking my own work with my own eyes.', who: 'Team member, on where she is now' },
    { q: 'I learn a lot of code, how to read, how to interpret.', who: 'Research team member' },
    { q: 'Seven — I am so here for it.', who: 'Team member, placing herself on a 1–10 scale' }
  ]}
];

export const modes = [
  { n: '1', title: 'Listen', body: 'One-to-one conversations with staff, including people who don’t use AI, then a shared account of what people use, avoid, worry about and want.', form: 'Interviews and sensemaking' },
  { n: '2', title: 'Build together', body: 'Working sessions on a real task, side by side. Show, don’t tell, and explain the method so the skill stays with the person.', form: 'One-to-one build sessions' },
  { n: '3', title: 'Learn from peers', body: 'Colleagues show each other what works on real material. Seeing a teammate do it is what gives people permission to try.', form: 'Peer learning sessions and demos' },
  { n: '4', title: 'Decide and review', body: 'An authorised person chooses a bounded next step, or chooses not to act. Results are reviewed against the evidence, then you stop, adapt or repeat.', form: 'Bounded experiments with a review date' }
];

export const loop = [
  { t: 'Discover', q: 'Where is human potential trapped?' },
  { t: 'Evaluate', q: 'Should we do this? Is it aligned and safe?' },
  { t: 'Execute', q: 'How do we implement and learn?' }
];

export const stages = [
  { n: 'I', t: 'Build Fluency', d: 'Practical capability, confidence and shared positions.' },
  { n: 'II', t: 'Capture Value', d: 'Measurable mission impact in a few high-value areas.' },
  { n: 'III', t: 'Transform', d: 'AI reshapes how the organisation creates impact.' }
];

export const outcomes = ['Refuse', 'Defer, with a reason', 'A non-AI alternative', 'Stay at Build Fluency', 'Reduce use', 'One bounded experiment'];

export const principles = [
  { n: 'i', t: 'Articulate your moral boundaries.' },
  { n: 'ii', t: 'Know what you’re risking.' },
  { n: 'iii', t: 'Distrust on first use, then trust but verify.' },
  { n: 'iv', t: 'Assume you can’t take it back.' },
  { n: 'v', t: 'It is something other.' },
  { n: 'vi', t: 'It wasn’t built for you.' },
  { n: 'vii', t: 'The ground is shifting under you.' }
];
