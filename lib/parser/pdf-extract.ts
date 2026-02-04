// MOCK IMPLEMENTATION FOR DEMO/TESTING
// pdf-parse library removed to simplify deployment and testing
// This mock simulates a successful PDF text extraction

export async function extractTextFromPDF(_buffer: Buffer): Promise<string> {
    console.log("⚠️ USING MOCK PDF EXTRACTION ⚠️");
    return `
    JOHN DOE
    Email: john.doe@example.com
    Phone: +1 555-0199
    Location: San Francisco, CA

    PROFILE
    Innovative Software Engineer with 5 years of experience in building scalable web applications. Passionate about AI and user experience.

    EXPERIENCE
    ACNE Corp
    Senior Software Engineer | Jan 2020 - Present
    - Spearheaded the development of the company's main e-commerce platform, increasing sales by 20%.
    - Mentored junior developers and introduced modern CI/CD practices.
    - Optimized database queries, reducing load times by 40%.

    TechStart Inc.
    Junior Developer | Jun 2018 - Dec 2019
    - Collaborated with cross-functional teams to deliver high-quality software features.
    - Assisted in migration of legacy systems to cloud infrastructure.

    EDUCATION
    University of Technology
    B.S. in Computer Science | 2014 - 2018

    SKILLS
    Languages: JavaScript, TypeScript, Python, SQL
    Frameworks: React, Next.js, Node.js, Django
    Tools: Git, Docker, AWS, Supabase
    `;
}
