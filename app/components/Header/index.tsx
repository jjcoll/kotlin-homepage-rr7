import { useState, useEffect } from 'react';

const Header = (props: any) => {
  const [GlobalHeader, setGlobalHeader] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only import on client-side to avoid SSR issues with React <18 internals
    import('@jetbrains/kotlin-web-site-ui/dist/header.css');
    import('@jetbrains/kotlin-web-site-ui/dist/header.js').then((mod) => {
      setGlobalHeader(() => mod.default);
    });
  }, []);

  if (!GlobalHeader) return null;

  return <GlobalHeader {...props} />;
};

export default Header;
