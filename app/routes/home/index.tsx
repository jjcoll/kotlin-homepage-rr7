import '@rescui/typography/lib/font-jb-sans-auto.css';

import hljs from 'highlight.js/lib/core';
import kotlin from 'highlight.js/lib/languages/kotlin';
import 'highlight.js/styles/github.css';
hljs.registerLanguage('kotlin', kotlin);

import { ThemeProvider } from '@rescui/ui-contexts';
import { useLoaderData } from 'react-router';

import type { Route } from "./+types/index";

// OG and Twitter images
import ogImage from "~/assets/images/open-graph/general.png";
import twitterImage from "~/assets/images/twitter/general.png";

import './index.scss';

// Loader runs on server - can read cookies
export function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const sortByName = cookieHeader.includes("kotlin-testimonials-order=name");
  return { sortByName };
}

export const meta: Route.MetaFunction = () => {
  const title = "Kotlin Programming Language";
  const description = "Kotlin is a modern, concise, and safe programming language for building multiplatform applications.";
  const siteUrl = "https://kotlinlang.org";

  return [
    { title },
    { name: "description", content: description },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:image", content: `${siteUrl}${ogImage}` },
    { property: "og:description", content: description },
    { property: "og:site_name", content: "Kotlin" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@kotlin" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image:src", content: `${siteUrl}${twitterImage}` },
  ];
};
import '../../styles/grid.scss'
import { Header } from '~/components/Header';
import { HeaderSection } from '~/components/HeaderSection';
import { LatestFromKotlinSection } from '~/components/LatestFromKotlinSection';
import { WhyKotlinSection } from '~/components/WhyKotlinSection';
import { UsageSection, type UsageSectionProps } from '~/components/UsageSection';
import { StartSection } from '~/components/StartSection';
import { Footer } from '~/components/Footer';

function OverviewPageContent({ initialSortByName }: { initialSortByName: boolean }) {
  return <div className="overview-page">
    <Header />
    <HeaderSection />
    <LatestFromKotlinSection />
    <WhyKotlinSection />
    <UsageSection initialSortByName={initialSortByName} />
    <StartSection />
    <Footer />
  </div>
}

export default function HomePage() {
  const { sortByName } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider theme="dark">
      <OverviewPageContent initialSortByName={sortByName} />
    </ThemeProvider>
  );
}


