import { pageMetadata, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy",
  description: `How ${SITE_NAME} handles your data: salary calculations run in your browser and are never sent or stored.`,
});

export default function Page() {
  return (
    <article className="prose max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Privacy</h1>
      <h2>Your salary stays on your device</h2>
      <p>
        The calculator runs entirely in your browser. The salary, allowances and bonus you enter are not sent to our servers, not saved, not put in
        the page address and not shared with analytics or advertising providers.
      </p>
      <h2>No account needed</h2>
      <p>We do not ask for your name, phone number, email address or employer.</p>
      <h2>Advertising</h2>
      <p>
        If advertising is shown on this site, it is provided by third parties such as Google, which may use cookies to show and measure ads. You can
        manage personalised advertising in your Google ad settings. Ads are kept separate from the calculator.
      </p>
      <h2>Changes</h2>
      <p>If we change how we handle data, we will update this page.</p>
    </article>
  );
}
