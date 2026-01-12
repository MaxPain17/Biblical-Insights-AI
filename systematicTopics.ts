export interface SystematicSession {
    session: number;
    title: string;
    introduction: string;
    topics: string[];
}

export interface SystematicTopicCategory {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    introduction: string;
    sessions: SystematicSession[];
}

export const SYSTEMATIC_STUDY_TOPICS: SystematicTopicCategory[] = [
    {
        level: 'Beginner',
        introduction: "This plan focuses on the foundational pillars of Christian faith. Using simple, clear language, the goal is to build a solid understanding of the main story and message of the Bible.",
        sessions: [
            { 
                session: 1,
                title: "Foundational Concepts",
                introduction: "Start your journey by understanding what the Bible is, who God is as our Creator, and the core of the Christian faith.",
                topics: [
                    "What is the Bible?",
                    "Who is God? (Creator & Father)",
                    "What is Faith?",
                    "The Nature of Man (Made in God's Image)"
                ] 
            },
            { 
                session: 2,
                title: "The Core Narrative",
                introduction: "Explore the central story of the Bible: creation, humanity's fall into sin, and God's rescue plan through Jesus Christ.",
                topics: [
                    "Creation and the Fall (Sin)",
                    "The Promise of a Savior",
                    "Who is Jesus Christ?",
                    "The Crucifixion and Resurrection"
                ] 
            },
            { 
                session: 3,
                title: "The Christian Response",
                introduction: "Learn about the personal response to God's work, including how to be saved and what it means to live as a Christian.",
                topics: [
                    "Salvation: How to be saved",
                    "Repentance and Forgiveness",
                    "Who is the Holy Spirit?",
                    "Baptism and Communion"
                ] 
            },
            {
                session: 4,
                title: "Living as a Christian",
                introduction: "Discover the practical aspects of the Christian faith, including prayer, community, and sharing your faith with others.",
                topics: [
                    "Prayer: Talking with God",
                    "The Church: God's Family",
                    "Reading the Bible for Growth",
                    "The Great Commission: Sharing the Gospel"
                ]
            }
        ]
    },
    {
        level: 'Intermediate',
        introduction: "Build upon foundational knowledge to explore deeper theological concepts and the interconnectedness of Scripture. This plan assumes you know the main Bible stories.",
        sessions: [
            { 
                session: 1,
                title: "Deepening the Doctrine of God",
                introduction: "Move beyond the basics to understand God's attributes, the nature of the Trinity, and the reliability of the Bible itself.",
                topics: [
                    "Theology Proper: God's Attributes",
                    "The Doctrine of the Trinity",
                    "Bibliology: Inspiration, Inerrancy, and Canon",
                    "God's Providence"
                ] 
            },
            { 
                session: 2,
                title: "The Person & Work of Christ",
                introduction: "Focus on the specifics of who Jesus is and what He accomplished for believers through His life, death, and resurrection.",
                topics: [
                    "Christology: The Hypostatic Union (Fully God, Fully Man)",
                    "The Atonement: Theories and Meaning",
                    "The Threefold Office: Prophet, Priest, and King",
                    "The Resurrection and Ascension of Christ"
                ] 
            },
            { 
                session: 3,
                title: "The Holy Spirit, Covenants, and the Church",
                introduction: "Trace God's unfolding plan through His covenants, understand the role of the Holy Spirit, and define the mission of the Church.",
                topics: [
                    "Pneumatology: The Person and work of the Holy Spirit",
                    "Spiritual Gifts",
                    "Covenant Theology: Tracing God's Redemptive Plan",
                    "Ecclesiology: The Nature and Mission of the Church"
                ] 
            },
            {
                session: 4,
                title: "Humanity & Salvation",
                introduction: "Explore the biblical doctrines of humanity's creation in God's image, the nature of sin, and the logical order of salvation.",
                topics: [
                    "Biblical Anthropology: The Image of God (Imago Dei)",
                    "Hamartiology: The Doctrine of Sin",
                    "Soteriology: The Order of Salvation (Ordo Salutis)",
                    "The Doctrine of Justification by Faith"
                ]
            }
        ]
    },
    {
        level: 'Advanced',
        introduction: "Engage with complex theological issues, historical debates, and nuanced interpretations. This plan expects familiarity with systematic theological categories.",
        sessions: [
            { 
                session: 1,
                title: "Prolegomena and Soteriological Debates",
                introduction: "Examine the foundations of theological study and dive into the historic debates surrounding the doctrine of salvation.",
                topics: [
                    "Prolegomena & Bibliology: Authority, Hermeneutics, and Textual Criticism",
                    "Soteriology: Comparing Calvinism and Arminianism",
                    "The Doctrine of Election and Predestination",
                    "The Extent of the Atonement"
                ] 
            },
            { 
                session: 2,
                title: "Christology, Angelology, and Theodicy",
                introduction: "Analyze advanced Christological concepts, explore what the Bible teaches about spiritual beings, and tackle the problem of evil.",
                topics: [
                    "Advanced Christology: Kenosis and Impeccability",
                    "Angelology & Demonology: Spiritual Beings",
                    "The Intermediate State (Heaven, Hell, Sheol)",
                    "Theodicy: The Problem of Evil and Suffering"
                ] 
            },
            { 
                session: 3,
                title: "Eschatology and Christian Ethics",
                introduction: "Study the major viewpoints on end times and learn to apply robust biblical principles to complex modern ethical issues.",
                topics: [
                    "Eschatology: Comparing Millennial Views",
                    "The Kingdom of God: Inaugurated Eschatology",
                    "Christian Ethics: Frameworks and Application",
                    "The Final Judgment and Eternal State"
                ] 
            },
            {
                session: 4,
                title: "Historical & Contemporary Theology",
                introduction: "Survey the development of doctrine through key historical moments and engage with significant theological challenges in the modern era.",
                topics: [
                    "The Creeds and Ecumenical Councils",
                    "The Theology of the Reformation",
                    "Post-Reformation Developments (Puritanism, Pietism)",
                    "Modern Theological Challenges"
                ]
            }
        ]
    }
];