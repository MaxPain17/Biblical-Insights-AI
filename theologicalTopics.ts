export interface TopicCategory {
  title: string;
  color: string;
  topics: string[];
}

export const CATEGORIZED_TOPICS: TopicCategory[] = [
    {
        title: "Theology Proper (Doctrine of God)",
        color: "border-rose-400",
        topics: [ "Aseity", "Attributes of God", "Eternity of God", "Glory of God", "Goodness", "Holiness", "Immanence", "Immutability", "Jealousy", "Justice", "Longsuffering", "Omnipotence", "Omnipresence", "Omniscience", "Providence", "Sovereignty", "Transcendence", "Trinity", "Wisdom of God", "Wrath" ].sort()
    },
    {
        title: "Christology (Person & Work of Christ)",
        color: "border-amber-400",
        topics: [ "Ascension", "Atonement", "Exaltation of Christ", "Humiliation of Christ", "Hypostatic Union", "Impeccability of Christ", "Incarnation", "Kenosis", "Logos", "Messiah", "Parousia", "Pre-existence of Christ", "Prophet, Priest, and King", "Resurrection", "Second Coming", "Threefold Office", "Vicarious Atonement" ].sort()
    },
    {
        title: "Pneumatology (Doctrine of the Holy Spirit)",
        color: "border-yellow-400",
        topics: [ "Baptism of the Holy Spirit", "Blasphemy against the Holy Spirit", "Filling of the Spirit", "Fruit of the Spirit", "Gifts of the Spirit", "Holy Spirit", "Illumination", "Indwelling", "Paraclete", "Sealing of the Spirit" ].sort()
    },
    {
        title: "Bibliology (Doctrine of Scripture)",
        color: "border-violet-400",
        topics: [ "Apocrypha", "Canon of Scripture", "Clarity of Scripture (Perspicuity)", "Exegesis", "Hermeneutics", "Inerrancy", "Infallibility", "Inspiration", "Necessity of Scripture", "Revelation", "Sufficiency of Scripture" ].sort()
    },
    {
        title: "Anthropology (Doctrine of Humanity)",
        color: "border-green-400",
        topics: [ "Body, Soul, & Spirit", "Conscience", "Dichotomy vs. Trichotomy", "Federal Headship", "Human Nature", "Image of God (Imago Dei)" ].sort()
    },
    {
        title: "Hamartiology (Doctrine of Sin)",
        color: "border-fuchsia-400",
        topics: [ "Fall of Man", "Imputed Sin", "Original Sin", "Personal Sin", "Sin", "Temptation", "Total Depravity" ].sort()
    },
    {
        title: "Soteriology (Doctrine of Salvation)",
        color: "border-sky-400",
        topics: [ "Adoption", "Assurance", "Calling (General/Effectual)", "Common Grace", "Conversion", "Efficacious Grace", "Election", "Faith", "Foreknowledge", "Free Will", "Glorification", "Grace", "Irresistible Grace", "Justification", "Limited Atonement", "Lordship Salvation", "Penal Substitutionary Atonement", "Perseverance of the Saints", "Predestination", "Prevenient Grace", "Redemption", "Regeneration", "Repentance", "Sanctification", "Unconditional Election" ].sort()
    },
    {
        title: "Ecclesiology (Doctrine of the Church)",
        color: "border-teal-400",
        topics: [ "Baptism", "Church", "Church Discipline", "Deacon", "Elder", "Eldership", "Fellowship", "Mission of the Church", "Ordinances", "Sacraments", "Spiritual Gifts", "The Body of Christ", "The Local Church", "The Lord's Supper", "The Universal Church", "Worship" ].sort()
    },
    {
        title: "Christian Living & Ethics",
        color: "border-indigo-400",
        topics: [ "Discipleship", "Doubt", "Family", "Fasting", "Forgiveness", "Giving", "Hope", "Hospitality", "Idolatry", "Joy", "Love", "Marriage", "Mercy", "Obedience", "Patience", "Peace", "Piety", "Prayer", "Sabbath", "Stewardship", "Suffering", "The Great Commission", "Tithe", "Vocation/Calling" ].sort()
    },
    {
        title: "Covenant & Kingdom Theology",
        color: "border-purple-400",
        topics: [ "Abrahamic Covenant", "Covenant", "Covenant of Grace", "Covenant of Works", "Davidic Covenant", "Kingdom of God", "Law", "Mosaic Covenant", "New Covenant", "Noahic Covenant", "Old Covenant" ].sort()
    },
    {
        title: "Angelology & Demonology",
        color: "border-cyan-400",
        topics: [ "Angels", "Cherubim", "Demons", "Heaven", "Hell", "Principalities and Powers", "Satan", "Seraphim", "Sheol", "Spiritual Warfare" ].sort()
    },
    {
        title: "Eschatology (End Times)",
        color: "border-lime-400",
        topics: [ "Amillennialism", "Antichrist", "Day of the Lord", "Eschatology", "Final Judgement", "Great White Throne Judgment", "Millennium", "New Heavens and New Earth", "Postmillennialism", "Premillennialism", "Rapture", "The Great Tribulation" ].sort()
    },
     {
        title: "Systematic & Historical Theology",
        color: "border-orange-400",
        topics: [ "Apologetics", "Arianism", "Arminianism", "Calvinism", "Covenant Theology", "Dispensationalism", "Gnosticism", "Patristics", "Pelagianism", "Sola Fide", "Sola Gratia", "Sola Scriptura", "Soli Deo Gloria", "Solus Christus", "Theodicy" ].sort()
    }
];
