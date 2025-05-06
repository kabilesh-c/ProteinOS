
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const proteinSynthesisQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the first step in protein synthesis?",
    options: [
      "Translation", 
      "Transcription", 
      "Replication", 
      "Post-translational modification"
    ],
    correctOptionIndex: 1,
    explanation: "Transcription is the first step in protein synthesis where DNA is copied into mRNA. This process occurs in the nucleus of eukaryotic cells."
  },
  {
    id: 2,
    question: "Which enzyme is responsible for synthesizing RNA during transcription?",
    options: [
      "DNA polymerase", 
      "RNA polymerase", 
      "Helicase", 
      "Ligase"
    ],
    correctOptionIndex: 1,
    explanation: "RNA polymerase is the enzyme that synthesizes RNA by adding complementary RNA nucleotides to the DNA template strand."
  },
  {
    id: 3,
    question: "What is the function of mRNA in protein synthesis?",
    options: [
      "It carries amino acids to the ribosome", 
      "It forms the structure of ribosomes", 
      "It carries the genetic code from DNA to ribosomes", 
      "It catalyzes peptide bond formation"
    ],
    correctOptionIndex: 2,
    explanation: "mRNA (messenger RNA) carries the genetic information copied from DNA in the form of a series of three-base code words, each of which specifies a particular amino acid."
  },
  {
    id: 4,
    question: "What is a codon?",
    options: [
      "A sequence of three nucleotides in DNA", 
      "A sequence of three nucleotides in mRNA that specifies an amino acid", 
      "A type of RNA that carries amino acids", 
      "A protein complex that reads mRNA"
    ],
    correctOptionIndex: 1,
    explanation: "A codon is a sequence of three nucleotides in mRNA that specifies a particular amino acid or a signal to start or stop protein synthesis."
  },
  {
    id: 5,
    question: "Which molecule brings amino acids to the ribosome during translation?",
    options: [
      "mRNA", 
      "tRNA", 
      "rRNA", 
      "DNA"
    ],
    correctOptionIndex: 1,
    explanation: "tRNA (transfer RNA) molecules carry specific amino acids to the ribosome during translation, matching them to the corresponding codons in the mRNA."
  },
  {
    id: 6,
    question: "Where does translation occur in eukaryotic cells?",
    options: [
      "Nucleus", 
      "Mitochondria", 
      "Cytoplasm", 
      "Golgi apparatus"
    ],
    correctOptionIndex: 2,
    explanation: "Translation occurs in the cytoplasm of eukaryotic cells, either freely or bound to the rough endoplasmic reticulum, where ribosomes read mRNA to synthesize proteins."
  },
  {
    id: 7,
    question: "What is the start codon for protein synthesis?",
    options: [
      "UAG", 
      "AUG", 
      "UGA", 
      "UAA"
    ],
    correctOptionIndex: 1,
    explanation: "AUG is the start codon that initiates protein synthesis. It codes for the amino acid methionine in eukaryotes."
  },
  {
    id: 8,
    question: "What happens during the elongation phase of translation?",
    options: [
      "mRNA is synthesized", 
      "The ribosome attaches to mRNA", 
      "Amino acids are added one by one to the growing polypeptide chain", 
      "The polypeptide chain is released from the ribosome"
    ],
    correctOptionIndex: 2,
    explanation: "During elongation, the ribosome moves along the mRNA, adding amino acids one at a time to the growing polypeptide chain according to the codon sequence."
  },
  {
    id: 9,
    question: "What are the stop codons in protein synthesis?",
    options: [
      "AUG, GUG, UUG", 
      "UAG, UAA, UGA", 
      "AAA, AAG, GAA", 
      "CCC, GGG, UUU"
    ],
    correctOptionIndex: 1,
    explanation: "UAG, UAA, and UGA are the three stop codons that signal the termination of protein synthesis. They do not code for any amino acids."
  },
  {
    id: 10,
    question: "What process may occur after a protein is synthesized?",
    options: [
      "Transcription", 
      "DNA replication", 
      "Post-translational modification", 
      "RNA splicing"
    ],
    correctOptionIndex: 2,
    explanation: "Post-translational modification occurs after protein synthesis and involves chemical changes to the protein that can affect its function, localization, or stability."
  }
];
