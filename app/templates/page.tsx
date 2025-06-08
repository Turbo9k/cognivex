import ContentPage from '@/components/ContentPage';

export default function TemplatesPage() {
  return (
    <ContentPage
      title="Templates"
      section1={{
        title: "Ready-to-Use Templates",
        content: (
          <>
            <p>
              Browse our collection of professionally designed templates to kickstart your project.
              Each template is carefully crafted to provide the best user experience and follows
              modern design principles.
            </p>
            <ul className="mt-4 space-y-2">
              <li>• Responsive layouts</li>
              <li>• Modern UI components</li>
              <li>• Customizable themes</li>
              <li>• Documentation included</li>
            </ul>
          </>
        ),
      }}
      section2={{
        title: "Custom Templates",
        content: (
          <>
            <p>
              Need something specific? Our custom template service allows you to create
              tailored solutions for your unique requirements.
            </p>
            <ul className="mt-4 space-y-2">
              <li>• Custom design</li>
              <li>• Brand-specific styling</li>
              <li>• Specialized functionality</li>
              <li>• Dedicated support</li>
            </ul>
          </>
        ),
      }}
    />
  );
} 