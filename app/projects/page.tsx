import { SnakeGame } from '../components/SnakeGame';

export default function Projects() {
  return (
    <main className="font-sans min-h-screen bg-background relative">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Section */}
          <div>
            <header>
              <h1 className="text-3xl font-bold text-text font-['Times_New_Roman']">Projects</h1>
            </header>
            <section className="mt-8">
              <div className="prose prose-lg">
                <p className="text-sm text-text">More projects coming soon...</p>
              </div>
            </section>
          </div>

          {/* Center Section - Snake Game */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-6 font-['Times_New_Roman']">Snakes</h2>
            <SnakeGame />
          </div>

          {/* Right Section */}
          <div className="col-span-1">
            {/* Add future content here */}
          </div>
        </div>
      </div>
    </main>
  );
} 