import type { Project } from "./Contact";


export const projects: Project[] = [
    {
        title: "ERPNext Razorpay Sync",
        desc:
            "Automated capture + Payment Entry with verification, retry, and reconciliation report.",
        tags: ["Frappe", "Payments", "Webhooks"],
        link: "https://github.com/yourname/erpnext-razorpay-sync",
    },
    {
        title: "LMS Enhancer",
        desc:
            "Client Scripts bundle, print formats, and analytics reports for ERPNext LMS.",
        tags: ["ERPNext", "Reports", "UX"],
        link: "https://github.com/yourname/lms-enhancer",
    },
    {
        title: "Frappe REST Starter",
        desc: "Template for API keys, rate limiting, tests (`frappe.tests`).",
        tags: ["Frappe", "API", "Security"],
        link: "https://github.com/yourname/frappe-rest-starter",
    },
];