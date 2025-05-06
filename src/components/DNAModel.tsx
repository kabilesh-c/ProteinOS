
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface DNAModelProps {
  className?: string;
}

const DNAModel: React.FC<DNAModelProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
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
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Add directional light (like sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for dramatic effect
    const purpleLight = new THREE.PointLight(0x8B5CF6, 3, 50);
    purpleLight.position.set(-10, 10, 10);
    scene.add(purpleLight);
    
    const blueLight = new THREE.PointLight(0x0EA5E9, 3, 50);
    blueLight.position.set(10, -10, 10);
    scene.add(blueLight);
    
    // Create DNA helix
    const dna = new THREE.Group();
    scene.add(dna);
    
    // Parameters for the DNA
    const helixRadius = 8;
    const helixHeight = 40;
    const helixTurns = 4;
    const helixSegments = 100;
    const nucleotideSize = 0.6;
    const backboneSize = 0.3;
    
    // Materials
    const backboneMaterial1 = new THREE.MeshPhongMaterial({ 
      color: 0x8B5CF6,
      emissive: 0x8B5CF6,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    
    const backboneMaterial2 = new THREE.MeshPhongMaterial({ 
      color: 0x0EA5E9,
      emissive: 0x0EA5E9,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    
    const nucleotideMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xE11D48 }), // Adenine
      new THREE.MeshPhongMaterial({ color: 0x22C55E }), // Thymine
      new THREE.MeshPhongMaterial({ color: 0xF59E0B }), // Guanine
      new THREE.MeshPhongMaterial({ color: 0x3B82F6 })  // Cytosine
    ];
    
    // Create spheres for backbone
    const backboneGeometry = new THREE.SphereGeometry(backboneSize, 12, 12);
    
    // Create spheres for nucleotides
    const nucleotideGeometry = new THREE.SphereGeometry(nucleotideSize, 12, 12);
    
    // Create cylinder for connections
    const connectionGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 6);
    connectionGeometry.rotateX(Math.PI / 2);
    const connectionMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    
    // Generate DNA structure
    for (let i = 0; i < helixSegments; i++) {
      const ratio = i / helixSegments;
      const angle1 = ratio * Math.PI * 2 * helixTurns;
      const angle2 = angle1 + Math.PI; // Opposite side
      const y = helixHeight * (0.5 - ratio) - helixHeight/4; // Center and shift down
      
      // First backbone
      const backbone1 = new THREE.Mesh(backboneGeometry, backboneMaterial1);
      backbone1.position.set(
        helixRadius * Math.cos(angle1),
        y,
        helixRadius * Math.sin(angle1)
      );
      dna.add(backbone1);
      
      // Second backbone
      const backbone2 = new THREE.Mesh(backboneGeometry, backboneMaterial2);
      backbone2.position.set(
        helixRadius * Math.cos(angle2),
        y,
        helixRadius * Math.sin(angle2)
      );
      dna.add(backbone2);
      
      // Add nucleotides only to some positions for better performance
      if (i % 3 === 0) {
        // First nucleotide
        const nucleotide1 = new THREE.Mesh(
          nucleotideGeometry, 
          nucleotideMaterials[i % 4]
        );
        nucleotide1.position.set(
          helixRadius * 0.6 * Math.cos(angle1),
          y,
          helixRadius * 0.6 * Math.sin(angle1)
        );
        dna.add(nucleotide1);
        
        // Second nucleotide (complementary base pair)
        const nucleotide2 = new THREE.Mesh(
          nucleotideGeometry, 
          nucleotideMaterials[(i + 1) % 4]
        );
        nucleotide2.position.set(
          helixRadius * 0.6 * Math.cos(angle2),
          y,
          helixRadius * 0.6 * Math.sin(angle2)
        );
        dna.add(nucleotide2);
        
        // Connection between nucleotides
        const dist = nucleotide1.position.distanceTo(nucleotide2.position);
        const connection = new THREE.Mesh(
          connectionGeometry.clone(),
          connectionMaterial
        );
        connection.position.copy(nucleotide1.position);
        connection.lookAt(nucleotide2.position);
        connection.scale.set(1, 1, dist);
        dna.add(connection);
      }
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the DNA
      dna.rotation.y += 0.003;
      
      // Move point lights for dynamic effect
      const time = Date.now() * 0.001;
      purpleLight.position.x = Math.sin(time * 0.7) * 15;
      purpleLight.position.y = Math.cos(time * 0.5) * 15;
      blueLight.position.x = Math.cos(time * 0.3) * 15;
      blueLight.position.y = Math.sin(time * 0.5) * 15;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
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
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div ref={containerRef} className={`${className} w-full h-full`}></div>;
};

export default DNAModel;
