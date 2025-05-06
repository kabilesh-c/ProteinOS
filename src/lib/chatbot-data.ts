interface ChatbotData {
  [key: string]: string[];
}

// Predefined responses for common protein synthesis questions
const proteinSynthesisData: ChatbotData = {
  'transcription': [
    "Transcription is the first step of protein synthesis. It occurs in the cell nucleus where DNA is used as a template to create messenger RNA (mRNA). RNA polymerase reads the DNA template strand and synthesizes a complementary RNA strand. The process includes initiation, elongation, and termination phases.",
    "During transcription, DNA unwinds and RNA polymerase attaches to the promoter region. It then reads the DNA template strand in the 3' to 5' direction, adding complementary RNA nucleotides (A pairs with U, G with C) to create mRNA in the 5' to 3' direction. The process ends at the terminator sequence."
  ],
  'translation': [
    "Translation is the second major step in protein synthesis, where the mRNA code is decoded to build a protein. It takes place at ribosomes in the cytoplasm. tRNA molecules bring specific amino acids, matching their anticodons to mRNA codons. The amino acids are linked by peptide bonds to form a polypeptide chain.",
    "The process of translation has three phases: initiation (ribosome assembly, start codon recognition), elongation (amino acid chain growth), and termination (release of the completed protein when a stop codon is reached)."
  ],
  'mrna': [
    "Messenger RNA (mRNA) carries genetic information from DNA to the ribosomes for protein synthesis. In eukaryotes, mRNA is processed after transcription (capping, polyadenylation, splicing) before leaving the nucleus for translation.",
    "mRNA consists of a 5' cap, 5' untranslated region (UTR), coding region with start and stop codons, 3' UTR, and a poly(A) tail. Each three-nucleotide sequence (codon) in the coding region specifies an amino acid or signals the start/end of protein synthesis."
  ],
  'ribosome': [
    "Ribosomes are cellular structures that serve as the site of protein synthesis. They consist of ribosomal RNA (rRNA) and proteins organized into two subunits: the small subunit (which reads the mRNA) and the large subunit (which catalyzes peptide bond formation).",
    "Ribosome assembly begins when the small subunit binds to mRNA at the start codon. The large subunit joins, forming the complete ribosome with three tRNA binding sites: A (incoming tRNA), P (peptidyl-tRNA), and E (exit site for empty tRNA)."
  ],
  'post-translational': [
    "Post-translational modifications (PTMs) are chemical changes that occur after a protein is synthesized. These include phosphorylation, glycosylation, ubiquitination, methylation, acetylation, and proteolytic cleavage. PTMs diversify protein function and regulate activity.",
    "After translation, proteins may undergo folding (assisted by chaperones), addition of functional groups, formation of disulfide bridges, and proteolytic processing. These modifications are crucial for proper protein function, localization, and interaction with other molecules."
  ],
  'dna': [
    "DNA (deoxyribonucleic acid) serves as the genetic blueprint in all living organisms. It's a double-stranded helix composed of nucleotides, each containing a deoxyribose sugar, phosphate group, and one of four nitrogenous bases: adenine (A), thymine (T), guanine (G), or cytosine (C).",
    "In protein synthesis, DNA acts as the template for transcription. The genetic code in DNA determines the sequence of amino acids in proteins through the processes of transcription and translation. Each gene in DNA contains the instructions for making a specific protein."
  ],
  'trna': [
    "Transfer RNA (tRNA) molecules are adapter molecules that bridge the gap between mRNA codons and amino acids during translation. Each tRNA has a specific anticodon that pairs with a complementary mRNA codon, and carries the corresponding amino acid.",
    "tRNAs have a cloverleaf-like secondary structure with an acceptor stem (where the amino acid attaches), an anticodon loop, D loop, TΨC loop, and variable loop. They're essential for accurate protein synthesis as they ensure the correct amino acid is added to the growing polypeptide chain."
  ],
  'codon': [
    "Codons are three-nucleotide sequences in mRNA that specify either an amino acid or a stop signal during translation. There are 64 possible codons in the genetic code, coding for 20 amino acids and stop signals.",
    "The genetic code is degenerate, meaning multiple codons can specify the same amino acid. The start codon (AUG) signals the beginning of protein synthesis and codes for methionine. Three stop codons (UAA, UAG, UGA) signal the end of translation."
  ],
  'proteinos': [
    "ProteinOS is an educational platform designed to make learning about protein synthesis intuitive and interactive. Our goal is to transform complex biological processes into engaging visual experiences that help students and enthusiasts understand the fundamental mechanisms of life.",
    "ProteinOS was created to bridge the gap between traditional textbook learning and modern interactive education. We visualize the intricate processes of transcription, translation, and protein folding to help users gain a deeper appreciation of molecular biology."
  ],
  'purpose': [
    "The purpose of ProteinOS is to democratize knowledge about protein synthesis through interactive visualizations and engaging content. We aim to make complex biological concepts accessible to students, educators, and anyone curious about how life works at the molecular level.",
    "Our mission with ProteinOS is to inspire the next generation of scientists by making molecular biology more approachable and exciting. By visualizing these invisible cellular processes, we hope to ignite curiosity and deeper understanding of the building blocks of life."
  ],
  'folding': [
    "Protein folding is the process by which a linear chain of amino acids acquires its three-dimensional structure. This structure is essential for proper function, as it determines how the protein interacts with other molecules in the cell.",
    "Protein folding is guided by hydrophobic interactions, hydrogen bonds, ionic interactions, and disulfide bridges. Chaperone proteins assist in the folding process, ensuring proteins achieve their correct conformation and preventing misfolding that can lead to diseases."
  ],
  'aim': [
    "The aim of ProteinOS is to make protein synthesis education more accessible, interactive, and engaging. We believe that complex biological processes are best understood through dynamic visualization rather than static textbook images.",
    "Our aim with ProteinOS is to transform how people learn about molecular biology by providing interactive models that accurately represent the dynamic nature of protein synthesis, making these microscopic processes tangible and understandable."
  ],
  'website': [
    "This website was built to revolutionize how people learn about protein synthesis by providing interactive visualizations of molecular biology concepts that are traditionally difficult to grasp from textbooks alone.",
    "ProteinOS website combines beautiful visuals with scientific accuracy to create an immersive learning experience about protein synthesis, making these invisible cellular processes visible and understandable."
  ],
  'quiz': [
    "The quiz feature on ProteinOS helps test your knowledge of protein synthesis concepts in an interactive way. It's designed to reinforce your learning and identify areas where you might need additional study.",
    "Taking our quiz is a great way to check your understanding of the protein synthesis process after exploring our interactive modules. It covers key concepts from transcription and translation to protein folding."
  ]
};

/**
 * Get a chatbot response based on user input
 */
export const chatbotResponse = async (userInput: string): Promise<string> => {
  const input = userInput.toLowerCase();
  
  // Check for specific questions about protein synthesis topics
  for (const [topic, responses] of Object.entries(proteinSynthesisData)) {
    if (input.includes(topic)) {
      // Return a random response from the available responses for this topic
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Handle general protein synthesis questions
  if (input.includes('protein synthesis') || input.includes('central dogma')) {
    return "Protein synthesis is the process by which cells build proteins. It occurs in two main stages: transcription (DNA → mRNA) and translation (mRNA → protein). This process is part of the Central Dogma of molecular biology, which describes the flow of genetic information from DNA to RNA to proteins.";
  }
  
  // Handle questions about the website's purpose
  if (input.includes('why') || input.includes('about') || input.includes('goal') || input.includes('learn')) {
    return "ProteinOS was created to make learning about protein synthesis engaging and interactive. Our goal is to transform complex biological concepts into visual experiences that are easy to understand. We believe that by seeing these processes in action, you can gain a deeper appreciation for the amazing molecular machinery that powers all life.";
  }
  
  // For unrecognized questions
  return "I'm your guide to protein synthesis and ProteinOS! You can ask me about specific topics like transcription, translation, mRNA, ribosomes, or about why we created this website. How can I help you learn about the fascinating world of proteins?";
};
