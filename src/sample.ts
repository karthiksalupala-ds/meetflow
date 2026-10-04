import type { Constraint, EventType, Guest, Resource, RSVP, Table } from './types'
import { freshVenue, ROOM_ORIGIN, ft } from './geometry'

function g(
  id: string,
  name: string,
  group: string,
  extra: { dietary?: string[]; rsvp?: RSVP; notes?: string } = {},
): Guest {
  return {
    id,
    name,
    group,
    dietary: extra.dietary ?? [],
    rsvp: extra.rsvp ?? 'yes',
    notes: extra.notes,
  }
}

const BRIDE = "Bride's family"
const GROOM = "Groom's family"
const PARTY = 'Bridal party'
const COLLEGE = 'College friends'
const WORK = 'Work friends'
const CHILDHOOD = 'Childhood friends'
const NEIGHBORS = 'Neighbors'
const KIDS = 'Kids'

export const SAMPLE_GUESTS: Guest[] = [
  // Bride's family — the Rossis
  g('g-rosa', 'Grandma Rosa Rossi', BRIDE, { notes: 'Cannot abide loud speakers' }),
  g('g-ezio', 'Grandpa Ezio Rossi', BRIDE),
  g('g-marta', 'Aunt Marta Rossi', BRIDE, { notes: 'Recently divorced from Dario' }),
  g('g-dario', 'Uncle Dario Rossi', BRIDE, { notes: 'Recently divorced from Marta' }),
  g('g-bianca', 'Aunt Bianca Rossi', BRIDE, { notes: 'Looks after Grandma Rosa' }),
  g('g-franco', 'Uncle Franco Rossi', BRIDE),
  g('g-lucia', 'Cousin Lucia Rossi', BRIDE),
  g('g-matteo', 'Cousin Matteo Rossi', BRIDE),
  g('g-elena', 'Cousin Elena Rossi', BRIDE),
  g('g-sofia', 'Sofia Rossi', BRIDE, { notes: 'Mother of the bride' }),
  g('g-marco', 'Marco Rossi', BRIDE, { notes: 'Father of the bride' }),
  g('g-paolo', 'Cousin Paolo Rossi', BRIDE, { rsvp: 'no' }),
  // Groom's family — the Okafors
  g('g-adaeze', 'Grandma Adaeze Okafor', GROOM),
  g('g-ngozi', 'Ngozi Okafor', GROOM, { notes: 'Mother of the groom' }),
  g('g-chidi', 'Chidi Okafor', GROOM, { notes: 'Father of the groom' }),
  g('g-amara', 'Aunt Amara Okafor', GROOM),
  g('g-emeka', 'Uncle Emeka Okafor', GROOM),
  g('g-ifeoma', 'Aunt Ifeoma Okafor', GROOM, { dietary: ['vegetarian'] }),
  g('g-obi', 'Uncle Obi Okafor', GROOM),
  g('g-zik', 'Cousin Zik Okafor', GROOM),
  g('g-chiamaka', 'Cousin Chiamaka Okafor', GROOM),
  g('g-nnamdi', 'Cousin Nnamdi Okafor', GROOM),
  g('g-ike', 'Uncle Ike Okafor', GROOM, { notes: 'Will request the microphone' }),
  g('g-ada', 'Cousin Ada Okafor', GROOM),
  // Bridal party
  g('g-maya', 'Maya Chen', PARTY, { notes: 'Maid of honor; with Chris' }),
  g('g-chris', 'Chris Park', PARTY, { notes: "Maya's partner" }),
  g('g-tunde', 'Tunde Bakare', PARTY, { notes: 'First on the dance floor' }),
  g('g-priya', 'Priya Sharma', PARTY, { dietary: ['vegetarian'] }),
  g('g-jordan', 'Jordan Banks', PARTY, { notes: 'Ex of Sam Whitfield' }),
  g('g-lena', 'Lena Kowalski', PARTY, { dietary: ['gluten-free'] }),
  g('g-dev', 'Dev Patel', PARTY),
  g('g-rosie', 'Rosie Alvarez', PARTY),
  // College friends
  g('g-sam', 'Sam Whitfield', COLLEGE, { notes: 'Ex of Jordan Banks' }),
  g('g-nick', 'Nick Papadopoulos', COLLEGE),
  g('g-harper', 'Harper Lane', COLLEGE, { dietary: ['vegan'] }),
  g('g-gabe', 'Gabe Ortiz', COLLEGE),
  g('g-yuki', 'Yuki Tanaka', COLLEGE, { dietary: ['vegetarian'] }),
  g('g-fran', 'Fran Delgado', COLLEGE),
  g('g-omar', 'Omar Haddad', COLLEGE, { dietary: ['halal'] }),
  g('g-jess', 'Jess Nguyen', COLLEGE, { notes: "Toby's partner, Poppy's mom" }),
  g('g-toby', 'Toby Reed', COLLEGE, { notes: "Jess's partner" }),
  g('g-kofi', 'Kofi Mensah', COLLEGE),
  g('g-isla', 'Isla MacLeod', COLLEGE, { rsvp: 'pending' }),
  g('g-bea', 'Bea Romano', COLLEGE),
  // Work friends
  g('g-diane', 'Diane Foster', WORK, { dietary: ['shellfish allergy'], notes: 'The boss — seat wisely' }),
  g('g-raj', 'Raj Iyer', WORK, { dietary: ['gluten-free'] }),
  g('g-carmen', 'Carmen Silva', WORK, { notes: "Milo's mom" }),
  g('g-pete', 'Pete Sorensen', WORK),
  g('g-annika', 'Annika Berg', WORK, { rsvp: 'no' }),
  g('g-leo', 'Leo Martins', WORK),
  g('g-grace', 'Grace Liu', WORK),
  g('g-hank', 'Hank Dawson', WORK, { rsvp: 'pending' }),
  // Childhood friends
  g('g-charlie', 'Charlie Dunn', CHILDHOOD, { notes: "Teddy's dad" }),
  g('g-effie', 'Effie Brooks', CHILDHOOD),
  g('g-miles', 'Miles Turner', CHILDHOOD),
  g('g-nora', 'Nora Flynn', CHILDHOOD),
  g('g-gus', 'Gus Weaver', CHILDHOOD),
  g('g-tilly', 'Tilly Marsh', CHILDHOOD),
  g('g-ray', 'Ray Suzuki', CHILDHOOD),
  g('g-wren', 'Wren Bailey', CHILDHOOD),
  // Neighbors
  g('g-rich', 'Rich Henderson', NEIGHBORS, { notes: 'Fence dispute with the Novaks' }),
  g('g-joan', 'Joan Henderson', NEIGHBORS),
  g('g-petra', 'Petra Novak', NEIGHBORS, { notes: 'Fence dispute with the Hendersons' }),
  g('g-karel', 'Karel Novak', NEIGHBORS),
  g('g-dot', 'Dot Pemberton', NEIGHBORS, { notes: 'Likes to see everyone arrive' }),
  g('g-stan', 'Stan Pemberton', NEIGHBORS),
  g('g-june', 'June Ellery', NEIGHBORS, { dietary: ['vegetarian'] }),
  g('g-walt', 'Walt Ellery', NEIGHBORS, { rsvp: 'pending' }),
  // Kids
  g('g-poppy', 'Poppy Nguyen-Reed', KIDS, { dietary: ['nut allergy'], notes: 'Jess & Toby’s daughter' }),
  g('g-milo', 'Milo Silva', KIDS, { notes: "Carmen's son" }),
  g('g-zara', 'Zara Okafor', KIDS, { notes: "Travels with Aunt Amara" }),
  g('g-teddy', 'Teddy Dunn', KIDS, { notes: "Charlie's son" }),
]

/** Table centers are given in feet from the room's top-left corner, the same
 *  way the venue's amenities are — this layout is a real floor plan for the
 *  default room, with the dance floor and band down its right-hand side. */
function t(id: string, name: string, shape: Table['shape'], seats: number, xFt: number, yFt: number): Table {
  return { id, name, shape, seats, x: ROOM_ORIGIN.x + ft(xFt), y: ROOM_ORIGIN.y + ft(yFt), rotation: 0 }
}

const SAMPLE_TABLES: Table[] = [
  t('t1', 'Table 1', 'round', 8, 7, 12),
  t('t2', 'Table 2', 'round', 8, 17.5, 12),
  t('t3', 'Table 3', 'round', 8, 28, 12),
  t('t4', 'Table 4', 'round', 8, 38.5, 12),
  t('t5', 'Table 5', 'round', 8, 7, 23),
  t('t6', 'Table 6', 'round', 8, 17.5, 23),
  t('t7', 'Table 7', 'round', 8, 28, 23),
  t('t8', 'Table 8', 'round', 8, 38.5, 23),
  t('t9', 'Table 9', 'rect', 10, 20, 38),
  t('t10', 'Table 10', 'rect', 10, 40, 38),
]

export const SAMPLE_CONSTRAINTS: Constraint[] = [
  { id: 'c1', type: 'apart', a: 'g-marta', b: 'g-dario', note: 'Recently divorced' },
  { id: 'c2', type: 'apart', a: 'g-jordan', b: 'g-sam', note: 'Exes — it did not end well' },
  { id: 'c3', type: 'apart', a: 'g-rich', b: 'g-petra', note: 'The fence dispute' },
  { id: 'c4', type: 'together', a: 'g-rosa', b: 'g-bianca', note: 'Bianca looks after her' },
  { id: 'c5', type: 'together', a: 'g-maya', b: 'g-chris', note: 'Couple' },
  { id: 'c6', type: 'together', a: 'g-jess', b: 'g-toby', note: 'Couple' },
  { id: 'c7', type: 'together', a: 'g-jess', b: 'g-poppy', note: 'Kid with parent' },
  { id: 'c8', type: 'together', a: 'g-carmen', b: 'g-milo', note: 'Kid with parent' },
  { id: 'c9', type: 'together', a: 'g-charlie', b: 'g-teddy', note: 'Kid with parent' },
  { id: 'c10', type: 'together', a: 'g-amara', b: 'g-zara', note: 'Zara travels with Amara' },
  { id: 'c11', type: 'zone', guestId: 'g-rosa', zone: 'band', preference: 'far', note: 'Hates loud speakers' },
  { id: 'c12', type: 'zone', guestId: 'g-ezio', zone: 'band', preference: 'far', note: 'Keeps Rosa company' },
  { id: 'c13', type: 'zone', guestId: 'g-priya', zone: 'dance_floor', preference: 'near' },
  { id: 'c14', type: 'zone', guestId: 'g-tunde', zone: 'dance_floor', preference: 'near' },
  { id: 'c15', type: 'zone', guestId: 'g-jordan', zone: 'dance_floor', preference: 'near' },
  { id: 'c16', type: 'zone', guestId: 'g-dot', zone: 'entrance', preference: 'near', note: 'Likes to see everyone arrive' },
  { id: 'c17', type: 'zone', guestId: 'g-diane', zone: 'dance_floor', preference: 'far', note: 'Prefers conversation' },
]

export const SAMPLE = {
  event: {
    title: 'Wedding Celebration',
    date: '',
    venue: '',
    eventType: 'wedding' as const,
  },
  guests: SAMPLE_GUESTS,
  tables: SAMPLE_TABLES,
  constraints: SAMPLE_CONSTRAINTS,
}

const HACKATHON_GROUPS = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon']

const HACKATHON_GUESTS: Guest[] = Array.from({ length: 100 }, (_, index) => ({
  id: `h-${String(index + 1).padStart(3, '0')}`,
  name: `Attendee ${String(index + 1).padStart(3, '0')}`,
  group: HACKATHON_GROUPS[index % HACKATHON_GROUPS.length],
  dietary: [],
  rsvp: 'yes' as RSVP,
}))

const HACKATHON_TABLES: Table[] = Array.from({ length: 20 }, (_, index) => ({
  id: `team-${index + 1}`,
  name: `Team table ${index + 1}`,
  shape: 'rect' as const,
  seats: 5,
  x: ROOM_ORIGIN.x + ft(7 + (index % 5) * 11),
  y: ROOM_ORIGIN.y + ft(13 + Math.floor(index / 5) * 6),
  rotation: 0,
  resourceType: 'team_table' as const,
}))

const HACKATHON_VENUE = freshVenue()
for (const feature of Object.values(HACKATHON_VENUE)) feature.enabled = false
for (const id of ['entrance', 'exit', 'registration', 'food_area', 'presentation_stage'] as const) {
  HACKATHON_VENUE[id].enabled = true
}
HACKATHON_VENUE.entrance.x = ROOM_ORIGIN.x + ft(2)
HACKATHON_VENUE.entrance.y = ROOM_ORIGIN.y + ft(35)
HACKATHON_VENUE.registration.x = ROOM_ORIGIN.x + ft(12)
HACKATHON_VENUE.registration.y = ROOM_ORIGIN.y + ft(35)
HACKATHON_VENUE.food_area.x = ROOM_ORIGIN.x + ft(2)
HACKATHON_VENUE.food_area.y = ROOM_ORIGIN.y + ft(2)
HACKATHON_VENUE.presentation_stage.x = ROOM_ORIGIN.x + ft(19)
HACKATHON_VENUE.presentation_stage.y = ROOM_ORIGIN.y + ft(2)
HACKATHON_VENUE.exit.x = ROOM_ORIGIN.x + ft(50)
HACKATHON_VENUE.exit.y = ROOM_ORIGIN.y + ft(35)

function eventResource(
  id: string,
  name: string,
  type: Resource['type'],
  xFt: number,
  yFt: number,
  wFt: number,
  hFt: number,
): Resource {
  return { id, name, type, x: ROOM_ORIGIN.x + ft(xFt), y: ROOM_ORIGIN.y + ft(yFt), w: ft(wFt), h: ft(hFt), rotation: 0, locked: false }
}

/** Deterministic event-planning fixture: 100 attendees and the approved MVP resources. */
export const HACKATHON_SAMPLE = {
  event: {
    title: 'College Hackathon',
    date: 'Saturday, October 10, 2026',
    venue: 'Innovation Hall',
    description: 'A 100-attendee hackathon layout.',
    eventType: 'hackathon' as const,
  },
  guests: HACKATHON_GUESTS,
  tables: HACKATHON_TABLES,
  constraints: [] as Constraint[],
  resources: Object.fromEntries([
  ...Array.from({ length: 5 }, (_, i): [string, Resource] => {
    return [`mentor-zone-${i + 1}`, eventResource(`mentor-zone-${i + 1}`, `Mentor zone ${i + 1}`, 'mentor_zone', 2 + i * 12, 36, 8, 3)]
  }),
  ...Array.from({ length: 3 }, (_, i): [string, Resource] => [
    `judge-table-${i + 1}`,
    eventResource(`judge-table-${i + 1}`, `Judge table ${i + 1}`, 'judge_table', 22 + i * 13, 9, 10, 4),
  ]),
  ['registration', eventResource('registration', 'Registration', 'registration', 12, 35, 8, 4)],
  ['food_area', eventResource('food_area', 'Food area', 'food_area', 2, 2, 16, 4)],
  ['presentation_stage', eventResource('presentation_stage', 'Presentation stage', 'presentation_stage', 19, 2, 22, 6)],
  ['entrance', eventResource('entrance', 'Entrance', 'entrance', 2, 35, 8, 4)],
  ['exit', eventResource('exit', 'Exit', 'exit', 50, 35, 8, 4)],
  ]),
  venue: HACKATHON_VENUE,
  venueDimensions: { widthFt: 60, lengthFt: 40, snapFt: 1 },
}

export function buildEventSample(config: {
  eventType: EventType | string
  attendees: number
  teams: number
  members: number
  width: number
  length: number
}) {
  if (config.eventType === 'wedding') {
    return {
      ...SAMPLE,
      venue: freshVenue(),
      venueDimensions: { widthFt: config.width, lengthFt: config.length, snapFt: 1 },
    }
  }
  if (config.eventType === 'hackathon') {
    return {
      ...HACKATHON_SAMPLE,
      event: {
        ...HACKATHON_SAMPLE.event,
        description: `${config.attendees}-participant hackathon with ${config.teams} teams of ${config.members}.`,
      },
      venueDimensions: { widthFt: config.width, lengthFt: config.length, snapFt: 1 },
    }
  }

  const tableCount = Math.max(1, Math.ceil(config.attendees / 8))
  const guests = Array.from({ length: config.attendees }, (_, index): Guest => ({
    id: `event-${index + 1}`,
    name: `Participant ${String(index + 1).padStart(3, '0')}`,
    group: 'Participants',
    dietary: [],
    rsvp: 'yes',
  }))
  const tables = Array.from({ length: tableCount }, (_, index): Table => ({
    id: `conference-${index + 1}`,
    name: `Conference table ${index + 1}`,
    shape: 'round',
    seats: 8,
    // Round tables give an eight-person meeting layout enough aisle space to
    // fit within the default venue without colliding with perimeter areas.
    x: ROOM_ORIGIN.x + ft(8 + (index % 5) * 11),
    y: ROOM_ORIGIN.y + ft(13 + Math.floor(index / 5) * 9),
    rotation: 0,
    resourceType: 'team_table',
  }))
  const baseResourceTypes = ['registration', 'food_area', 'presentation_stage', 'entrance', 'exit']
  const extraResourceTypes = config.eventType === 'seminar'
    ? ['mentor_zone']
    : config.eventType === 'college_event' || config.eventType === 'club'
      ? ['mentor_zone', 'judge_table']
      : []
  const resourceTypes = [...baseResourceTypes, ...extraResourceTypes]
  const resources = Object.fromEntries(
    resourceTypes.map((type, index) => {
      const positions: Record<string, [number, number, number, number]> = {
        registration: [10, 37, 10, 2],
        food_area: [3, 2, 16, 4],
        presentation_stage: [21, 2, 22, 6],
        entrance: [2, 37, 6, 2],
        exit: [52, 37, 6, 2],
        mentor_zone: [3, 28, 14, 5],
        judge_table: [44, 12, 10, 4],
      }
      const [x, y, w, h] = positions[type] ?? [3 + index * 4, 28, 12, 4]
      return [type, eventResource(type, type.replace(/_/g, ' '), type as Resource['type'], x, y, w, h)]
    }),
  )
  const venue = freshVenue()
  for (const feature of Object.values(venue)) feature.enabled = false
  for (const id of ['entrance', 'exit', 'registration', 'food_area', 'presentation_stage'] as const) {
    venue[id].enabled = true
    const resource = resources[id]
    venue[id].x = resource.x
    venue[id].y = resource.y
  }
  return {
    event: {
      title: EVENT_TYPE_LABELS[config.eventType] ?? 'Event',
      date: '',
      venue: 'Event venue',
      description: `${config.attendees}-participant event.`,
      eventType: (config.eventType === 'meeting' ? 'corporate_meeting' : config.eventType === 'club' ? 'college_event' : config.eventType) as EventType,
    },
    guests,
    tables,
    constraints: [] as Constraint[],
    resources,
    venue,
    venueDimensions: { widthFt: config.width, lengthFt: config.length, snapFt: 1 },
  }
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  seminar: 'Seminar / Workshop',
  corporate_meeting: 'Corporate Meeting',
  meeting: 'Corporate Meeting',
  college_event: 'College / E-Cell Event',
  club: 'College / E-Cell Event',
  custom: 'Custom Event',
}
