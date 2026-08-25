/* ============================================================
   EDIT THIS FILE — it is the only file you need to touch.

   Turn a section on or off with:  enabled: true  /  enabled: false
   Sections always render in this order:
      work → stats → services → brands → contact

   Anything marked  << REPLACE >>  is placeholder text.
   ============================================================ */

window.SITE = {

  /* ---------- IDENTITY ---------- */
  name: "Denes Garda",
  role: "UGC Creator",
  location: "New York, NY", // << REPLACE >>

  // The one line a brand reads first. Say what you make and who it's for.
  thesis: "Custom short-form video for brands that need content built for the feed, not repurposed for it.", // << REPLACE >>

  email: "hello@denesgarda.com", // << REPLACE >>

  // Shown as a live pill in the top bar. Set enabled:false to hide it.
  availability: {
    enabled: true,
    text: "Booking Q4 2026" // << REPLACE >>
  },

  // Small facts under the thesis. Add or remove freely.
  facts: [
    { label: "Formats", value: "9:16 · 4:5 · 1:1" },
    { label: "Turnaround", value: "5–7 days" },
    { label: "Usage", value: "Paid + organic" },
    { label: "Revisions", value: "2 included" }
  ],

  // Profile links. Shown in the contact block and the footer.
  socials: [
    { label: "TikTok",    url: "https://tiktok.com/@yourhandle" },     // << REPLACE >>
    { label: "Instagram", url: "https://instagram.com/yourhandle" },   // << REPLACE >>
    { label: "YouTube",   url: "https://youtube.com/@yourhandle" }     // << REPLACE >>
  ],


  sections: {

    /* ---------- SELECTED WORK — ON ---------- */
    work: {
      enabled: true,
      title: "Selected Work",
      // Drop .mp4 files and .jpg posters into assets/work/.
      // Leave `video` and `poster` empty and the tile shows a labelled slate.
      // `link` is optional — if set, clicking opens that URL instead of the player.
      items: [
        { brand: "Brand Name",  title: "Hook-first product demo", platform: "TikTok",    video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Unboxing, 3-scene cut",   platform: "Reels",     video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Testimonial, straight-to-camera", platform: "TikTok", video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Routine / day-in-the-life", platform: "Reels",   video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Problem → solution spot", platform: "Shorts",    video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Founder-style voiceover", platform: "TikTok",    video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Static-to-motion carousel", platform: "Reels",   video: "", poster: "", link: "" },
        { brand: "Brand Name",  title: "Green-screen explainer",  platform: "TikTok",    video: "", poster: "", link: "" }
      ]
    },

    /* ---------- PLATFORMS & REACH — OFF ---------- */
    stats: {
      enabled: false,
      title: "Platforms & Reach",
      note: "Rolling 90-day averages.",
      platforms: [
        { platform: "TikTok",    handle: "@yourhandle", url: "https://tiktok.com/@yourhandle",    followers: "00.0K", avgViews: "00.0K", engagement: "0.0%" },
        { platform: "Instagram", handle: "@yourhandle", url: "https://instagram.com/yourhandle",  followers: "00.0K", avgViews: "00.0K", engagement: "0.0%" },
        { platform: "YouTube",   handle: "@yourhandle", url: "https://youtube.com/@yourhandle",   followers: "00.0K", avgViews: "00.0K", engagement: "0.0%" }
      ],
      // Audience breakdown. Set to [] to hide this block.
      audience: [
        { label: "Top age range", value: "25–34" },
        { label: "Top market",    value: "United States" },
        { label: "Split",         value: "00% W / 00% M" }
      ]
    },

    /* ---------- SERVICES & RATES — OFF ---------- */
    services: {
      enabled: false,
      title: "Services & Rates",
      note: "Rates cover creation and 30-day paid usage. Extended and exclusive usage quoted per project.",
      packages: [
        {
          name: "Single Video",
          deliverables: ["1 hero video, up to 60s", "2 aspect ratios", "Raw footage on request"],
          price: "$000"
        },
        {
          name: "Content Pack",
          deliverables: ["3 hero videos", "6 hook variations", "All aspect ratios", "Ad-ready exports"],
          price: "$0,000"
        },
        {
          name: "Monthly Retainer",
          deliverables: ["8 videos per month", "Concepting + scripting", "Priority turnaround", "Quarterly performance review"],
          price: "$0,000/mo"
        }
      ],
      addons: [
        { name: "Additional usage term", price: "+00%" },
        { name: "Whitelisting / Spark Ads", price: "$000" },
        { name: "Rush delivery (48h)", price: "+00%" }
      ]
    },

    /* ---------- BRANDS — OFF ---------- */
    brands: {
      enabled: false,
      title: "Brands",
      note: "",
      // Plain names read cleaner than mismatched logos. Add a `url` to link one.
      list: [
        { name: "Brand One",   url: "" },
        { name: "Brand Two",   url: "" },
        { name: "Brand Three", url: "" },
        { name: "Brand Four",  url: "" },
        { name: "Brand Five",  url: "" },
        { name: "Brand Six",   url: "" }
      ],
      // Optional pull quote. Set to null to hide.
      quote: {
        text: "Placeholder testimonial — one or two sentences about what the content did for them.",
        attribution: "First Last, Title at Brand"
      }
    },

    /* ---------- CONTACT — always on ---------- */
    contact: {
      title: "Work with me",
      pitch: "Send the brief, the deadline, and where it's running. You'll get a quote back within one business day.",
      ctaLabel: "Start a project"
    }
  }
};
