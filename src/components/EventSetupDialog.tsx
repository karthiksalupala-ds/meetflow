import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { buildEventSample } from '../sample'
import type { EventType } from '../types'

const EVENT_TYPES = [
  ['wedding', 'Wedding', 'Guests, tables, family groups and wedding details'],
  ['hackathon', 'College Hackathon', 'AI-powered team workspace'],
  ['seminar', 'Seminar / Workshop', 'Sessions, seating and presentation'],
  ['corporate_meeting', 'Corporate Meeting', 'Meeting rooms, participants and presentation'],
  ['college_event', 'College / E-Cell Event', 'Activities, teams, mentors and attendees'],
  ['custom', 'Custom Event', 'Describe your own event'],
] as const

export function EventSetupDialog({ onClose }: { onClose: () => void }) {
  const loadSample = useStore((state) => state.loadSample)
  const setEventMetadata = useStore((state) => state.setEventMetadata)
  const [step, setStep] = useState(0)
  const [eventType, setEventType] = useState<EventType>('hackathon')
  const [width, setWidth] = useState(60)
  const [length, setLength] = useState(40)
  const [attendees, setAttendees] = useState(100)
  const [teams, setTeams] = useState(20)
  const [members, setMembers] = useState(5)
  const [priorities, setPriorities] = useState(['presentation', 'entry'])

  const capacity = teams * members
  const isHackathon = eventType === 'hackathon'
  const isWedding = eventType === 'wedding'
  const selectedType = useMemo(() => EVENT_TYPES.find(([value]) => value === eventType) ?? EVENT_TYPES[0], [eventType])

  function generate() {
    loadSample(buildEventSample({ eventType, attendees, teams, members, width, length }))
    setEventMetadata({ title: selectedType[1], description: `${attendees}-participant event plan.` })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-pine-950/75 p-4" role="dialog" aria-modal="true" aria-label="MeetFlow event setup">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-xl border border-gold/35 bg-ivory p-6 text-ink shadow-2xl">
        <p className="smallcaps text-gold-ink">MeetFlow</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Let&apos;s plan your event.</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">Tell MeetFlow what you&apos;re organizing. AI will turn your requirements into an optimized 2D event plan.</p>

        {step === 0 && (
          <section className="mt-6">
            <h2 className="font-serif text-2xl">Choose an event type</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {EVENT_TYPES.map(([value, label, description]) => (
                <button key={value} type="button" onClick={() => setEventType(value)} className={`rounded-lg border p-4 text-left ${eventType === value ? 'border-gold bg-gold/10' : 'border-hairline bg-card'}`}>
                  <span className="font-semibold">{label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{description}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="mt-6">
            <h2 className="font-serif text-2xl">Set the venue dimensions</h2>
            <p className="mt-1 text-sm text-ink-soft">These real-world dimensions feed the Canvas geometry and optimizer.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">Width (ft)<input className="rounded border p-3 font-mono" type="number" min={20} value={width} onChange={(e) => setWidth(Number(e.target.value))} /></label>
              <label className="grid gap-1 text-sm font-semibold">Length (ft)<input className="rounded border p-3 font-mono" type="number" min={15} value={length} onChange={(e) => setLength(Number(e.target.value))} /></label>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6">
            <h2 className="font-serif text-2xl">{isWedding ? 'Define guests and seating capacity' : 'Define participants and capacity'}</h2>
            <div className={`mt-5 grid gap-4 ${isHackathon ? 'sm:grid-cols-3' : 'sm:grid-cols-1'}`}>
              <label className="grid gap-1 text-sm font-semibold">{isWedding ? 'Guests' : 'Attendees'}<input className="rounded border p-3 font-mono" type="number" min={1} value={attendees} onChange={(e) => setAttendees(Number(e.target.value))} /></label>
              {isHackathon && <label className="grid gap-1 text-sm font-semibold">Teams<input className="rounded border p-3 font-mono" type="number" min={1} value={teams} onChange={(e) => setTeams(Number(e.target.value))} /></label>}
              {isHackathon && <label className="grid gap-1 text-sm font-semibold">People / team<input className="rounded border p-3 font-mono" type="number" min={1} value={members} onChange={(e) => setMembers(Number(e.target.value))} /></label>}
            </div>
            <p className="mt-4 rounded bg-sage/10 p-3 text-sm font-semibold">{isHackathon ? `Required team capacity: ${teams} × ${members} = ${capacity} seats` : isWedding ? `Capacity: ${attendees} guests across wedding tables` : `Capacity: ${attendees} participants in event seating`}</p>
          </section>
        )}

        {step === 3 && (
          <section className="mt-6">
            <h2 className="font-serif text-2xl">Choose AI planning priorities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['smart', 'Smart Layout', 'AI optimizes the entire event.'],
                ['collaboration', 'Maximum Collaboration', 'Keep teams and mentors accessible.'],
                ['presentation', 'Presentation Focus', 'Prioritize stage visibility and judge placement.'],
                ['entry', 'Smooth Entry', 'Keep registration near the entrance and maintain clear paths.'],
              ].map(([value, label, description]) => {
                const checked = priorities.includes(value)
                return <label key={value} className="flex gap-3 rounded-lg border border-hairline bg-card p-4"><input type="checkbox" checked={checked} onChange={() => setPriorities((current) => checked ? current.filter((item) => item !== value) : [...current, value])} /><span><b>{label}</b><span className="mt-1 block text-sm text-ink-soft">{description}</span></span></label>
              })}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mt-6">
            <h2 className="font-serif text-2xl">MeetFlow event plan</h2>
            <div className="mt-4 rounded-lg border border-hairline bg-card p-5 text-sm">
              <p><b>Event:</b> {selectedType[1]}</p>
              <p><b>Venue:</b> {width} × {length} ft</p>
              <p><b>Attendees:</b> {attendees}</p>
              {isHackathon ? <p><b>Teams:</b> {teams} × {members} members</p> : isWedding ? <p><b>Format:</b> Wedding tables with family constraints</p> : <p><b>Format:</b> Event participant seating</p>}
              <ul className="mt-4 grid gap-1 text-sage">
                {isHackathon ? <><li>✓ {teams} team tables</li><li>✓ 5 mentor zones</li><li>✓ 3 judge areas</li></> : <li>✓ Conference tables sized for {attendees} participants</li>}
                {isWedding ? <li>✓ Wedding tables, dance floor, band, cake and gift options</li> : <li>✓ Presentation stage, registration, food area, entrance and exit</li>}
                {priorities.includes('presentation') && <li>✓ Stage visibility and judges near the stage</li>}
                {priorities.includes('entry') && <li>✓ Registration near the entrance</li>}
              </ul>
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-hairline pt-4">
          <button type="button" className="rounded px-3 py-2 text-sm text-ink-soft" onClick={step === 0 ? onClose : () => setStep((current) => current - 1)}> {step === 0 ? 'Cancel' : 'Back'} </button>
          {step < 4 ? <button type="button" className="rounded bg-pine-800 px-5 py-2.5 text-sm font-semibold text-linen" onClick={() => setStep((current) => current + 1)}>Continue</button> : <button type="button" className="rounded bg-pine-800 px-5 py-2.5 text-sm font-semibold text-linen" onClick={generate}>Generate AI event plan</button>}
        </div>
      </div>
    </div>
  )
}
