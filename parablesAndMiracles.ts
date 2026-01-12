
export interface StorySubCategory {
  title: string;
  stories: string[];
}

export interface StorySuperCategory {
  title: string;
  color: string;
  subCategories: StorySubCategory[];
}

export const ALL_STORIES: StorySuperCategory[] = [
  {
    title: "Parables of Jesus",
    color: "border-lime-400",
    subCategories: [
      {
        title: "Kingdom of Heaven",
        stories: [ "The Sower", "The Mustard Seed", "The Leaven", "The Hidden Treasure", "The Pearl of Great Price", "The Net", "The Growing Seed", "The Weeds (Tares)" ],
      },
      {
        title: "Lost and Found",
        stories: [ "The Lost Sheep", "The Lost Coin", "The Prodigal Son" ],
      },
      {
        title: "Watchfulness & Readiness",
        stories: [ "The Ten Virgins", "The Faithful Servant", "The Talents", "The Ten Minas", "The Wise and Foolish Builders" ],
      },
      {
        title: "Grace & Forgiveness",
        stories: [ "The Unforgiving Servant", "The Two Debtors", "The Workers in the Vineyard", "The Good Samaritan" ],
      },
      {
        title: "Prayer & Humility",
        stories: [ "The Friend at Night", "The Persistent Widow", "The Pharisee and the Tax Collector", "The Lowest Seat at the Feast" ],
      },
      {
        title: "Wealth & Stewardship",
        stories: [ "The Rich Fool", "The Rich Man and Lazarus", "The Unjust Steward" ],
      },
      {
        title: "Judgment & The Future",
        stories: [ "The Sheep and the Goats", "The Wicked Tenants", "The Great Banquet", "The Barren Fig Tree", "The Budding Fig Tree" ],
      },
      {
        title: "Discipleship",
        stories: [ "The Good Shepherd", "The Speck and the Log", "The New Cloth on Old Garment", "The New Wine in Old Wineskins", "The Master and Servant", "The Tower and The Warring King", "The Two Sons", "The Lamp under a Bushel", "The Strong Man", "The Wedding Feast" ]
      }
    ]
  },
  {
    title: "Miracles of Jesus",
    color: "border-cyan-400",
    subCategories: [
      {
        title: "Healing the Sick",
        stories: [ "Healing Peter's Mother-in-Law", "Cleansing a Leper", "Healing a Paralytic", "Healing the Man with a Withered Hand", "Healing the Centurion's Servant", "Healing the Woman with an Issue of Blood", "Healing a Deaf Mute", "Healing a Blind Man at Bethsaida", "Healing the Man at the Pool of Bethesda", "Healing a Man with Dropsy", "Healing a Crippled Woman", "Cleansing Ten Lepers", "Healing the Nobleman's Son", "Healing Two Blind Men", "Healing a Man Born Blind", "Healing the Syrophoenician Woman's Daughter", "Restoring a Servant's Ear" ]
      },
      {
        title: "Power Over Nature",
        stories: [ "Turning Water into Wine", "The First Great Catch of Fish", "Calming the Storm", "Walking on Water", "Feeding the 5,000", "Withering the Fig Tree", "Feeding the 4,000", "The Coin in the Fish's Mouth", "The Second Great Catch of Fish" ]
      },
      {
        title: "Exorcisms",
        stories: [ "Casting Out an Unclean Spirit (Capernaum)", "Healing the Gerasene Demoniac", "Healing a Boy with a Demon" ]
      },
      {
        title: "Raising the Dead",
        stories: [ "Raising the Widow's Son", "Raising Jairus's Daughter", "Raising Lazarus" ]
      },
      {
        title: "Supernatural Events",
        stories: ["The Transfiguration"]
      }
    ]
  },
  {
    title: "Old Testament Miracles",
    color: "border-amber-400",
    subCategories: [
      {
        title: "Genesis & Exodus",
        stories: [ "Creation of the World", "Noah's Ark and the Flood", "The Confusion of Tongues (Babel)", "Isaac's Birth in Old Age", "Lot's Wife Turns to Salt", "Jacob Wrestling the Angel", "The Burning Bush", "The Plagues of Egypt", "Parting of the Red Sea", "Manna and Quail", "Water from the Rock" ]
      },
      {
        title: "Wilderness & Conquest",
        stories: [ "Aaron's Rod Buds", "The Bronze Serpent", "The Earth Swallows Korah", "Balaam's Donkey Speaks", "Parting of the Jordan River", "The Fall of Jericho", "Sun Stands Still", "Gideon's Fleece", "Samson Slays a Lion", "Samson Destroys the Temple" ]
      },
      {
        title: "Prophets & Kings",
        stories: [ "Death of Uzzah", "Elijah Fed by Ravens", "Elijah and the Prophets of Baal", "The Translation of Elijah", "Elisha and the Widow's Oil", "Elisha and the Axe Head", "Healing of Naaman", "Hezekiah's Healing & Shadow Returns", "Jonah and the Great Fish" ]
      },
      {
        title: "Exile",
        stories: [ "Shadrach, Meshach, and Abednego (Fiery Furnace)", "Handwriting on the Wall", "Daniel in the Lions' Den" ]
      }
    ]
  }
];
