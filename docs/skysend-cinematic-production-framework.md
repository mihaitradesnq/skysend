# SkySend cinematic production framework

## Director's premise

SkySend is not a generic flying-drone brand. Its product promise is a **controlled urban handoff**: a customer chooses a route, SkySend validates the city coverage and meeting points, helps profile the parcel, assigns a compatible delivery configuration, then makes the handoff visible, secure, and trackable.

The film therefore follows one ordinary, time-sensitive parcel across Pitești at blue hour. It is not an ad about a warehouse, a futuristic city, or a fleet of anonymous aircraft. The emotional idea is simple:

> When the street is slow, the route goes above it.

The hero creates the feeling in eight seconds. The How It Works experience earns the feeling by showing how it works, without losing momentum.

### Product truths the film must preserve

- The current active experience is Pitești, not a generic or invented megacity.
- A customer selects pickup and dropoff; SkySend recommends an appropriate meeting point rather than promising a drone at any map pin.
- Parcel intelligence proposes a profile; the customer confirms it before configuration, price, and ETA are set.
- The customer sees the drone before the locker is used. The PIN is entered on the **physical locker**, never on the website.
- The recipient has a limited public tracking view. The client/operator/admin views have different levels of detail.
- This website is a delivery simulation/prototype. Film copy must not invent regulatory approval, live hardware telemetry, weather clearance, or medical guarantees that the product does not make.

## Recommendation after the repository audit

The existing hero already establishes useful visual canon: a night-time Pitești setting, a graphite multicopter, cyan active lighting, a black suspended cargo locker, an operational hub, and wet-street reflections. Keep those assets as the base.

However, the current long scroll sequence begins with the solution and makes the viewer wait to understand the benefit. It also contains a lower-right sparkle/watermark-like motif that should be removed. The new hero should be a self-contained **8-second autoplay film** (not a 9,300-pixel explanation). It starts with the obstacle, shows the vertical alternative immediately, and finishes on the locker—the product's distinctive object. The detailed story belongs below, where the user has chosen to learn.

Do not make a film about every fleet class. One canonical **Medium Standard** configuration carries this journey, matching the currently supplied reference imagery and its default, balanced Pitești role. The website can still explain other configurations in product UI. A changing drone model would break recognition and undermine the sense of one real delivery.

## 1. Visual bible

### Canonical delivery system

| Element | Locked direction |
| --- | --- |
| Drone | The supplied Medium Standard: one graphite/near-black six-rotor delivery drone, rounded central body, compact forward sensor bay, no exposed branding stickers, slim cyan running-light bars on the two forward arms. It is stable and purposeful, never insect-like or weaponized. |
| Cargo locker | One charcoal rectangular secure cargo module with softened 18–22 mm corner radii, a four-point cable bridle converging to the underside winch, flush seam, narrow cyan readiness line, physical 3×4 keypad and small monochrome status display. A restrained white `SkySend` wordmark appears once on the front-left face. |
| Parcel | One small sealed kraft parcel, approximately shoe-box scale, with a single cyan SkySend seal. It is the same parcel in every handoff shot. No medicine labels, food logos, or third-party brands. |
| Hub | A compact Pitești operational hub: dark corrugated facade, warm practical interior, white bay markings, low cyan charging cues. It is clean and attainable—not a sci-fi hangar. |
| People | Two different adults: sender at pickup and recipient at delivery. Film hands, silhouettes, and natural gestures more than faces. They are participants, not models posing beside a drone. |

### Material, colour, and light

- **Base palette:** SkySend near-black `#05070A`, graphite, soft steel `#8EA3B3`, warm practical lamps, and only SkySend cyan `#20E7D5` for active system state.
- **Success state:** the existing green `#48D6A0` is reserved for a small delivered confirmation only. Do not turn the environment green.
- **Material truth:** satin powder-coated metal, carbon-fibre arms, brushed steel cable fittings, smoked polycarbonate sensor glass, damp asphalt, concrete, residential stucco, and warm windows. Avoid chrome, gloss plastic, holograms, neon grids, or blue laser scans.
- **Time and weather lock:** one overcast blue-hour evening immediately after rain. Pavement is damp and reflective; the rain has stopped; wind is visually gentle. The same cloud density, wetness, streetlamp warmth, and cyan exposure level continue throughout.
- **Pitești identity:** compact boulevards, apartment blocks, ordinary entrances, trees, and restrained Romanian urban texture. Use no fabricated landmark, street sign, business, or text that needs to be readable.
- **Contrast:** shadows retain detail. Cyan is an accent and a navigation cue, never a wash over the entire image.

### Brand consistency rules

- Use the existing Sora-like display character and Manrope-like UI character; do not introduce a techno typeface.
- `SkySend` is title case, white, and shown on the locker only when a product close-up earns it. Do not scatter logos over drone arms, buildings, packages, or sky.
- No generator signatures, sparkle overlays, lens-dirt graphics, fake app icons, or unapproved third-party logos.
- The physical cyan readiness line and the UI cyan primary action use the same hue. Warm light belongs to the city; cyan belongs to SkySend.

### Camera language

- Camera is a quiet witness, not a hyperactive chase drone. Every move has a physical motivation: follow the route, reveal the mechanism, or transfer attention.
- Use mostly 35–50 mm equivalent for human/product honesty; 65–85 mm for the locker and hands; 24–28 mm only for the hub and one city-scale reveal.
- Keep horizons level, verticals straight, and stabilization premium. No fisheye, barrel distortion, dutch angles, snap zooms, or impossible camera passes through rotor blades/cables.
- Flight shots use a stabilized, forward-looking pursuit camera. The one FPV-style move is a clean, short route transition—not an extreme rollercoaster.
- Hold for 8–12 frames before the main action in each scene and land on a still, legible final frame. That stillness is what makes the clips feel intentionally connected.

### Technical master

- Master: 16:9, 4K, 24 fps, 180° shutter appearance; grade in a single show LUT.
- Deliver web derivatives at 1440×810 to align with the existing hero frame ratio, plus separately reframed 9:16 mobile variants. Do not crop one master blindly: keep the drone, locker, and UI-safe area composed for each format.
- The hero gets a silent readable first frame/poster, muted autoplay, loop-safe end frame, a reduced-motion still, captions/transcript where sound is used, and the existing performance fallback behavior.

## 2. Story bible

### The emotional arc

| Act | Feeling | Story action |
| --- | --- | --- |
| Friction | “This small thing should not have to wait.” | A parcel is ready while the street below is slow and congested. |
| Relief | “There is a clearer route.” | The customer commits; SkySend validates the handoff and assigns the delivery. |
| Confidence | “This is considered, not magic.” | The hub prepares one drone; the sender sees it arrive and the physical locker responds to a PIN. |
| Wonder | “It comes down to me.” | The locker descends from a stable hover. This is the principal wow moment. |
| Trust | “It is secure all the way through.” | The parcel is sealed, tracked, flown across the city, and released only to the recipient. |
| Calm completion | “Done, with proof.” | The recipient has the parcel; the empty locker rises and the city returns to quiet. |

### Hero story: 8 seconds

The hero does not explain AI, payment, maps, every drone, or all handoff rules. It communicates only urgency, escape from street friction, speed, and the physical promise.

| Time | Image / action | Intended feeling |
| --- | --- | --- |
| 0.0–1.2 s | Tight, calm view of the sealed parcel beside a phone at a wet curb; blurred headlights crawl behind it. | Friction without melodrama. |
| 1.2–2.1 s | On the phone, a restrained cyan route lifts upward from the street map; cut on the line becoming the hub runway light. | A route above the blockage. |
| 2.1–3.8 s | The same drone rises from the hub into frame, cyan bars waking once. | Capability. |
| 3.8–6.0 s | Stable pursuit as it crosses above the boulevard—fast relative to traffic, never reckless. | Release and speed. |
| 6.0–8.0 s | Frontal arrival; locker starts its controlled descent toward camera and fills the lower frame. Hold on the illuminated keypad/readiness line. | Premium, secure anticipation. |

The end frame deliberately does **not** show an open locker or a full delivery. It creates a single question—“how does that work?”—answered by the next major experience.

### How It Works story

This is a scroll-led, 19-scene film of roughly 58 seconds in total, presented as short chapters, not a forced linear video player. It starts one beat earlier than the hero: intent. It ends one beat later: the proof of completion. The continuous axis is hub → pickup → dropoff, left-to-right/eastward on screen.

The principal wow is scene 12, **the first controlled locker descent**. Scene 17 repeats the mechanism from the recipient's point of view; repetition becomes trust, not spectacle. The final image is the empty locker ascending into the blue-hour sky, which gives the hero a natural loop-back option without falsely claiming a completed return-to-hub mission.

## 3. Shot list — How It Works

| # | Scene / purpose | Duration | Camera movement | Emotional objective | Final-frame handoff |
| ---: | --- | ---: | --- | --- |
| 1 | **Route intent.** Sender opens Create delivery beside the same sealed parcel. | 2.6 s | 50 mm slow push to phone and parcel. | Agency, not friction. | Phone map fills frame; pickup pin sits centre. |
| 2 | **Set pickup and dropoff.** Two route points resolve inside Pitești coverage. | 2.8 s | Top-down phone/desk move, then slight parallax. | Clarity. | Cyan route line exits map toward upper right. |
| 3 | **Choose the meeting point.** Recommended curbside/entrance point is selected; alternatives remain quiet. | 3.0 s | Phone close-up, 65 mm; one decisive tap. | Safety is designed in. | Cyan selection ring expands until it becomes a parcel-seal circle. |
| 4 | **Parcel intelligence.** The sender describes the parcel; a compact estimate card resolves. | 3.0 s | Match from seal to parcel on counter; controlled side slide. | The system understands the job. | Estimate card ends on a verified weight/dimensions line. |
| 5 | **Configuration.** Compatible Medium Standard card locks in, with ETA and price secondary. | 2.8 s | Clean product-like push across UI card. | Reassurance, not choice overload. | Card's cyan confirmation rule becomes a hub bay line. |
| 6 | **Order confirmed.** A single confirmation appears; the public tracking link is prepared. | 2.5 s | Static product frame; micro glow only. | Commitment. | Confirmation pulse travels along the bay line. |
| 7 | **Mission readies.** Inside the hub, the canonical drone rests in its marked bay; locker attached. | 3.2 s | 28 mm low dolly toward drone. | Competence behind the interface. | Cyan arm bars wake from back to front. |
| 8 | **Preflight.** Tight macro sequence of latch, cable apex, sensor, and ready light. | 2.8 s | 85 mm lateral product slide; no rapid montage. | Precision. | Ready light flares to a real cyan take-off reflection. |
| 9 | **Launch.** The drone lifts cleanly out of the hub threshold. | 3.0 s | Gimbal rises with it, then lets it climb out top-right. | Lift and release. | Drone exits top-right; cyan reflection trails across wet ground. |
| 10 | **Above the street.** It traverses the boulevard toward pickup while cars below crawl. | 3.4 s | Stabilized pursuit, 35 mm, left-to-right. | The speed advantage becomes visible. | Drone brakes gently; its underside fills frame. |
| 11 | **Visible at pickup.** Sender looks up at a safe meeting point and confirms visibility on phone. | 2.8 s | Over-shoulder to horizon, then rack focus to drone. | Mutual readiness. | Sender's raised gaze matches the drone holding centered above. |
| 12 | **First descent — the wow.** The drone holds perfectly; the locker lowers on its cable into a cyan puddle reflection. | 4.0 s | 35 mm slow vertical tilt down, maintaining drone/locker centreline. | Wonder anchored in control. | Locker lands at natural hand height; keypad faces camera. |
| 13 | **Physical PIN.** Sender enters the PIN on the locker keypad; display changes from READY to an abstract unlocked indicator. | 3.0 s | 85 mm hand/product close-up. | Security is tangible. | Locker seam opens toward camera on the final frame. |
| 14 | **Load and secure.** Parcel enters; door closes; cable takes tension and locker rises. | 3.5 s | 50 mm, calm side profile, then tilt up. | Confidence earned. | Cyan seal on parcel becomes a cyan route line in the sky. |
| 15 | **Cross-city flight.** One elegant forward route move over the city toward delivery. | 3.4 s | The sole restrained FPV-style move, stabilized and level. | Momentum. | Route line resolves into the recipient's tracking-map position. |
| 16 | **Recipient is ready.** Recipient sees a public tracking view and steps to the verified entrance point. | 2.8 s | 50 mm shoulder-height glide from phone to face-up posture. | Anticipation with privacy respected. | Their gaze tilts up; drone light appears at frame edge. |
| 17 | **Arrival and descent.** Wider front view: drone settles into hover; locker descends at the recipient entrance. | 3.8 s | Locked symmetrical 35 mm, a minimal push in. | The promise arrives. | Locker stops at identical hand height and keypad orientation from scene 12. |
| 18 | **Collect.** PIN, open seam, parcel picked up; cyan seal visible for one beat. | 3.4 s | 65 mm close-up that widens just enough to include the recipient. | Relief, possession, human warmth. | Empty locker door closes; clean cyan line travels upward. |
| 19 | **Proof and release.** Empty locker ascends, drone departs toward sky; a small Delivered state settles over the city. | 3.2 s | Vertical tilt from recipient to sky, ending on city/horizon. | Calm completion. | Cyan point resolves to the same upper-sky position that can loop to the hero's launch line. |

### Hero-to-experience placement

- Hero CTA: `Creează livrare` is the action; `Vezi cum funcționează` scrolls/jumps to the cinematic chapter experience.
- The How It Works page or home section should use scene cards with one short looping clip per active scroll range. Do not put 19 autoplaying videos on the page at once.
- Each scene is a semantic section with a static poster and descriptive copy so the experience remains understandable with video disabled or reduced motion enabled.

## 4. Transition and continuity rules

### The one-delivery ledger

Every generation/edit must inherit this ledger before a shot is created:

- **Order:** one anonymous standard parcel; do not change its dimensions, seal, tape, damage, or orientation.
- **Drone:** same Medium Standard body, six rotors, graphite finish, cyan bars, forward sensor bay, cable attachment, and flight state. No model swaps and no extra drones in flight.
- **Locker:** same width/height ratio, four cable bridle, white wordmark position, keypad on camera-facing right panel, display above keypad, one cyan readiness line. At each handoff it descends to the same natural waist/hand height.
- **Geography:** hub is screen-west/southwest; pickup is central; dropoff is east/northeast. A flight moves left-to-right/forward unless it is ascending or descending.
- **Environment:** one blue-hour, post-rain evening; wet asphalt; no falling rain; same streetlamp temperature and cloud cover; no time jump from night to day.
- **Human continuity:** sender wears a charcoal jacket; recipient wears a muted stone/grey coat; no readable personal information on either phone.

### Edit grammar

1. Prefer a **match action** over a dissolve: map line → hub line, confirmation rule → runway line, lock seam → locker door, sky route → public tracking map.
2. Let motion leave the frame in the direction the next scene begins. Ascents end high; the next aerial starts high. Descents end low; the next hand shot starts low.
3. Use a 6–12 frame visual settle at the tail of every clip. The next clip begins from that same object, axis, or light source.
4. Never cross-cut to a different route, package, aircraft, or time of day just to make the sequence more dramatic.
5. UI fades out for the final 8 frames of a scene and does not appear for the first 6 frames of the next. This leaves clean edit handles and keeps overlays from fighting the match cut.
6. The only permitted hard cuts are the phone-to-world transformations in scenes 3→4, 5→6, 14→15, and 15→16. Their cyan line/shape match is mandatory.
7. No speed ramps except the subtle hero launch acceleration. Real-time, controlled vertical motion makes the locker more believable than exaggerated fast motion.

## 5. Motion language

### Pace

- **Hero:** one quick acceleration between 2.1 and 6.0 seconds, then decelerate into a luxurious, controlled final two seconds.
- **How It Works:** 2.5–3.5 second scenes; 4 seconds only for the first descent. The pacing moves from deliberate setup to flight momentum, then slows again at each human handoff.
- **Micro-motion:** cyan LEDs breathe once at readiness; UI values resolve once; maps glide rather than animate like gaming radar. Nothing pulses continuously.

### Camera allocation

| Use | Rule |
| --- | --- |
| Product shots | Scenes 5, 7, 8, 13, 14, 18. Locked or very slow dolly; symmetric framing, crisp materials, sound of mechanism/air. |
| Wide cinematic shots | Hero launch/flight, scenes 9, 10, 12, 15, 17, 19. Use scale to relate drone to the ordinary city, not to show a fantasy metropolis. |
| Human shots | Scenes 1–4, 11, 16, 18. Shoulder-height, 50–65 mm, short and respectful; show action rather than staged emotion. |
| FPV | Scene 15 only, plus an optional 0.6-second bridge in the hero. It is forward, level, stabilized, and without fisheye. Never use FPV during loading, PIN entry, or descent. |

### Transitions, zooms, and effects

- No crash zooms, whip pans, digital punch-ins, glitch transitions, animated HUDs, or fake volumetric projections.
- A slow 3–5% optical-style push is enough for UI/product moments. Drone flight gets its velocity from parallax and the traffic below, not from artificial blur.
- Rotor motion may blur naturally; the locker, people, and UI remain readable.
- Sound, if used: restrained low rotor texture, distant wet-road traffic, one tactile keypad confirmation, soft latch, and a quiet resolved tone on Delivered. No cinematic booms, voice-over, or EDM drop.

## 6. UI overlay strategy

### Role of overlays

The imagery is physical reality; overlays state only what SkySend knows at that moment. They should look native to the current website: deep translucent near-black surface, 1 px quiet border, 18–22 px radius, Sora heading/Manrope text, cyan only for active state, and soft blur. They are not floating sci-fi HUDs.

### Overlay system

| Level | Visual rule | Use |
| --- | --- | --- |
| Status chip | 32–36 px tall pill; icon + 1–3 words; top-left. | `În pregătire`, `În zbor`, `La ridicare`, `Livrat`. |
| Mission card | Small, 280–340 px max width; title, one supporting line, a thin progress bar; lower-left on desktop, lower third on mobile. | Confirmation, configuration, ETA, recipient public tracking. |
| Physical close-up label | 1-line caption, no card, bottom-left. | `PIN-ul se introduce pe compartiment.` Only in scene 13; do not show the actual code. |

### Copy map

| Scenes | Overlay copy | Constraint |
| --- | --- | --- |
| 1–2 | `Setează traseul` / `Pitești · în zona activă` | Map information stays simple and never exposes a real home address. |
| 3 | `Punct de întâlnire recomandat` | Show “recomandat,” not “safe” or “guaranteed.” |
| 4 | `Profil colet estimat` | Secondary: `Verifică înainte de confirmare`. Avoid claiming the AI has physically measured it. |
| 5 | `Configurație compatibilă` | Secondary can say `Medium Standard · ETA estimat`; do not over-specify a fictitious live allocation. |
| 6–8 | `Comandă confirmată` → `Dronă alocată` → `Pregătire` | One state at a time; clear prior state before the next. |
| 9–10 | `În zbor spre ridicare` | Optional secondary `Urmărire live` only if the film is embedded with its real tracking feature. |
| 11–14 | `La ridicare` → `Compartiment pregătit` → `Colet securizat` | PIN is visually implied; never display digits or invite site entry. |
| 15–17 | `În zbor spre livrare` → `Destinatar notificat` → `La livrare` | Use the public-tracking visual language, with less data than client UI. |
| 18–19 | `Colet ridicat` → `Livrat` | The final green success dot appears only here. |

### Overlay timing and placement

- Keep the first 0.5 seconds of each scene clear. Reveal the chip with a 180–220 ms opacity/4 px rise; do not slide it theatrically.
- Lower third is safe for 16:9. For 9:16, use the upper safe band for status and keep hand/locker interaction unobstructed in the central 60%.
- Hero: use no status card until 1.2 seconds. At most show `Mai sus decât traficul.` for 1.5 seconds and then the standard two CTA buttons outside the video. The logo/navigation already identify the brand.
- On paused, reduced-motion, or poster states, overlay the scene title and one plain-language sentence rather than a frozen operational status.

## Production guardrails before prompt writing

1. Build a locked reference board from the current drone, locker, hub, icon, and the five existing hero anchor frames. Correct/remove the sparkle artefact before it becomes training reference.
2. Generate or shoot a character/object turntable for the drone, locker, parcel, sender, recipient, hub, and both handoff entrances. Approve this continuity pack before any scene work.
3. Establish shot 12 first. If the descent is not physically convincing, the entire film loses its differentiator. Shots 13, 14, 17, and 18 inherit its geometry.
4. Generate adjacent scene pairs with their shared last/first frame visible side by side. Reject clips that cannot make the match cut before polishing isolated beauty shots.
5. Add overlays in web compositing, not inside generated footage. That preserves Romanian copy, accessibility, responsive framing, and the current SkySend UI system.
6. After the visual test, replace the present hero frame sequence deliberately rather than layering a second competing cinematic language over it.

This framework is intentionally prompt-free. Hixfield scene prompts should only be written after the canonical continuity pack and the scene-12 locker descent have been approved.
