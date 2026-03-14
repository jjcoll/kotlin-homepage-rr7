import { useState } from 'react';
import Button from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import { cardCn } from '@rescui/card';
import { ThemeProvider } from '@rescui/ui-contexts';
import cn from 'classnames';


import { testimonials } from './data';

import './index.scss';
import { Container, Section } from '../Layout';

export interface UsageSectionProps {
  initialSortByName?: boolean;
}

function UsageSectionContent({ initialSortByName = false }: UsageSectionProps) {
  const textCn = useTextStyles();

  // Initial value comes from server (read from cookie in loader)
  const [sortByName, setSortByName] = useState(initialSortByName);
  const sortedTestimonials = sortByName
    ? [...testimonials].sort((a, b) => a.company.localeCompare(b.company))
    : testimonials;

  return (
    <Section className="usage-section">
      <Container>
        <h2 className={textCn('rs-hero')}>Kotlin Usage Highlights</h2>

        <div className="kto-offset-top-16" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            mode="outline"
            size="s"
            onClick={() => {
              const next = !sortByName;
              setSortByName(next);
              // Use cookie instead of localStorage so server can read it
              document.cookie = `kotlin-testimonials-order=${next ? 'name' : 'default'}; path=/; max-age=31536000`;
            }}
          >
            Sort: {sortByName ? 'A-Z' : 'Default'}
          </Button>
        </div>

        <div className="kto-grid kto-grid-gap-16 kto-offset-top-48">
          {sortedTestimonials.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                cardCn({ theme: 'light', mode: 'classic', isClickable: true }),
                'usage-section__card',
                'kto-col-4 kto-col-md-6 kto-col-sm-12'
              )}
            >
              <img
                src={item.logo}
                alt={item.company}
                className={cn('usage-section__logo', {
                  'usage-section__logo_spring': item.company === 'Spring'
                })}
              />
              <p className={cn(textCn('rs-text-2'), 'kto-offset-top-8')}>{item.text}</p>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function UsageSection({ initialSortByName }: UsageSectionProps) {
  return (
    <ThemeProvider theme="light">
      <UsageSectionContent initialSortByName={initialSortByName} />
    </ThemeProvider>
  );
}
