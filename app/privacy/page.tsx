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
      <h2>Analytics</h2>
      <p>
        We may use Google Analytics to understand how the site is used — for example, which pages are visited and whether people choose monthly
        or annual salaries. Analytics cookies are only used if you accept them in the cookie banner. We never send the amounts you enter to Google Analytics.
      </p>
      <h2>Advertising</h2>
      <p>
        Advertising is provided by third parties such as Google and is shown whether or not you accept cookies. If you accept, ads may be
        personalised to your interests; if you choose “No thanks”, you see non-personalised ads, which may still use cookies for things like
        limiting how often an ad appears and preventing fraud. Ads are kept separate from the calculator.
      </p>
      <h2>Changing your choice</h2>
      <p>Use “Cookie settings” at the bottom of any page to change your cookie choice at any time.</p>
      <h2>Changes</h2>
      <p>If we change how we handle data, we will update this page.</p>
    </article>
  );
}
