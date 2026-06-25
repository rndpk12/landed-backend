import { Navigate } from 'react-router-dom';
import { CtaSection, ProofSection } from '../components/landing/ProofSection';
import { FeaturesSection, RolesSection } from '../components/landing/FeatureSections';
import { HeroSection } from '../components/landing/HeroSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingNav } from '../components/landing/LandingNav';
import { MarqueeSection } from '../components/landing/MarqueeSection';
import { ProductWindow } from '../components/landing/ProductWindow';
import { StorySection } from '../components/landing/StorySection';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="overflow-x-hidden bg-white font-sans text-[#0a0a0a] antialiased">
      <LandingNav />
      <HeroSection />
      <ProductWindow />
      <div className="mx-5 h-px bg-[linear-gradient(90deg,transparent,rgba(249,115,22,0.25),transparent)] md:mx-11" />
      <StorySection />
      <MarqueeSection />
      <FeaturesSection />
      <div className="mx-5 h-px bg-[linear-gradient(90deg,transparent,rgba(249,115,22,0.25),transparent)] md:mx-11" />
      <RolesSection />
      <ProofSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
};
