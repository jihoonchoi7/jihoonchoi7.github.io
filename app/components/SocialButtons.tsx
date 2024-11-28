import Link from 'next/link';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ji_hoony_choi/',
  },
  {
    name: 'X',
    url: 'https://x.com/jihoonc7',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/jihoon.choi.9461',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/jihoon-choi7/',
  },
  {
    name: 'Projects',
    url: '/projects',
    internal: true,
  },
];

export function SocialButtons() {
  return (
    <div className="flex gap-4 mt-24 mb-12">
      {socialLinks.map((link) => (
        <Link
          key={link.name}
          href={link.url}
          target={link.internal ? undefined : "_blank"}
          rel={link.internal ? undefined : "noopener noreferrer"}
          className="inline-flex items-center justify-center h-[30px] w-[80px] border border-black text-sm transition-colors duration-200 ease-in-out hover:bg-black hover:text-white font-['Times_New_Roman']"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
} 