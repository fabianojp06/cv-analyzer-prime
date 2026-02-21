export interface JobHistory {
  company: string;
  role: string;
  period: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "new" | "screened" | "interview" | "rejected";
  aiScore: number;
  aiJustification: string;
  skills: string[];
  qualifications: string[];
  jobHistory: JobHistory[];
}

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Ana Beatriz Costa",
    email: "ana.costa@email.com",
    phone: "+55 11 99887-6543",
    role: "Frontend Engineer",
    status: "screened",
    aiScore: 92,
    aiJustification: "Candidata apresenta forte domínio em React, TypeScript e design systems. Experiência sólida de 5 anos em empresas de tecnologia de ponta, com contribuições open-source relevantes. O perfil é altamente compatível com a vaga, especialmente pela experiência com micro-frontends e otimização de performance.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    qualifications: ["Bacharelado em Ciência da Computação - USP", "Certificação AWS Cloud Practitioner"],
    jobHistory: [
      { company: "Nubank", role: "Senior Frontend Engineer", period: "2022 - Atual" },
      { company: "VTEX", role: "Frontend Developer", period: "2019 - 2022" },
      { company: "Resultados Digitais", role: "Junior Developer", period: "2017 - 2019" },
    ],
  },
  {
    id: "2",
    name: "Carlos Eduardo Silva",
    email: "carlos.silva@email.com",
    phone: "+55 21 98765-4321",
    role: "Backend Engineer",
    status: "new",
    aiScore: 78,
    aiJustification: "Candidato com experiência relevante em Node.js e Python. Possui bom conhecimento de arquitetura de microsserviços e mensageria. Recomenda-se validar experiência com sistemas de alta disponibilidade, pois o histórico indica foco maior em startups de menor escala.",
    skills: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS"],
    qualifications: ["Bacharelado em Engenharia de Software - UFMG", "MBA em Gestão de Projetos - FGV"],
    jobHistory: [
      { company: "iFood", role: "Backend Developer", period: "2021 - Atual" },
      { company: "Stone Pagamentos", role: "Software Engineer", period: "2018 - 2021" },
    ],
  },
  {
    id: "3",
    name: "Mariana Oliveira",
    email: "mariana.oliveira@email.com",
    phone: "+55 31 97654-3210",
    role: "UX Designer",
    status: "interview",
    aiScore: 85,
    aiJustification: "Perfil excepcional em Design Centrado no Usuário. Portfólio demonstra forte capacidade de conduzir pesquisas qualitativas e traduzir insights em interfaces intuitivas. A experiência com design systems e acessibilidade é um diferencial significativo para a posição.",
    skills: ["Figma", "User Research", "Design Systems", "Prototyping", "A11y"],
    qualifications: ["Design Digital - PUC Minas", "Especialização em UX - Interaction Design Foundation"],
    jobHistory: [
      { company: "Mercado Livre", role: "Senior UX Designer", period: "2020 - Atual" },
      { company: "Globo", role: "Product Designer", period: "2017 - 2020" },
    ],
  },
  {
    id: "4",
    name: "Rafael Mendes",
    email: "rafael.mendes@email.com",
    phone: "+55 41 96543-2109",
    role: "Frontend Engineer",
    status: "new",
    aiScore: 45,
    aiJustification: "Candidato em transição de carreira, vindo de marketing digital. Possui conhecimentos básicos de HTML, CSS e JavaScript, mas carece de experiência com frameworks modernos como React. O score reflete a lacuna técnica para uma posição de nível pleno, porém demonstra entusiasmo e capacidade de aprendizado.",
    skills: ["HTML", "CSS", "JavaScript", "WordPress"],
    qualifications: ["Publicidade e Propaganda - UFPR", "Bootcamp Frontend - Rocketseat"],
    jobHistory: [
      { company: "Agência Digital XYZ", role: "Analista de Marketing", period: "2019 - Atual" },
    ],
  },
  {
    id: "5",
    name: "Juliana Ferreira",
    email: "juliana.ferreira@email.com",
    phone: "+55 51 95432-1098",
    role: "Data Scientist",
    status: "screened",
    aiScore: 88,
    aiJustification: "Candidata com mestrado em Estatística e sólida experiência em ML/AI. Publicações acadêmicas relevantes e experiência prática com modelos de NLP e sistemas de recomendação. Fit cultural excelente baseado no perfil comportamental.",
    skills: ["Python", "TensorFlow", "SQL", "Spark", "MLOps"],
    qualifications: ["Mestrado em Estatística - UNICAMP", "Bacharelado em Matemática Aplicada - UFRGS"],
    jobHistory: [
      { company: "Itaú Unibanco", role: "Data Scientist Sr.", period: "2021 - Atual" },
      { company: "Loggi", role: "Data Analyst", period: "2018 - 2021" },
    ],
  },
  {
    id: "6",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com",
    phone: "+55 11 94321-0987",
    role: "Backend Engineer",
    status: "rejected",
    aiScore: 28,
    aiJustification: "Candidato não atende aos requisitos mínimos da vaga. Experiência limitada a projetos acadêmicos sem exposição a ambientes de produção. Falta de familiaridade com cloud computing e práticas DevOps essenciais para a posição. Recomenda-se reconsiderar para posições de estágio.",
    skills: ["Java", "MySQL"],
    qualifications: ["Cursando Sistemas de Informação - Universidade Estácio"],
    jobHistory: [
      { company: "Freelancer", role: "Desenvolvedor Web", period: "2023 - Atual" },
    ],
  },
  {
    id: "7",
    name: "Camila Santos",
    email: "camila.santos@email.com",
    phone: "+55 61 93210-9876",
    role: "Product Manager",
    status: "interview",
    aiScore: 91,
    aiJustification: "Candidata altamente qualificada com track record impressionante em produtos digitais B2B SaaS. Experiência comprovada em metodologias ágeis, discovery e delivery. Forte capacidade analítica combinada com habilidades de liderança e comunicação stakeholder.",
    skills: ["Product Strategy", "Agile", "SQL", "Analytics", "Roadmapping"],
    qualifications: ["Administração de Empresas - FGV", "Product Management - Product School (SF)"],
    jobHistory: [
      { company: "TOTVS", role: "Group Product Manager", period: "2021 - Atual" },
      { company: "Resultados Digitais", role: "Product Manager", period: "2018 - 2021" },
      { company: "ThoughtWorks", role: "Business Analyst", period: "2015 - 2018" },
    ],
  },
  {
    id: "8",
    name: "Lucas Ribeiro",
    email: "lucas.ribeiro@email.com",
    phone: "+55 19 92109-8765",
    role: "DevOps Engineer",
    status: "screened",
    aiScore: 55,
    aiJustification: "Candidato com base sólida em infraestrutura e Linux, porém com experiência limitada em Kubernetes e IaC (Terraform). O perfil é promissor para crescimento, mas atualmente está abaixo do nível de senioridade exigido. Considerar para posição de nível pleno ao invés de sênior.",
    skills: ["Linux", "AWS", "Docker", "CI/CD", "Ansible"],
    qualifications: ["Redes de Computadores - UNICAMP", "Certificação Linux LPIC-1"],
    jobHistory: [
      { company: "Locaweb", role: "SysAdmin", period: "2020 - Atual" },
      { company: "UOL", role: "Analista de Infraestrutura Jr.", period: "2018 - 2020" },
    ],
  },
];
