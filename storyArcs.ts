
export interface StoryArcCategory {
  title: string;
  color: string;
  arcs: string[];
}

export const CATEGORIZED_STORY_ARCS: StoryArcCategory[] = [
    {
        title: "Primeval History (Genesis 1-11)",
        color: "border-rose-400",
        arcs: [
            "The Creation and Fall",
            "The Story of Cain and Abel",
            "Noah and the Flood",
            "The Tower of Babel"
        ]
    },
    {
        title: "The Patriarchs (Genesis 12-50)",
        color: "border-amber-400",
        arcs: [
            "The Life of Abraham",
            "The Life of Isaac",
            "The Life of Jacob",
            "The Story of Joseph"
        ]
    },
    {
        title: "Israel's Formation & Early History",
        color: "border-sky-400",
        arcs: [
            "The Life of Moses",
            "The Exodus and Wilderness Wanderings",
            "The Giving of the Law at Sinai",
            "The Conquest of Canaan (Joshua)",
            "The Period of the Judges",
            "The Story of Gideon",
            "The Story of Samson",
            "The Story of Ruth"
        ]
    },
    {
        title: "The United & Divided Kingdom",
        color: "border-indigo-400",
        arcs: [
            "The Life of Samuel",
            "The Reign of King Saul",
            "The Life of David",
            "David and Goliath",
            "The Reign of King Solomon",
            "The Divided Kingdom"
        ]
    },
    {
        title: "Prophets & Exile",
        color: "border-purple-400",
        arcs: [
            "The Ministry of Elijah",
            "The Ministry of Elisha",
            "The Story of Jonah",
            "The Ministry of Isaiah",
            "The Ministry of Jeremiah",
            "The Story of Daniel",
            "The Fiery Furnace (Shadrach, Meshach, and Abednego)",
            "Daniel in the Lions' Den",
            "Israel's Exile and Return",
            "The Rebuilding under Ezra and Nehemiah",
            "The Story of Esther"
        ]
    },
    {
        title: "Wisdom & Poetic Narratives",
        color: "border-teal-400",
        arcs: [
            "The Story of Job",
        ]
    },
    {
        title: "The Life of Christ & The Early Church",
        color: "border-lime-400",
        arcs: [
            "The Birth and Early Life of Jesus",
            "The Life and Ministry of Jesus",
            "The Sermon on the Mount",
            "The Passion Week",
            "The Resurrection and Ascension",
            "The Early Church in Acts",
            "The Day of Pentecost",
            "The Ministry of Peter",
            "The Conversion and Journeys of Paul",
            "The Apocalyptic Vision of John (Revelation)"
        ]
    }
];