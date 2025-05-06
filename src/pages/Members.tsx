
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NavBar from '@/components/NavBar';
import MemberCard from '@/components/MemberCard';
import FacultyCard from '@/components/FacultyCard';
import GooeyBlob from '@/components/GooeyBlob';

const Members = () => {
  const [activeSection, setActiveSection] = useState('members');

  // Protein Squad member data
  const squadMembers = [
    { number: 1, name: "Kabilesh C", quote: "Don't mess with my ribosomes 😎" },
    { number: 2, name: "Vibhas", quote: "ATP is my energy drink 💥" },
    { number: 3, name: "Rishith Patchava", quote: "Living that double helix life 🧬✨" },
    { number: 4, name: "Gummala Divya", quote: "Molecules making magic. 🔬✨" },
    { number: 5, name: "Shreyasi Kirti", quote: "Photosynthesis is my superpower. 🌞🌱" },
    { number: 6, name: "Vyom Misra", quote: "Microbe hunter, macro results. 🔬🦠" },
  ];

  // Faculty data
  const facultyData = {
    name: "Dr. Devi A.",
    title: "Associate Professor, Cancer Research and Stem Cell Biology",
    bio: "With over 18 years of experience, Dr. Devi A. specializes in cancer research and stem cell biology. Her research focuses on oral cancer signaling pathways, epigenetics, adult stem cell isolation, stem cell markers, and the genetics of cardiovascular diseases. She teaches courses such as Stem Cell Biology, Gene Therapy, Animal Biotechnology, and various laboratory subjects, shaping future researchers in these critical fields.",
    photoUrl: "https://d23qowwaqkh3fj.cloudfront.net/wp-content/uploads/2022/04/Profile_Bio-Tech_0040_DSC_9267.jpg"
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative overflow-hidden">
      <Helmet>
        <title>Team Members | Protein Synthesis</title>
        <meta name="description" content="Meet the team behind this protein synthesis educational project" />
      </Helmet>

      {/* Background blobs */}
      <GooeyBlob 
        color="bg-primary/30" 
        size={600} 
        top="-100px" 
        right="-200px" 
        delay={0} 
        blur="2xl"
      />
      <GooeyBlob 
        color="bg-secondary/30" 
        size={500} 
        bottom="-100px" 
        left="-200px" 
        delay={2} 
        blur="2xl"
      />
      <GooeyBlob 
        color="bg-accent/20" 
        size={400} 
        top="40%" 
        left="60%" 
        delay={4} 
        blur="2xl"
      />

      {/* Navigation */}
      <NavBar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="container mx-auto px-4 pt-28 relative z-10">
        {/* Section 1: Protein Squad */}
        <section id="protein-squad" className="mb-20">
          <div className="text-center mb-16">
            <h1 className="section-title inline-block relative">
              Meet the Protein Squad 🧬
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-secondary to-primary/50 rounded-full"></span>
            </h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              The brilliant minds behind this protein synthesis project
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {squadMembers.map((member) => (
              <MemberCard
                key={member.number}
                memberNumber={member.number}
                name={member.name}
                quote={member.quote}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Faculty Guide */}
        <section id="faculty-guide" className="mb-20">
          <div className="text-center mb-16">
            <h2 className="section-title inline-block relative">
              Faculty Guide
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-secondary/50 via-primary to-secondary/50 rounded-full"></span>
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              The expert guidance behind our research
            </p>
          </div>

          <FacultyCard
            name={facultyData.name}
            title={facultyData.title}
            bio={facultyData.bio}
            photoUrl={facultyData.photoUrl}
          />
        </section>
      </main>
    </div>
  );
};

export default Members;
