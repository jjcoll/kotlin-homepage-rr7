import { useState, useEffect } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';

const Footer = (props: any) => {
  const [GlobalFooter, setGlobalFooter] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only import on client-side to avoid SSR issues with React <18 internals
    import('@jetbrains/kotlin-web-site-ui/dist/footer.css');
    import('@jetbrains/kotlin-web-site-ui/dist/footer.js').then((mod) => {
      setGlobalFooter(() => mod.default);
    });
  }, []);

  if (!GlobalFooter) return null;

  return (
    <ThemeProvider theme="dark">
      <GlobalFooter {...props} />
    </ThemeProvider>
  );
};

export default Footer;
