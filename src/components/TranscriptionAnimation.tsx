
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface TranscriptionAnimationProps {
  className?: string;
  isActive?: boolean;
}

const TranscriptionAnimation: React.FC<TranscriptionAnimationProps> = ({ 
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
    camera.position.z = 25;
    camera.position.y = 5;
    
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
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const purpleLight = new THREE.PointLight(0x8B5CF6, 2, 30);
    purpleLight.position.set(-10, 10, 10);
    scene.add(purpleLight);
    
    const blueLight = new THREE.PointLight(0x0EA5E9, 2, 30);
    blueLight.position.set(10, -10, 10);
    scene.add(blueLight);
    
    // Create DNA and RNA structures
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);
    
    const rnaGroup = new THREE.Group();
    scene.add(rnaGroup);
    
    // DNA strands
    const dnaLength = 30;
    const strandSeparation = 2;
    const nucleotideSpacing = 1;
    
    // Materials
    const dnaMaterial1 = new THREE.MeshPhongMaterial({ color: 0x8B5CF6 });
    const dnaMaterial2 = new THREE.MeshPhongMaterial({ color: 0x0EA5E9 });
    const rnaMaterial = new THREE.MeshPhongMaterial({ color: 0xFFA500 });
    
    const basePairMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xE11D48 }), // A
      new THREE.MeshPhongMaterial({ color: 0x22C55E }), // T/U
      new THREE.MeshPhongMaterial({ color: 0xF59E0B }), // G
      new THREE.MeshPhongMaterial({ color: 0x3B82F6 })  // C
    ];
    
    // Geometries
    const backboneGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const nucleotideGeometry = new THREE.SphereGeometry(0.5, 12, 12);
    const polymeraseGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    
    // Create DNA strands
    const strand1 = [];
    const strand2 = [];
    const bases1 = [];
    const bases2 = [];
    
    const strand1Group = new THREE.Group();
    const strand2Group = new THREE.Group();
    dnaGroup.add(strand1Group);
    dnaGroup.add(strand2Group);
    
    // Create RNA polymerase
    const polymerase = new THREE.Mesh(
      polymeraseGeometry,
      new THREE.MeshPhongMaterial({ 
        color: 0x10B981,
        emissive: 0x10B981,
        emissiveIntensity: 0.3,
        shininess: 80
      })
    );
    polymerase.position.set(0, 0, 0);
    scene.add(polymerase);
    
    // Randomly generate base pairs sequence
    const sequence = [];
    for (let i = 0; i < dnaLength; i++) {
      sequence.push(Math.floor(Math.random() * 4));
    }
    
    // Create DNA backbone and bases
    for (let i = 0; i < dnaLength; i++) {
      const x = i * nucleotideSpacing - (dnaLength * nucleotideSpacing) / 2;
      
      // Strand 1 (template strand)
      const backbone1 = new THREE.Mesh(backboneGeometry, dnaMaterial1);
      backbone1.position.set(x, strandSeparation/2, 0);
      strand1Group.add(backbone1);
      strand1.push(backbone1);
      
      // Strand 2 (coding strand)
      const backbone2 = new THREE.Mesh(backboneGeometry, dnaMaterial2);
      backbone2.position.set(x, -strandSeparation/2, 0);
      strand2Group.add(backbone2);
      strand2.push(backbone2);
      
      // Base pairs
      const baseIndex = sequence[i];
      const complementaryBaseIndex = baseIndex % 2 === 0 ? baseIndex + 1 : baseIndex - 1;
      
      const base1 = new THREE.Mesh(nucleotideGeometry, basePairMaterials[baseIndex]);
      base1.position.set(x, strandSeparation/4, 0);
      strand1Group.add(base1);
      bases1.push(base1);
      
      const base2 = new THREE.Mesh(nucleotideGeometry, basePairMaterials[complementaryBaseIndex]);
      base2.position.set(x, -strandSeparation/4, 0);
      strand2Group.add(base2);
      bases2.push(base2);
    }
    
    // Animation variables
    let time = 0;
    const transcriptionSpeed = 0.05;
    let transcriptionProgress = 0;
    const rnaNucleotides: THREE.Mesh[] = [];
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Move polymerase along DNA
      if (transcriptionProgress < dnaLength - 1) {
        transcriptionProgress += transcriptionSpeed;
        
        const position = Math.floor(transcriptionProgress);
        const partialPosition = transcriptionProgress - position;
        
        if (position >= 0 && position < dnaLength) {
          const x = position * nucleotideSpacing - (dnaLength * nucleotideSpacing) / 2;
          const nextX = (position + 1) * nucleotideSpacing - (dnaLength * nucleotideSpacing) / 2;
          
          polymerase.position.x = x + (nextX - x) * partialPosition;
          
          // Open up DNA strands as polymerase passes
          for (let i = 0; i < dnaLength; i++) {
            const distFromPolymerase = Math.abs(i - transcriptionProgress);
            const separation = Math.max(0, 3 - distFromPolymerase) * 0.7;
            
            if (i <= position + 5) {
              strand1[i].position.y = strandSeparation/2 + separation;
              bases1[i].position.y = strandSeparation/4 + separation;
              
              strand2[i].position.y = -strandSeparation/2 - separation;
              bases2[i].position.y = -strandSeparation/4 - separation;
            }
          }
          
          // Create RNA nucleotide at current position if it doesn't exist yet
          if (position >= 0 && Math.floor(transcriptionProgress) > rnaNucleotides.length - 1) {
            const baseIndex = sequence[position];
            // RNA uses U instead of T
            const rnaBaseIndex = baseIndex === 1 ? 1 : (baseIndex === 0 ? 3 : (baseIndex === 2 ? 0 : 2));
            
            const rnaNucleotide = new THREE.Mesh(
              nucleotideGeometry, 
              basePairMaterials[rnaBaseIndex]
            );
            
            rnaNucleotide.position.set(
              polymerase.position.x,
              polymerase.position.y + 1,
              polymerase.position.z
            );
            
            rnaGroup.add(rnaNucleotide);
            rnaNucleotides.push(rnaNucleotide);
            
            // Add RNA backbone
            const rnaBackbone = new THREE.Mesh(backboneGeometry, rnaMaterial);
            rnaBackbone.position.set(
              polymerase.position.x,
              polymerase.position.y + 1.5,
              polymerase.position.z
            );
            rnaGroup.add(rnaBackbone);
          }
        }
      }
      
      // Animate RNA strand folding away
      for (let i = 0; i < rnaNucleotides.length; i++) {
        const age = transcriptionProgress - i;
        if (age > 3) {
          // Move RNA away and form a folded structure
          const growFactor = Math.min(1, (age - 3) / 10);
          const angle = i * 0.3 + time * 0.2;
          const radius = 3 * growFactor;
          
          rnaNucleotides[i].position.y = polymerase.position.y + 1 + Math.sin(angle) * radius;
          rnaNucleotides[i].position.z = polymerase.position.z + Math.cos(angle) * radius;
        }
      }
      
      // Ambient movement
      dnaGroup.rotation.y = Math.sin(time * 0.1) * 0.2;
      
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

export default TranscriptionAnimation;
