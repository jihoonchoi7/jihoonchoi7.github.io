import { SocialButtons } from "./components/SocialButtons";
import { InfiniteScroll } from "./components/InfiniteScroll";

export default function Home() {
  return (
    <main className="font-sans min-h-screen bg-background relative">
      <div className="background-pattern" />
      <InfiniteScroll />
      <div className="max-w-4xl pl-6 py-8 relative z-10">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-text">Jihoon Choi</h1>
        </header>

        {/* About Section */}
        <section className="mt-8">
          <div className="prose prose-lg">
            <h2 className="text-xl font-medium text-text mb-4">About</h2>
            <ul className="list-decimal pl-5 space-y-2 text-sm text-text">
              <li>Born in South Korea, raised in the Philippines for 18 years. Finished highschool in Midtown High in Atlanta, GA.</li>
              <li>Went to SMU in Dallas, TX for Piano. My professor is 4 handshakes away from Beethoven. Making me the 5th handshake.</li>
              <li>Met the love of my life in college. </li>
              <li>Living in Chicago and frequently visiting SF/LA/ATL. </li>
              <li>Working in Sales at Stripe. </li>
            </ul>
          </div>
        </section>

        {/* Social Buttons */}
        <SocialButtons />
      </div>
    </main>
  );
}
