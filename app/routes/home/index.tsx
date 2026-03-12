import '@rescui/typography/lib/font-jb-sans-auto.css';

import hljs from 'highlight.js/lib/core';
import kotlin from 'highlight.js/lib/languages/kotlin';
import 'highlight.js/styles/github.css';
hljs.registerLanguage('kotlin', kotlin);

import { ThemeProvider } from '@rescui/ui-contexts';


import './index.scss';
import '../../styles/grid.scss'
import { HeaderSection } from '~/components/HeaderSection';
import { LatestFromKotlinSection } from '~/components/LatestFromKotlinSection';
import { WhyKotlinSection } from '~/components/WhyKotlinSection';
import { UsageSection } from '~/components/UsageSection';
import { StartSection } from '~/components/StartSection';
import Header from '~/components/Header';
import Footer from '~/components/Footer';

function OverviewPageContent() {
  return <div className="overview-page">
    <Header />
    <HeaderSection />
    <LatestFromKotlinSection />
    <WhyKotlinSection />
    <UsageSection />
    <StartSection />
    <Footer />
  </div>
}

export default function HomePage() {
  return (
    <ThemeProvider theme="dark">
      <OverviewPageContent />
    </ThemeProvider>
  );
}


