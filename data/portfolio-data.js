window.PORTFOLIO_DATA = {
    site: {
        name: "Kartik Patkar",
        shortName: "KP",
        role: "Salesforce Consultant & Senior Developer",
        description: "Kartik Patkar — Salesforce Consultant & Senior Developer. Portfolio showcasing Salesforce work, projects, and experience.",
        email: "kartikkp.assets@gmail.com",
        linkedin: "https://www.linkedin.com/in/kartik-patkar/",
        github: "https://github.com/Kartikpatkar",
        githubLabel: "github.com/Kartikpatkar",
        linkedinLabel: "linkedin.com/in/kartik-patkar",
        resumePath: "assets/Kartik-Patkar-Resume.pdf",
        profileImage: "assets/images/profile-placeholder.svg",
        profileImageAlt: "Profile placeholder for Kartik Patkar",
        availability: "Open to opportunities"
    },
    hero: {
        eyebrow: "Hello, I'm",
        subtitle: "Building scalable Salesforce solutions, integrations, and developer tools.",
        primaryCtaLabel: "Download Resume",
        secondaryCtaLabel: "View Projects",
        secondaryCtaHref: "#projects",
        socials: [
            {
                label: "LinkedIn",
                url: "https://www.linkedin.com/in/kartik-patkar/",
                icon: "in"
            },
            {
                label: "GitHub",
                url: "https://github.com/Kartikpatkar",
                icon: "GH"
            },
            {
                label: "Email",
                url: "mailto:kartikkp.assets@gmail.com",
                icon: "@"
            }
        ]
    },
    about: {
        subtitle: "Salesforce-first. Outcome-driven. Detail-oriented.",
        summaryTitle: "Professional Summary",
        summary:
            "I'm a Salesforce Consultant & Senior Developer focused on delivering reliable, scalable solutions across Sales Cloud, Service Cloud, and custom platform builds. I enjoy turning complex requirements into clean implementations with strong UX, solid automation, and maintainable code.",
        snapshotTitle: "Snapshot",
        snapshot: [
            {
                label: "Experience",
                value: "5+ years"
            },
            {
                label: "Focus",
                value: "Salesforce Development & Consulting"
            },
            {
                label: "Strengths",
                value: "Integrations, automation, and developer tooling"
            }
        ],
        expertiseTitle: "Core Expertise",
        expertise: [
            "Salesforce Development",
            "Lightning Web Components",
            "Apex",
            "Flow Automation",
            "Integrations",
            "Chrome Extension Development"
        ]
    },
    skills: {
        subtitle: "A practical toolkit for building on Salesforce and beyond.",
        items: [
            {
                icon: "SF",
                title: "Salesforce",
                text: "Platform configuration, security, data model, and best practices."
            },
            {
                icon: "A",
                title: "Apex",
                text: "Triggers, async patterns, test strategy, and governor limits."
            },
            {
                icon: "LWC",
                title: "Lightning Web Components",
                text: "Reusable components, clean UI patterns, and performance."
            },
            {
                icon: "Flow",
                title: "Flow",
                text: "Automation, validations, and maintainable orchestration."
            },
            {
                icon: "API",
                title: "REST APIs",
                text: "Integrations, authentication, webhooks, and error handling."
            },
            {
                icon: "JS",
                title: "JavaScript",
                text: "Vanilla JS (ES6+), tooling, and Chrome Extensions."
            },
            {
                icon: "H",
                title: "HTML",
                text: "Semantic structure and accessible UI foundations."
            },
            {
                icon: "C",
                title: "CSS",
                text: "Responsive layouts with Grid/Flexbox and modern CSS."
            },
            {
                icon: "Git",
                title: "Git",
                text: "Branching workflows, PR reviews, and clean history."
            },
            {
                icon: "CE",
                title: "Chrome Extensions",
                text: "MV3 patterns, storage, messaging, and UI overlays."
            }
        ]
    },
    projects: {
        subtitle: "Public Chrome Extensions and Salesforce developer tools pulled from my GitHub profile.",
        items: [
            {
                title: "Apex Genie",
                description: "Browser extension for Salesforce developers to convert JSON into strongly typed Apex classes, generate test classes, and package outputs directly in the browser.",
                technologies: ["JavaScript", "Chrome Extension", "Apex", "Salesforce"],
                links: [
                    {
                        label: "Chrome Store",
                        url: "https://chrome.google.com/webstore/detail/json-to-apex-genie/ifliljlnfdnmagdgmomglfoimjcnpinb"
                    },
                    {
                        label: "GitHub",
                        url: "https://github.com/Kartikpatkar/json-2-apex-genie"
                    }
                ]
            },
            {
                title: "SLDS Icons Kit",
                description:
                    "Full-tab Chrome Extension for Salesforce Developers, Admins, and Architects to browse the complete SLDS icon library, preview styles, and copy LWC, Aura, and SLDS snippets instantly.",
                technologies: ["JavaScript", "Chrome Extension", "SLDS", "Monaco Editor"],
                links: [
                    {
                        label: "Chrome Store",
                        url: "https://chromewebstore.google.com/detail/pgjeeljfclipedfnlojjchmmilddiaje"
                    },
                    {
                        label: "GitHub",
                        url: "https://github.com/Kartikpatkar/SLDS-icons-kit-salesforce"
                    }
                ]
            },
            {
                title: "Offline PDF Tools",
                description:
                    "Privacy-first Chrome Extension for modifying PDF files entirely offline with merge, split, extract, reorder, delete, and rotate workflows built directly into the browser.",
                technologies: ["JavaScript", "Chrome Extension", "PDF.js", "pdf-lib"],
                links: [
                    {
                        label: "Chrome Store",
                        url: "https://chromewebstore.google.com/detail/lkokanmnglecjkgabbhincgaiceedolc?utm_source=item-share-cb"
                    },
                    {
                        label: "GitHub",
                        url: "https://github.com/Kartikpatkar/offline-pdf-tools"
                    }
                ]
            },
            {
                title: "Salesforce Package XML Generator",
                description:
                    "Developer-focused Chrome Extension that explores logged-in org metadata and generates accurate package.xml files visually for Salesforce deployments and release workflows.",
                technologies: ["JavaScript", "Chrome Extension", "Metadata API", "Tooling API", "Salesforce"],
                links: [
                    {
                        label: "Chrome Store",
                        url: "https://chromewebstore.google.com/detail/dckmmjdjldnoipccflojfodimnmemfgn?utm_source=item-share-cb"
                    },
                    {
                        label: "GitHub",
                        url: "https://github.com/Kartikpatkar/salesforce-package-xml-generator"
                    }
                ]
            },
            {
                title: "FieldForge",
                description: "Developer-focused Chrome Extension for bulk-creating Salesforce custom fields from CSV or XLSX with validation, metadata preview, deploy ZIP generation, and safe Metadata API deployment.",
                technologies: ["JavaScript", "Chrome Extension", "Metadata API", "Salesforce"],
                links: [
                    {
                        label: "Chrome Store",
                        url: "https://chromewebstore.google.com/detail/nfjjccdcnpdmfglblfnkmmfecmblbhfo?utm_source=item-share-cb"
                    },
                    {
                        label: "GitHub",
                        url: "https://github.com/Kartikpatkar/fieldforge"
                    }
                ]
            }
        ]
    },
    experience: {
        subtitle: "Highlights from recent roles and responsibilities.",
        items: [
            {
                role: "Salesforce Consultant",
                company: "Current Company",
                responsibilities: [
                    "Salesforce development across Apex, LWC, and declarative automation.",
                    "Integrations with external services using REST APIs and secure authentication.",
                    "Automation and custom solutions to improve operational efficiency."
                ]
            }
        ]
    },
    contact: {
        subtitle: "Have a role, project, or collaboration in mind? Let's talk.",
        intro: "This form opens your email client with a pre-filled message (no backend required)."
    }
};
