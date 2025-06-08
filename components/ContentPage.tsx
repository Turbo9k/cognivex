interface ContentPageProps {
  title: string;
  section1: {
    title: string;
    content: React.ReactNode;
  };
  section2: {
    title: string;
    content: React.ReactNode;
  };
}

export default function ContentPage({ title, section1, section2 }: ContentPageProps) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {title}
          </h1>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Section 1 */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section1.title}
              </h2>
              <div className="prose prose-indigo prose-lg text-gray-500">
                {section1.content}
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section2.title}
              </h2>
              <div className="prose prose-indigo prose-lg text-gray-500">
                {section2.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 