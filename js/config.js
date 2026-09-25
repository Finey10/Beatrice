/* ═══════════════════════════════════════════════════════════════════
   ✦  PERSONALIZE EVERYTHING HERE ✦
   ─────────────────────────────────────────────────────────────────
   This is the ONLY file you need to edit to make this site hers.
   Replace the text between the quotes, then save. That's it.

   Tips:
   • Keep the quotes (" ") around every piece of text.
   • If your text contains a double quote, use ’ or ‘ instead.
   • In the letter, press Enter between paragraphs — blank lines
     create new paragraphs automatically.
   • Photos: drop your images into the  images/  folder and set
     image: "images/your-photo.jpg"  in the memories list below.
   ═══════════════════════════════════════════════════════════════════ */

const SITE = {

  /* ─── THE ESSENTIALS ─────────────────────────────────────────── */

  HER_NAME:         "Beatrice",     // e.g. "Sofia"
  MY_NAME:          "Finey",             // e.g. "Daniel"
  BIRTHDAY_DATE:    "26.9.2005",       // e.g. "14 March 2000" — shown as "her day"
  RELATIONSHIP_DATE:"30th August 2026",   // e.g. "12 June 2021" — used for the day counter
  NICKNAME:         "Beatrice",            // e.g. "sunshine" — the gate says "Hey, sunshine…"
  FAVORITE_COLOR:   "#C8A2C8",      // e.g. "#b76e79" — gently tints buttons & accents
  SONG_NAME:        "Daniel Caesar-Who Knows",           // e.g. "Yellow — Coldplay"
  AUDIO_FILE:       "audio/song.mp3",        // put her song at audio/song.mp3

  /* ─── THE LETTER (Section 3) ─────────────────────────────────── */
  /* Write it like you talk. Not a poem. Just you. Blank line = new paragraph. */

  PERSONAL_MESSAGE: `Sometimes I wonder how I got so lucky to have someone as good as you in my life. 
  You’ve given me so much love, patience, and kindness, even on the days when I struggle to be the person I want to be.
   You have such a beautiful heart, and I hope life gives you all the love, peace, 
   and happiness you so effortlessly give to others. Never forget how special you are to me, 
   and how much you deserve to be loved. ❤️

`,

  /* ─── COUNTER LINE (shown under the hero, if date is set) ────── */

  SHOW_DAY_COUNTER: true,   // set to false if you'd rather skip it

  /* ─── a closing line after the timeline (optional) ───────────── */

  storyQuote: "…and I'd choose every single one of these moments again.",

  /* ─── TIMELINE (Section 4) — add as many as you like ─────────── */

  timeline: [
    {
      date:   "31 May 2026",       // e.g. "September 2021"
      title:  "The first hello",
      text:   "A message that seemed ordinary at the time. It wasn't."
    },
    {
      date:   "23 August 2026",
      title:  "Realizing you were different",
      text:   "Our first time seeing each other,I was scared as hell to see you but you were so sweet."
    },
    {
      date:   "3 September 2026",
      title:  "The night everything changed",
      text:   "One specific evening I still replay in my head. You know the one."
    },
    {
      date:   "5th September",
      title:  "Our last time seeing each other in person",
      text:   "There wasn't a single big moment. It was a hundred small ones that all pointed at you."
    },
    {
      date:   "26 September 2026",
      title:  "Today",
      text:   "Your day. The best chapter so far — and we're nowhere near the end."
    }
  ],

  /* ─── MEMORIES (Section 5) — your photos ─────────────────────── */
  /* Add 6–10 photos for the best look. Sizes are mixed automatically. */

  memories: [
    {
      image:   "images/memory1.jpeg",   // ← replace with your real photo paths
      date:    "23 August 2026",
      title:   "Our first memory",
      note:    "First Date…"
    },
    {
      image:   "images/memory-2.jpeg",
      date:    "1 September 2026",
      title:   "Our First Time going to the park as a couple",
      note:    "Our First Reel moment"
    },
    {
      image:   "images/memory-3.jpeg",
      date:    "30 August 2026",
      title:   "Our first time being a couple",
      note:    "You make me look gay"
    },
    {
      image:   "images/memory-4.jpeg",
      date:    "3 September 2026",
      title:   "Ordinary Thursday, extraordinary you",
      note:    "Folkland Park with you was so fun"
    },
    {
      image:   "images/memory-5.jpeg",
      date:    "3 Septemner 2026",
      title:   "The potential i see",
      note:    ""
    },
    {
      image:   "images/memory-6.jpeg",
      date:    "4 Septemner 2026",
      title:   "Last Goodbye",
      note:    ""
    }
  ],

  /* ─── THINGS I LOVE ABOUT YOU (Section 6) ────────────────────── */

  loves: [
    { emoji: "☺", title: "Your smile",      text: "It rearranges my whole day in about two seconds." },
    { emoji: "♪", title: "Your laugh",      text: "The real one — the loud, unfiltered, can't-stop kind." },
    { emoji: "❤", title: "The way you care", text: "About people, about small things, about me. You never do it halfway." },
    { emoji: "✦", title: "Your little habits", text: "The ones you think nobody notices. I notice all of them." },
    { emoji: "☀", title: "How you make ordinary days better", text: "Groceries, traffic, rainy afternoons — somehow better with you in them." },
    { emoji: "∞", title: "Just… you.",       text: "Every version of you, on every kind of day." }
  ],

  /* ─── THE SECRET MESSAGE (Section 7) ─────────────────────────── */

  secret: {
    tease:   "You actually clicked it. Of course you did.",
    message: "If I had to choose one person to meet again in every lifetime…",
    message2:"I'd still look for you."
  },

  /* ─── FINAL LINES (Section 9) ────────────────────────────────── */

  finalLines: [
    "I hope this year gives you countless reasons to smile.",
    "And I hope I get to be there for many of them."
  ],

  footerNote: "Made with love, just for you."
};
