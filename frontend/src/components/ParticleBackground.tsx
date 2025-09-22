import { useEffect, useRef } from 'react';
import { Heart, Activity, Zap, Shield, Brain, Stethoscope } from 'lucide-react';

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size variation
      const sizeVariation = Math.random();
      if (sizeVariation < 0.3) {
        particle.classList.add('particle-small');
      } else if (sizeVariation > 0.7) {
        particle.classList.add('particle-large');
      }
      
      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 20) + 's';
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 35000);
    };

    // Create floating medical icons
    const createFloatingIcon = () => {
      const icons = [Heart, Activity, Zap, Shield, Brain, Stethoscope];
      const icon = icons[Math.floor(Math.random() * icons.length)];
      
      const iconElement = document.createElement('div');
      iconElement.className = 'floating-icon';
      iconElement.style.left = Math.random() * 100 + '%';
      iconElement.style.top = Math.random() * 100 + '%';
      iconElement.style.animationDelay = Math.random() * 10 + 's';
      iconElement.style.animationDuration = (6 + Math.random() * 8) + 's';
      
      // Create SVG icon
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.5');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      
      // Add icon path based on the selected icon
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      switch (icon) {
        case Heart:
          path.setAttribute('d', 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z');
          break;
        case Activity:
          path.setAttribute('d', 'M22 12h-4l-3 9L9 3l-3 9H2');
          break;
        case Zap:
          path.setAttribute('d', 'M13 2L3 14h9l-1 8 10-12h-9l1-8z');
          break;
        case Shield:
          path.setAttribute('d', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
          break;
        case Brain:
          path.setAttribute('d', 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1 .34-4.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z');
          break;
        case Stethoscope:
          path.setAttribute('d', 'M4.5 3a2.5 2.5 0 0 0-2.5 2.5v5a2.5 2.5 0 0 0 5 0v-5a2.5 2.5 0 0 0-2.5-2.5Z');
          break;
      }
      
      svg.appendChild(path);
      iconElement.appendChild(svg);
      container.appendChild(iconElement);
      
      // Remove icon after animation
      setTimeout(() => {
        if (iconElement.parentNode) {
          iconElement.parentNode.removeChild(iconElement);
        }
      }, 18000);
    };

    // Create particles and icons periodically
    const particleInterval = setInterval(createParticle, 800);
    const iconInterval = setInterval(createFloatingIcon, 3000);

    // Cleanup
    return () => {
      clearInterval(particleInterval);
      clearInterval(iconInterval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="particle-container"
    />
  );
};

export default ParticleBackground;
