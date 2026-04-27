export type FeedPostData = {
  id: string;
  type: "video" | "image";
  /**
   * For type="video": YouTube video ID (e.g. "dQw4w9WgXcQ") or full embed URL.
   * For type="image": image URL.
   */
  src: string;
  /** Optional poster/alt for images and accessibility */
  alt?: string;
  title: string;
  description: string;
};

/**
 * Feed content — edit freely. Each post follows the strict vertical stack:
 * Media → Title → Short description (~5–6 lines).
 */
export const posts: FeedPostData[] = [
  {
    id: "wedding-celebration",
    type: "video",
    src: "dQw4w9WgXcQ",
    title: "Wedding Celebration",
    description:
      "A high-energy Merengue set that turned the reception into a packed dance floor from the very first downbeat. Vibrant percussion, layered horns, and call-and-response vocals kept guests of every age moving until the final song. The bride and groom shared the floor with grandparents, kids, and surprise guests, and the night wrapped with a roaring conga line that wound through the entire venue. Pure celebration, start to finish.",
  },
  {
    id: "corporate-gala",
    type: "image",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1280&q=80",
    alt: "Live Latin band performing at a corporate gala",
    title: "Corporate Gala — Downtown Dallas",
    description:
      "An elegant evening for a Fortune 500 client that began with cocktail-hour bossa and bolero, then shifted into full Salsa and Merengue as the night took off. Our seven-piece lineup read the room beat for beat, mixing crowd-favorite classics with originals. Executives traded blazers for the dance floor, and the company's CEO requested an encore well past the planned set. Polished, professional, and unforgettable.",
  },
  {
    id: "studio-session",
    type: "video",
    src: "L_jWHffIx5E",
    title: "Studio Session — New Single Coming Soon",
    description:
      "Behind the scenes of our newest original recording: a slow-burn Salsa romántica that builds into an explosive montuno. We tracked live brass, three-part vocal harmonies, and a percussion section that filled the studio with energy you can feel through the speakers. Producer notes, dance breaks, and a lot of café cubano fueled the late-night sessions. Drop is coming soon — hit the News page to hear it first.",
  },
  {
    id: "festival-mainstage",
    type: "image",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1280&q=80",
    alt: "Festival main stage at sunset with cheering crowd",
    title: "Festival Mainstage at Sunset",
    description:
      "Headlining the Latin block at a regional festival under a perfect Texas sunset. Thousands of fans, a massive sound system, and a setlist designed to peak right as the sky turned gold. We opened with a Bachata medley, climbed through Salsa standards, and closed with a twelve-minute Merengue jam featuring an extended timbales solo. One of those nights the band will remember for a long, long time.",
  },
  {
    id: "private-quinceanera",
    type: "image",
    src: "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1280&q=80",
    alt: "Quinceañera celebration with live band",
    title: "Quinceañera Celebration",
    description:
      "A traditional waltz for the father-daughter dance, then straight into the celebration the family had been dreaming of for months. Our band led the surprise choreography, kept the energy high through dinner with smooth Latin jazz, and lit up the dance floor for the rest of the night. Families who hadn't danced together in years closed out the evening hand in hand. These are the nights we live for.",
  },
];
