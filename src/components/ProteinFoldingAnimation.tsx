
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ProteinFoldingAnimationProps {
  className?: string;
  isActive?: boolean;
}

const ProteinFoldingAnimation: React.FC<ProteinFoldingAnimationProps> = ({ 
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
    
    // Create protein structure
    const proteinGroup = new THREE.Group();
    scene.add(proteinGroup);
    
    // Number of amino acids
    const numAminoAcids = 100;
    
    // Create amino acids
    const aminoAcids = [];
    const aminoAcidGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    
    // Colors for different types of amino acids
    const hydrophobicColor = 0xF97316; // Orange
    const hydrophilicColor = 0x06B6D4; // Cyan
    const positiveColor = 0xEC4899;    // Pink
    const negativeColor = 0x84CC16;    // Green
    const specialColor = 0xA855F7;     // Purple
    
    const aminoAcidTypes = [
      { type: 'hydrophobic', color: hydrophobicColor },
      { type: 'hydrophilic', color: hydrophilicColor },
      { type: 'positive', color: positiveColor },
      { type: 'negative', color: negativeColor },
      { type: 'special', color: specialColor }
    ];
    
    // Create connections between amino acids
    const connectionGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 6);
    const connectionMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    
    const connections = [];
    
    // Generate extended peptide chain
    for (let i = 0; i < numAminoAcids; i++) {
      // Randomly select amino acid type (biased distribution)
      const typeIndex = Math.floor(Math.pow(Math.random(), 2) * aminoAcidTypes.length);
      const aminoAcidType = aminoAcidTypes[typeIndex];
      
      const material = new THREE.MeshPhongMaterial({ 
        color: aminoAcidType.color,
        emissive: aminoAcidType.color,
        emissiveIntensity: 0.2,
        shininess: 80
      });
      
      const aminoAcid = new THREE.Mesh(aminoAcidGeometry, material);
      
      // Position in extended chain
      aminoAcid.position.set(i * 1.5 - numAminoAcids * 0.75, 0, 0);
      
      // Add additional properties
      const data = {
        type: aminoAcidType.type,
        index: i,
        originalPosition: aminoAcid.position.clone()
      };
      
      Object.assign(aminoAcid, { userData: data });
      
      proteinGroup.add(aminoAcid);
      aminoAcids.push(aminoAcid);
      
      // Create connection to previous amino acid
      if (i > 0) {
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
        proteinGroup.add(connection);
        connections.push(connection);
      }
    }
    
    // Animation parameters
    let time = 0;
    let foldingPhase = 0; // 0: extended, 1: secondary, 2: tertiary, 3: quaternary
    let foldingProgress = 0;
    const foldingSpeed = 0.005;
    
    // Predefined secondary structures
    const alphaHelixParams = {
      radius: 2,
      rise: 0.3,
      residuesPerTurn: 3.6
    };
    
    const betaSheetParams = {
      width: 4,
      separation: 1.2
    };
    
    // Creates a shape like an alpha helix
    const createAlphaHelix = (startIndex: number, length: number, progress: number) => {
      for (let i = 0; i < length && startIndex + i < aminoAcids.length; i++) {
        const aminoAcid = aminoAcids[startIndex + i];
        const angle = i / alphaHelixParams.residuesPerTurn * Math.PI * 2;
        const x = alphaHelixParams.radius * Math.cos(angle);
        const z = alphaHelixParams.radius * Math.sin(angle);
        const y = i * alphaHelixParams.rise;
        
        // Interpolate between extended and helical position
        aminoAcid.position.x = THREE.MathUtils.lerp(
          aminoAcid.userData.originalPosition.x,
          x + startIndex * 1.5 - numAminoAcids * 0.5,
          progress
        );
        
        aminoAcid.position.y = THREE.MathUtils.lerp(
          aminoAcid.userData.originalPosition.y,
          y,
          progress
        );
        
        aminoAcid.position.z = THREE.MathUtils.lerp(
          aminoAcid.userData.originalPosition.z,
          z,
          progress
        );
      }
    };
    
    // Creates a shape like a beta sheet
    const createBetaSheet = (startIndex: number, length: number, progress: number, direction: number) => {
      for (let i = 0; i < length && startIndex + i < aminoAcids.length; i++) {
        const aminoAcid = aminoAcids[startIndex + i];
        
        const offset = direction * betaSheetParams.width * (i % 2);
        const x = i * 1.2;
        const z = offset;
        
        // Interpolate between extended and sheet position
        aminoAcid.position.x = THREE.MathUtils.lerp(
          aminoAcid.userData.originalPosition.x,
          x + startIndex * 1.5 - numAminoAcids * 0.5,
          progress
        );
        
        aminoAcid.position.z = THREE.MathUtils.lerp(
          aminoAcid.userData.originalPosition.z,
          z,
          progress
        );
      }
    };
    
    // Updates connections between amino acids
    const updateConnections = () => {
      for (let i = 0; i < connections.length; i++) {
        const start = aminoAcids[i];
        const end = aminoAcids[i + 1];
        const connection = connections[i];
        
        // Position connection at midpoint
        const midpoint = new THREE.Vector3().lerpVectors(start.position, end.position, 0.5);
        connection.position.copy(midpoint);
        
        // Orient connection to point from start to end
        connection.lookAt(end.position);
        
        // Scale connection length to match distance
        const distance = start.position.distanceTo(end.position);
        connection.scale.set(1, distance, 1);
      }
    };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Progress through folding phases
      if (foldingPhase < 3) {
        foldingProgress += foldingSpeed;
        
        if (foldingProgress >= 1) {
          foldingProgress = 0;
          foldingPhase++;
        }
        
        // Phase 1: Secondary structure formation (alpha helices and beta sheets)
        if (foldingPhase === 0) {
          // Create alpha helices in specific regions
          createAlphaHelix(0, 20, foldingProgress);
          createAlphaHelix(30, 15, foldingProgress);
          createAlphaHelix(60, 25, foldingProgress);
          
          // Create beta sheets in other regions
          createBetaSheet(22, 7, foldingProgress, 1);
          createBetaSheet(50, 7, foldingProgress, -1);
          createBetaSheet(88, 7, foldingProgress, 1);
        }
        // Phase 2: Tertiary structure (folding of secondary structures)
        else if (foldingPhase === 1) {
          // Move alpha helices and beta sheets into tertiary arrangement
          // First helix
          for (let i = 0; i < 20; i++) {
            const aminoAcid = aminoAcids[i];
            aminoAcid.position.y = THREE.MathUtils.lerp(
              aminoAcid.position.y,
              aminoAcid.position.y - 5 + Math.sin(i * 0.3) * 2,
              foldingProgress
            );
            
            aminoAcid.position.x = THREE.MathUtils.lerp(
              aminoAcid.position.x,
              aminoAcid.position.x - 3,
              foldingProgress
            );
          }
          
          // Second helix
          for (let i = 30; i < 45; i++) {
            const aminoAcid = aminoAcids[i];
            aminoAcid.position.z = THREE.MathUtils.lerp(
              aminoAcid.position.z,
              aminoAcid.position.z + 5,
              foldingProgress
            );
            
            aminoAcid.position.x = THREE.MathUtils.lerp(
              aminoAcid.position.x,
              aminoAcid.position.x + 2,
              foldingProgress
            );
          }
          
          // Third helix
          for (let i = 60; i < 85; i++) {
            const aminoAcid = aminoAcids[i];
            aminoAcid.position.y = THREE.MathUtils.lerp(
              aminoAcid.position.y,
              aminoAcid.position.y + 4,
              foldingProgress
            );
            
            aminoAcid.position.z = THREE.MathUtils.lerp(
              aminoAcid.position.z,
              aminoAcid.position.z - 3,
              foldingProgress
            );
          }
          
          // Beta sheets
          for (let i = 22; i < 29; i++) {
            const aminoAcid = aminoAcids[i];
            aminoAcid.position.x = THREE.MathUtils.lerp(
              aminoAcid.position.x,
              aminoAcid.position.x + 2,
              foldingProgress
            );
          }
          
          for (let i = 50; i < 57; i++) {
            const aminoAcid = aminoAcids[i];
            aminoAcid.position.x = THREE.MathUtils.lerp(
              aminoAcid.position.x,
              aminoAcid.position.x - 1,
              foldingProgress
            );
            
            aminoAcid.position.y = THREE.MathUtils.lerp(
              aminoAcid.position.y,
              aminoAcid.position.y + 2,
              foldingProgress
            );
          }
          
          for (let i = 88; i < 95; i++) {
            const aminoAcid = aminoAcids[i];
            aminoAcid.position.z = THREE.MathUtils.lerp(
              aminoAcid.position.z,
              aminoAcid.position.z + 3,
              foldingProgress
            );
          }
        }
        // Phase 3: Quaternary structure (wiggling)
        else if (foldingPhase === 2) {
          // Compact the entire protein
          for (let i = 0; i < aminoAcids.length; i++) {
            const aminoAcid = aminoAcids[i];
            const center = new THREE.Vector3(0, 0, 0);
            
            aminoAcid.position.lerp(center, 0.01);
            
            // Add some randomization for natural movement
            aminoAcid.position.x += Math.sin(time * 2 + i * 0.1) * 0.02;
            aminoAcid.position.y += Math.cos(time * 2 + i * 0.1) * 0.02;
            aminoAcid.position.z += Math.sin(time * 2 + i * 0.2) * 0.02;
          }
        }
        
        // Update connections between amino acids
        updateConnections();
      } else {
        // Final state: complete protein that gently pulses and rotates
        proteinGroup.rotation.y += 0.005;
        
        // Gentle pulsing/breathing effect
        const scaleFactor = 1 + Math.sin(time) * 0.02;
        proteinGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        // Small random movements of individual amino acids
        for (let i = 0; i < aminoAcids.length; i++) {
          const aminoAcid = aminoAcids[i];
          aminoAcid.position.x += Math.sin(time * 2 + i * 0.1) * 0.005;
          aminoAcid.position.y += Math.cos(time * 2 + i * 0.1) * 0.005;
          aminoAcid.position.z += Math.sin(time * 2 + i * 0.2) * 0.005;
        }
        
        // Update connections
        updateConnections();
      }
      
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

export default ProteinFoldingAnimation;
