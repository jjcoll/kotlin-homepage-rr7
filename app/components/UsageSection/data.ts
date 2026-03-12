import gradleLogo from '../../assets/images/companies/gradle.svg';
import cordaLogo from '../../assets/images/companies/corda.svg';
import evernoteLogo from '../../assets/images/companies/evernote.svg';
import courseraLogo from '../../assets/images/companies/coursera.svg';
import springLogo from '../../assets/images/companies/spring.svg';
import atlassianLogo from '../../assets/images/companies/atlassian.svg';

type TestimonialsType = {
  company: string
  logo: string
  url: string
  text: string
}

export const testimonials: TestimonialsType[] = [
  {
    company: 'Gradle',
    logo: gradleLogo,
    url: 'https://blog.gradle.org/kotlin-meets-gradle',
    text: 'Gradle is introducing Kotlin as a language for writing build scripts',
  },
  {
    company: 'Corda',
    logo: cordaLogo,
    url: 'https://www.corda.net/2017/01/10/kotlin/',
    text: 'Corda is an open-source distributed ledger platform, supported by major banks, and built entirely in Kotlin',
  },
  {
    company: 'Evernote',
    logo: evernoteLogo,
    url: 'https://blog.evernote.com/tech/2017/01/26/android-state-library/',
    text: 'Evernote recently integrated Kotlin into their Android client',
  },
  {
    company: 'Coursera',
    logo: courseraLogo,
    url: 'https://building.coursera.org/blog/2016/03/16/becoming-bilingual-coursera/',
    text: 'Coursera Android app is partially written in Kotlin',
  },
  {
    company: 'Spring',
    logo: springLogo,
    url: 'https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0',
    text: "Spring makes use of Kotlin's language features to offer more concise APIs",
  },
  {
    company: 'Atlassian',
    logo: atlassianLogo,
    url: 'https://twitter.com/danlew42/status/809065097339564032',
    text: 'All new code in the Trello Android app is in Kotlin',
  },
];
