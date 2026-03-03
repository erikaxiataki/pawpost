// Caption templates organized by category
// Each caption includes: text, hashtags, imageIdea, videoIdea, engagementHook, photo, platforms
export const captionTemplates = {
  groomer: [
    { text: "This sweet baby came in looking like a cotton ball that rolled through a hedge backwards. Two hours later? A SUPERMODEL walked out. Swipe to see the glow-up that had their owner literally tearing up in our lobby. This is why we wake up at 6am every morning — for moments like THESE.", hashtags: "#DogGrooming #BeforeAndAfter #FreshCut #DogSpa #GroomingTransformation #DogGlowUp", imageIdea: "Side-by-side before/after grooming photo with dramatic difference", videoIdea: "Timelapse of the full grooming process from matted to gorgeous — set to a dramatic reveal sound", engagementHook: { type: "share", prompt: "Tag a friend whose dog needs this glow-up!", saveable: true, saveReason: "Save for your next grooming inspo" }, category: "transformation", photo: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=600&fit=crop" },
    { text: "You know that moment when a freshly groomed dog catches their reflection and does a little strut? We live for that energy. Tail up, head high, walking out like they just got cast in a movie. Main character energy ONLY at this salon.", hashtags: "#GroomingSalon #FreshGroom #DogOfTheDay #PamperedPup #DogConfidence #MainCharacterEnergy", imageIdea: "Dog walking confidently after grooming, head up, tail wagging", videoIdea: "POV video of a dog strutting out post-groom in slow motion with a runway music overlay", engagementHook: { type: "comment", prompt: "Drop a 💅 if your dog has main character energy too!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop" },
    { text: "Real talk — grooming isn't just a spa day. Under that fluffy coat, we're checking for skin issues, hot spots, ear infections, and matting that can actually cause pain. Regular grooming every 4-6 weeks keeps your pup healthy from the skin out. It's preventive care disguised as pampering.", hashtags: "#DogCare #GroomingTips #PetHealth #DogGroomer #GroomingEducation #PetWellness", imageIdea: "Carousel: 4 slides showing hidden issues grooming prevents (matting, ear buildup, nail overgrowth, skin irritation)", videoIdea: "Talking-head video explaining 3 things groomers check that owners miss — with close-up examples", engagementHook: { type: "save", prompt: "Save this so you remember when to book!", saveable: true, saveReason: "Grooming schedule reminder" }, category: "educational", photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop" },
    { text: "Our calendar for this month is filling up FAST and we don't want your baby walking around looking like a dust mop. Pro tip: book your next appointment at checkout so you always have a spot locked in. Your pup (and their coat) will thank you.", hashtags: "#BookNow #DogGrooming #LocalBusiness #PetGroomer #GroomingAppointment #DogSalonLife", imageIdea: "Clean booking calendar graphic with a cute groomed dog overlay", videoIdea: "Quick video tour of your grooming station getting set up for the day — 'your pup's spot is waiting'", engagementHook: { type: "share", prompt: "Share this with a pet parent who keeps forgetting to book!", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop" },
    { text: "Today a client said 'I can't believe that's MY dog' and honestly, that reaction never gets old. We had three people in the lobby asking if we'd done her coat and one person tried to book on the spot. There is nothing more rewarding than seeing a pet parent's face light up at pickup. THIS is why we do what we do.", hashtags: "#DogGroomer #HappyClients #PetLove #SmallBusiness #ClientLove #GroomerLife", imageIdea: "Candid photo of happy owner reacting to freshly groomed dog — genuine joy moment", videoIdea: "Compilation of real pickup reactions from pet parents seeing their groomed dogs — their genuine surprise is priceless", engagementHook: { type: "comment", prompt: "Tell us about your dog's best grooming moment!", saveable: false }, category: "testimonial", photo: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop" },
    { text: "Anxious pup in the salon? We've been there. Here's our approach: low tables for safety, breaks between steps, calming music in the background, and ZERO rushing. Every single dog that comes through our doors gets treated at THEIR pace. Some of our most nervous first-timers are now our most chill regulars.", hashtags: "#GentleGrooming #NervousDogs #DogGroomer #PetCare #FearFreeGrooming #AnxiousDogs", imageIdea: "Groomer at eye level with a small nervous dog, gentle hand placement, calm environment", videoIdea: "Calming video showing a nervous dog's first visit vs their 5th visit — the trust transformation", engagementHook: { type: "save", prompt: "Save this if your pup gets nervous at the groomer — these tips help!", saveable: true, saveReason: "Tips for anxious dogs" }, category: "trust", photo: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop" },
    { text: "FIRST HAIRCUT ALERT! This 12-week-old baby had never seen clippers, a bath tub, or a blow dryer before today. And you know what? They were an absolute champ. Little tail was wagging the whole time. There's something so special about being trusted with a puppy's very first grooming experience. We don't take that lightly.", hashtags: "#PuppyFirstGroom #DogGrooming #PuppyLove #FirstHaircut #PuppyMilestone #NewPuppy", imageIdea: "Adorable puppy sitting on grooming table with a tiny bow, looking at camera", videoIdea: "Vlog-style video of a puppy's entire first grooming experience from arrival to pickup — narrate the steps and their reactions", engagementHook: { type: "comment", prompt: "Comment your puppy's name — we wanna know!", saveable: true, saveReason: "First groom prep checklist" }, category: "milestone", photo: "https://images.unsplash.com/photo-1587463278679-57d7dde498e1?w=600&h=600&fit=crop" },
    { text: "We're not just groomers — we're your dog's personal stylist, spa therapist, and biggest fan all rolled into one. Every dog that leaves our salon goes home smelling like a dream, looking like a magazine cover, and feeling like the absolute best version of themselves. That's our promise, every single visit.", hashtags: "#DogSpa #PremiumGrooming #DogGroomer #PetPampering #DogStylist #GroomingExcellence", imageIdea: "Freshly groomed dog with a cute bandana, professional lighting, beauty-shot style", videoIdea: "Aesthetic montage of your best grooms set to chill music — show the artistry in your work", engagementHook: { type: "share", prompt: "Send this to someone who treats their dog like royalty!", saveable: false }, category: "brand", photo: "https://images.unsplash.com/photo-1518882345390-66ca28e5b9e2?w=600&h=600&fit=crop" },
  ],
  walker: [
    { text: "6:47am. The fog hasn't lifted yet, there's dew on the grass, and this golden retriever is absolutely LIVING for the morning air. These early walks are pure magic — just us, the birds, and a very happy tail. No screens, no stress, just nature and the sound of paws on the trail.", hashtags: "#DogWalker #MorningWalk #DogAdventures #HappyDogs #GoldenHour #DogTrails", imageIdea: "Golden hour trail shot with dog silhouette and misty background", videoIdea: "Cinematic morning walk vlog — sunrise, dogs exploring, peaceful nature sounds mixed with light music", engagementHook: { type: "comment", prompt: "What time does YOUR dog drag you out of bed? Tell us below!", saveable: true, saveReason: "Walk route inspiration" }, category: "lifestyle", photo: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=600&fit=crop" },
    { text: "Here's something most people don't realize: your dog doesn't just need a walk. They need to SNIFF. Sniffing is mental stimulation — it's like reading the newspaper for dogs. A 20-minute 'sniff walk' can tire your pup out more than a 45-minute power walk. Let them explore. Let them process. It's how they understand their world.", hashtags: "#DogWalking #PetCare #DogEnrichment #HealthyDog #SniffWalk #DogScience", imageIdea: "Close-up of dog nose sniffing in grass with overlay text about mental stimulation benefits", videoIdea: "Educational video: 'Why your dog NEEDS to sniff' — show a dog on a sniff walk vs a rushed walk and explain the science", engagementHook: { type: "save", prompt: "Save this — your dog will thank you on the next walk!", saveable: true, saveReason: "Sniff walk science explained" }, category: "educational", photo: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=600&h=600&fit=crop" },
    { text: "It was pouring rain this morning. Like, POURING. And you know what? We still showed up, because that's what we do. Rain boots, waterproof jacket, and three very excited dogs who couldn't care less about the weather. Your pup's routine matters to us just as much as it matters to them. Rain. Shine. Snow. We walk.", hashtags: "#DogWalker #RainOrShine #DedicatedDogWalker #ReliablePetCare #AllWeatherWalks #DogCommitment", imageIdea: "Dog walker with dogs in rain, everyone looks happy despite the weather", videoIdea: "Rainy day walk compilation — show the puddle splashing, happy wet dogs, the dedication it takes. Caption: 'We never cancel.'", engagementHook: { type: "share", prompt: "Know a pet parent who needs a walker like this? Send them our way!", saveable: false }, category: "trust", photo: "https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop" },
    { text: "Today's pack walk crew: one golden who thinks she's the leader, a dachshund with BIG energy, and a rescue mutt who's finally coming out of his shell. Watching these three become friends over the past month has been the highlight of my week. Dog friendships are so pure.", hashtags: "#PackWalk #DogWalker #DogFriends #DogSocialization #DogSquad #PackLife", imageIdea: "Three dogs walking together side by side, tails up, looking happy", videoIdea: "Pack walk montage with intro cards for each dog's name and personality — show their dynamics and friendship moments", engagementHook: { type: "comment", prompt: "Does your dog have a bestie? Drop their name below!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=600&h=600&fit=crop" },
    { text: "Working from home and your dog is staring at you with THOSE eyes? The ones that say 'if you don't take me outside I'm going to eat your favorite shoe'? That's where we come in. Our midday walks give your pup the exercise and enrichment they need while you crush your to-do list. Happy dog. Intact shoes. Win-win.", hashtags: "#DogWalker #WFHLife #MiddayWalks #DogCare #RemoteWork #DogExercise", imageIdea: "Split image: dog staring at laptop owner on left, same dog happily on a walk on right", videoIdea: "Funny skit: dog getting increasingly dramatic at home while owner works, then cut to same dog living their best life on walk", engagementHook: { type: "share", prompt: "Tag a WFH dog parent who NEEDS this service!", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop" },
    { text: "Today's walk stats for Charlie: 1.8 miles walked, 52 minutes of adventure, 63 documented sniffs, 2 squirrel chases (unsuccessful), 4 new dog friends greeted, 1 stick collected and proudly carried for 3 blocks, and 1 very tired pup now napping on his favorite couch. Job well done, Charlie. See you Wednesday.", hashtags: "#DogWalkReport #DogWalker #HappyDog #PetCare #DogStats #WalkUpdate", imageIdea: "Cute infographic-style walk report with dog photo and stats", videoIdea: "End-of-walk selfie video with the tired happy dog, read out the 'stats' like a sports reporter", engagementHook: { type: "comment", prompt: "How many squirrels has YOUR dog chased this week? Be honest!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop" },
  ],
  trainer: [
    { text: "I need you to hear this: your dog is not 'bad.' There's no such thing as a bad dog. There are dogs who are confused, understimulated, anxious, or who simply haven't been taught what we expect from them. When we reframe behavior as communication instead of defiance, everything changes. That frustrated pup pulling on the leash? They're not trying to ruin your walk. They just don't know there's a better way. Yet.", hashtags: "#DogTraining #PositiveReinforcement #DogBehavior #DogTrainer #ForceFreeDogTraining #DogCommunication", imageIdea: "Trainer sitting at eye level with a dog, calm and patient interaction", videoIdea: "Talking-head video debunking the myth of 'bad dogs' — use real examples of behavior transformation with before/after clips", engagementHook: { type: "share", prompt: "Share this with every dog owner you know — they need to hear it!", saveable: true, saveReason: "Reframe dog behavior" }, category: "educational", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop" },
    { text: "Recall training isn't just a nice-to-have — it can literally save your dog's life. Imagine your dog slips their leash near a busy road. In that moment, the ONLY thing between your dog and danger is whether they come when you call. We practice recall in every single session because it's that important. Start today: say their name, reward like crazy when they look at you. Build from there.", hashtags: "#RecallTraining #DogSafety #DogTrainer #TrainingTips #DogLifeSaver #ComeWhenCalled", imageIdea: "Dog mid-run, joyfully sprinting back to owner with a big smile", videoIdea: "Demo video: show recall training progression from week 1 to week 6 — the improvement is dramatic and motivating for viewers", engagementHook: { type: "save", prompt: "Save this — practice recall today. It could save their life.", saveable: true, saveReason: "Recall training steps" }, category: "educational", photo: "https://images.unsplash.com/photo-1494947665470-20322015e3a8?w=600&h=600&fit=crop" },
    { text: "Session 1: couldn't walk past another dog without lunging. Session 6: walked past TWO dogs and a cat, and didn't even flinch. This pup's parents called me in tears last night because they finally went on a peaceful walk together for the first time in two years. Two. Years. This is what training can do. It changes lives — both ends of the leash.", hashtags: "#DogTraining #Progress #DogTrainer #GoodBoy #TrainingTransformation #ReactivityTraining", imageIdea: "Split comparison: tense pulling dog on left, calm loose-leash walking on right", videoIdea: "Real client transformation video: show actual footage from session 1 vs session 6 — narrate the journey and the breakthrough moment", engagementHook: { type: "comment", prompt: "Has your dog had a breakthrough moment? We want to celebrate with you!", saveable: false }, category: "transformation", photo: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=600&h=600&fit=crop" },
    { text: "Hot take: you don't need an hour-long training session to see results. Five minutes of focused practice every single day will outperform one weekend boot camp EVERY time. Here's your 5-minute drill: 10 sits, 5 name recalls, 3 'leave its,' and 2 minutes of calm leash walking. Do this daily for a week and watch what happens. Consistency is the secret sauce.", hashtags: "#TrainingTips #DogTraining #DogTrainer #PetParenting #DailyTraining #ConsistencyWins", imageIdea: "Clean infographic with the 5-minute daily drill steps, timer icon", videoIdea: "Follow-along training video: 'Do this 5-minute drill with your dog every day' — film in real-time so viewers can train along", engagementHook: { type: "save", prompt: "Save this 5-minute drill and try it TONIGHT!", saveable: true, saveReason: "5-min daily training drill" }, category: "educational", photo: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=600&fit=crop" },
    { text: "Your dog barking and lunging at other dogs on walks does NOT mean they're aggressive. Nine times out of ten, it means they're overwhelmed, frustrated, or scared. Reactivity is an emotional response, not a character flaw. With the right approach — distance, patience, and positive association — we can help your dog feel safe again. You're not alone in this, and it's absolutely fixable.", hashtags: "#LeashReactivity #DogTrainer #DogBehavior #PositiveTraining #ReactiveDogsCanHeal #DogAnxiety", imageIdea: "Calm dog walking on loose leash past other dogs at comfortable distance", videoIdea: "Educational video explaining leash reactivity with animations showing the dog's emotional state — end with success stories from real clients", engagementHook: { type: "share", prompt: "Send this to a friend whose dog is reactive — give them hope!", saveable: true, saveReason: "Understanding reactivity" }, category: "trust", photo: "https://images.unsplash.com/photo-1548658166-136d9f6a5c3b?w=600&h=600&fit=crop" },
    { text: "Enrollment is NOW OPEN for our spring group classes! We've got Puppy Foundations (8-16 weeks), Leash Manners, Rock-Solid Recall, and our brand new Reactive Rover workshop. Small group sizes, force-free methods, and real results you can see in weeks. Last session sold out in 3 days, so don't sleep on this one.", hashtags: "#DogTraining #PuppyClass #DogTrainer #EnrollNow #GroupDogClass #SpringTraining", imageIdea: "Class schedule graphic with dog photos for each class type, enrollment link", videoIdea: "Hype video showing clips from past classes — dogs learning, owners celebrating wins, fun group energy", engagementHook: { type: "share", prompt: "Tag a friend who just got a puppy — they NEED this!", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1587559045816-8b0a54d1a65f?w=600&h=600&fit=crop" },
  ],
  sitter: [
    { text: "I know leaving your dog is hard. Like, really hard. But here's what your pup did today while you were on vacation: played fetch for 30 minutes, got two belly rub sessions, had a full nap on the couch (yes, they claimed the good pillow), ate every bite of dinner, and passed out by 8pm. They're having the time of their life. Go enjoy your trip.", hashtags: "#PetSitter #DogSitting #VacationReady #HappyPup #PetSittingUpdates #DogVacation", imageIdea: "Cozy photo of dog sleeping on couch with a toy, looking completely content", videoIdea: "Day-in-the-life vlog of a dog's stay with you — morning walk, playtime, snack time, cuddle nap. Show how loved they are.", engagementHook: { type: "share", prompt: "Know someone going on vacation? Send them our page!", saveable: false }, category: "trust", photo: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=600&fit=crop" },
    { text: "We don't do kennels. We do couch cuddles on rainy afternoons, backyard zoomies at golden hour, their favorite treats hidden around the house for a sniff-and-find game, and goodnight belly rubs before bed. Your dog doesn't know you're gone — they just know they're having an adventure. That's the kind of care we provide.", hashtags: "#PetSitting #DogSitter #HomeAway #PamperedPets #InHomePetSitting #SpoiledDog", imageIdea: "Dog lying on a cozy couch with blanket, looking relaxed and happy", videoIdea: "Montage of all the fun activities: zoomies, treat games, couch cuddles, dinner time — set to warm, feel-good music", engagementHook: { type: "save", prompt: "Save this for when you need a sitter you can actually trust!", saveable: true, saveReason: "Trusted pet sitter reference" }, category: "lifestyle", photo: "https://images.unsplash.com/photo-1530041539828-114de669390e?w=600&h=600&fit=crop" },
    { text: "We send photo updates because we know you're going to check your phone 47 times today anyway. You'll get morning selfies, mid-day activity reports, and a bedtime 'goodnight' photo of your pup all tucked in. Peace of mind isn't just a nice perk of our service — it's built into everything we do. Your baby is safe, happy, and very much loved.", hashtags: "#PetSitter #DogUpdates #PetParent #PeaceOfMind #PetSittingPhotos #TrustedPetCare", imageIdea: "Phone mockup showing cute photo updates sent to the owner — timestamps, hearts, captions", videoIdea: "Screen recording style: flip through a day's worth of adorable photo updates you sent to a client — show the real texts and reactions", engagementHook: { type: "comment", prompt: "Would daily photo updates give YOU peace of mind? Tell us below!", saveable: false }, category: "trust", photo: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop" },
    { text: "Whether you need overnight stays while you travel, midday drop-ins during a long work day, or full-time care for an extended trip — we've got a plan that fits. Every pet sitting experience starts with a free meet-and-greet so your dog can sniff us out (literally) and you can ask all the questions. No cookie-cutter care. Just personalized love for your pup.", hashtags: "#PetSitting #FlexibleCare #DogSitter #PetCare #CustomPetSitting #MeetAndGreet", imageIdea: "Infographic showing your service tiers: drop-in, overnight, extended stay", videoIdea: "Walk-through of your space showing where dogs sleep, eat, play — give future clients a virtual tour of their dog's home-away-from-home", engagementHook: { type: "share", prompt: "Planning a trip? Share this with your pet parent group chat!", saveable: true, saveReason: "Pet sitting options" }, category: "promo", photo: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8571?w=600&h=600&fit=crop" },
    { text: "Pickup day is the BEST day. The door opens, their person walks in, and suddenly it's full-body wiggles, happy cries, and a tail going so fast it could power a small generator. I always step back and just let the reunion happen. These moments remind me why I love this job — connecting hearts, one belly rub at a time.", hashtags: "#PetSitter #HappyReunion #DogLove #PetSitting #DogReunion #TailWagging", imageIdea: "Candid shot of dog excitedly greeting returning owner at the door — pure joy", videoIdea: "Compilation of real reunion moments at pickup — capture the wiggly butts, happy cries, and owner smiles", engagementHook: { type: "comment", prompt: "Drop a heart if reunion wiggles are the best thing ever!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop" },
  ],
  daycare: [
    { text: "POV: Your dog's Monday is WAY better than yours. 8am: arrival zoomies. 9am: supervised playgroup with their best friends. 10:30am: snack break. 11am: enrichment puzzles. 12pm: nap time in the cozy corner. 2pm: round two of zoomies. 3pm: belly rubs from our team. 4pm: picked up, absolutely exhausted, and completely happy. Tell me your Monday was this good.", hashtags: "#DoggyDaycare #DogPlaytime #HappyDogs #DaycareLife #DogSchedule #BestDayEver", imageIdea: "Multi-frame timeline showing a dog's day at daycare — morning to pickup", videoIdea: "Full day-in-the-life at daycare — film key moments from open to close, show the energy, the naps, the friendships", engagementHook: { type: "comment", prompt: "Rate your Monday 1-10. We bet your dog's is higher!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop" },
    { text: "Here's why socialization matters more than most people realize: a well-socialized dog is a confident dog. And confident dogs don't bark at every stranger, lunge at every dog, or panic during thunderstorms. Our daycare gives your pup daily opportunities to practice social skills in a safe, supervised environment. Think of it as school for their emotional intelligence.", hashtags: "#DogSocialization #DoggyDaycare #DogBehavior #PetCare #ConfidentDogs #DogSchool", imageIdea: "Dogs of different sizes calmly playing together, body language showing comfort", videoIdea: "Side-by-side comparison: shy dog on day 1 vs same dog confidently playing on day 30 — narrate the socialization journey", engagementHook: { type: "save", prompt: "Save this for anyone asking 'is daycare worth it?'", saveable: true, saveReason: "Why socialization matters" }, category: "educational", photo: "https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=600&h=600&fit=crop" },
    { text: "There is a formula to a good evening: Tired dog = Good dog. After a full day of running, playing, and socializing with friends, your pup comes home absolutely spent. No destroyed shoes. No counter surfing. No 2am zoomies. Just a peaceful, contented dog who passes out on their bed by 7pm. You're welcome.", hashtags: "#DoggyDaycare #TiredDog #HappyDog #DogCare #PeacefulEvenings #ExercisedDog", imageIdea: "Dog curled up sleeping peacefully on their bed at home, clearly exhausted from a good day", videoIdea: "Before and after: hyper dog in the morning bouncing off walls vs same dog passed out cold after daycare. The contrast is hilarious.", engagementHook: { type: "share", prompt: "Tag a pet parent who needs more peaceful evenings!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop" },
    { text: "This isn't just a room full of dogs running around. Our daycare runs structured play groups matched by size, energy level, and play style. Every group is supervised by trained staff who know how to read body language and redirect before things escalate. We have enrichment stations, rest areas, and fresh water always available. This is professional pet care, not a free-for-all.", hashtags: "#DoggyDaycare #PremiumCare #DogEnrichment #PetCare #SafePlay #ProfessionalDaycare", imageIdea: "Staff member supervising a small play group, calm and organized environment", videoIdea: "Behind-the-scenes tour: show your play groups, explain how you match dogs, demo your enrichment activities — build trust through transparency", engagementHook: { type: "save", prompt: "Save this — show it to anyone who thinks daycare is just 'dogs running around'!", saveable: true, saveReason: "What real daycare looks like" }, category: "trust", photo: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop" },
    { text: "Our spring schedule just opened up and spots are filling fast! We cap enrollment to keep our staff-to-dog ratio small, which means better supervision and more personalized attention for every pup. Once we're full, we're full — no exceptions. Lock in your spot now so your dog doesn't miss out on the fun.", hashtags: "#DoggyDaycare #BookNow #DogCare #LocalBusiness #LimitedSpots #DogDaycare", imageIdea: "Clean booking graphic with 'Spots Available' counter and happy dog photos", videoIdea: "Quick tour of your facility with upbeat music — 'This could be YOUR pup's second home. Spots are limited!'", engagementHook: { type: "share", prompt: "Share with a dog parent before spots fill up!", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop" },
  ],
  vet: [
    { text: "I know nobody's favorite activity is bringing their pet to the vet. But here's the thing: that annual checkup we recommend? It's how we caught a heart murmur in a 4-year-old golden retriever last month. No symptoms. Owner had no idea. Early detection meant early treatment, and that dog is going to live a much longer, healthier life because of one routine visit. Preventive care isn't optional — it's the most loving thing you can do.", hashtags: "#VetClinic #PetHealth #PreventiveCare #DogHealth #AnnualCheckup #EarlyDetection", imageIdea: "Vet with stethoscope gently examining a calm, trusting dog", videoIdea: "Story-time video: tell the real (anonymized) story of how a routine visit saved a dog's life — emotional and educational", engagementHook: { type: "save", prompt: "Save this as your reminder to book that annual checkup!", saveable: true, saveReason: "Annual checkup reminder" }, category: "educational", photo: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=600&fit=crop" },
    { text: "Let's talk about the thing nobody wants to talk about: your dog's teeth. By age 3, about 80% of dogs show signs of dental disease. That's not a scare tactic — it's a fact. Bad teeth don't just cause bad breath. They lead to pain, difficulty eating, and can even affect the heart and kidneys. A dental checkup takes 15 minutes and can add years to your dog's life. When was your pup's last one?", hashtags: "#PetDental #VetCare #DogHealth #DentalHealth #DogTeeth #PetDentistry", imageIdea: "Before/after dental cleaning photos (clinical but not graphic) with key stats overlay", videoIdea: "Quick educational video: 'Check your dog's teeth like a vet' — show 3 things owners can look for at home", engagementHook: { type: "comment", prompt: "Be honest — when was your dog's last dental check? No judgment!", saveable: true, saveReason: "Dental health facts" }, category: "educational", photo: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=600&fit=crop" },
    { text: "When a scared puppy comes into our clinic, our team gets on the floor. Literally. We sit down, offer treats, speak softly, and wait. We don't rush. We don't force. We let every patient set the pace. Because trust isn't something we demand — it's something we earn, one visit at a time. Your pet's emotional wellbeing matters to us just as much as their physical health.", hashtags: "#VetClinic #CompassionateCare #PetHealth #AnimalHospital #FearFreeVet #GentleCare", imageIdea: "Vet sitting on floor at puppy's level, offering a treat, warm and gentle", videoIdea: "Heartwarming video of your team interacting with nervous pets — gentle handling, patience, treats. Show the care in action.", engagementHook: { type: "share", prompt: "Send this to a friend looking for a gentle vet!", saveable: false }, category: "trust", photo: "https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop" },
    { text: "Spring vaccination season is here! If your dog is overdue on their rabies, DHPP, or Bordetella shots, now is the time. Vaccines aren't just about protecting your dog — they protect every dog your dog comes in contact with. Think of it as community immunity for the dog park. Call us to check what your pup is due for. We make it quick and treat-filled.", hashtags: "#Vaccinations #PetHealth #VetClinic #DogCare #VaccinesSaveLives #SpringWellness", imageIdea: "Friendly infographic showing common vaccines and when dogs need them", videoIdea: "FAQ video: answer the top 5 questions pet parents ask about vaccines — quick, clear, reassuring", engagementHook: { type: "save", prompt: "Save this vaccine schedule — you'll need it!", saveable: true, saveReason: "Vaccine schedule reference" }, category: "promo", photo: "https://images.unsplash.com/photo-1587463278679-57d7dde498e1?w=600&h=600&fit=crop" },
    { text: "Dogs are experts at hiding pain. It's an instinct from their wild ancestors — showing weakness made them vulnerable. So by the time you notice something is off, they may have been hurting for a while. Watch for these subtle signs: eating slower than usual, reluctance to jump or use stairs, licking one spot repeatedly, sleeping more, or just being 'not themselves.' Trust your gut. If something feels off, bring them in. Better to check and be reassured than to wait and wish you hadn't.", hashtags: "#PetHealth #VetTips #DogHealth #AnimalCare #PainSigns #KnowYourDog", imageIdea: "Clean carousel: 5 subtle signs your dog might be in pain, each with an illustration and description", videoIdea: "Vet explains 5 hidden pain signs with demo footage — empower owners to catch issues early", engagementHook: { type: "save", prompt: "SAVE THIS. Every pet parent needs to know these 5 pain signs.", saveable: true, saveReason: "5 hidden signs of pain" }, category: "educational", photo: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&h=600&fit=crop" },
  ],
  photographer: [
    { text: "Every dog has a story written in their eyes. The curious tilt, the soulful gaze, the mischievous sparkle right before they steal your sandwich. My job isn't just to take photos — it's to freeze those fleeting expressions into something you can hold onto forever. Because dogs don't stay puppies, and moments don't last. But great photos? Those are eternal.", hashtags: "#PetPhotography #DogPortrait #PetPhotographer #DogLife #PetMemories #DogStory", imageIdea: "Close-up portrait capturing a dog's expressive eyes, shallow depth of field, warm light", videoIdea: "Behind-the-lens reel: show the camera viewfinder capturing those magical expressions — the moment you press the shutter", engagementHook: { type: "comment", prompt: "Drop a photo of your dog's most expressive face below!", saveable: false }, category: "brand", photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop" },
    { text: "MINI SESSIONS ARE BACK and they book out fast. Here's what you get: 20 minutes of shooting magic, 10 professionally edited digital images, and one very photogenic pup who has no idea how cute they are. Perfect for holiday cards, social media content, or simply having beautiful photos of your best friend while they're in their prime. Link in bio to grab your slot.", hashtags: "#PetMiniSession #DogPhotography #PetPhotographer #BookNow #PetPortraits #PhotoSession", imageIdea: "Grid of 4-6 sample photos from past mini sessions showing variety of breeds and settings", videoIdea: "Hype reel: fast cuts of your best mini session shots set to trendy music — show the variety and quality", engagementHook: { type: "share", prompt: "Tag someone whose dog deserves a photoshoot!", saveable: true, saveReason: "Mini session details" }, category: "promo", photo: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop" },
    { text: "What today's shoot ACTUALLY looked like behind the camera: 47 treats thrown, 3 squeaky toys deployed, one very patient assistant making weird noises off-camera, 2 accidental owner-photobombs, and approximately 400 frames to get THE shot. But oh, when we got it? Pure perfection. That's the magic of pet photography — beautiful chaos that creates beautiful art.", hashtags: "#BTS #PetPhotography #DogPhotoshoot #PetPhotographer #BehindTheScenes #RealTalk", imageIdea: "Fun collage: polished final photo next to silly BTS outtakes and setup shots", videoIdea: "BTS reel: show the hilarious reality of pet photography — treat throwing, funny poses, outtakes — then reveal the stunning final shot", engagementHook: { type: "comment", prompt: "What's the funniest thing your dog does during photos? Tell us!", saveable: false }, category: "fun", photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop" },
    { text: "I had a client tell me she sleeps with a framed photo of her dog on her nightstand. Not her partner. Not her kids. Her DOG. And honestly? I get it. These photos aren't just pictures — they're the way you remember the goofy head tilt, the way they looked in autumn light, how small they once were. Your dog deserves to be celebrated while they're here. Don't wait.", hashtags: "#PetPortrait #DogPhotography #PetMemories #PetPhotographer #CelebrateYourDog #TimelessPhotos", imageIdea: "Beautifully framed pet portrait on a nightstand or living room wall — lifestyle setting", videoIdea: "Emotional video: show photos aging from puppy to senior — 'time flies, photos stay.' End with booking CTA.", engagementHook: { type: "share", prompt: "Send this to someone who needs to book a session before it's too late.", saveable: false }, category: "emotional", photo: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?w=600&h=600&fit=crop" },
    { text: "Want better phone photos of your dog? Here are 3 tips that instantly level up your game. First: get on THEIR level. Shoot from the ground, not standing above them — it's more intimate and makes them look majestic. Second: face a window or go outside. Natural light is free and it's the best light there is. Third: hold a treat right next to your phone lens. Instant eye contact, instant great photo. Try it and tag us!", hashtags: "#PhotoTips #PetPhotography #DogPhotos #PetPhotographer #PhonePhotography #DogPhotoHacks", imageIdea: "Side-by-side comparison: bad phone photo (from above, flash, unfocused) vs good one (eye level, natural light, treat)", videoIdea: "Tutorial video: demonstrate all 3 tips in real-time with a dog — show the 'before' attempt and the 'after' result for each tip", engagementHook: { type: "save", prompt: "Save these 3 tips — try them this weekend and tag us!", saveable: true, saveReason: "Dog photo tips" }, category: "educational", photo: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=600&h=600&fit=crop" },
  ],
  store: [
    { text: "Fresh delivery day is the BEST day! We just unboxed the latest toys, all-natural treats, and some seriously stylish gear that your pup is going to obsess over. First rule of our store: everything gets the sniff test. If the dogs in our shop don't approve, it doesn't make the shelf. Come see what passed the test this week.", hashtags: "#PetStore #NewArrivals #DogToys #PetShop #PetProducts #ShopLocal", imageIdea: "Aesthetically arranged display of new products with a curious dog sniffing", videoIdea: "Unboxing video: open new products on camera with a dog 'helping' — show their genuine reactions to each item", engagementHook: { type: "comment", prompt: "What product does YOUR dog need? Drop it below!", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop" },
    { text: "Here's something worth knowing: the first 5 ingredients on your dog food label tell you everything. If you see corn, wheat, or 'meat by-products' in the top 5, that food is filling your dog's belly without nourishing their body. Look for named proteins (chicken, salmon, beef), whole grains or quality carbs, and recognizable ingredients. Your dog's energy, coat, digestion, and longevity all start with what's in their bowl. Come talk to us — we'll help you decode the labels.", hashtags: "#PetNutrition #DogFood #PetStore #HealthyDog #DogFoodTips #ReadTheLabel", imageIdea: "Close-up of a premium dog food label with the top 5 ingredients highlighted and explained", videoIdea: "Educational video: pick up 3 different dog food bags and compare labels live — teach viewers what to look for and what to avoid", engagementHook: { type: "save", prompt: "Save this guide — check your dog food label tonight!", saveable: true, saveReason: "Dog food label guide" }, category: "educational", photo: "https://images.unsplash.com/photo-1587559045816-8b0a54d1a65f?w=600&h=600&fit=crop" },
    { text: "Staff pick of the week! Every single dog who has tried this puzzle feeder in our store has gone absolutely WILD for it. It slows down fast eaters, provides 20+ minutes of mental stimulation, and it's dishwasher safe (because we know that matters). Our team tested it with their own dogs first — unanimous paws up. Come try before you buy!", hashtags: "#StaffPick #PetStore #DogToys #PetShop #DogPuzzle #Enrichment", imageIdea: "Product photo with staff member holding it and their dog engaging with it — genuine recommendation", videoIdea: "In-store demo: film a dog trying the product for the first time — their genuine excitement is the best ad you could make", engagementHook: { type: "share", prompt: "Know a fast eater? Share this with their owner!", saveable: true, saveReason: "Best puzzle feeder" }, category: "promo", photo: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop" },
    { text: "We're not a big box store and we're proud of it. We know your dog's name, their allergies, their favorite treats, and which toy they destroyed in 12 seconds. When you shop local, you're not just buying products — you're supporting someone who genuinely cares about your pet's wellbeing. Every recommendation we make comes from experience, research, and love. Not an algorithm.", hashtags: "#ShopLocal #PetStore #SmallBusiness #LocalPetShop #CommunityMatters #PetFamily", imageIdea: "Warm candid photo of staff interacting with a regular customer and their dog by name", videoIdea: "Mini documentary style: interview regular customers about why they come to your shop instead of a chain — authentic testimonials", engagementHook: { type: "comment", prompt: "What's your dog's name? We bet we already know it!", saveable: false }, category: "brand", photo: "https://images.unsplash.com/photo-1583337130417-13104dec14c3?w=600&h=600&fit=crop" },
  ],
  bakery: [
    { text: "Everything in our case right now was baked fresh this morning using human-grade ingredients your pup can actually pronounce: peanut butter, oat flour, banana, pumpkin, and love (okay, love isn't an ingredient, but you get it). No artificial colors. No preservatives. No mystery powders. Just real food shaped into adorable treats that make tails go wild. Your dog eats better than most humans.", hashtags: "#DogBakery #DogTreats #HomemadeDogTreats #PupCakes #FreshBaked #HealthyDogTreats", imageIdea: "Beautiful bakery case display with variety of freshly baked treats, warm lighting", videoIdea: "Baking montage: show the process from mixing ingredients to pulling treats from the oven — satisfying, ASMR-style, warm vibes", engagementHook: { type: "comment", prompt: "What flavor would YOUR dog pick? PB, pumpkin, or banana?", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop" },
    { text: "HAPPY BIRTHDAY TO THIS VERY GOOD BOY! His humans ordered a custom pup cake: two layers of peanut butter and banana, frosted with dog-safe yogurt frosting, topped with his name in carob letters. He demolished it in approximately 90 seconds. Best 90 seconds of his entire year. DM us if your pup's birthday is coming up — we'll make it unforgettable.", hashtags: "#DogBirthday #PupCake #DogBakery #DogCelebration #DogBirthdayCake #CustomDogCake", imageIdea: "Dog with birthday hat next to decorated pup cake, candle lit, party setup", videoIdea: "Birthday celebration video: build up of the cake reveal, then the dog's reaction and demolition — joyful and shareable", engagementHook: { type: "comment", prompt: "When is your pup's birthday? Comment their name + bday!", saveable: true, saveReason: "Custom cake ordering info" }, category: "fun", photo: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=600&h=600&fit=crop" },
    { text: "We get asked a lot: 'Are these REALLY safe for dogs?' Here's our answer: every single ingredient we use is human-grade and vet-approved. We offer grain-free options for sensitive tummies. Zero artificial flavors, colors, or preservatives ever touch our kitchen. We wouldn't feed your dog anything we wouldn't eat ourselves — and yes, we've taste-tested. They're actually pretty good.", hashtags: "#DogBakery #HealthyTreats #NaturalDogTreats #DogNutrition #VetApproved #TransparentIngredients", imageIdea: "Clean flat lay of all ingredients laid out with labels — showing exactly what goes into your treats", videoIdea: "Ingredient spotlight video: hold up each ingredient, name it, explain why you use it — build trust through total transparency", engagementHook: { type: "save", prompt: "Save this — share it with anyone worried about treat safety!", saveable: true, saveReason: "Safe treat ingredients" }, category: "trust", photo: "https://images.unsplash.com/photo-1548658166-136d9f6a5c3b?w=600&h=600&fit=crop" },
    { text: "Just dropped our seasonal collection and it might be our best one yet. Pumpkin spice bones, apple cinnamon pup-tarts, and sweet potato crunch biscuits — all made fresh, all limited edition, all guaranteed to make your dog lose their mind. Last year's seasonal flavors sold out in two weeks. Fair warning: when they're gone, they're gone until next year.", hashtags: "#DogTreats #SeasonalFlavors #DogBakery #NewFlavors #LimitedEdition #SeasonalDogTreats", imageIdea: "Seasonal treat display with autumn/seasonal decor, warm colors, lifestyle feel", videoIdea: "Taste-test video: introduce each seasonal flavor, then film dogs trying them for the first time — their reactions sell themselves", engagementHook: { type: "share", prompt: "Share this before they sell out — your dog will thank you!", saveable: false }, category: "promo", photo: "https://images.unsplash.com/photo-1587463278679-57d7dde498e1?w=600&h=600&fit=crop" },
  ],
  other: [
    { text: "Every morning we open our doors with one mission: give every pet that walks through them the best possible care. Not adequate care. Not good-enough care. The BEST. Because your pet chose you as their whole world, and we think that deserves to be honored with nothing less than excellence. This is what drives us every single day.", hashtags: "#PetBusiness #PetCare #PetLove #SmallBusiness #PetExcellence #OurMission", imageIdea: "Warm team photo with pets, professional but inviting, showing genuine care", videoIdea: "Mission statement video: show clips of your team working with pets intercut with the words that drive you — authentic and inspiring", engagementHook: { type: "share", prompt: "Know a pet business that goes above and beyond? Tag them!", saveable: false }, category: "brand", photo: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop" },
    { text: "Behind this business is a person who chose animals over a corporate career, late nights over predictable paychecks, and passion over comfort. We started this because we genuinely believe pets deserve better. Better products, better care, better attention. And every day we show up and try to deliver exactly that. Thank you for being on this journey with us.", hashtags: "#PetBusiness #AnimalLover #SmallBusiness #PetCommunity #FounderStory #WhyWeDoThis", imageIdea: "Behind-the-scenes candid of the founder working with an animal, authentic and personal", videoIdea: "Founder story video: share your 'why' in a personal, conversational way — what made you start this business? What keeps you going?", engagementHook: { type: "comment", prompt: "What made YOU fall in love with animals? Share your story!", saveable: false }, category: "brand", photo: "https://images.unsplash.com/photo-1583337130417-13104dec14c3?w=600&h=600&fit=crop" },
    { text: "New week energy! What does your pet need from us this week? A fresh look? Some extra playtime? A new toy recommendation? A nutrition check? Drop it in the comments and let us help you make this week the best one yet for your furry bestie. We're here, we're ready, and we genuinely love helping you out.", hashtags: "#PetBusiness #HappyPets #PetServices #PetCare #AskUs #WeeklyCheckin", imageIdea: "Bright, friendly graphic with 'How can we help this week?' and your branding", videoIdea: "Casual selfie video: 'Hey! New week — what does your pet need? Drop it in the comments!' — warm, personal, approachable", engagementHook: { type: "comment", prompt: "Tell us what your pet needs this week — we'll help!", saveable: false }, category: "engagement", photo: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop" },
    { text: "When you choose a local pet business over a big chain, you're not just getting a product or service. You're getting someone who remembers your dog's name, who asks how their allergy is doing, who throws in an extra treat just because. You're getting a relationship. And that relationship means the world to us. Thank you for shopping small and supporting local.", hashtags: "#ShopLocal #PetBusiness #SmallBusiness #ThankYou #SupportLocal #CommunityFirst", imageIdea: "Split image: impersonal big-box experience vs warm, personal small business interaction", videoIdea: "Customer appreciation video: montage of real interactions with your regulars — knowing names, remembering details, the personal touch", engagementHook: { type: "share", prompt: "Share this to support a local pet business today!", saveable: false }, category: "brand", photo: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop" },
    { text: "We love a good pet question! Here are the top 3 things pet parents asked us this week: 'How often should I really bathe my dog?' 'What's the best way to introduce a new pet?' 'Why does my dog eat grass?' We answered all three in our stories — go check them out! And keep the questions coming. No question is too basic or too weird. We've heard them all.", hashtags: "#PetAdvice #AskUs #PetCare #PetBusiness #PetFAQ #PetTips", imageIdea: "Clean Q&A graphic with the 3 questions listed, inviting more in comments", videoIdea: "Q&A video: answer the top 3 questions on camera, quick and helpful — encourage viewers to send more questions", engagementHook: { type: "comment", prompt: "Drop YOUR pet question below — we answer everything!", saveable: true, saveReason: "Pet Q&A reference" }, category: "engagement", photo: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop" },
  ],
}

// CTA (Call-to-Action) templates by category
export const ctaTemplates = {
  transformation: ["Book your transformation today!", "DM us for your pup's glow-up", "Tap the link in bio to book"],
  fun: ["Tag a fellow pet parent!", "Double tap if you relate!", "Share this with someone who needs a laugh"],
  educational: ["Save this for later!", "Share with a pet parent who needs this", "Bookmark this tip!"],
  promo: ["Book now — spots are limited!", "DM us to reserve your spot", "Link in bio to get started"],
  testimonial: ["See what pet parents are saying!", "Ready for the same experience? DM us", "Book your visit today"],
  trust: ["Your pet is in safe hands with us", "DM us with any questions", "Schedule a meet & greet today"],
  milestone: ["Celebrate with us! Drop a comment below", "Thank you for being part of our journey", "Share your pet's milestone too!"],
  brand: ["Follow us for daily pet content", "Learn more about us — link in bio", "Join our pet-loving community!"],
  lifestyle: ["Would your pup love this? Tag them!", "Share your pet's adventure in comments", "Follow for more pet content"],
  emotional: ["Hug your pet a little tighter today", "Tag someone who'd love this", "Share the love in the comments"],
  engagement: ["Drop your answer in the comments!", "Tell us in the comments below", "Vote in our story poll!"],
}

// SEO keywords by business type
export const seoKeywords = {
  groomer: { primary: ["dog grooming", "pet grooming near me", "dog spa"], secondary: ["puppy haircut", "dog bath", "pet styling", "mobile grooming", "dog nail trim"] },
  walker: { primary: ["dog walker", "dog walking service", "pet walking"], secondary: ["midday dog walks", "group dog walks", "professional dog walker", "dog exercise"] },
  trainer: { primary: ["dog training", "dog trainer near me", "puppy training"], secondary: ["obedience training", "leash training", "recall training", "positive reinforcement"] },
  sitter: { primary: ["pet sitting", "dog sitter near me", "pet care"], secondary: ["overnight pet sitting", "in-home dog sitting", "vacation pet care", "house sitting with pets"] },
  daycare: { primary: ["doggy daycare", "dog daycare near me", "pet daycare"], secondary: ["dog socialization", "supervised dog play", "full-day dog care", "dog enrichment"] },
  vet: { primary: ["veterinarian", "vet clinic near me", "animal hospital"], secondary: ["pet vaccinations", "dog dental care", "preventive pet care", "emergency vet"] },
  photographer: { primary: ["pet photography", "dog photographer", "pet portraits"], secondary: ["pet photo session", "dog photoshoot", "animal photography", "pet holiday photos"] },
  store: { primary: ["pet store", "pet supplies", "dog shop"], secondary: ["natural dog food", "dog toys", "pet accessories", "premium pet products"] },
  bakery: { primary: ["dog bakery", "dog treats", "pet bakery"], secondary: ["homemade dog treats", "custom dog cakes", "healthy pet snacks", "grain-free dog treats"] },
  other: { primary: ["pet business", "pet services", "pet care"], secondary: ["local pet business", "pet community", "animal services", "pet professionals"] },
}

// Get CTA for a caption
export function getCTA(category, index = 0) {
  const ctas = ctaTemplates[category] || ctaTemplates.brand
  return ctas[index % ctas.length]
}

// Get SEO keywords for a business type
export function getSEOKeywords(businessType) {
  return seoKeywords[businessType] || seoKeywords.other
}

// Vibe modifiers — adjust tone of captions
export const vibeModifiers = {
  warm: { prefix: "", style: "Keep it warm, friendly, and approachable. Like talking to a good friend." },
  funny: { prefix: "", style: "Add humor, be playful, use internet-speak and relatable pet parent moments." },
  professional: { prefix: "", style: "Keep it polished, trustworthy, and expertise-focused." },
  educational: { prefix: "", style: "Lead with tips, facts, and helpful knowledge." },
}

// Image suggestions per category
export const imageSuggestions = {
  transformation: ["Before & after side-by-side", "Time-lapse video", "Split-screen comparison"],
  fun: ["Candid pet moments", "Funny pet expressions", "Behind-the-scenes clips"],
  educational: ["Infographic", "Carousel slides with tips", "Quick how-to video"],
  promo: ["Product/service showcase", "Booking calendar graphic", "Limited-time offer banner"],
  testimonial: ["Client review screenshot", "Happy client photo (with permission)", "Star rating graphic"],
  trust: ["Team at work", "Facility tour", "Certifications/awards"],
  milestone: ["Celebration photo", "Milestone counter graphic", "Throwback comparison"],
  brand: ["Logo/brand colors showcase", "Team photo", "Mission statement graphic"],
  lifestyle: ["Scenic/outdoor shots", "Day-in-the-life content", "Aesthetic flat lay"],
  emotional: ["Close-up portraits", "Heartfelt moments", "Soft lighting photos"],
  engagement: ["Question sticker/poll", "Fill-in-the-blank graphic", "This or that template"],
}

// Platform-specific formatting
export const platformFormats = {
  instagram: {
    label: "Instagram",
    emoji: "📷",
    maxLength: 2200,
    hashtagTip: "Use 20-30 hashtags, mix popular + niche",
    formatTip: "Line breaks for readability. Hook in first line.",
    cta: "Link in bio!",
  },
  facebook: {
    label: "Facebook",
    emoji: "👤",
    maxLength: 63206,
    hashtagTip: "Use 1-3 hashtags max",
    formatTip: "Longer storytelling works. Ask questions for engagement.",
    cta: "Comment below or send us a message!",
  },
  tiktok: {
    label: "TikTok",
    emoji: "🎵",
    maxLength: 300,
    hashtagTip: "Use 3-5 trending + niche hashtags",
    formatTip: "Short, punchy hook. Trending sounds reference.",
    cta: "Follow for more!",
  },
}

// Trending sounds — organized by category/mood, with platform notes
export const trendingSounds = {
  transformation: [
    { name: "Oh No - Kreepa", tip: "Before/after reveal with dramatic pause", platforms: ["tiktok", "instagram"] },
    { name: "Metamorphosis - Interworld", tip: "Slow-mo glow-up transition", platforms: ["tiktok", "instagram"] },
    { name: "Get Ready With Me (original)", tip: "Grooming or prep timelapse", platforms: ["tiktok"] },
  ],
  fun: [
    { name: "Funny Song - Cavendish Music", tip: "Silly pet moments montage", platforms: ["tiktok", "instagram"] },
    { name: "Monkeys Spinning Monkeys", tip: "Chaotic pet energy clips", platforms: ["tiktok", "instagram"] },
    { name: "Just a Cloud Away - Pharrell", tip: "Happy vibes montage of pets", platforms: ["tiktok", "instagram"] },
    { name: "Quirky - Oleg Kirilkov", tip: "Cute behind-the-scenes moments", platforms: ["tiktok"] },
  ],
  educational: [
    { name: "Storytelling (original sound)", tip: "Voiceover with tips on screen", platforms: ["tiktok", "instagram"] },
    { name: "Blade Runner 2049 - Synthwave", tip: "Cinematic fact overlay", platforms: ["tiktok", "instagram"] },
    { name: "Lo-fi Study Beats", tip: "Calm tips carousel or slideshow", platforms: ["instagram"] },
  ],
  promo: [
    { name: "Money - Cardi B", tip: "Showcase your service with energy", platforms: ["tiktok"] },
    { name: "Boss B*tch - Doja Cat", tip: "Confident business showcase", platforms: ["tiktok", "instagram"] },
    { name: "Aesthetic - Tollan Kim", tip: "Clean product/service reveal", platforms: ["tiktok", "instagram"] },
  ],
  testimonial: [
    { name: "Good Days - SZA", tip: "Happy client reactions compilation", platforms: ["tiktok", "instagram"] },
    { name: "Best Day Of My Life - ATAP", tip: "Pet reunion or pickup moment", platforms: ["tiktok", "instagram"] },
    { name: "Thank You (original sound)", tip: "Client love with text overlay", platforms: ["instagram"] },
  ],
  trust: [
    { name: "Calm Down - Rema", tip: "Show your gentle, patient process", platforms: ["tiktok", "instagram"] },
    { name: "Sunflower - Post Malone", tip: "Warm team/facility tour", platforms: ["tiktok", "instagram"] },
    { name: "A Day in My Life (original)", tip: "Behind-the-scenes day vlog", platforms: ["tiktok"] },
  ],
  milestone: [
    { name: "Celebration - Kool & The Gang", tip: "Business or pet milestone moment", platforms: ["tiktok", "instagram"] },
    { name: "We Are The Champions - Queen", tip: "Achievement or anniversary", platforms: ["tiktok"] },
    { name: "Memories - Maroon 5", tip: "Throwback montage", platforms: ["instagram"] },
  ],
  brand: [
    { name: "INDUSTRY BABY - Lil Nas X", tip: "Bold brand intro or tour", platforms: ["tiktok"] },
    { name: "Aesthetic - Xilo", tip: "Clean brand aesthetic showcase", platforms: ["tiktok", "instagram"] },
    { name: "Chill Vibes - Official Sound", tip: "Brand values or mission content", platforms: ["instagram"] },
  ],
  lifestyle: [
    { name: "Golden Hour - JVKE", tip: "Dreamy outdoor content", platforms: ["tiktok", "instagram"] },
    { name: "Here Comes The Sun - Beatles", tip: "Morning routine or walk content", platforms: ["instagram"] },
    { name: "Running Up That Hill - Kate Bush", tip: "Epic adventure/outdoor montage", platforms: ["tiktok", "instagram"] },
  ],
  emotional: [
    { name: "Another Love - Tom Odell", tip: "Heartfelt pet moments", platforms: ["tiktok", "instagram"] },
    { name: "Glimpse of Us - Joji", tip: "Emotional bond between pet and owner", platforms: ["tiktok"] },
    { name: "You Are My Sunshine (cover)", tip: "Sweet pet compilation", platforms: ["tiktok", "instagram"] },
  ],
  engagement: [
    { name: "Oh No Oh No (TikTok remix)", tip: "Relatable pet parent fails", platforms: ["tiktok"] },
    { name: "Put a Finger Down (original)", tip: "Interactive pet parent challenge", platforms: ["tiktok"] },
    { name: "Tell Me Without Telling Me", tip: "Pet owner relatability trend", platforms: ["tiktok", "instagram"] },
  ],
}

// Stock photo URLs by category (Unsplash free photos)
export const categoryPhotos = {
  transformation: [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518882345390-66ca28e5b9e2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop',
  ],
  fun: [
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530041539828-114de669390e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop',
  ],
  educational: [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=600&fit=crop',
  ],
  promo: [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587559045816-8b0a54d1a65f?w=600&h=600&fit=crop',
  ],
  testimonial: [
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522276498395-f4f68f7f8571?w=600&h=600&fit=crop',
  ],
  trust: [
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548658166-136d9f6a5c3b?w=600&h=600&fit=crop',
  ],
  milestone: [
    'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587463278679-57d7dde498e1?w=600&h=600&fit=crop',
  ],
  brand: [
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-13104dec14c3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
  ],
  lifestyle: [
    'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494947665470-20322015e3a8?w=600&h=600&fit=crop',
  ],
  emotional: [
    'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553882809-a4f57e59501d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop',
  ],
  engagement: [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
  ],
}

// Get a photo URL for a category and index (cycles through available photos)
export function getCategoryPhoto(category, index = 0) {
  const photos = categoryPhotos[category] || categoryPhotos.brand
  return photos[index % photos.length]
}

// Content calendar themes by day of week
export const weeklyThemes = {
  0: { theme: "Self-Care Sunday", icon: "🧖", suggestion: "Share pet pampering tips or relaxation content" },
  1: { theme: "Motivation Monday", icon: "💪", suggestion: "Inspirational pet stories or business wins" },
  2: { theme: "Tip Tuesday", icon: "💡", suggestion: "Share a quick pet care tip" },
  3: { theme: "Wisdom Wednesday", icon: "🧠", suggestion: "Educational content or myth-busting" },
  4: { theme: "Throwback Thursday", icon: "📸", suggestion: "Before/after, progress, or old photos" },
  5: { theme: "Feature Friday", icon: "⭐", suggestion: "Client spotlight or product feature" },
  6: { theme: "Saturday Showcase", icon: "🎉", suggestion: "Fun content, memes, or weekend vibes" },
}

// Pet holidays & awareness dates (month is 0-indexed)
export const petHolidays = [
  { month: 0, day: 14, name: "National Dress Up Your Pet Day", icon: "👗", tip: "Post your cutest dressed-up pet photos!" },
  { month: 0, day: 24, name: "Change a Pet's Life Day", icon: "💛", tip: "Share adoption stories or rescue highlights" },
  { month: 1, day: 3, name: "National Golden Retriever Day", icon: "🐕", tip: "Feature Golden Retrievers in your content" },
  { month: 1, day: 14, name: "Pet Valentine's Day", icon: "💝", tip: "Love letters to your furry clients" },
  { month: 1, day: 20, name: "Love Your Pet Day", icon: "❤️", tip: "Encourage followers to share pet love stories" },
  { month: 1, day: 23, name: "National Dog Biscuit Day", icon: "🦴", tip: "Treat-themed content or giveaway" },
  { month: 2, day: 3, name: "If Pets Had Thumbs Day", icon: "👍", tip: "Funny content about what pets would do with thumbs" },
  { month: 2, day: 23, name: "National Puppy Day", icon: "🐶", tip: "ALL the puppy content! Before/after, first visits, puppy tips" },
  { month: 3, day: 11, name: "National Pet Day", icon: "🐾", tip: "Celebrate ALL pets! Run a photo contest or spotlight" },
  { month: 3, day: 26, name: "National Kids and Pets Day", icon: "👶🐕", tip: "Share cute kid + pet moments" },
  { month: 3, day: 30, name: "National Adopt a Shelter Pet Day", icon: "🏠", tip: "Partner with local shelters for awareness" },
  { month: 4, day: 1, name: "National Purebred Dog Day", icon: "🏆", tip: "Feature different breeds you work with" },
  { month: 4, day: 3, name: "National Pet Week begins", icon: "🎉", tip: "Week-long content series about pet care" },
  { month: 5, day: 4, name: "Hug Your Cat Day", icon: "🐱", tip: "Feature cat clients if applicable!" },
  { month: 5, day: 21, name: "National Dog Party Day", icon: "🎈", tip: "Host or promote a dog-friendly event" },
  { month: 5, day: 23, name: "Take Your Dog to Work Day", icon: "💼", tip: "Behind-the-scenes of your workday with pets" },
  { month: 6, day: 15, name: "National Pet Fire Safety Day", icon: "🔥", tip: "Share safety tips for pet owners" },
  { month: 6, day: 31, name: "National Mutt Day", icon: "🐕‍🦺", tip: "Celebrate mixed breed dogs!" },
  { month: 7, day: 5, name: "Work Like a Dog Day", icon: "💪", tip: "Show your hardworking team or working dog breeds" },
  { month: 7, day: 10, name: "National Spoil Your Dog Day", icon: "👑", tip: "Promote treats, spa services, or premium products" },
  { month: 7, day: 26, name: "National Dog Day", icon: "🐕", tip: "THE biggest pet holiday — go all out!" },
  { month: 8, day: 13, name: "National Pet Memorial Day", icon: "🌈", tip: "Thoughtful remembrance content" },
  { month: 8, day: 28, name: "National Good Neighbor Day", icon: "🏘️", tip: "Pet-friendly neighborhood tips" },
  { month: 9, day: 1, name: "National Black Dog Day", icon: "🖤", tip: "Spotlight black dogs — they're often overlooked" },
  { month: 9, day: 4, name: "World Animal Day", icon: "🌍", tip: "Global animal awareness content" },
  { month: 9, day: 29, name: "National Cat Day", icon: "🐱", tip: "Feature feline friends!" },
  { month: 10, day: 1, name: "National Cook for Your Pets Day", icon: "🍳", tip: "Share pet-safe recipes or treat ideas" },
  { month: 10, day: 3, name: "National Pet Obesity Awareness Day", icon: "⚖️", tip: "Health tips about pet weight management" },
  { month: 11, day: 2, name: "National Mutt Day", icon: "🐕‍🦺", tip: "Another chance to celebrate mixed breeds!" },
]

// Generate caption variants from a base caption
export function generateVariants(caption, vibe = 'warm', businessName = '') {
  if (!caption) return [caption]
  const base = caption.text
  const variants = [{ ...caption, variantLabel: 'Original' }]

  // Variant 2: Shorter/punchier
  const sentences = base.split(/(?<=[.!?])\s+/)
  if (sentences.length > 1) {
    const short = sentences.slice(0, Math.ceil(sentences.length / 2)).join(' ')
    variants.push({ ...caption, text: short + (short.endsWith('.') || short.endsWith('!') ? '' : '.'), variantLabel: 'Short & Punchy' })
  } else {
    variants.push({ ...caption, text: base.split(',')[0] + '.', variantLabel: 'Short & Punchy' })
  }

  // Variant 3: Question hook
  const hooks = {
    transformation: `Can you believe this transformation? ${base}`,
    fun: `Who else can relate? ${base}`,
    educational: `Did you know? ${base}`,
    promo: `Looking for the best care? ${base}`,
    testimonial: `Guess what our clients are saying? ${base}`,
    trust: `Here's why pet parents trust us: ${base}`,
    milestone: `We hit a milestone! ${base}`,
    brand: `This is what we're all about. ${base}`,
    lifestyle: `This is the life! ${base}`,
    emotional: `This one hit us in the feels. ${base}`,
    engagement: `We want to hear from YOU! ${base}`,
  }
  const hookText = hooks[caption.category] || `Here's the thing: ${base}`
  variants.push({ ...caption, text: hookText, variantLabel: 'Question Hook' })

  return variants
}

// Best times to post by day of week (based on general social media best practices)
export const bestPostingTimes = {
  0: { time: '10:00 AM', note: 'Sunday mornings — people browse while relaxing' },
  1: { time: '9:00 AM', note: 'Monday start of week — high scroll time' },
  2: { time: '11:00 AM', note: 'Tuesday mid-morning — peak engagement' },
  3: { time: '12:00 PM', note: 'Wednesday lunch break — top of feed' },
  4: { time: '2:00 PM', note: 'Thursday afternoon — shares spike' },
  5: { time: '10:00 AM', note: 'Friday morning — weekend planning mode' },
  6: { time: '11:00 AM', note: 'Saturday — leisurely browsing time' },
}
