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
  location: "Irvine, CA",

  // The one line a brand reads first. Keep it plain.
  thesis: "I make short-form video for brands.", // << REPLACE >>

  email: "hello@denesgarda.com", // << REPLACE >>

  // A status line in the top bar, e.g. "Open to new projects".
  // Off for now — turn it on when you actually want to signal availability.
  availability: {
    enabled: false,
    text: "Open to new projects"
  },

  // Optional facts under the thesis. Empty = the block is hidden.
  // Worth adding once you have real answers (turnaround, usage terms).
  facts: [],

  // Profile links, shown in the contact block.
  socials: [
    { label: "TikTok", url: "https://tiktok.com/@denes0114" }
    // Instagram removed — @denesgarda is a personal account and this page is
    // public. Add a separate creator account here when there is one.
  ],


  sections: {

    /* ---------- SAMPLES — ON ---------- */
    work: {
      enabled: true,
      title: "Samples",
      // Drop .mp4 files and .jpg posters into assets/work/.
      // Leave `video` and `poster` empty and the tile shows a labelled slate.
      // `link` is optional — if set, clicking opens that URL instead of the player.
      //
      // `brand` is optional and empty on purpose. Adding one says "this was a
      // paid job for that company", so only fill it in when that's true.
      items: [
        { title: "Product demo",        brand: "", video: "", poster: "", link: "" },
        { title: "Unboxing",            brand: "", video: "", poster: "", link: "" },
        { title: "Straight-to-camera",  brand: "", video: "", poster: "", link: "" },
        { title: "Problem → solution",  brand: "", video: "", poster: "", link: "" },
        { title: "Voiceover explainer", brand: "", video: "", poster: "", link: "" },
        { title: "Green screen",        brand: "", video: "", poster: "", link: "" }
      ]
    },

    /* ---------- PLATFORMS & REACH — OFF ---------- */
    stats: {
      enabled: false,
      title: "Platforms & Reach",
      note: "Rolling 90-day averages.",
      platforms: [
        { platform: "TikTok", handle: "@denes0114", url: "https://tiktok.com/@denes0114", followers: "00.0K", avgViews: "00.0K", engagement: "0.0%" }
        // Add the creator Instagram here once it exists — not the personal one.
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
      title: "Get in touch",
      // Optional. Empty = just the email address and your links.
      pitch: ""
    }
  }
};
