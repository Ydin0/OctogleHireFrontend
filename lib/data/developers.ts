export interface WorkHistoryItem {
  company: string;
  role: string;
  duration: string;
  description: string;
  techUsed: string[];
  companyDomain?: string;
}

export interface Review {
  author: string;
  authorRole: string;
  authorAvatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface Award {
  title: string;
  issuer: string;
  year: string;
}

export interface Developer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  skills: string[];
  rating: number;
  projects: number;
  hourlyRate: number;
  monthlyRate: number;
  location: string;
  yearsOfExperience: number;
  bio: string;
  about: string;
  workHistory: WorkHistoryItem[];
  achievements: string[];
  education: Education[];
  awards: Award[];
  reviews?: Review[];
}

export const TECH_STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Tailwind CSS",
  "Vue.js",
  "React Native",
  "Terraform",
  "Firebase",
] as const;

export const MARKETPLACE_TECH_STACK_OPTIONS = [
  ...new Set([
    ...TECH_STACKS,
    "JavaScript",
    "Java",
    "C#",
    "C++",
    "C",
    "Ruby",
    "PHP",
    "Dart",
    "Scala",
    "Elixir",
    "Haskell",
    "Clojure",
    "Lua",
    "Perl",
    "R",
    "MATLAB",
    "Julia",
    "Objective-C",
    "Solidity",
    "Bash",
    "PowerShell",
    "F#",
    "Groovy",
    "Visual Basic",
    "Assembly",
    "Fortran",
    "COBOL",
    "Erlang",
    "Nim",
    "OCaml",
    "Nuxt.js",
    "Angular",
    "Svelte",
    "SvelteKit",
    "Remix",
    "Astro",
    "Qwik",
    "SolidJS",
    "Ember.js",
    "Backbone.js",
    "jQuery",
    "Bootstrap",
    "Material UI",
    "Chakra UI",
    "Ant Design",
    "Redux",
    "Zustand",
    "MobX",
    "Storybook",
    "Flutter",
    "Ionic",
    "Xamarin",
    "Express",
    "NestJS",
    "Fastify",
    "Django",
    "Flask",
    "FastAPI",
    "Ruby on Rails",
    "Laravel",
    "Spring Boot",
    "ASP.NET Core",
    "Phoenix",
    "Gin",
    "Fiber",
    "Apollo",
    "tRPC",
    "gRPC",
    "REST APIs",
    "MySQL",
    "MariaDB",
    "SQLite",
    "Redis",
    "DynamoDB",
    "Cassandra",
    "Couchbase",
    "Elasticsearch",
    "OpenSearch",
    "Neo4j",
    "Supabase",
    "Prisma",
    "Drizzle",
    "TypeORM",
    "Sequelize",
    "Mongoose",
    "Ansible",
    "Pulumi",
    "Helm",
    "Jenkins",
    "GitHub Actions",
    "GitLab CI",
    "CircleCI",
    "ArgoCD",
    "Prometheus",
    "Grafana",
    "Datadog",
    "New Relic",
    "Sentry",
    "Nginx",
    "Apache Kafka",
    "RabbitMQ",
    "Google Cloud",
    "Azure",
    "Cloudflare",
    "Vercel",
    "Netlify",
    "DigitalOcean",
    "Heroku",
    "Linode",
    "Snowflake",
    "BigQuery",
    "Apache Spark",
    "Hadoop",
    "Airflow",
    "dbt",
    "Tableau",
    "Power BI",
    "TensorFlow",
    "PyTorch",
    "scikit-learn",
    "OpenCV",
    "Unity",
    "Unreal Engine",
    "WordPress",
    "Shopify",
    "Salesforce",
  ]),
].sort((a, b) => a.localeCompare(b));

export const COUNTRY_OPTIONS = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export const JOB_TITLE_OPTIONS = [
  "Frontend Engineer",
  "Senior Frontend Engineer",
  "Backend Engineer",
  "Senior Backend Engineer",
  "Full Stack Engineer",
  "Senior Full Stack Engineer",
  "Mobile Engineer",
  "iOS Engineer",
  "Android Engineer",
  "React Native Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Platform Engineer",
  "Site Reliability Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Technical Architect",
  "Solutions Architect",
  "Software Engineer",
  "Staff Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Product Engineer",
  "QA Engineer",
  "Automation QA Engineer",
  "Security Engineer",
  "Blockchain Engineer",
  "Game Developer",
  "Embedded Engineer",
  "Firmware Engineer",
  "AR/VR Engineer",
  "UI Engineer",
  "UX Engineer",
  "Design Engineer",
  "Data Scientist",
  "Data Analyst",
  "BI Engineer",
  "MLOps Engineer",
  "Database Administrator",
  "Systems Engineer",
  "Infrastructure Engineer",
  "Network Engineer",
  "Technical Lead",
  "Tech Lead",
  "Scrum Master",
  "Product Manager",
  "CTO",
  "VP Engineering",
  "Head of Engineering",
  "Research Engineer",
].sort((a, b) => a.localeCompare(b));

export const developers: Developer[] = [
  {
    id: "sofia-martinez",
    name: "Sofia Martinez",
    role: "Senior Frontend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    rating: 4.9,
    projects: 89,
    hourlyRate: 75,
    monthlyRate: 12000,
    location: "Buenos Aires, Argentina",
    yearsOfExperience: 7,
    bio: "Building performant, accessible interfaces with React and TypeScript. Passionate about design systems and component architecture.",
    about:
      "I'm a senior frontend engineer with 7 years of experience building production-grade web applications. My core expertise lies in React and TypeScript, where I focus on creating performant, accessible, and maintainable user interfaces. I'm deeply passionate about design systems, component architecture, and bridging the gap between design and engineering to deliver pixel-perfect experiences.",
    workHistory: [
      {
        company: "Vercel",
        role: "Senior Frontend Engineer",
        duration: "Mar 2023 – Present",
        description:
          "Leading frontend architecture for the dashboard experience. Rebuilt the deployment flow UI, improving user task completion by 34%. Championed adoption of server components across the product.",
        techUsed: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        companyDomain: "vercel.com",
      },
      {
        company: "MercadoLibre",
        role: "Frontend Engineer",
        duration: "Jan 2020 – Feb 2023",
        description:
          "Built and maintained the seller dashboard used by 2M+ merchants across Latin America. Led the design system migration from styled-components to Tailwind CSS.",
        techUsed: ["React", "TypeScript", "Tailwind CSS"],
        companyDomain: "mercadolibre.com",
      },
      {
        company: "Globant",
        role: "Junior Frontend Developer",
        duration: "Jun 2018 – Dec 2019",
        description:
          "Worked on client projects for Fortune 500 companies. Developed reusable component libraries and contributed to internal design system tooling.",
        techUsed: ["React", "TypeScript"],
        companyDomain: "globant.com",
      },
    ],
    achievements: [
      "Improved deployment flow task completion by 34% at Vercel",
      "Led design system migration for 2M+ merchant platform",
      "Built component libraries used across Fortune 500 projects",
    ],
    education: [
      {
        institution: "Universidad de Buenos Aires",
        degree: "BS",
        field: "Computer Science",
        year: "2017",
      },
    ],
    awards: [
      {
        title: "React Summit Speaker 2024",
        issuer: "GitNation",
        year: "2024",
      },
      {
        title: "Google Developer Expert — Web Technologies",
        issuer: "Google",
        year: "2023",
      },
    ],
  },
  {
    id: "david-kimani",
    name: "David Kimani",
    role: "Full Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["Node.js", "Python", "AWS", "PostgreSQL", "Docker"],
    rating: 4.8,
    projects: 142,
    hourlyRate: 90,
    monthlyRate: 14500,
    location: "Nairobi, Kenya",
    yearsOfExperience: 9,
    bio: "Full stack engineer specializing in scalable cloud architectures. Building robust APIs and microservices on AWS.",
    about:
      "I'm a full stack engineer with 9 years of experience designing and building scalable cloud-native applications. I specialize in Node.js and Python backends deployed on AWS, with deep expertise in microservices architecture, API design, and database optimization. I've led engineering teams across multiple startups and have a track record of shipping products that handle millions of requests per day.",
    workHistory: [
      {
        company: "Andela",
        role: "Senior Full Stack Engineer",
        duration: "Jun 2022 – Present",
        description:
          "Architecting microservices for the talent matching platform. Reduced API response times by 60% through caching strategies and query optimization. Mentoring a team of 5 engineers.",
        techUsed: ["Node.js", "Python", "AWS", "PostgreSQL"],
        companyDomain: "andela.com",
      },
      {
        company: "Twiga Foods",
        role: "Backend Engineer",
        duration: "Sep 2019 – May 2022",
        description:
          "Built the order management and logistics API powering 50K+ daily transactions. Designed the event-driven architecture for real-time delivery tracking.",
        techUsed: ["Python", "PostgreSQL", "Docker", "AWS"],
        companyDomain: "twigafoods.com",
      },
      {
        company: "Safaricom (M-Pesa)",
        role: "Software Engineer",
        duration: "Jan 2017 – Aug 2019",
        description:
          "Contributed to payment processing APIs handling millions of mobile money transactions. Implemented monitoring and alerting systems for critical payment flows.",
        techUsed: ["Node.js", "PostgreSQL", "Docker"],
        companyDomain: "safaricom.co.ke",
      },
    ],
    achievements: [
      "Reduced API response times by 60% through caching optimization",
      "Built logistics API powering 50K+ daily transactions",
      "Contributed to M-Pesa APIs processing millions of transactions",
    ],
    education: [
      {
        institution: "University of Nairobi",
        degree: "BS",
        field: "Software Engineering",
        year: "2016",
      },
    ],
    awards: [
      {
        title: "AWS Certified Solutions Architect — Professional",
        issuer: "Amazon Web Services",
        year: "2023",
      },
      {
        title: "Andela Senior Fellow",
        issuer: "Andela",
        year: "2024",
      },
    ],
  },
  {
    id: "mei-lin-chen",
    name: "Mei-Lin Chen",
    role: "Backend & DevOps Engineer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    skills: ["Go", "Kubernetes", "Terraform", "Docker", "AWS"],
    rating: 5.0,
    projects: 63,
    hourlyRate: 110,
    monthlyRate: 17500,
    location: "Taipei, Taiwan",
    yearsOfExperience: 11,
    bio: "Infrastructure and backend specialist. Designing high-availability systems with Go and Kubernetes at scale.",
    about:
      "I'm a backend and DevOps engineer with 11 years of experience building high-availability distributed systems. My expertise spans Go microservices, Kubernetes orchestration, and infrastructure-as-code with Terraform. I've designed and operated platforms serving billions of requests, and I'm passionate about reliability engineering, observability, and reducing operational toil through automation.",
    workHistory: [
      {
        company: "TSMC (Cloud Platform)",
        role: "Principal DevOps Engineer",
        duration: "Apr 2022 – Present",
        description:
          "Designed and built the internal developer platform serving 3,000+ engineers. Implemented GitOps workflows with ArgoCD, reducing deployment times from hours to minutes.",
        techUsed: ["Kubernetes", "Terraform", "Go", "AWS"],
        companyDomain: "tsmc.com",
      },
      {
        company: "PicCollage",
        role: "Senior Backend Engineer",
        duration: "Aug 2018 – Mar 2022",
        description:
          "Built the image processing pipeline handling 10M+ daily uploads. Led the migration from monolith to microservices architecture on Kubernetes.",
        techUsed: ["Go", "Docker", "Kubernetes", "AWS"],
        companyDomain: "piccollage.com",
      },
      {
        company: "Trend Micro",
        role: "Backend Developer",
        duration: "Jan 2015 – Jul 2018",
        description:
          "Developed threat detection services processing real-time security data streams. Built automated infrastructure provisioning reducing setup time by 80%.",
        techUsed: ["Go", "Docker", "Terraform"],
        companyDomain: "trendmicro.com",
      },
    ],
    achievements: [
      "Designed developer platform serving 3,000+ engineers",
      "Led monolith-to-microservices migration with zero downtime",
      "Achieved perfect 5.0 client rating across all engagements",
    ],
    education: [
      {
        institution: "National Taiwan University",
        degree: "MS",
        field: "Computer Science",
        year: "2014",
      },
    ],
    awards: [
      {
        title: "Certified Kubernetes Administrator (CKA)",
        issuer: "CNCF",
        year: "2022",
      },
      {
        title: "HashiCorp Certified: Terraform Associate",
        issuer: "HashiCorp",
        year: "2023",
      },
    ],
  },
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    role: "Mobile & React Native Dev",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "TypeScript"],
    rating: 4.7,
    projects: 108,
    hourlyRate: 85,
    monthlyRate: 13500,
    location: "Mumbai, India",
    yearsOfExperience: 6,
    bio: "Cross-platform mobile developer delivering polished apps for iOS and Android. Strong focus on performance and UX.",
    about:
      "I'm a mobile developer with 6 years of experience shipping cross-platform and native apps for iOS and Android. My primary toolkit is React Native for cross-platform work, with deep native knowledge in Swift and Kotlin for performance-critical features. I've shipped apps used by millions and I obsess over smooth animations, offline-first architecture, and pixel-perfect UX.",
    workHistory: [
      {
        company: "Swiggy",
        role: "Senior Mobile Engineer",
        duration: "Jan 2023 – Present",
        description:
          "Leading the React Native rewrite of the delivery partner app used by 300K+ drivers. Improved app startup time by 45% and reduced crash rate to under 0.1%.",
        techUsed: ["React Native", "TypeScript", "Firebase"],
        companyDomain: "swiggy.com",
      },
      {
        company: "CRED",
        role: "Mobile Developer",
        duration: "Mar 2021 – Dec 2022",
        description:
          "Built payment and rewards features in the flagship iOS and Android apps. Implemented biometric authentication and real-time transaction tracking.",
        techUsed: ["Swift", "Kotlin", "Firebase"],
        companyDomain: "cred.club",
      },
      {
        company: "Freelance",
        role: "Mobile App Developer",
        duration: "Jun 2019 – Feb 2021",
        description:
          "Developed 15+ mobile apps for startups across fintech, health, and e-commerce. Managed end-to-end delivery from design to App Store deployment.",
        techUsed: ["React Native", "TypeScript", "Firebase"],
      },
    ],
    achievements: [
      "Improved app startup time by 45% for 300K+ daily users",
      "Reduced crash rate to under 0.1% on delivery partner app",
      "Shipped 15+ mobile apps across fintech, health, and e-commerce",
    ],
    education: [
      {
        institution: "Indian Institute of Technology Bombay",
        degree: "BTech",
        field: "Computer Engineering",
        year: "2019",
      },
    ],
    awards: [
      {
        title: "Google Associate Android Developer",
        issuer: "Google",
        year: "2021",
      },
      {
        title: "Winner — AngelHack Mumbai 2020",
        issuer: "AngelHack",
        year: "2020",
      },
    ],
  },
  {
    id: "emma-larsson",
    name: "Emma Larsson",
    role: "Frontend & Design Engineer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "GraphQL"],
    rating: 4.9,
    projects: 74,
    hourlyRate: 80,
    monthlyRate: 13000,
    location: "Stockholm, Sweden",
    yearsOfExperience: 5,
    bio: "Design-minded frontend engineer bridging the gap between design and code. Expert in modern CSS and animation.",
    about:
      "I'm a frontend and design engineer with 5 years of experience creating beautiful, interactive web experiences. I work at the intersection of design and engineering, specializing in React, Vue.js, and modern CSS including animations and micro-interactions. I believe great frontend engineering is invisible — users should feel the quality without thinking about the technology behind it.",
    workHistory: [
      {
        company: "Spotify",
        role: "Frontend Engineer",
        duration: "Sep 2023 – Present",
        description:
          "Building interactive features for the Spotify for Artists dashboard. Led the redesign of the analytics visualization suite, improving data comprehension scores by 28%.",
        techUsed: ["React", "TypeScript", "GraphQL"],
        companyDomain: "spotify.com",
      },
      {
        company: "Klarna",
        role: "UI Engineer",
        duration: "Feb 2021 – Aug 2023",
        description:
          "Developed the checkout experience used by 150M+ consumers. Created the animation system for the Klarna app's onboarding flow.",
        techUsed: ["React", "TypeScript", "Tailwind CSS"],
        companyDomain: "klarna.com",
      },
      {
        company: "Ueno (Design Agency)",
        role: "Frontend Developer",
        duration: "Jun 2020 – Jan 2021",
        description:
          "Built award-winning interactive websites for global brands. Specialized in scroll-driven animations and creative coding with WebGL.",
        techUsed: ["Vue.js", "TypeScript", "Tailwind CSS"],
        companyDomain: "ueno.co",
      },
    ],
    achievements: [
      "Improved data comprehension scores by 28% at Spotify",
      "Built checkout animations that measurably improved conversion rates",
      "Created award-winning interactive websites at Ueno",
    ],
    education: [
      {
        institution: "KTH Royal Institute of Technology",
        degree: "BS",
        field: "Computer Science",
        year: "2020",
      },
    ],
    awards: [
      {
        title: "Awwwards Developer of the Year Nominee",
        issuer: "Awwwards",
        year: "2023",
      },
      {
        title: "CSS Design Awards — Judge",
        issuer: "CSS Design Awards",
        year: "2024",
      },
    ],
  },
  {
    id: "james-okonkwo",
    name: "James Okonkwo",
    role: "Backend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    skills: ["Python", "PostgreSQL", "Docker", "GraphQL", "AWS"],
    rating: 4.6,
    projects: 97,
    hourlyRate: 70,
    monthlyRate: 11000,
    location: "Lagos, Nigeria",
    yearsOfExperience: 8,
    bio: "Python backend specialist building data-driven applications. Experienced with large-scale API design and database optimization.",
    about:
      "I'm a backend engineer with 8 years of experience building data-intensive applications with Python. I specialize in API design, database optimization, and building reliable backend services that power complex products. My experience spans fintech, e-commerce, and SaaS, and I'm passionate about writing clean, well-tested code that scales gracefully.",
    workHistory: [
      {
        company: "Paystack (Stripe)",
        role: "Senior Backend Engineer",
        duration: "May 2022 – Present",
        description:
          "Building payment processing APIs for merchants across Africa. Designed the reconciliation system handling $2B+ in annual transactions.",
        techUsed: ["Python", "PostgreSQL", "Docker", "AWS"],
        companyDomain: "paystack.com",
      },
      {
        company: "Flutterwave",
        role: "Backend Developer",
        duration: "Jan 2020 – Apr 2022",
        description:
          "Developed the merchant onboarding and KYC verification pipeline. Built GraphQL APIs for the merchant dashboard serving 300K+ businesses.",
        techUsed: ["Python", "GraphQL", "PostgreSQL", "Docker"],
        companyDomain: "flutterwave.com",
      },
      {
        company: "Konga (E-commerce)",
        role: "Software Engineer",
        duration: "Mar 2017 – Dec 2019",
        description:
          "Built the product catalog and search backend for Nigeria's largest e-commerce platform. Optimized database queries reducing page load times by 55%.",
        techUsed: ["Python", "PostgreSQL", "AWS"],
        companyDomain: "konga.com",
      },
    ],
    achievements: [
      "Designed reconciliation system handling $2B+ in annual transactions",
      "Built GraphQL APIs serving 300K+ businesses",
      "Optimized queries reducing page load times by 55%",
    ],
    education: [
      {
        institution: "University of Lagos",
        degree: "BS",
        field: "Computer Science",
        year: "2016",
      },
    ],
    awards: [
      {
        title: "AWS Certified Developer — Associate",
        issuer: "Amazon Web Services",
        year: "2022",
      },
    ],
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    role: "Systems Engineer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["Rust", "Go", "Docker", "Kubernetes", "PostgreSQL"],
    rating: 4.8,
    projects: 52,
    hourlyRate: 120,
    monthlyRate: 19000,
    location: "Tokyo, Japan",
    yearsOfExperience: 10,
    bio: "Systems programmer specializing in high-performance computing. Building low-latency services with Rust and Go.",
    about:
      "I'm a systems engineer with 10 years of experience building high-performance, low-latency software. I work primarily in Rust and Go, focusing on systems programming, real-time data processing, and performance-critical infrastructure. I've built trading systems, real-time analytics engines, and distributed databases, always pushing for maximum efficiency and reliability.",
    workHistory: [
      {
        company: "LINE Corporation",
        role: "Senior Systems Engineer",
        duration: "Feb 2022 – Present",
        description:
          "Building real-time messaging infrastructure serving 200M+ monthly active users. Rewrote the message routing layer in Rust, achieving 3x throughput improvement.",
        techUsed: ["Rust", "Go", "Kubernetes"],
        companyDomain: "line.me",
      },
      {
        company: "Mercari",
        role: "Backend Engineer",
        duration: "Apr 2019 – Jan 2022",
        description:
          "Developed the search and recommendation engine for Japan's largest marketplace app. Built real-time indexing pipeline processing 50K events per second.",
        techUsed: ["Go", "PostgreSQL", "Docker", "Kubernetes"],
        companyDomain: "mercari.com",
      },
      {
        company: "Sony (PlayStation Network)",
        role: "Systems Developer",
        duration: "Jun 2016 – Mar 2019",
        description:
          "Contributed to PlayStation Network backend services handling game session management and matchmaking for millions of concurrent players.",
        techUsed: ["Rust", "Go", "Docker"],
        companyDomain: "sony.com",
      },
    ],
    achievements: [
      "Achieved 3x throughput improvement in message routing at LINE",
      "Built real-time indexing processing 50K events per second",
      "Contributed to PlayStation Network serving millions of concurrent players",
    ],
    education: [
      {
        institution: "University of Tokyo",
        degree: "MS",
        field: "Information Science & Technology",
        year: "2015",
      },
    ],
    awards: [
      {
        title: "RustConf Speaker 2024",
        issuer: "Rust Foundation",
        year: "2024",
      },
      {
        title: "LINE Engineering Award for Excellence",
        issuer: "LINE Corporation",
        year: "2023",
      },
    ],
  },
  {
    id: "carlos-rivera",
    name: "Carlos Rivera",
    role: "Full Stack Engineer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["React", "Next.js", "Node.js", "MongoDB", "TypeScript"],
    rating: 4.7,
    projects: 118,
    hourlyRate: 65,
    monthlyRate: 10500,
    location: "Mexico City, Mexico",
    yearsOfExperience: 6,
    bio: "Full stack JavaScript developer with a passion for real-time applications. Building fast, modern web apps with Next.js.",
    about:
      "I'm a full stack JavaScript engineer with 6 years of experience building modern web applications end-to-end. I specialize in the React/Next.js ecosystem with Node.js backends and MongoDB. I have a particular passion for real-time features — chat, collaborative editing, live dashboards — and I love building products that feel instant and responsive to users.",
    workHistory: [
      {
        company: "Kavak",
        role: "Senior Full Stack Engineer",
        duration: "Aug 2023 – Present",
        description:
          "Building the vehicle inspection and pricing platform. Developed real-time bidding features and collaborative tools for the sales team.",
        techUsed: ["React", "Next.js", "Node.js", "MongoDB"],
        companyDomain: "kavak.com",
      },
      {
        company: "Clip (Fintech)",
        role: "Full Stack Developer",
        duration: "Feb 2021 – Jul 2023",
        description:
          "Built the merchant dashboard and real-time transaction monitoring system. Implemented WebSocket-based live updates for payment notifications.",
        techUsed: ["React", "Node.js", "MongoDB", "TypeScript"],
        companyDomain: "clip.mx",
      },
      {
        company: "Wizeline",
        role: "Software Engineer",
        duration: "Jan 2020 – Jan 2021",
        description:
          "Developed web applications for enterprise clients in the media and entertainment industry. Built content management systems and video streaming dashboards.",
        techUsed: ["React", "Next.js", "TypeScript"],
        companyDomain: "wizeline.com",
      },
    ],
    achievements: [
      "Built real-time bidding platform handling hundreds of concurrent auctions",
      "Implemented WebSocket-based live transaction monitoring",
      "Completed 118 projects with a 4.7 average rating",
    ],
    education: [
      {
        institution: "Universidad Nacional Autónoma de México",
        degree: "BS",
        field: "Computer Engineering",
        year: "2019",
      },
    ],
    awards: [
      {
        title: "MongoDB Certified Developer Associate",
        issuer: "MongoDB",
        year: "2023",
      },
      {
        title: "JSConf Mexico Speaker",
        issuer: "JSConf",
        year: "2023",
      },
    ],
  },
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    role: "Cloud & DevOps Engineer",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Python"],
    rating: 4.9,
    projects: 86,
    hourlyRate: 105,
    monthlyRate: 17000,
    location: "Toronto, Canada",
    yearsOfExperience: 8,
    bio: "Cloud infrastructure expert building reliable CI/CD pipelines and scalable cloud-native architectures on AWS.",
    about:
      "I'm a cloud and DevOps engineer with 8 years of experience designing and operating production infrastructure at scale. I specialize in AWS, infrastructure-as-code with Terraform, and container orchestration with Kubernetes. My mission is to make developers more productive by building reliable platforms, automating everything possible, and establishing robust CI/CD practices.",
    workHistory: [
      {
        company: "Shopify",
        role: "Senior Cloud Engineer",
        duration: "Jan 2023 – Present",
        description:
          "Leading infrastructure for the Shopify Payments platform. Designed multi-region failover architecture achieving 99.999% uptime for payment processing.",
        techUsed: ["AWS", "Terraform", "Kubernetes", "Docker"],
        companyDomain: "shopify.com",
      },
      {
        company: "Wealthsimple",
        role: "DevOps Engineer",
        duration: "May 2020 – Dec 2022",
        description:
          "Built the CI/CD platform serving 200+ engineers. Implemented infrastructure-as-code practices reducing environment provisioning from days to minutes.",
        techUsed: ["Terraform", "Kubernetes", "Docker", "Python"],
        companyDomain: "wealthsimple.com",
      },
      {
        company: "Hootsuite",
        role: "Infrastructure Engineer",
        duration: "Sep 2017 – Apr 2020",
        description:
          "Managed cloud infrastructure supporting 18M+ users. Led the migration from on-premise data centers to AWS, reducing infrastructure costs by 40%.",
        techUsed: ["AWS", "Docker", "Python"],
        companyDomain: "hootsuite.com",
      },
    ],
    achievements: [
      "Achieved 99.999% uptime for Shopify Payments infrastructure",
      "Reduced environment provisioning from days to minutes",
      "Led AWS migration reducing infrastructure costs by 40%",
    ],
    education: [
      {
        institution: "University of Waterloo",
        degree: "BCS",
        field: "Computer Science",
        year: "2017",
      },
    ],
    awards: [
      {
        title: "AWS Certified DevOps Engineer — Professional",
        issuer: "Amazon Web Services",
        year: "2023",
      },
      {
        title: "HashiCorp Ambassador 2024",
        issuer: "HashiCorp",
        year: "2024",
      },
    ],
  },
  {
    id: "lucas-weber",
    name: "Lucas Weber",
    role: "Frontend Developer",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["Vue.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL"],
    rating: 4.5,
    projects: 61,
    hourlyRate: 60,
    monthlyRate: 9500,
    location: "Berlin, Germany",
    yearsOfExperience: 4,
    bio: "Vue.js specialist crafting elegant user interfaces. Focused on accessibility, internationalization, and developer experience.",
    about:
      "I'm a frontend developer with 4 years of experience specializing in Vue.js and the modern JavaScript ecosystem. I'm passionate about building accessible, internationalized web applications that work for everyone. I care deeply about developer experience, clean component APIs, and writing maintainable code. I also have experience with Node.js backends and GraphQL APIs.",
    workHistory: [
      {
        company: "DeliveryHero",
        role: "Frontend Engineer",
        duration: "Mar 2024 – Present",
        description:
          "Building the restaurant management portal used across 70+ countries. Implementing internationalization and accessibility improvements for the global platform.",
        techUsed: ["Vue.js", "TypeScript", "Tailwind CSS", "GraphQL"],
        companyDomain: "deliveryhero.com",
      },
      {
        company: "Zalando",
        role: "Junior Frontend Developer",
        duration: "Sep 2022 – Feb 2024",
        description:
          "Developed product listing and filtering components for the fashion e-commerce platform. Built reusable Vue.js components for the design system.",
        techUsed: ["Vue.js", "TypeScript", "Tailwind CSS"],
        companyDomain: "zalando.com",
      },
      {
        company: "Freelance",
        role: "Web Developer",
        duration: "Jan 2022 – Aug 2022",
        description:
          "Built websites and web applications for small businesses and startups in Berlin's tech scene. Specialized in Vue.js SPAs with headless CMS backends.",
        techUsed: ["Vue.js", "Node.js", "TypeScript"],
      },
    ],
    achievements: [
      "Implemented i18n for platform operating across 70+ countries",
      "Built Vue.js design system components adopted at Zalando",
      "Specialized in accessibility across all delivered projects",
    ],
    education: [
      {
        institution: "Technische Universität Berlin",
        degree: "BS",
        field: "Computer Science",
        year: "2021",
      },
    ],
    awards: [
      {
        title: "Vue.js Amsterdam Speaker 2024",
        issuer: "Vue.js Amsterdam",
        year: "2024",
      },
      {
        title: "Certified Web Accessibility Specialist",
        issuer: "IAAP",
        year: "2023",
      },
    ],
  },
  {
    id: "aisha-hassan",
    name: "Aisha Hassan",
    role: "Data & Backend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["Python", "PostgreSQL", "MongoDB", "Docker", "AWS"],
    rating: 4.8,
    projects: 73,
    hourlyRate: 85,
    monthlyRate: 13500,
    location: "Dubai, UAE",
    yearsOfExperience: 7,
    bio: "Data-focused backend engineer building analytics platforms and ETL pipelines. Expert in Python and database design.",
    about:
      "I'm a data and backend engineer with 7 years of experience building analytics platforms, ETL pipelines, and data-driven applications. I specialize in Python, PostgreSQL, and MongoDB, with deep expertise in data modeling, pipeline architecture, and performance optimization. I love turning raw data into actionable insights and building the infrastructure that makes it possible.",
    workHistory: [
      {
        company: "Careem (Uber)",
        role: "Senior Data Engineer",
        duration: "Apr 2023 – Present",
        description:
          "Building the real-time analytics platform for ride-hailing operations across 100+ cities. Designed the data pipeline processing 50M+ events daily.",
        techUsed: ["Python", "PostgreSQL", "AWS", "Docker"],
        companyDomain: "careem.com",
      },
      {
        company: "Noon.com",
        role: "Backend Engineer",
        duration: "Aug 2020 – Mar 2023",
        description:
          "Developed the product analytics and reporting backend for the Middle East's largest e-commerce platform. Built ETL pipelines for seller performance dashboards.",
        techUsed: ["Python", "MongoDB", "PostgreSQL", "AWS"],
        companyDomain: "noon.com",
      },
      {
        company: "Emirates NBD (Banking)",
        role: "Data Engineer",
        duration: "Jun 2018 – Jul 2020",
        description:
          "Built customer analytics and fraud detection pipelines for one of the largest banks in the UAE. Processed millions of transactions daily for pattern analysis.",
        techUsed: ["Python", "PostgreSQL", "Docker"],
        companyDomain: "emiratesnbd.com",
      },
    ],
    achievements: [
      "Designed pipeline processing 50M+ events daily at Careem",
      "Built ETL pipelines for Middle East's largest e-commerce platform",
      "Fraud detection system prevented millions in potential losses",
    ],
    education: [
      {
        institution: "American University of Sharjah",
        degree: "BS",
        field: "Computer Engineering",
        year: "2018",
      },
    ],
    awards: [
      {
        title: "AWS Certified Data Analytics — Specialty",
        issuer: "Amazon Web Services",
        year: "2024",
      },
      {
        title: "Dubai Future Accelerators Fellow",
        issuer: "Dubai Future Foundation",
        year: "2023",
      },
    ],
  },
  {
    id: "liam-oshea",
    name: "Liam O'Shea",
    role: "iOS & Swift Developer",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    skills: ["Swift", "React Native", "Firebase", "TypeScript", "GraphQL"],
    rating: 4.6,
    projects: 45,
    hourlyRate: 95,
    monthlyRate: 15000,
    location: "Dublin, Ireland",
    yearsOfExperience: 5,
    bio: "Apple ecosystem developer building native iOS apps and cross-platform solutions. SwiftUI and UIKit expert.",
    about:
      "I'm an iOS developer with 5 years of experience building native and cross-platform mobile applications. My primary expertise is Swift with SwiftUI and UIKit, and I also work extensively with React Native for cross-platform projects. I'm passionate about Apple's design principles, smooth animations, and creating apps that feel truly native and delightful to use.",
    workHistory: [
      {
        company: "Intercom",
        role: "iOS Engineer",
        duration: "Jun 2023 – Present",
        description:
          "Building the iOS SDK used by 25,000+ businesses to embed in-app messaging. Shipped the SwiftUI rewrite of the Messenger component with 40% less code.",
        techUsed: ["Swift", "Firebase"],
        companyDomain: "intercom.com",
      },
      {
        company: "Stripe",
        role: "Mobile Developer",
        duration: "Jan 2022 – May 2023",
        description:
          "Contributed to the Stripe iOS SDK and Terminal app. Implemented new payment method integrations and improved SDK initialization performance.",
        techUsed: ["Swift", "React Native", "TypeScript"],
        companyDomain: "stripe.com",
      },
      {
        company: "Pointy (Google)",
        role: "Junior iOS Developer",
        duration: "Sep 2020 – Dec 2021",
        description:
          "Built the merchant-facing iOS app for in-store product scanning and inventory management. Implemented barcode scanning and offline-first data sync.",
        techUsed: ["Swift", "Firebase", "GraphQL"],
        companyDomain: "pointy.com",
      },
    ],
    achievements: [
      "SwiftUI rewrite achieved 40% codebase reduction at Intercom",
      "SDK used by 25,000+ businesses for in-app messaging",
      "Contributed to Stripe iOS SDK and Terminal app",
    ],
    education: [
      {
        institution: "Trinity College Dublin",
        degree: "BA",
        field: "Computer Science",
        year: "2020",
      },
    ],
    awards: [
      {
        title: "Apple WWDC Scholar",
        issuer: "Apple",
        year: "2021",
      },
      {
        title: "Swift Student Challenge Winner",
        issuer: "Apple",
        year: "2020",
      },
    ],
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Full Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["React", "Next.js", "Python", "PostgreSQL", "Docker"],
    rating: 4.9,
    projects: 131,
    hourlyRate: 80,
    monthlyRate: 13000,
    location: "Bangalore, India",
    yearsOfExperience: 8,
    bio: "Versatile full stack engineer equally comfortable with React frontends and Python backends. Advocate for clean code.",
    about:
      "I'm a full stack developer with 8 years of experience building web applications end-to-end with React and Python. I'm equally comfortable architecting database schemas and building pixel-perfect UIs. I'm a strong advocate for clean code practices, comprehensive testing, and thoughtful API design. I've shipped products used by millions across e-commerce, fintech, and SaaS.",
    workHistory: [
      {
        company: "Razorpay",
        role: "Senior Full Stack Engineer",
        duration: "Mar 2023 – Present",
        description:
          "Leading development of the merchant analytics dashboard. Built the real-time revenue tracking system and customizable reporting features used by 8M+ businesses.",
        techUsed: ["React", "Next.js", "Python", "PostgreSQL"],
        companyDomain: "razorpay.com",
      },
      {
        company: "Flipkart",
        role: "Full Stack Developer",
        duration: "Jul 2020 – Feb 2023",
        description:
          "Developed seller tools and inventory management features for India's largest e-commerce platform. Optimized product listing flows reducing seller onboarding time by 50%.",
        techUsed: ["React", "Python", "PostgreSQL", "Docker"],
        companyDomain: "flipkart.com",
      },
      {
        company: "Freshworks",
        role: "Software Engineer",
        duration: "Jun 2018 – Jun 2020",
        description:
          "Built features for the CRM product serving 60K+ businesses. Developed the contact management module and email integration APIs.",
        techUsed: ["React", "Python", "PostgreSQL"],
        companyDomain: "freshworks.com",
      },
    ],
    achievements: [
      "Revenue tracking system used by 8M+ businesses at Razorpay",
      "Reduced seller onboarding time by 50% at Flipkart",
      "Built CRM features serving 60K+ businesses at Freshworks",
    ],
    education: [
      {
        institution: "Indian Institute of Science, Bangalore",
        degree: "BTech",
        field: "Computer Science",
        year: "2017",
      },
    ],
    awards: [
      {
        title: "Women in Tech India Award",
        issuer: "NASSCOM",
        year: "2024",
      },
      {
        title: "Google Cloud Certified Professional",
        issuer: "Google Cloud",
        year: "2023",
      },
    ],
  },
  {
    id: "alex-petrov",
    name: "Alex Petrov",
    role: "Platform Engineer",
    avatar:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["Go", "Rust", "Kubernetes", "Terraform", "AWS"],
    rating: 5.0,
    projects: 58,
    hourlyRate: 150,
    monthlyRate: 24000,
    location: "Tallinn, Estonia",
    yearsOfExperience: 12,
    bio: "Senior platform engineer designing distributed systems and developer tooling. Deep expertise in Go and infrastructure-as-code.",
    about:
      "I'm a platform engineer with 12 years of experience designing distributed systems, developer platforms, and infrastructure tooling. I work primarily in Go and Rust, with deep expertise in Kubernetes and Terraform. I've built platforms that serve thousands of engineers and process billions of requests. I'm passionate about developer experience, system reliability, and making complex infrastructure simple.",
    workHistory: [
      {
        company: "Bolt",
        role: "Principal Platform Engineer",
        duration: "Jan 2022 – Present",
        description:
          "Architecting the internal developer platform serving 4,000+ engineers across 45 countries. Built the service mesh and deployment automation handling 10K+ deployments per week.",
        techUsed: ["Go", "Kubernetes", "Terraform", "AWS"],
        companyDomain: "bolt.eu",
      },
      {
        company: "TransferWise (Wise)",
        role: "Senior Infrastructure Engineer",
        duration: "Mar 2018 – Dec 2021",
        description:
          "Designed and built the multi-region Kubernetes platform. Led infrastructure cost optimization saving $3M annually through automated right-sizing and spot instance strategies.",
        techUsed: ["Go", "Rust", "Kubernetes", "Terraform"],
        companyDomain: "wise.com",
      },
      {
        company: "Skype (Microsoft)",
        role: "Backend Engineer",
        duration: "Jun 2014 – Feb 2018",
        description:
          "Built distributed backend services for real-time communications. Contributed to the signaling infrastructure handling millions of concurrent voice and video calls.",
        techUsed: ["Go", "Rust", "AWS"],
        companyDomain: "skype.com",
      },
    ],
    achievements: [
      "Platform serving 4,000+ engineers across 45 countries",
      "Saved $3M annually through infrastructure cost optimization",
      "10K+ deployments per week through deployment automation",
    ],
    education: [
      {
        institution: "Tallinn University of Technology",
        degree: "MS",
        field: "Computer Science",
        year: "2013",
      },
    ],
    awards: [
      {
        title: "KubeCon Speaker 2024",
        issuer: "CNCF",
        year: "2024",
      },
      {
        title: "CNCF Ambassador",
        issuer: "CNCF",
        year: "2023",
      },
    ],
  },
  {
    id: "nina-kowalski",
    name: "Nina Kowalski",
    role: "React & Next.js Developer",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    skills: ["React", "Next.js", "TypeScript", "GraphQL", "Tailwind CSS"],
    rating: 4.7,
    projects: 67,
    hourlyRate: 70,
    monthlyRate: 11000,
    location: "Warsaw, Poland",
    yearsOfExperience: 5,
    bio: "React ecosystem specialist with deep Next.js expertise. Building server-rendered apps with great developer and user experience.",
    about:
      "I'm a React and Next.js developer with 5 years of experience building modern, server-rendered web applications. I specialize in the React ecosystem including Next.js App Router, React Server Components, and GraphQL. I care deeply about performance, SEO, and creating seamless user experiences. I also have strong TypeScript and Tailwind CSS skills for building polished, type-safe interfaces.",
    workHistory: [
      {
        company: "Allegro",
        role: "Frontend Engineer",
        duration: "Oct 2023 – Present",
        description:
          "Building the next-generation seller platform with Next.js App Router. Implemented server-side rendering strategies that improved SEO traffic by 35%.",
        techUsed: ["React", "Next.js", "TypeScript", "GraphQL"],
        companyDomain: "allegro.pl",
      },
      {
        company: "Brainly",
        role: "React Developer",
        duration: "Apr 2021 – Sep 2023",
        description:
          "Developed the question-and-answer interface for the education platform with 350M+ monthly users. Built the rich text editor and real-time collaboration features.",
        techUsed: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
        companyDomain: "brainly.com",
      },
      {
        company: "STX Next",
        role: "Junior Frontend Developer",
        duration: "Jun 2020 – Mar 2021",
        description:
          "Built web applications for clients across e-commerce and SaaS. Developed reusable React component libraries and contributed to open-source tooling.",
        techUsed: ["React", "Next.js", "TypeScript"],
        companyDomain: "stxnext.com",
      },
    ],
    achievements: [
      "Improved SEO traffic by 35% through server-rendering strategies",
      "Built rich text editor for platform with 350M+ monthly users",
      "Open-source component libraries adopted across multiple projects",
    ],
    education: [
      {
        institution: "University of Warsaw",
        degree: "BS",
        field: "Computer Science",
        year: "2020",
      },
    ],
    awards: [
      {
        title: "Next.js Conf Speaker 2024",
        issuer: "Vercel",
        year: "2024",
      },
      {
        title: "Women in Tech Poland — Rising Star",
        issuer: "Perspektywy Foundation",
        year: "2023",
      },
    ],
  },
  {
    id: "omar-farouk",
    name: "Omar Farouk",
    role: "Android & Kotlin Developer",
    avatar:
      "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    skills: ["Kotlin", "React Native", "Firebase", "Node.js", "MongoDB"],
    rating: 4.6,
    projects: 82,
    hourlyRate: 75,
    monthlyRate: 12000,
    location: "Cairo, Egypt",
    yearsOfExperience: 6,
    bio: "Android-first mobile developer with strong backend skills. Building cross-platform apps that feel native on every device.",
    about:
      "I'm an Android and Kotlin developer with 6 years of experience building mobile applications that feel truly native. My primary expertise is in Kotlin with Jetpack Compose and the Android SDK, and I also work with React Native for cross-platform projects. I have strong backend skills with Node.js and MongoDB, which allows me to build complete mobile solutions from API to app store.",
    workHistory: [
      {
        company: "Instabug",
        role: "Senior Android Engineer",
        duration: "May 2023 – Present",
        description:
          "Building the Android SDK used by 25,000+ mobile apps for bug reporting and performance monitoring. Implemented Jetpack Compose migration and reduced SDK size by 30%.",
        techUsed: ["Kotlin", "Firebase"],
        companyDomain: "instabug.com",
      },
      {
        company: "Swvl",
        role: "Mobile Developer",
        duration: "Jan 2021 – Apr 2023",
        description:
          "Developed the rider and captain apps for the mass transit platform operating across 5 countries. Built real-time location tracking and route optimization features.",
        techUsed: ["Kotlin", "React Native", "Firebase", "Node.js"],
        companyDomain: "swvl.com",
      },
      {
        company: "Freelance",
        role: "Mobile App Developer",
        duration: "Jun 2019 – Dec 2020",
        description:
          "Delivered 20+ mobile apps for startups and SMBs across the MENA region. Built e-commerce, delivery, and social apps with full backend integration.",
        techUsed: ["Kotlin", "React Native", "MongoDB", "Node.js"],
      },
    ],
    achievements: [
      "Reduced SDK size by 30% during Jetpack Compose migration",
      "Built real-time location tracking for transit in 5 countries",
      "Delivered 20+ mobile apps for startups across MENA region",
    ],
    education: [
      {
        institution: "Cairo University",
        degree: "BS",
        field: "Computer Engineering",
        year: "2019",
      },
    ],
    awards: [
      {
        title: "Google Developer Expert — Android",
        issuer: "Google",
        year: "2024",
      },
      {
        title: "Kotlin GDE",
        issuer: "JetBrains/Google",
        year: "2024",
      },
    ],
  },
];
