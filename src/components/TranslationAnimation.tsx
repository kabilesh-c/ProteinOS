import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface TranslationAnimationProps {
  className?: string;
  isActive?: boolean;
}

const TranslationAnimation: React.FC<TranslationAnimationProps> = ({ 
  className = '',
  isActive = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const purpleLight = new THREE.PointLight(0x8B5CF6, 3, 50);
    purpleLight.position.set(-10, 10, 10);
    scene.add(purpleLight);
    
    const blueLight = new THREE.PointLight(0x0EA5E9, 3, 50);
    blueLight.position.set(10, -10, 10);
    scene.add(blueLight);
    
    // Create ribosome
    const ribosome = new THREE.Group();
    
    // Large subunit
    const largeSubunitGeometry = new THREE.SphereGeometry(5, 32, 32);
    largeSubunitGeometry.scale(1, 0.7, 1);
    const largeSubunit = new THREE.Mesh(
      largeSubunitGeometry,
      new THREE.MeshPhongMaterial({ 
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.8
      })
    );
    largeSubunit.position.y = 2;
    ribosome.add(largeSubunit);
    
    // Small subunit
    const smallSubunitGeometry = new THREE.SphereGeometry(4, 32, 32);
    smallSubunitGeometry.scale(1, 0.5, 1);
    const smallSubunit = new THREE.Mesh(
      smallSubunitGeometry,
      new THREE.MeshPhongMaterial({ 
        color: 0x0EA5E9,
        transparent: true,
        opacity: 0.8
      })
    );
    smallSubunit.position.y = -1;
    ribosome.add(smallSubunit);
    
    scene.add(ribosome);
    
    // Create mRNA
    const mRNAGroup = new THREE.Group();
    scene.add(mRNAGroup);
    
    const mRNALength = 30;
    const mRNASegments = [];
    
    // mRNA backbone
    const mRNAGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    const mRNAMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFA500,
      emissive: 0xFFA500,
      emissiveIntensity: 0.2
    });
    
    // mRNA nucleotides (simplified as colored spheres)
    const nucleotideGeometry = new THREE.SphereGeometry(0.6, 12, 12);
    const nucleotideMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xE11D48 }), // A
      new THREE.MeshPhongMaterial({ color: 0x22C55E }), // U
      new THREE.MeshPhongMaterial({ color: 0xF59E0B }), // G
      new THREE.MeshPhongMaterial({ color: 0x3B82F6 })  // C
    ];
    
    // Create mRNA strand
    for (let i = 0; i < mRNALength; i++) {
      const x = (i - mRNALength / 2) * 1.2;
      
      // Backbone
      const mRNASegment = new THREE.Mesh(mRNAGeometry, mRNAMaterial);
      mRNASegment.position.set(x, -5, 0);
      mRNAGroup.add(mRNASegment);
      mRNASegments.push(mRNASegment);
      
      // Nucleotide
      const baseIndex = Math.floor(Math.random() * 4);
      const nucleotide = new THREE.Mesh(nucleotideGeometry, nucleotideMaterials[baseIndex]);
      nucleotide.position.set(x, -6, 0);
      mRNAGroup.add(nucleotide);
    }
    
    // Create tRNA models
    const createTRNA = (baseColor: number) => {
      const tRNAGroup = new THREE.Group();
      
      // tRNA backbone
      const backboneGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 3, 0),
          new THREE.Vector3(3, 3, 0),
          new THREE.Vector3(3, 0, 0)
        ]),
        20,
        0.3,
        8
      );
      
      const backbone = new THREE.Mesh(
        backboneGeometry,
        new THREE.MeshPhongMaterial({ 
          color: 0x10B981,
          transparent: true,
          opacity: 0.8
        })
      );
      tRNAGroup.add(backbone);
      
      // Anticodon
      const anticodonGeometry = new THREE.SphereGeometry(0.6, 12, 12);
      const anticodon = new THREE.Mesh(
        anticodonGeometry,
        new THREE.MeshPhongMaterial({ color: baseColor })
      );
      anticodon.position.set(3, 0, 0);
      tRNAGroup.add(anticodon);
      
      // Amino acid
      const aminoAcidGeometry = new THREE.SphereGeometry(0.8, 12, 12);
      const aminoAcid = new THREE.Mesh(
        aminoAcidGeometry,
        new THREE.MeshPhongMaterial({ 
          color: 0xFFFFFF,
          emissive: 0xFFFFFF,
          emissiveIntensity: 0.2
        })
      );
      aminoAcid.position.set(0, 0, 0);
      tRNAGroup.add(aminoAcid);
      
      return tRNAGroup;
    };
    
    // Create array of tRNAs with different colors
    const tRNAs = [
      createTRNA(0xE11D48),
      createTRNA(0x22C55E),
      createTRNA(0xF59E0B),
      createTRNA(0x3B82F6)
    ];
    
    // Position tRNAs off screen initially
    tRNAs.forEach(tRNA => {
      tRNA.position.set(20, 0, 0);
      tRNA.rotation.z = Math.PI / 2;
      scene.add(tRNA);
    });
    
    // Create protein chain
    const proteinGroup = new THREE.Group();
    scene.add(proteinGroup);
    
    const aminoAcidGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const aminoAcidMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xF97316 }),
      new THREE.MeshPhongMaterial({ color: 0x84CC16 }),
      new THREE.MeshPhongMaterial({ color: 0x06B6D4 }),
      new THREE.MeshPhongMaterial({ color: 0xA855F7 }),
      new THREE.MeshPhongMaterial({ color: 0xEC4899 })
    ];
    
    const proteinChain: THREE.Mesh[] = [];
    
    // Animation parameters
    let time = 0;
    let translationProgress = 0;
    const translationSpeed = 0.05;
    let currentTRNA = -1;
    let activeTRNA: THREE.Group | null = null;
    let tRNAState = 'approaching'; // approaching, docked, leaving
    let tRNATimer = 0;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Animate mRNA moving through ribosome
      if (translationProgress < mRNALength - 6) {
        translationProgress += translationSpeed;
        
        for (let i = 0; i < mRNALength; i++) {
          const segment = mRNASegments[i];
          const originalX = (i - mRNALength / 2) * 1.2;
          segment.position.x = originalX + translationProgress * 1.2;
        }
        
        // Animate tRNA cycle
        if (!activeTRNA || tRNAState === 'leaving' && tRNATimer > 2) {
          // Select new tRNA
          currentTRNA = (currentTRNA + 1) % tRNAs.length;
          activeTRNA = tRNAs[currentTRNA];
          tRNAState = 'approaching';
          tRNATimer = 0;
        }
        
        if (activeTRNA) {
          tRNATimer += 0.01;
          
          if (tRNAState === 'approaching') {
            // Move tRNA toward ribosome
            activeTRNA.position.x = THREE.MathUtils.lerp(
              activeTRNA.position.x,
              0,
              0.05
            );
            
            activeTRNA.position.y = THREE.MathUtils.lerp(
              activeTRNA.position.y,
              -5,
              0.05
            );
            
            if (tRNATimer > 1 && activeTRNA.position.distanceTo(new THREE.Vector3(0, -5, 0)) < 1) {
              tRNAState = 'docked';
              tRNATimer = 0;
              
              // Add new amino acid to protein chain
              if (proteinChain.length < 20) { // Limit protein length
                const aminoAcid = new THREE.Mesh(
                  aminoAcidGeometry,
                  aminoAcidMaterials[Math.floor(Math.random() * aminoAcidMaterials.length)]
                );
                
                // Position first amino acid at ribosome exit site
                if (proteinChain.length === 0) {
                  aminoAcid.position.set(0, 5, 0);
                } else {
                  // Position subsequent amino acids relative to the last one
                  const lastAminoAcid = proteinChain[proteinChain.length - 1];
                  aminoAcid.position.copy(lastAminoAcid.position);
                  
                  // Add some randomization for a folding effect
                  aminoAcid.position.x += 0.8 + Math.random() * 0.4;
                  aminoAcid.position.y += Math.random() * 0.8 - 0.4;
                  aminoAcid.position.z += Math.random() * 0.8 - 0.4;
                }
                
                proteinGroup.add(aminoAcid);
                proteinChain.push(aminoAcid);
              }
            }
          } else if (tRNAState === 'docked') {
            // Keep tRNA at ribosome for a moment
            if (tRNATimer > 1) {
              tRNAState = 'leaving';
              tRNATimer = 0;
            }
          } else if (tRNAState === 'leaving') {
            // Move tRNA away from ribosome
            activeTRNA.position.x = THREE.MathUtils.lerp(
              activeTRNA.position.x,
              -20,
              0.05
            );
            
            activeTRNA.position.y = THREE.MathUtils.lerp(
              activeTRNA.position.y,
              5,
              0.05
            );
          }
        }
      } else {
        // When translation is complete, animate protein folding
        for (let i = 0; i < proteinChain.length; i++) {
          const aminoAcid = proteinChain[i];
          const foldProgress = Math.min(1, (translationProgress - (mRNALength - 6)) / 10);
          
          if (foldProgress > 0) {
            const angle = i * 0.5 + time * 0.2;
            const radius = 5 * foldProgress;
            
            aminoAcid.position.x = Math.cos(angle) * radius;
            aminoAcid.position.y = 5 + Math.sin(angle) * radius;
            aminoAcid.position.z = Math.sin(angle * 0.5) * radius * 0.5;
          }
        }
      }
      
      // Rotate ribosome slightly for 3D effect
      ribosome.rotation.y = Math.sin(time * 0.2) * 0.1;
      
      // Move lights for dynamic effect
      purpleLight.position.x = Math.sin(time * 0.5) * 15;
      purpleLight.position.y = Math.cos(time * 0.3) * 15;
      blueLight.position.x = Math.cos(time * 0.3) * 15;
      blueLight.position.y = Math.sin(time * 0.5) * 15;
      
      renderer.render(scene, camera);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);
  
  return <div ref={containerRef} className={`${className} w-full h-full`}></div>;
};

export default TranslationAnimation;
