/*
 * Shared content for the design previews.
 * Single source of truth — the prototypes read window.SITE and never hardcode facts.
 */
window.SITE = {
  name: 'Hein Htet Aung',
  role: 'an engineer working with Kubernetes',
  location: 'Dubai, UAE',
  email: 'heinhtetaung.hha@hotmail.com',

  /* The console chrome identifies itself the way a k8s client shows the cluster
     it is connected to. */
  domain: 'heinhtetaung.info',
  namespace: 'prod',

  links: {
    linkedin: 'https://www.linkedin.com/in/hein-htet-aung-hha/',
    github: 'https://github.com/hellboyhha',
    medium: 'https://medium.com/@devopsdecode'
  },

  about: "Always curious, always learning. I love tackling new challenges and collaborating in fast-paced environments.",

  /* Capabilities, not products. Ordered along the delivery lifecycle so the
     wrapped chips read in clusters rather than as a pile. */
  services: [
    'Cloud platforms',
    'On-premises infrastructure',
    'Kubernetes management',
    'Infrastructure as code',
    'Configuration management',
    'Continuous integration & delivery',
    'DevSecOps',
    'Load balancing & reverse proxy',
    'Monitoring & observability',
    'Data platforms'
  ],

  education: {
    school: 'University of Information Technology',
    degree: 'BSc Computer Science',
    major: 'High Performance Computing',
    place: 'Yangon, MM',
    years: '2015 — 2020'
  },

  experience: [
    { role: 'DevOps Engineer', company: 'Finclutech Ltd FZCO', place: 'Dubai, UAE', period: 'Feb 2025 — present', current: true },
    { role: 'Technical SEO Specialist', company: 'V Perfumes L.L.C', place: 'Dubai, UAE', period: 'Feb 2024 — Feb 2025' },
    { role: 'DevOps Engineer', company: 'City Mart Holding Co., ltd.', place: 'Yangon, MM', period: 'Dec 2020 — May 2023' },
    { role: 'System Engineer (intern)', company: 'TechnoSwift Co., Ltd', place: 'Yangon, MM', period: 'Sept 2020 — Dec 2020' }
  ],

  projects: [
    { name: 'Talos Kubernetes Deployment on VMware', tech: 'kubernetes · vmware · IaC', year: '2025', blurb: 'Kubernetes on Talos VMs — identical nodes from one official OVA', url: 'https://github.com/hellboyhha/talos-on-vmware' },
    { name: 'Selenium UI Python Testcase in GitHub Actions', tech: 'python · github actions · testing', year: '2023', blurb: 'Selenium browser tests in CI — results published back into the run', url: 'https://github.com/hellboyhha/run-selenium-ui-python-testcase-using-githubaction' },
    { name: 'ML Model Deployment on Azure ML Studio', tech: 'mlflow · azure ml · ci/cd', year: '2023', blurb: 'Model, environment and endpoint deployed by pipeline, not by hand', url: 'https://github.com/hellboyhha/mlmodel-deployment-using-githubaction-on-azuremlstudio' },
    { name: 'CI/CD on Azure Databricks with Azure DevOps', tech: 'databricks · azure devops', year: '2023', blurb: 'Databricks batch pipelines built to survive a regional outage', url: 'https://github.com/hellboyhha/cicd-on-azure-databricks-using-azuredevops' },
    { name: 'Terraform, Terragrunt & Terratest — Static Hosting on S3', tech: 'terraform · terragrunt · terratest', year: '2023', blurb: 'Layered with Terragrunt, verified by Terratest before it deploys', url: 'https://github.com/hellboyhha/aws-s3-static-website-terraform-terragrunt-terratest' }
  ],

  /* `embed: false` marks credentials whose host refuses to be framed, so they
     open in a new tab instead of the in-page viewer. Credential pages tend to
     block it (Credly, Microsoft Learn, cncf.io); files and Databricks
     credentials do not. */
  certs: [
    {
      name: 'Kubestronaut', issuer: 'CNCF', code: '', embed: false,
      badge: 'assets/images/kubestronaut-badge.png',
      url: 'https://www.credly.com/badges/64c93abb-4424-4633-b8f1-5a61d8d23fd2/public_url'
    },
    { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', code: 'CKA', url: 'https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/17ed1d76-f8e8-4a63-a22b-ecc69ef4a210-hein-htet-aung-2d1b47de-aa3c-4f7a-9499-31593f64950e-certificate.pdf' },
    { name: 'Certified Kubernetes Application Developer', issuer: 'CNCF', code: 'CKAD', url: 'https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/17ed1d76-f8e8-4a63-a22b-ecc69ef4a210-hein-htet-aung-3356e4b6-75de-4eac-8e6a-9003bdf21014-certificate.pdf' },
    { name: 'Certified Kubernetes Security Specialist', issuer: 'CNCF', code: 'CKS', url: 'https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/17ed1d76-f8e8-4a63-a22b-ecc69ef4a210-hein-htet-aung-5f508728-8b46-47a6-949c-1436f23515d1-certificate.pdf' },
    { name: 'Kubernetes and Cloud Native Associate', issuer: 'CNCF', code: 'KCNA', url: 'https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/17ed1d76-f8e8-4a63-a22b-ecc69ef4a210-hein-htet-aung-18889f31-a4ab-4273-8368-be657f7f53d3-certificate.pdf' },
    { name: 'Kubernetes and Cloud Native Security Associate', issuer: 'CNCF', code: 'KCSA', url: 'https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/17ed1d76-f8e8-4a63-a22b-ecc69ef4a210-hein-htet-aung-91c7d3e6-09ea-459c-849b-3eda0d88ce65-certificate.pdf' },
    { name: 'Azure DevOps Engineer Expert', issuer: 'Microsoft', code: 'AZ-400', embed: false, url: 'https://learn.microsoft.com/api/credentials/share/en-us/HeinHtetAung-6232/62C4287DEF804B9E?sharingId=2BDD3C88A66A026A' },
    { name: 'Azure Solutions Architect Expert', issuer: 'Microsoft', code: 'AZ-305', embed: false, url: 'https://learn.microsoft.com/api/credentials/share/en-us/HeinHtetAung-6232/B12F8AE33471E082?sharingId=2BDD3C88A66A026A' },
    { name: 'Azure Administrator Associate', issuer: 'Microsoft', code: 'AZ-104', embed: false, url: 'https://learn.microsoft.com/api/credentials/share/en-us/HeinHtetAung-6232/A8BB75B389E2AF0C?sharingId=2BDD3C88A66A026A' },
    {
      name: 'AWS SysOps Administrator Associate', issuer: 'AWS', code: 'SOA-C02', embed: false,
      url: 'https://www.credly.com/badges/4017485a-a16a-4534-a49c-4c17f7a7aca7/public_url'
    },
    {
      name: 'Terraform Associate', issuer: 'HashiCorp', code: '003', embed: false,
      url: 'https://www.credly.com/badges/590a0aef-de52-4d3b-a2f5-74fd6302933b/public_url'
    },
    { name: 'Databricks Platform Administrator', issuer: 'Databricks', code: '', url: 'https://credentials.databricks.com/18b94214-429b-4ba9-a92e-80a40cdaeea9' }
  ],

  contact: [
    { label: 'email', value: 'heinhtetaung.hha@hotmail.com', action: 'send email', url: 'mailto:heinhtetaung.hha@hotmail.com' },
    { label: 'linkedin', value: 'linkedin.com/in/hein-htet-aung-hha', action: 'open on LinkedIn', url: 'https://www.linkedin.com/in/hein-htet-aung-hha/' },
    { label: 'medium', value: 'medium.com/@devopsdecode', action: 'open on Medium', url: 'https://medium.com/@devopsdecode' },
    { label: 'github', value: 'github.com/hellboyhha', action: 'open on GitHub', url: 'https://github.com/hellboyhha' }
  ],

  employers: [
    { name: 'Finclutech', url: 'https://finclutech.com/', logo: 'assets/images/finclutech-color-logo.png' },
    { name: 'V Perfumes', url: 'https://www.vperfumes.com/', logo: 'assets/images/vperfumes-color-logo.png' },
    { name: 'City Mart', url: 'https://www.citymart.com.mm/', logo: 'assets/images/citymart-color-logo.png' },
    { name: 'TechnoSwift', url: 'https://www.linkedin.com/company/technoswift', logo: 'assets/images/technoswift-color-logo.png' }
  ]
};

/*
 * Live career total — shared by all three views so they can never disagree.
 *
 * It adds up each role's own span rather than measuring from the first start
 * date, so gaps between jobs are not counted. Any role marked `current: true`
 * is measured against today's date, which means the total keeps climbing on
 * its own while that role is still held.
 */
window.SITE.career = (function () {
  const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const SPLIT = /\s*[\u2014\u2013]\s*|\s+-\s+/;

  const parseMonth = text => {
    const bits = String(text || '').trim().split(/\s+/);
    if (bits.length !== 2 || !/^\d{4}$/.test(bits[1])) return null;
    const month = MONTHS[bits[0].slice(0, 3).toLowerCase()];
    return month === undefined ? null : { y: Number(bits[1]), m: month };
  };

  const parts = period => String(period || '').split(SPLIT).filter(Boolean);
  const nowMonths = () => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); };

  const spanMonths = period => {
    const bits = parts(period);
    if (bits.length < 2) return null;
    const start = parseMonth(bits[0]);
    if (!start) return null;
    let end;
    if (/present|now|current/i.test(bits[1])) {
      end = nowMonths();
    } else {
      const finish = parseMonth(bits[1]);
      if (!finish) return null;
      end = finish.y * 12 + finish.m;
    }
    const from = start.y * 12 + start.m;
    return end < from ? null : end - from;
  };

  const format = n => {
    if (n == null) return '—';
    if (n < 1) return '<1mo';
    const y = Math.floor(n / 12);
    const m = n % 12;
    if (!y) return m + 'mo';
    return m ? y + 'y ' + m + 'mo' : y + 'y';
  };

  const months = () => (window.SITE.experience || []).reduce((sum, role) => {
    const span = spanMonths(role.period);
    return sum + (span == null ? 0 : span);
  }, 0);

  const starts = () => (window.SITE.experience || [])
    .map(role => ({ token: parseMonth(parts(role.period)[0]), label: parts(role.period)[0] }))
    .filter(x => x.token)
    .sort((a, b) => (a.token.y * 12 + a.token.m) - (b.token.y * 12 + b.token.m));

  return {
    months: months,
    label: () => format(months()),
    roles: () => (window.SITE.experience || []).length,
    since: () => (starts()[0] ? starts()[0].label : ''),
    spanMonths: spanMonths,
    format: format
  };
})();
