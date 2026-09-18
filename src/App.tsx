import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { RevealOnScroll, StaggerOnScroll, fadeUp, scaleUp } from './animations'
import { Monitor, Code, ShoppingCart, Palette, Share2, Search, PenTool, Link, Megaphone, Bot, Globe, MapPin, Flame, BarChart2, Layers, UserCheck, Phone, Mail } from 'lucide-react'
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok, FaXTwitter, FaWhatsapp } from 'react-icons/fa6'

type Theme = 'dark' | 'light'
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} })
const useTheme = () => useContext(ThemeCtx)

// Dark & Light token maps
const T = {
  dark: {
    bg: '#0a0a0a', bg2: '#0f0f0f', bg3: '#111111', bgHover: '#141414',
    fg: '#f0ede8', fgMuted: 'rgba(240,237,232,0.55)', fgDim: 'rgba(240,237,232,0.35)',
    border: 'rgba(255,255,255,0.07)', borderStrong: 'rgba(255,255,255,0.12)',
    cardBg: '#0f0f0f', cardHover: '#141414',
    navBg: 'rgba(10,10,10,0.95)', navBorder: 'rgba(255,255,255,0.06)',
    statsBg: '#0a0a0a', statsGrid: 'rgba(255,255,255,0.06)',
    gridGap: 'rgba(255,255,255,0.06)',
    orb1: 'rgba(206,48,125,0.18)', orb2: 'rgba(206,48,125,0.08)',
    heroGrad: 'linear-gradient(to top, #0a0a0a 0%, transparent 60%)',
    yearColor: 'rgba(240,237,232,0.08)', letterColor: 'rgba(240,237,232,0.06)',
    iconMuted: 'rgba(240,237,232,0.15)',
    testimonialBg: '#0a0a0a', testimonialActive: 'rgba(206,48,125,0.08)',
    footerBg: '#050505',
    scrollbar: '#CE307D #0a0a0a',
  },
  light: {
    bg: '#ffffff', bg2: '#fafafa', bg3: '#f5f5f5', bgHover: '#f0f0f0',
    fg: '#1a1a1a', fgMuted: 'rgba(26,26,26,0.6)', fgDim: 'rgba(26,26,26,0.4)',
    border: 'rgba(0,0,0,0.08)', borderStrong: 'rgba(0,0,0,0.12)',
    cardBg: '#fafafa', cardHover: '#f5f5f5',
    navBg: 'rgba(255,255,255,0.97)', navBorder: 'rgba(0,0,0,0.08)',
    statsBg: '#ffffff', statsGrid: 'rgba(0,0,0,0.06)',
    gridGap: 'rgba(0,0,0,0.06)',
    orb1: 'rgba(206,48,125,0.08)', orb2: 'rgba(206,48,125,0.04)',
    heroGrad: 'linear-gradient(to top, #ffffff 0%, transparent 60%)',
    yearColor: 'rgba(26,26,26,0.08)', letterColor: 'rgba(26,26,26,0.06)',
    iconMuted: 'rgba(26,26,26,0.15)',
    testimonialBg: '#ffffff', testimonialActive: 'rgba(206,48,125,0.06)',
    footerBg: '#f5f5f5',
    scrollbar: '#CE307D #ffffff',
  },
} as const

const NAV_LINKS = ['Work', 'Services', 'Process', 'Team', 'Journal', 'Contact']

const MARQUEE_WORDS = ['Digital Marketing', 'Social Media', 'Branding', 'Content', 'Performance']

const FOOTER_EXPLORE = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Privacy Policy', href: '#' },
]

const FOOTER_CONTACT = [
  { label: 'General Inquiries', value: '(786) 600-1595', href: 'tel:+17866001595', icon: Phone },
  { label: 'Sales Department', value: '(832) 521-7343', href: 'tel:+18325217343', icon: Phone },
  { label: 'Email Us', value: 'info@digierapro.com', href: 'mailto:info@digierapro.com', icon: Mail },
]

const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#', icon: FaFacebookF },
  { name: 'LinkedIn', href: '#', icon: FaLinkedinIn },
  { name: 'Instagram', href: '#', icon: FaInstagram },
  { name: 'TikTok', href: '#', icon: FaTiktok },
  { name: 'X', href: '#', icon: FaXTwitter },
]

const HISTORY = [
  { year: '2018', title: 'The Startup Begins', desc: 'Digi Era Pro launched as a small startup with one goal: help growing businesses build a real digital presence.' },
  { year: '2023', title: 'Team Expansion', desc: 'Grew our IT, Support, and Sales teams to keep pace with client demand and deliver faster, more dedicated service.' },
  { year: '2025', title: 'Malaysia Expansion', desc: 'Launched a new venture in Malaysia, extending our reach and bringing our digital marketing services to a new region.' },
  { year: '2026', title: 'Stability & Trusted Clients', desc: 'Built a stable foundation and a growing base of trusted clients who return for long-term partnership.' },
]

const SERVICES = [
  { num: '01', title: 'Website Design', desc: 'We craft visually stunning, conversion-focused websites that reflect your brand and drive real results.', icon: Monitor },
  { num: '02', title: 'E-commerce', desc: 'We build powerful online stores designed to convert visitors into loyal customers at scale.', icon: ShoppingCart },
  { num: '03', title: 'Branding Strategy', desc: 'We develop bold brand identities and strategies that position you ahead of the competition.', icon: Palette },
  { num: '04', title: 'Social Media Marketing', desc: 'We create and manage campaigns that grow your audience and turn followers into paying customers.', icon: Share2 },
  { num: '05', title: 'Search Engine Optimization', desc: 'We optimize your online presence so your business ranks higher and gets found by the right people.', icon: Search },
  { num: '06', title: 'Graphic Design', desc: 'We design compelling visuals that communicate your message and make your brand impossible to ignore.', icon: PenTool },
  { num: '07', title: 'Content Creation', desc: 'We produce high-quality content that engages your audience and builds lasting brand authority.', icon: Globe },
  { num: '08', title: 'Citations & Backlinks', desc: 'We build authoritative citations and backlinks that strengthen your domain and boost local rankings.', icon: Link },
  { num: '09', title: 'Google Ads', desc: 'We run data-driven ad campaigns that maximize your ROI and put your business in front of ready buyers.', icon: Megaphone },
  { num: '10', title: 'Virtual AI Solution', desc: 'We implement smart AI tools that automate your workflows and give your business a competitive edge.', icon: Bot },
  { num: '11', title: 'Web Development', desc: 'We build fast, scalable, and secure web applications engineered to perform and grow with your business.', icon: Code },
  { num: '12', title: 'GBP Optimization', desc: 'We optimize your Google Business Profile to dominate local search and attract more nearby customers.', icon: MapPin },
]

const TEAM = [
  { name: 'Talha Khalid', role: 'CEO/Co-Founder, Strategy', img: './Assets/images/IMG_3074.JPG' },
  { name: 'Kamran Ali', role: 'CTO, Communications', img: './Assets/images/image4.png' },
  { name: 'Nuhammad Zaid', role: 'Head of IT Team', img: './Assets/images/image (2).png' },
  { name: 'Danish Naveed', role: 'Design Lead', img: './Assets/images/image3.png' },
]

const STATS = [
  { value: '14', label: 'Years operating' },
  { value: '280+', label: 'Projects delivered' },
  { value: '40', label: 'Global clients' },
  { value: '3', label: 'Cannes Lions' },
]

const PROCESS_STEPS = [
  { num: '01', phase: 'Discovery', duration: '1–2 weeks', desc: 'We begin by listening. Stakeholder interviews, competitive analysis, audience research, and brand archaeology to understand what you are and what you want to become.' },
  { num: '02', phase: 'Strategy', duration: '2–3 weeks', desc: 'Positioning territory, naming options (if applicable), messaging architecture, and a creative brief that anchors every design decision that follows.' },
  { num: '03', phase: 'Creative Development', duration: '3–5 weeks', desc: 'Visual exploration across identity, typography, color, and motion. We present three distinct territories and evolve the chosen direction through rounds of refinement.' },
  { num: '04', phase: 'Production', duration: '2–4 weeks', desc: 'Brand guidelines, asset libraries, digital templates, and handoff packages — everything your team needs to deploy the brand consistently at scale.' },
  { num: '05', phase: 'Launch & Embed', duration: 'Ongoing', desc: 'We stay on through launch, answer questions, and offer retainer relationships for brands that need ongoing creative partnership.' },
]

const GOOGLE_REVIEWS = [
  { author_name: 'Cindy', rating: 5, text: "I've had a great experience working with Digi Era Pro on my Google Business Profile. They've already helped place my business within the top three results for some of my main keywords, which has been a huge win. Even more impressive, within the first month I acquired a new client directly from my improved Google Maps presence.", relative_time_description: '5 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Cindy&background=CE307D&color=fff' },
  { author_name: 'Pamela Greenawalt', rating: 5, text: 'I am very pleased with the results so far of my Google listing, Business Card, Flyer and website. Henry has been very easy and friendly to work with. He has been very attentive to my changes and has been very patient with me.', relative_time_description: '6 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Pamela+Greenawalt&background=CE307D&color=fff' },
  { author_name: 'Spot On Mobile Detailing Services', rating: 5, text: "Since November 2025, Kate and her team have been working on optimizing my business profile, significantly improving our visibility, positioning, and overall performance compared to where we started.", relative_time_description: '7 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Spot+On&background=CE307D&color=fff' },
  { author_name: 'iBuilders Design and Build', rating: 5, text: "Paul has been absolutely exceptional. His level of professionalism, responsiveness, and genuine care makes a real difference in how my account is managed day to day. He stays on top of every detail, communicates clearly, and consistently delivers results.", relative_time_description: '8 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=iBuilders&background=CE307D&color=fff' },
  { author_name: 'Gavin Sundwall', rating: 5, text: "I have been working with Henry for one month now. They built me a quality website for the fairest price around, it was something I was nervous about paying for but seeing what came out of it I was very impressed and relieved. Henry takes his time to make sure everything is right.", relative_time_description: '6 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Gavin+Sundwall&background=CE307D&color=fff' },
  { author_name: 'Talha Khalid', rating: 5, text: "Working at DEP LLC has been a great experience for me as a programmer. The company operates as a dynamic digital marketing agency that combines marketing expertise with modern technology to deliver effective solutions for clients.One of the things I appreciate most about DEP LLC is the collaborative environment. The team includes marketers, designers, and developers who work closely together, which makes it easy to turn ideas into real, impactful products. As a programmer, I get the opportunity to work on different types of projects ranging from marketing automation tools to web applications that support client campaigns.The company also encourages learning and growth. New technologies, frameworks, and development practices are always welcomed, which allows developers like me to continuously improve our skills while contributing to meaningful projects.", relative_time_description: '2 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Terry&background=CE307D&color=fff' },
  { author_name: 'Bill', rating: 5, text: "Henry, and the rest of the team at Digi Era Pro LLC really know their stuff. They initiated a multi-faceted approach that is raising the ranking of my Google Business Profile almost daily. Their persistent efforts also extend to everyday management of my profile.", relative_time_description: '7 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Bill&background=CE307D&color=fff' },
  { author_name: 'azober qusiem', rating: 5, text: 'I really appreciate Kate for the great help and hospitality. She was very kind, welcoming, and made the whole experience smooth and comfortable. You can tell she genuinely cares about people and takes pride in what she does. Thank you again! 🙏', relative_time_description: '5 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Azober&background=CE307D&color=fff' },
  { author_name: 'Wansley Racine', rating: 5, text: "I've had a great experience working with Digi Era Pro, especially Kate Lyn. She handles my flyers and social media content, and the quality has been consistently solid.", relative_time_description: '9 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Wansley+Racine&background=CE307D&color=fff' },
  { author_name: 'Colette Wiest', rating: 5, text: 'I am very pleased with the services provided by Digiera. Reasonably priced, quick responses, and fantastic landing page. I WILL Continue to work with them moving forward.', relative_time_description: '7 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Colette+Wiest&background=CE307D&color=fff' },
  { author_name: 'Sean Haiker', rating: 5, text: 'Alexa did a great job communicating. I had many questions that she was able to answer.', relative_time_description: 'a month ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Sean+Haiker&background=CE307D&color=fff' },
  { author_name: 'Rock N Roll Pest Control', rating: 5, text: 'They definitely helped grow my business. Affordable rates and a friendly and very responsive team.', relative_time_description: '4 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Rock+N+Roll&background=CE307D&color=fff' },
  { author_name: 'Dennis Hoefsmit', rating: 5, text: "Captain D Cruises here and just wanted to say I had the pleasure of speaking with Kate about the monthly review they graciously provide me on how progress evolved over the past month. Very informative and professional.", relative_time_description: '3 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Dennis+Hoefsmit&background=CE307D&color=fff' },
  { author_name: 'Brenda Hofman', rating: 5, text: "I had a great experience with Kate Lyn and the Digi Era Pro team. She was very patient and attentive, especially because my English is not very clear. Kate took the time to understand everything I needed and helped me a lot throughout the process.", relative_time_description: '11 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Brenda+Hofman&background=CE307D&color=fff' },
  { author_name: 'Luke Porter', rating: 5, text: "Paul and his team designed my website, logo's and more. Paul personally navigated any troubleshooting and kindly guided me through the Google verification process. I couldn't be more happy with the results.", relative_time_description: 'a year ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Luke+Porter&background=CE307D&color=fff' },
  { author_name: 'Alicia Dooley-Garland', rating: 5, text: 'It has been a pleasure working with the Digi Era Pro team. The team is very professional and willing to help you optimize your google ranking. Paul has been very prompt with his communication on my website enhancement. A cool company to work with.', relative_time_description: '11 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Alicia+Dooley&background=CE307D&color=fff' },
  { author_name: 'Michal Lucky', rating: 5, text: "Digi Era Pro LLC did an outstanding job with the digital marketing for my Google profile. I'm working with Kate, my account manager, and I'm very satisfied with her support so far. She's professional, friendly, and always quick to respond.", relative_time_description: '11 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Michal+Lucky&background=CE307D&color=fff' },
  { author_name: 'Rob Caro', rating: 5, text: 'Great company and Alexis has been fantastic to work with. Communication has been phenomenal.', relative_time_description: '4 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Rob+Caro&background=CE307D&color=fff' },
  { author_name: 'Arianne Etuk', rating: 5, text: 'From the moment I began working with Kate, I was impressed. She has been incredibly responsive, attentive to my needs, and absolutely committed to delivering the results I was looking for.', relative_time_description: 'a year ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Arianne+Etuk&background=CE307D&color=fff' },
  { author_name: 'Donna Peacocke', rating: 5, text: "I've been working with Digi Era Pro for a year or so and my website is great! Just recently they made a 28 second video for my business that is absolutely FABULOUS! Give them a chance to help your business!", relative_time_description: '11 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Donna+Peacocke&background=CE307D&color=fff' },
  { author_name: 'anil murgai', rating: 5, text: 'I worked with Paul, and, he was in one word, fantastic. He knew what to do, how to do and did it. Thanks Paul.', relative_time_description: '2 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Anil+Murgai&background=CE307D&color=fff' },
  { author_name: 'Hector Oliva', rating: 5, text: 'For us, this is the best marketing company out there. They have done an amazing job for our business, and we are very happy with the results. We highly recommend them to anyone looking for a reliable and professional marketing company.', relative_time_description: 'a week ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Hector+Oliva&background=CE307D&color=fff' },
  { author_name: 'Trinidad Arceo', rating: 5, text: "I've had a great experience working with Digi Era Pro. They've been helping me optimize the Google Business Profile for my local pet waste removal company. They are knowledgeable, responsive, and take the time to explain their process.", relative_time_description: '4 weeks ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Trinidad+Arceo&background=CE307D&color=fff' },
  { author_name: 'Jody Carlson', rating: 5, text: 'In a month this company brought my Google listing to 3rd in my area! I am excited to see what more they can do!', relative_time_description: '11 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Jody+Carlson&background=CE307D&color=fff' },
  { author_name: 'Rachael Lamet', rating: 5, text: "I've been incredibly pleased with the services provided by Digi Era Pro LLC. Going Above and Beyond — their team is always available and proactive in managing my online presence.", relative_time_description: '11 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Rachael+Lamet&background=CE307D&color=fff' },
  { author_name: 'Trever Harmon', rating: 5, text: 'Paul, from the start, was invaluable and informative about getting started. He helped me along the process to make sure I understand what my Google profile and website needed for improvement.', relative_time_description: 'a year ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Trever+Harmon&background=CE307D&color=fff' },
  { author_name: 'Talha Khalid', rating: 5, text: "Working at DEP LLC has been a great experience for me as a programmer. The company operates as a dynamic digital marketing agency that combines marketing expertise with modern technology to deliver effective solutions for clients.One of the things I appreciate most about DEP LLC is the collaborative environment. The team includes marketers, designers, and developers who work closely together, which makes it easy to turn ideas into real, impactful products. As a programmer, I get the opportunity to work on different types of projects ranging from marketing automation tools to web applications that support client campaigns.The company also encourages learning and growth. New technologies, frameworks, and development practices are always welcomed, which allows developers like me to continuously improve our skills while contributing to meaningful projects.", relative_time_description: '2 months ago', profile_photo_url: 'https://ui-avatars.com/api/?name=Terry&background=CE307D&color=fff' },
]

const TESTIMONIALS = [
  { quote: "Digi Era Pro didn't just redesign our brand — they rebuilt our entire market position. We went from regional challenger to national category leader within 18 months.", author: 'Ingrid Halvorsen', title: 'CEO, Meridian Bank', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: "The sharpest strategic thinkers we've worked with. They held their conviction under pressure and were right every time.", author: 'Daniel Adeyemi', title: 'CMO, Volta Motors', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: 'Our new identity has been featured in three design publications and won a D&AD Pencil. Worth every minute of the process.', author: 'Yuki Tanaka', title: 'Director, Norde Institute', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: 'Working with Digi Era Pro transformed our online presence completely. Our leads tripled within the first quarter of the campaign.', author: 'Sofia Lindqvist', title: 'CMO, Vantage Retail', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: 'They understood our vision from day one. The content strategy they built for us is still driving results two years later.', author: 'Marcus Chen', title: 'CEO, Northline Logistics', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format', rating: 4 },
  { quote: 'Exceptional team. They delivered a full rebrand and SEO overhaul in record time without compromising quality.', author: 'Priya Raman', title: 'Director, Solace Wellness', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: 'Our Google Ads ROI went from 1.8x to 4.6x after Digi Era Pro took over. The data-driven approach makes all the difference.', author: 'James Okafor', title: 'Founder, BrightPath Media', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: 'The social media growth we experienced was beyond expectations. Engagement up 280% in just 3 months.', author: 'Amara Whitfield', title: 'Founder, Bloom & Co.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&auto=format', rating: 5 },
  { quote: 'Professional, creative, and results-focused. Digi Era Pro is the only agency we trust with our brand.', author: 'Lena Hoffmann', title: 'Marketing Director, Apex Group', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format', rating: 4 },
  { quote: 'From website redesign to full digital strategy — they handled everything seamlessly. Our revenue grew 60% year over year.', author: 'Ryan Castillo', title: 'CEO, TerraBuilt Construction', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&auto=format', rating: 5 },
]

const VIDEO_STORIES = [
  { name: 'Amara Whitfield', role: 'Founder, Bloom & Co.', poster: './Assets/poster/imgi_77_client-review-1.png', videoId: 'cvRc7QBf-7A' },
  { name: 'Marcus Chen', role: 'CEO, Northline Logistics', poster: './Assets/poster/imgi_78_client-review2.png', videoId: 'Clrd11emal4' },
  { name: 'Priya Raman', role: 'Director, Solace Wellness', poster: './Assets/poster/imgi_79_client-review3-1_result.webp', videoId: 'OmHcHTjklSk' },
  { name: 'Sofia Lindqvist', role: 'CMO, Vantage Retail', poster: './Assets/poster/imgi_80_client-review4-1_result.webp', videoId: 'p57xrGysihs' },
]

const CLIENT_LOGOS = [
  { name: 'Enterprises LLC', img: './Assets/business success/1.webp' },
  { name: 'Raven Rock Contracting', img: './Assets/business success/2.webp' },
  { name: 'OnPoint Detailing LLC', img: './Assets/business success/7.webp' },
  { name: 'Affordable Demolition & Construction LLC', img: './Assets/business success/4.webp' },
  { name: 'Creative Fence Company', img: './Assets/business success/5.webp' },
  { name: 'SW Mobile Detailing', img: './Assets/business success/6.webp' },
]

const PARTNERS = [
  { name: 'Yelp Ads Optimization', img: './Assets/partners/imgi_40_Gemini_Generated_Image_j15rwpj15rwpj15r-e1761943136131-300x200.webp' },
  { name: 'Meta Business Partner', img: './Assets/partners/imgi_41_MetaBusinessPartne-e1730318781747-300x212.jpg' },
  { name: 'Trustpilot', img: './Assets/partners/imgi_7_Untitled-design-123.png' },
  { name: 'Secured by PositiveSSL', img: './Assets/partners/imgi_1_download-17.webp' },
  { name: 'Google Partner', img: './Assets/partners/imgi_43_BES-featured-image-1-300x150.jpg' },
]

const JOURNAL = [
  { date: 'Sep 2026', category: 'Essay', title: "The Brand That Won't Stop Moving", excerpt: 'Static identity is dead. The most durable brands today operate as living systems — adaptive, modular, and built for a world that never pauses.', img: 'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?w=700&h=450&fit=crop&auto=format', readTime: '7 min read' },
  { date: 'Aug 2026', category: 'Case Study', title: 'How We Named a Bank in 6 Days', excerpt: "When Meridian's rebrand demanded a new name, we had six days, three continents of stakeholders, and exactly one naming framework that actually works.", img: 'https://images.unsplash.com/photo-1647675975434-864e1c3fc98d?w=700&h=450&fit=crop&auto=format', readTime: '12 min read' },
  { date: 'Jul 2026', category: 'Perspective', title: 'Against the Rebrand', excerpt: "Not every company needs a new logo. A provocation on the industry's obsession with reinvention over refinement.", img: 'https://images.unsplash.com/photo-1768471125958-78556538fadc?w=700&h=450&fit=crop&auto=format', readTime: '5 min read' },
]

const VALUES = [
  { letter: 'C', word: 'Conviction', desc: 'We argue for the work. Good ideas require a defender, and we take that role seriously — while knowing when to listen.', icon: Flame },
  { letter: 'R', word: 'Rigour', desc: 'Design built on evidence. Every visual decision traces back to a strategic rationale you can articulate to a boardroom.', icon: BarChart2 },
  { letter: 'E', word: 'Economy', desc: 'Nothing extraneous. We remove until removal would damage the idea — then stop.', icon: Layers },
  { letter: 'A', word: 'Authorship', desc: 'We take responsibility for the work, not just the deliverable. That distinction changes everything about how we show up.', icon: UserCheck },
]

const WHY_CHOOSE_US = [
  { tab: 'Our Mission', desc: 'To help ambitious brands grow through strategic marketing, compelling content, and digital experiences engineered around real business outcomes — not vanity metrics.' },
  { tab: 'Our Vision', desc: 'To be the long-term growth partner ambitious brands call first — a team that thinks like an owner, not a vendor, and measures success in your results.' },
  { tab: 'Our Philosophy', desc: 'We believe in collaboration, creativity, and constant growth. When we work together, we make sure your business thrives, every step of the way.' },
]

const WHY_CHOOSE_US_POINTS = ['Plans made just for you.', 'Growth you can see.', 'Expert team on your side.', 'Ideas that keep you ahead.', 'Clear updates throughout.']

type GoogleReview = {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  profile_photo_url: string
}

type GooglePlaceData = {
  name: string
  rating: number
  user_ratings_total: number
  reviews: GoogleReview[]
}

function useGoogleReviews() {
  const data: GooglePlaceData = {
    name: 'Digi Era Pro LLC',
    rating: 4.9,
    user_ratings_total: GOOGLE_REVIEWS.length,
    reviews: GOOGLE_REVIEWS,
  }
  return { data, loading: false, error: null }
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialPaused, setTestimonialPaused] = useState(false)
  const testimonialRef = useRef<HTMLDivElement>(null)
  const { data: googleData } = useGoogleReviews()

  const clientVoices = googleData && googleData.reviews && googleData.reviews.length > 0
    ? googleData.reviews.map(r => ({ quote: r.text, author: r.author_name, title: r.relative_time_description, avatar: r.profile_photo_url, rating: r.rating }))
    : TESTIMONIALS

  useEffect(() => {
    if (testimonialPaused) return
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % clientVoices.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [testimonialPaused, clientVoices.length])

  useEffect(() => {
    if (!testimonialRef.current) return
    const cards = testimonialRef.current.querySelectorAll('[data-testimonial]')
    const activeCard = cards[activeTestimonial] as HTMLElement
    if (activeCard) activeCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeTestimonial])
  const [openProcess, setOpenProcess] = useState<number>(0)
  const [activeWhyUs, setActiveWhyUs] = useState(0)
  const [playingStory, setPlayingStory] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
    const handleEnded = () => { video.currentTime = 0; video.play().catch(() => {}) }
    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#0a0a0a', color: '#f0ede8', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'clamp(0.75rem, 2.5vw, 1.1rem) clamp(1rem, 5vw, 2.5rem)',
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease',
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.6rem' }}>
          <img
            src="/Assets/logo/logo.png"
            alt="Digi Era Pro"
            style={{ height: 'clamp(2.25rem, 7vw, 3.5rem)', width: 'auto', objectFit: 'contain', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </a>
        <ul style={{ display: 'flex', gap: 'clamp(1rem, 2.5vw, 2rem)', listStyle: 'none', margin: 0, padding: 0 }} className="hide-mobile">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <motion.a href={`#${l.toLowerCase()}`}
                style={{ color: '#ffffff', fontSize: '0.78rem', letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}
                whileHover={{ color: '#CE307D' }}
              >{l}</motion.a>
            </li>
          ))}
        </ul>
        <motion.a href="#contact"
          style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', background: '#CE307D', padding: '0.6rem 1.4rem', textDecoration: 'none', fontWeight: 500 }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(206,48,125,0.5)' }}
          whileTap={{ scale: 0.97 }}
          className="hide-mobile"
        >Start a project</motion.a>
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#f0ede8', cursor: 'pointer', display: 'none', flexDirection: 'column', gap: '5px', padding: '4px' }}
          className="show-mobile" aria-label="Menu"
        >
          <span style={{ display: 'block', width: '24px', height: '1px', background: '#f0ede8', transition: 'transform 0.3s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '1px', background: '#f0ede8', transition: 'opacity 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '24px', height: '1px', background: '#f0ede8', transition: 'transform 0.3s', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99, background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #CE307D, #ff6eb4, #CE307D)' }} />
            {NAV_LINKS.map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ fontFamily: "'Fraunces', serif", fontSize: '2.5rem', color: '#f0ede8', textDecoration: 'none' }}
                whileHover={{ color: '#CE307D', x: 10 }}
              >{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <video ref={videoRef} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, pointerEvents: 'none' }}>
          <source src="/Assets/coverr-sitting-down-in-the-office-72-1080p.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 0%, transparent 60%)', pointerEvents: 'none' }} />

        <motion.div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(1.25rem, 6vw, 2.5rem) clamp(3rem, 10vw, 6rem)', maxWidth: '1400px', margin: '0 auto', width: '100%', paddingTop: 'clamp(100px, 22vw, 140px)', opacity: heroOpacity }}>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(3.5rem, 10vw, 10rem)', lineHeight: 0.9, letterSpacing: '-0.03em', margin: '0 0 3rem', maxWidth: '14ch', color: '#f0ede8' }}>
           The Digital Marketing <em style={{ color: '#CE307D', fontStyle: 'italic' }}>Agency.</em>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: 'flex', gap: 'clamp(1.5rem, 5vw, 3rem)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <p style={{ maxWidth: '38ch', color: '#ffffff', fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>
              We are a full-service marketing agency helping brands grow through creative strategy, compelling content, and digital experiences. We turn ideas into meaningful campaigns that connect brands with their audiences.
            </p>
            <motion.a href="#work"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                color: '#f0ede8', textDecoration: 'none', fontSize: '0.8rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                border: '1px solid rgba(240,237,232,0.2)', padding: '0.85rem 1.75rem',
                position: 'relative', overflow: 'hidden',
              }}
              whileHover={{ borderColor: '#CE307D', color: '#CE307D' }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                style={{ position: 'absolute', inset: 0, background: 'rgba(206,48,125,0.08)', opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span style={{ position: 'relative', zIndex: 1 }}>View our work</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                style={{ display: 'inline-block', position: 'relative', zIndex: 1 }}
              >↓</motion.span>
            </motion.a>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ display: 'grid', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', gap: '1px', background: 'rgba(255,255,255,0.06)' }}
            className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map(s => (
              <div key={s.label} style={{ padding: '1.5rem clamp(1rem, 4vw, 2rem)', background: '#0a0a0a' }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#CE307D', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', marginTop: '0.5rem' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* VIDEO STORIES */}
      <section style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <RevealOnScroll style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D', display: 'block', marginBottom: '1rem' }}>Client stories</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f0ede8', margin: '0 0 1rem', lineHeight: 1.05 }}>
              Stories of growth <em style={{ color: '#CE307D', fontStyle: 'italic' }}>& success.</em>
            </h2>
            <p style={{ color: '#ffffff', fontSize: '0.95rem', maxWidth: '52ch', margin: '0 auto' }}>
              From strategy to execution — hear directly from the founders and leaders we've partnered with.
            </p>
          </RevealOnScroll>
          <StaggerOnScroll style={{ display: 'grid', gap: '1.5rem' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {VIDEO_STORIES.map((s, i) => (
              <motion.div key={s.name} variants={fadeUp}>
                <StoryCard story={s} playing={playingStory === i} onPlay={() => setPlayingStory(i)} onStop={() => setPlayingStory(null)} />
              </motion.div>
            ))}
          </StaggerOnScroll>
        </div>
      </section>

      {/* HISTORY */}
      <section id="work" style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0f0f0f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <RevealOnScroll style={{ marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D' }}>Our story</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', margin: '1rem 0 0', lineHeight: 1, color: '#f0ede8' }}>Company History</h2>
          </RevealOnScroll>
          <StaggerOnScroll style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)' }} className="grid grid-cols-1 md:grid-cols-2">
            {HISTORY.map((item, i) => (
              <motion.div key={item.year} variants={fadeUp}>
                <HistoryCard item={item} index={i} />
              </motion.div>
            ))}
          </StaggerOnScroll>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <RevealOnScroll style={{ marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D' }}>What we do</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', margin: '1rem 0 0', lineHeight: 1, color: '#f0ede8' }}>
              Craft at every <em style={{ fontStyle: 'italic', color: '#CE307D' }}>level.</em>
            </h2>
          </RevealOnScroll>
          <StaggerOnScroll style={{ display: 'grid', gap: '0', background: '#0a0a0a', overflow: 'hidden' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <motion.div key={s.num} variants={fadeUp}>
                <ServiceCard service={s} index={i} />
              </motion.div>
            ))}
          </StaggerOnScroll>
        </div>
      </section>

      {/* MARQUEE */}
      <MarqueeBar />



      {/* CLIENTS */}
      <section style={{ padding: 'clamp(3rem, 8vw, 7rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        {/* Background orb */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <RevealOnScroll style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#f0ede8', margin: 0, lineHeight: 1 }}>
              Partners who <em style={{ color: '#CE307D', fontStyle: 'italic' }}>trust us.</em>
            </h2>
          </RevealOnScroll>
          <PartnersGrid partners={PARTNERS} />
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: '6rem', alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-2">
            <RevealOnScroll>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D' }}>Our principles</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', margin: '1rem 0 2rem', lineHeight: 1.05, color: '#f0ede8' }}>
                We believe marketing is an <em style={{ color: '#CE307D', fontStyle: 'italic' }}>engine.</em>
              </h2>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
                Every project is a position. We advocate for clarity over complexity, durability over novelty, and specificity over safe generalism.
              </p>
              <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.8, margin: '0 0 2rem' }}>
                We don't chase trends — we build strategies that outlast them. From brand identity to performance campaigns, every decision we make is rooted in data, driven by creativity, and measured by real outcomes.
              </p>
              <ul style={{ listStyle: 'none', margin: '0 0 2.5rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Strategy before execution — always.',
                  'Creative work backed by market research.',
                  'Transparent reporting & measurable ROI.',
                  'Long-term partnerships, not one-off projects.',
                ].map(point => (
                  <li key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem', color: '#ffffff' }}>
                    <span style={{ color: '#CE307D', marginTop: '0.15rem', flexShrink: 0 }}>→</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem' }}>
                {[{ v: '4', l: 'Core values' }, { v: '14+', l: 'Years in market' }, { v: '12+', l: 'Industries served' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: '2.5rem', fontWeight: 300, color: '#CE307D', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', marginTop: '0.4rem' }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <motion.a href="#contact"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CE307D', textDecoration: 'none', borderBottom: '1px solid rgba(206,48,125,0.4)', paddingBottom: '0.3rem' }}
                whileHover={{ gap: '1rem', borderColor: '#CE307D' }}
              >
                Work with us <span>→</span>
              </motion.a>
            </RevealOnScroll>
            <StaggerOnScroll style={{ display: 'grid', gap: '1px', background: 'transparent' }} className="grid grid-cols-1 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <motion.div key={v.word} variants={fadeUp}>
                  <ValueCard value={v} index={i} />
                </motion.div>
              ))}
            </StaggerOnScroll>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0f0f0f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <RevealOnScroll style={{ marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D' }}>How we work</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', margin: '1rem 0 0', lineHeight: 1, color: '#f0ede8' }}>The process</h2>
          </RevealOnScroll>
          <div>
            {PROCESS_STEPS.map((step, i) => {
              const isOpen = openProcess === i
              return (
                <RevealOnScroll key={step.num} delay={i * 0.05} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
                  <div onClick={() => setOpenProcess(i)}>
                    <motion.div style={{ display: 'grid', gridTemplateColumns: 'clamp(2.25rem, 8vw, 4rem) 1fr auto', gap: 'clamp(1rem, 3vw, 2rem)', padding: '2rem 0', alignItems: 'center' }}
                      whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <span style={{ fontFamily: "'Fraunces', serif", fontSize: '0.85rem', color: isOpen ? '#f0ede8' : 'rgba(240,237,232,0.3)', transition: 'color 0.2s' }}>{step.num}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(1.25rem, 3vw, 2rem)', margin: 0, letterSpacing: '-0.02em', color: isOpen ? '#CE307D' : '#f0ede8', transition: 'color 0.2s' }}>{step.phase}</h3>
                        <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem' }}>{step.duration}</span>
                      </div>
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} style={{ color: '#CE307D', fontSize: '1.5rem', display: 'inline-block', lineHeight: 1 }}>+</motion.span>
                    </motion.div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                          <div style={{ paddingBottom: '2.5rem', paddingLeft: 'clamp(1.5rem, 18vw, 6rem)' }}>
                            <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: 0, maxWidth: '60ch' }}>{step.desc}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </RevealOnScroll>
              )
            })}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <RevealOnScroll>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D', display: 'block', marginBottom: '4rem' }}>Client voices</span>
          </RevealOnScroll>
          <div style={{ display: 'grid', gap: '6rem', alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-2">
            <div style={{ position: 'sticky', top: '8rem' }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTestimonial}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ExpandableQuote quote={clientVoices[activeTestimonial % clientVoices.length].quote} />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div key={`a-${activeTestimonial}`}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={clientVoices[activeTestimonial % clientVoices.length].avatar} alt={clientVoices[activeTestimonial % clientVoices.length].author}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(206,48,125,0.4)', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.3rem' }}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <span key={si} style={{ color: si < Math.round(clientVoices[activeTestimonial % clientVoices.length].rating) ? '#CE307D' : 'rgba(240,237,232,0.2)', fontSize: '0.85rem' }}>★</span>
                      ))}
                    </div>
                    <p style={{ fontWeight: 500, margin: '0 0 0.2rem', fontSize: '0.9rem', color: '#f0ede8' }}>{clientVoices[activeTestimonial % clientVoices.length].author}</p>
                    <p style={{ color: '#ffffff', margin: 0, fontSize: '0.8rem', letterSpacing: '0.04em' }}>{clientVoices[activeTestimonial % clientVoices.length].title}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div
              style={{ position: 'relative', height: '300px', overflow: 'hidden' }}
              onMouseEnter={() => setTestimonialPaused(true)}
              onMouseLeave={() => setTestimonialPaused(false)}
            >
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '1px',
                animation: testimonialPaused ? 'none' : 'scrollUp 30s linear infinite',
              }}>
                {[...clientVoices, ...clientVoices].map((t, i) => (
                  <motion.div key={i}
                    onClick={() => { setActiveTestimonial(i % clientVoices.length); setTestimonialPaused(true) }}
                    style={{ padding: '1.25rem 2rem', cursor: 'pointer', borderLeft: '2px solid transparent', background: '#0a0a0a', flexShrink: 0 }}
                    whileHover={{ background: 'rgba(206,48,125,0.05)', borderLeftColor: '#CE307D' }}
                    transition={{ duration: 0.2 }}>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: '0.95rem', margin: '0 0 0.3rem', color: '#ffffff', whiteSpace: 'nowrap' }}>{t.author}</p>
                    <p style={{ fontSize: '0.75rem', color: '#ffffff', margin: '0 0 0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '28ch' }}>
                      {t.quote.slice(0, 60)}{t.quote.length > 60 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {Array.from({ length: 5 }).map((_, si) => (
                          <span key={si} style={{ color: si < Math.round(t.rating) ? '#CE307D' : 'rgba(240,237,232,0.15)', fontSize: '0.65rem' }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#ffffff' }}>{t.rating}.0</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <section style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '-8%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: '4rem', alignItems: 'center' }} className="grid grid-cols-1 lg:grid-cols-2">
            <RevealOnScroll>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D', display: 'block', marginBottom: '1rem' }}>Our clients</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#f0ede8', margin: '0 0 1.5rem', lineHeight: 1.1 }}>
                Our growing network of <em style={{ color: '#CE307D', fontStyle: 'italic' }}>trusted clients.</em>
              </h2>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: 0, maxWidth: '44ch' }}>
                We're proud to collaborate with top brands, helping them achieve real success together.
              </p>
            </RevealOnScroll>
            <StaggerOnScroll style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)' }} className="grid grid-cols-2 sm:grid-cols-3">
              {CLIENT_LOGOS.map(c => <ClientLogoCard key={c.name} client={c} />)}
            </StaggerOnScroll>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-8%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: '6rem', alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-2">
            <RevealOnScroll>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D', display: 'block', marginBottom: '1.5rem' }}>Why choose us</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', margin: '0 0 2.5rem', lineHeight: 1.1, color: '#f0ede8' }}>
                Here's what makes us <em style={{ color: '#CE307D', fontStyle: 'italic' }}>different.</em>
              </h2>
              <div style={{ display: 'flex', gap: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {WHY_CHOOSE_US.map((w, i) => (
                  <button key={w.tab} onClick={() => setActiveWhyUs(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 1rem', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: activeWhyUs === i ? '#f0ede8' : 'rgba(240,237,232,0.4)', fontFamily: "'Outfit', sans-serif", position: 'relative', transition: 'color 0.2s' }}>
                    {w.tab}
                    {activeWhyUs === i && (
                      <motion.div layoutId="whyUsUnderline" style={{ position: 'absolute', left: 0, right: 0, bottom: '-1px', height: '2px', background: '#CE307D' }} />
                    )}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={activeWhyUs}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: 0, maxWidth: '48ch' }}>
                  {WHY_CHOOSE_US[activeWhyUs].desc}
                </motion.p>
              </AnimatePresence>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <div style={{ position: 'relative', marginBottom: '3rem' }}>
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=560&fit=crop&auto=format" alt="Our team"
                  style={{ width: '100%', height: '260px', borderRadius: '16px', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.85) 100%)' }} />
                <div style={{
                  position: 'absolute', left: '1.5rem', bottom: '-1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1rem 1.5rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: '2rem', color: '#CE307D', letterSpacing: '-0.03em', lineHeight: 1 }}>15+</span>
                  <span style={{ fontSize: '0.75rem', color: '#ffffff', lineHeight: 1.3, maxWidth: '10ch' }}>Years driving client growth</span>
                </div>
              </div>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: '2.5rem 0 0', maxWidth: '52ch' }}>
                There are a lot of digital marketing agencies out there. Here's why we stand out: our commitment to your success, our customized approach, and our results-driven strategies.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', right: '-5%', transform: 'translateY(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,48,125,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <RevealOnScroll>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D', display: 'block', marginBottom: '1.5rem' }}>About the Company</span>
          </RevealOnScroll>
          <div style={{ display: 'grid', gap: '6rem', alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-2">
            <RevealOnScroll>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1, color: '#f0ede8' }}>
                Strategy-led.<br /><em style={{ color: '#CE307D', fontStyle: 'italic' }}>Results</em> obsessed.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 1rem' }}>Founded in 2018, Digi Era Pro started as a small team with one goal: help growing businesses build a real digital presence. Since then we've become a full-service digital marketing agency trusted by clients across the US, and — since our 2025 expansion — Malaysia too.</p>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 3rem' }}>We stay lean and hands-on, so no account gets lost in a queue. Every client works directly with strategists, designers, and marketers who treat your growth like their own.</p>
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                {[{ v: '2018', l: 'Founded' }, { v: '280+', l: 'Projects' }, { v: '40+', l: 'Global clients' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 300, color: '#CE307D', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', marginTop: '0.4rem' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0f0f0f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <RevealOnScroll style={{ marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D' }}>The people</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', margin: '1rem 0 0', lineHeight: 1, color: '#f0ede8' }}>Principals</h2>
          </RevealOnScroll>
          <StaggerOnScroll style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(person => (
              <motion.div key={person.name} variants={fadeUp}>
                <TeamCard person={person} />
              </motion.div>
            ))}
          </StaggerOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ marginTop: '3rem', color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Supported by a wider team of 22 strategists, designers, developers, and producers across Berlin, New York, and Tokyo.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* JOURNAL */}
      <section id="journal" style={{ padding: 'clamp(3.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 2.5rem)', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <RevealOnScroll style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CE307D' }}>Thinking</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', margin: '1rem 0 0', lineHeight: 1, color: '#f0ede8' }}>Journal</h2>
            </div>
            <motion.a href="#" style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}
              whileHover={{ color: '#CE307D', borderColor: '#CE307D' }}>All articles →</motion.a>
          </RevealOnScroll>
          <StaggerOnScroll style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)' }} className="grid grid-cols-1 md:grid-cols-4">
            {JOURNAL.map((post, i) => (
              <motion.div key={post.title} variants={fadeUp} className={i === 0 ? 'md:col-span-2' : undefined}>
                <JournalCard post={post} featured={i === 0} />
              </motion.div>
            ))}
          </StaggerOnScroll>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: 'clamp(3rem, 8vw, 6rem) clamp(1.25rem, 6vw, 2.5rem) clamp(1.75rem, 4vw, 3rem)', background: '#CE307D', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: '3rem', alignItems: 'end', marginBottom: '4.5rem' }} className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '1.5rem' }}>Let's work together</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(2.75rem, 7vw, 6.5rem)', letterSpacing: '-0.03em', margin: 0, lineHeight: 0.95, color: '#fff' }}>
                Start your next <em style={{ fontStyle: 'italic', color: '#ffffff' }}>chapter.</em>
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <motion.a href={`mailto:${FOOTER_CONTACT[2].value}`}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: '#fff', color: '#CE307D', padding: '1.1rem 1.75rem', fontSize: '0.85rem', letterSpacing: '0.04em', fontWeight: 600, textDecoration: 'none', borderRadius: '10px' }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.97 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}><Mail size={16} /> {FOOTER_CONTACT[2].value}</span>
                <span>→</span>
              </motion.a>
              <motion.a href={FOOTER_CONTACT[0].href}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '1.1rem 1.75rem', fontSize: '0.85rem', letterSpacing: '0.04em', textDecoration: 'none', borderRadius: '10px' }}
                whileHover={{ borderColor: '#fff', background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.97 }}>
                <Phone size={16} /> {FOOTER_CONTACT[0].value}
              </motion.a>
            </motion.div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.25)', paddingTop: '3.5rem' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', color: '#fff' }}>
                  DIGI ERA PRO
                </span>
                <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.7, margin: '1.25rem 0 1.5rem', maxWidth: '32ch' }}>
                  Your partner in building a strong online presence with creative, results-focused marketing!
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {SOCIAL_LINKS.map(s => (
                    <motion.a key={s.name} href={s.href} aria-label={s.name}
                      style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}
                      whileHover={{ background: '#000', y: -3 }}>
                      <s.icon size={14} />
                    </motion.a>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.5rem', fontWeight: 700 }}>Explore</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {FOOTER_EXPLORE.map(l => (
                    <motion.a key={l.label} href={l.href}
                      style={{ fontSize: '0.9rem', color: '#ffffff', textDecoration: 'none', display: 'inline-block', width: 'fit-content' }}
                      whileHover={{ x: 4, color: '#fff' }}>{l.label}</motion.a>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.5rem', fontWeight: 700 }}>Contact</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {FOOTER_CONTACT.map(c => (
                    <motion.a key={c.label} href={c.href}
                      style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', textDecoration: 'none' }}
                      whileHover={{ x: 4 }}>
                      <c.icon size={17} style={{ color: '#fff', flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#ffffff' }}>{c.label}</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>{c.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.5rem', fontWeight: 700 }}>Follow our channel</h3>
                <motion.a href="https://wa.me/17866001595" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: '#fff', color: '#CE307D', padding: '1rem 1.5rem', fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', borderRadius: '10px', width: '100%' }}
                  whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.97 }}>
                  <FaWhatsapp size={17} /> Follow us
                </motion.a>
                <p style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.7, margin: '1.1rem 0 0' }}>
                  For the latest updates and news, join our WhatsApp channel.
                </p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.25)', marginTop: '3.5rem', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.82rem', color: '#ffffff', margin: 0 }}>
                ©{new Date().getFullYear()}. All rights reserved by <span style={{ color: '#fff', fontWeight: 600 }}>Digi Era Pro LLC</span>
              </p>
              <a href="#" style={{ fontSize: '0.82rem', color: '#fff', textDecoration: 'underline' }}>Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

function ExpandableQuote({ quote }: { quote: string }) {
  const [expanded, setExpanded] = useState(false)
  const LIMIT = 180
  const isLong = quote.length > LIMIT
  const displayed = expanded || !isLong ? quote : quote.slice(0, LIMIT) + '...'
  return (
    <div style={{ marginBottom: '2rem' }}>
      <blockquote style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(1rem, 2vw, 1.5rem)', lineHeight: 1.6, letterSpacing: '-0.01em', margin: '0 0 0.75rem', color: '#f0ede8', fontStyle: 'italic', borderLeft: '2px solid #CE307D', paddingLeft: '1.5rem' }}>
        "{displayed}"
      </blockquote>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CE307D', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0 0 1.5rem', display: 'block' }}
        >
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}
    </div>
  )
}

function ClientLogoCard({ client }: { client: typeof CLIENT_LOGOS[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      variants={scaleUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', background: '#f5f5f5', padding: '2rem 1.5rem 1.25rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.85rem',
        minHeight: '150px', cursor: 'default', overflow: 'hidden',
        boxShadow: hovered ? '0 16px 32px rgba(0,0,0,0.35)' : '0 0 0 rgba(0,0,0,0)',
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#CE307D', transformOrigin: 'left' }}
      />
      <img src={client.img} alt={client.name} style={{ maxWidth: '150px', maxHeight: '60px', width: '100%', objectFit: 'contain' }} />
      <span style={{ fontSize: '0.68rem', letterSpacing: '0.03em', color: '#666', textAlign: 'center', lineHeight: 1.3 }}>{client.name}</span>
    </motion.div>
  )
}

function StoryCard({ story, playing, onPlay, onStop }: { story: typeof VIDEO_STORIES[0]; playing: boolean; onPlay: () => void; onStop: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }} transition={{ duration: 0.25 }}
      style={{ position: 'relative', aspectRatio: '9 / 16', overflow: 'hidden', background: '#111', cursor: playing ? 'default' : 'pointer' }}
      onClick={() => { if (!playing) onPlay() }}
    >
      {playing ? (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${story.videoId}?autoplay=1&playsinline=1&rel=0`}
            title={`'s story`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
          <motion.button
            aria-label="Close video"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); onStop() }}
            style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem', width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1,
            }}
          >
            ✕
          </motion.button>
        </>
      ) : (
        <>
          <img src={story.poster} alt={story.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', transition: 'background 0.25s' }} />
          <motion.button
            aria-label={`Play ${story.name}'s story`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
              border: '1.5px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <span style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '14px solid #fff', marginLeft: '4px' }} />
          </motion.button>
        </>
      )}
    </motion.div>
  )
}

function MarqueeBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [phase, setPhase] = useState<'idle' | 'typing' | 'scrolling'>('idle')
  const [typed, setTyped] = useState('')
  const [paused, setPaused] = useState(false)
  const firstWord = MARQUEE_WORDS[0]

  useEffect(() => {
    if (inView && phase === 'idle') setPhase('typing')
  }, [inView, phase])

  useEffect(() => {
    if (phase !== 'typing') return
    if (typed.length >= firstWord.length) {
      const t = setTimeout(() => setPhase('scrolling'), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTyped(firstWord.slice(0, typed.length + 1)), 70)
    return () => clearTimeout(t)
  }, [phase, typed, firstWord])

  const wordStyle: React.CSSProperties = {
    fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300,
    fontSize: 'clamp(1.25rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', lineHeight: 1,
    color: 'transparent', WebkitTextStroke: '1.5px rgba(240,237,232,0.7)',
  } as React.CSSProperties

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        overflow: 'hidden', background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}
    >
      <div style={{ padding: '2.5rem 0', overflow: 'hidden', display: 'flex', justifyContent: phase === 'scrolling' ? 'flex-start' : 'center' }}>
        {phase === 'scrolling' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem', whiteSpace: 'nowrap', animation: 'marquee 34s linear infinite', animationPlayState: paused ? 'paused' : 'running' }}>
            {Array(8).fill(MARQUEE_WORDS).flat().map((t, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3.5rem' }}>
                <span style={wordStyle}>{t}</span>
                <span style={{ color: '#CE307D', fontSize: 'clamp(1rem, 1.5vw, 1.5rem)' }}>✦</span>
              </span>
            ))}
          </div>
        ) : (
          <span style={wordStyle}>
            {typed}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }} style={{ marginLeft: '6px', color: '#CE307D', WebkitTextStroke: '0px' }}>|</motion.span>
          </span>
        )}
      </div>
    </div>
  )
}

function PartnersGrid({ partners }: { partners: typeof PARTNERS }) {
  return (
    <div style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {partners.map((p, i) => <PartnerCard key={p.name} partner={p} index={i} />)}
    </div>
  )
}

function PartnerCard({ partner, index }: { partner: typeof PARTNERS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      style={{
        background: '#0a0a0a',
        padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        minHeight: '160px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
      whileHover={{ background: '#111' }}
    >
      {/* Hover glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(206,48,125,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}
      />
      {/* Top accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #CE307D, transparent)', transformOrigin: 'center' }}
      />
      {/* Logo image — no background, just the image itself */}
      <motion.div
        animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <img
          src={partner.img}
          alt={partner.name}
          style={{
            maxWidth: '140px',
            maxHeight: '52px',
            width: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: hovered
              ? 'grayscale(0) drop-shadow(0 0 12px rgba(206,48,125,0.4))'
              : 'grayscale(1) opacity(0.55)',
            transition: 'filter 0.4s ease',
          }}
        />
      </motion.div>
      {/* Partner name — fades in on hover */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.3 }}
        style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff', position: 'relative', zIndex: 1 }}
      >
        {partner.name}
      </motion.span>
    </motion.div>
  )
}

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [hovered, setHovered] = useState(index === 0)
  return (
    <motion.div
      style={{ background: '#0a0a0a', padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '2rem', cursor: 'pointer', position: 'relative', minHeight: '340px', overflow: 'hidden' }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(index === 0)}
      whileHover={{ background: '#111' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Glow on hover */}
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(206,48,125,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Top accent bar */}
      <motion.div animate={{ scaleX: hovered ? 1 : 0 }} initial={{ scaleX: index === 0 ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #CE307D, #ff6eb4)', transformOrigin: 'left' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <motion.span animate={{ color: hovered ? '#CE307D' : 'rgba(240,237,232,0.15)', scale: hovered ? 1.15 : 1 }} style={{ display: 'inline-block' }}>
          <service.icon size={28} strokeWidth={1.5} />
        </motion.span>
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', color: hovered ? '#f0ede8' : 'rgba(240,237,232,0.2)', fontFamily: "'Fraunces', serif" }}>{service.num}</span>
      </div>
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', letterSpacing: '-0.02em', margin: '0 0 1rem', color: '#f0ede8', lineHeight: 1.1 }}>{service.title}</h3>
        <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.8, margin: 0 }}>{service.desc}</p>
      </div>
      <motion.div animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CE307D' }}>Learn more</span>
        <span style={{ color: '#CE307D' }}>→</span>
      </motion.div>
    </motion.div>
  )
}

function HistoryCard({ item, index }: { item: typeof HISTORY[0]; index: number }) {
  const [hovered, setHovered] = useState(index === 0)
  return (
    <motion.div
      style={{ background: '#0f0f0f', padding: 'clamp(1.75rem, 6vw, 3.5rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'default', position: 'relative', overflow: 'hidden', minHeight: '260px' }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(index === 0 ? true : false)}
      whileHover={{ background: '#141414' }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(206,48,125,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <motion.div animate={{ scaleX: hovered ? 1 : 0 }} initial={{ scaleX: index === 0 ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #CE307D, transparent)', transformOrigin: 'left' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <motion.span animate={{ color: hovered ? '#CE307D' : 'rgba(240,237,232,0.08)' }} style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 }}>{item.year}</motion.span>
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: hovered ? '#f0ede8' : 'rgba(240,237,232,0.2)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.3rem 0.75rem', marginTop: '0.5rem' }}>0{index + 1}</span>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', letterSpacing: '-0.02em', margin: '0 0 0.75rem', color: '#f0ede8', lineHeight: 1.15 }}>{item.title}</h3>
        <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
      </div>
      <motion.div animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '24px', height: '1px', background: '#CE307D' }} />
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CE307D' }}>Milestone</span>
      </motion.div>
    </motion.div>
  )
}

function ValueCard({ value, index }: { value: typeof VALUES[0]; index: number }) {
  const [hovered, setHovered] = useState(index === 0)
  return (
    <motion.div
      style={{ background: '#0a0a0a', padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'default', position: 'relative', minHeight: '300px', overflow: 'hidden' }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(index === 0)}
      whileHover={{ background: '#111' }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%, rgba(206,48,125,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <motion.div animate={{ scaleX: hovered ? 1 : 0 }} initial={{ scaleX: index === 0 ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #CE307D, #ff6eb4)', transformOrigin: 'left' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <motion.span animate={{ color: hovered ? '#CE307D' : 'rgba(240,237,232,0.15)', scale: hovered ? 1.15 : 1 }} style={{ display: 'inline-block' }}>
          <value.icon size={36} strokeWidth={1.2} />
        </motion.span>
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: hovered ? '#f0ede8' : 'rgba(240,237,232,0.2)' }}>0{index + 1}</span>
      </div>
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(1.3rem, 2vw, 1.6rem)', letterSpacing: '-0.02em', margin: '0 0 0.75rem', color: '#f0ede8' }}>{value.word}</h3>
        <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.8, margin: 0 }}>{value.desc}</p>
      </div>
      <motion.div animate={{ width: hovered ? '100%' : '0%' }} style={{ height: '1px', background: 'linear-gradient(90deg, #CE307D, transparent)', position: 'relative', zIndex: 1 }} transition={{ duration: 0.5 }} />
    </motion.div>
  )
}

function TeamCard({ person }: { person: typeof TEAM[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div style={{ background: '#0f0f0f', overflow: 'hidden', position: 'relative' }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}>
      <div style={{ height: '380px', overflow: 'hidden', background: '#1a1a1a', position: 'relative' }}>
        <motion.img src={person.img} alt={person.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: hovered ? 'brightness(0.6) saturate(0.8)' : 'brightness(0.75) saturate(0.9)' }}
          animate={{ scale: hovered ? 1.07 : 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
        <motion.div animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(206,48,125,0.4) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.75rem' }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: '1.2rem', fontWeight: 300, margin: '0 0 0.25rem', color: '#fff' }}>{person.name}</p>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>{person.role}</p>
        </motion.div>
      </div>
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', fontWeight: 300, margin: '0 0 0.2rem', color: '#f0ede8' }}>{person.name}</p>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>{person.role}</p>
        </div>
        <motion.span animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }} style={{ color: '#CE307D', fontSize: '1.1rem' }}>→</motion.span>
      </div>
    </motion.div>
  )
}

function GoogleReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.text.length > 180
  const displayText = expanded || !isLong ? review.text : review.text.slice(0, 180) + '...'

  return (
    <motion.div
      style={{ background: '#0f0f0f', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden', minHeight: '200px' }}
      whileHover={{ background: '#141414' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #CE307D, transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src={review.profile_photo_url} alt={review.author_name}
          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(206,48,125,0.3)', flexShrink: 0 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div>
          <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: '1rem', margin: '0 0 0.2rem', color: '#f0ede8' }}>{review.author_name}</p>
          <p style={{ fontSize: '0.7rem', color: '#ffffff', margin: 0, letterSpacing: '0.04em' }}>{review.relative_time_description}</p>
        </div>
        <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < review.rating ? '#CE307D' : 'rgba(240,237,232,0.15)', fontSize: '0.8rem' }}>★</span>
          ))}
        </div>
      </div>
      <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.75, margin: 0 }}>"{displayText}"</p>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CE307D', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0, textAlign: 'left' }}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </motion.div>
  )
}

function JournalCard({ post, featured }: { post: typeof JOURNAL[0]; featured?: boolean }) {
  return (
    <motion.div
      style={{ background: '#0a0a0a', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative' }}
      whileHover={{ background: '#0f0f0f' }}
    >
      <div style={{ height: featured ? '340px' : '220px', overflow: 'hidden', background: '#1a1a1a', flexShrink: 0, position: 'relative' }}>
        <motion.img src={post.img} alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.7)' }}
          whileHover={{ scale: 1.07, filter: 'brightness(0.85)' }}
          transition={{ duration: 0.6 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)', pointerEvents: 'none' }} />
      </div>
      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CE307D', background: 'rgba(206,48,125,0.12)', border: '1px solid rgba(206,48,125,0.25)', padding: '0.25rem 0.7rem' }}>{post.category}</span>
          <span style={{ fontSize: '0.68rem', color: '#ffffff', letterSpacing: '0.06em' }}>{post.date}</span>
        </div>
        <motion.h3
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: featured ? '1.5rem' : '1.1rem', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2, color: '#f0ede8' }}
          whileHover={{ color: '#CE307D' }}
        >{post.title}</motion.h3>
        {featured && <p style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{post.excerpt}</p>}
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: '#ffffff', marginTop: 'auto' }}>{post.readTime}</span>
      </div>
    </motion.div>
  )
}
