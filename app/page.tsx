import { SocialButtons } from "./components/SocialButtons";

export default function Home() {
  return (
    <main className="font-sans min-h-screen bg-background relative">
      <div className="background-pattern" />
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
              <li>Went to SMU for Piano. My professor is 4 handshakes away from Beethoven. Making me the 5th handshake.</li>
              <li>Met my soon to be wife in college</li>
              <li>Living in Chicago</li>
            </ul>
          </div>
        </section>

        {/* Social Buttons */}
        <SocialButtons />
      </div>
    </main>
  );
}
