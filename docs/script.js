// ===== i18n translations =====
  const i18n = {
    en: {
      'nav.features': 'Features', 'nav.workflows': 'Workflows',
      'nav.antirat': 'Anti-Rationalization', 'nav.arch': 'Architecture', 'nav.install': 'Install',
      'hero.title': 'Transform AI into a<br><span class="gradient">Development Team</span>',
      'hero.desc': 'AWF is a prompt engineering framework that turns your AI coding assistant into specialized personas \u2014 PM, Developer, Designer, Detective \u2014 each with structured workflows and safety guardrails.',
      'hero.cta': 'Get Started', 'hero.github': 'View on GitHub',
      'hero.stat.wf': 'Workflows', 'hero.stat.sk': 'Built-in Skills',
      'hero.stat.ps': 'Personas', 'hero.stat.sp': 'Shared Protocols',
      'flow.label': 'Developer Cycle', 'flow.title': 'From Idea to Production',
      'flow.desc': 'Every stage of development has a dedicated workflow with its own expert persona.',
      'feat.label': 'Key Features', 'feat.title': 'What Makes AWF Different',
      'feat.desc': 'Not just prompts \u2014 a complete engineering system with process enforcement.',
      'f1.t': 'Persona System', 'f1.d': 'Each workflow has a named expert: PM Ha plans features, Detective Long debugs methodically, Security Eng Khang audits thoroughly. Consistent expertise across sessions.',
      'f2.t': 'Anti-Rationalization', 'f2.d': 'Tables of common AI excuses that are explicitly blocked. "Just a small change, skip tests" \u2192 BLOCKED. Applied to 7 workflows.',
      'f3.t': 'Non-Tech Mode', 'f3.d': 'Every workflow supports 3 levels: Newbie (plain language, 1 question per turn), Basic, and Technical. Error messages auto-translated to human language.',
      'f4.t': 'Context Management', 'f4.d': 'Never lose context between sessions. Lazy Checkpoint (~20 tokens/task), Proactive Handover when context is 80% full, MCP Memory integration.',
      'f5.t': 'Search-First Coding', 'f5.d': 'Before writing ANY new code, mandatory search for existing solutions. Research \u2192 Reuse \u2192 Build. Prevents reinventing the wheel.',
      'f6.t': 'Shared Protocols', 'f6.d': '5 cross-cutting protocols: context-retrieval, iterative-retrieval, resilience (auto-retry), token-discipline, GitHub CLI mapping.',
      'wf.label': 'Complete Coverage', 'wf.title': '22 Workflows',
      'wf.desc': 'Every stage of software development covered with structured processes.',
      'wf.g1': 'Development Lifecycle', 'wf.g2': 'Operations & Utilities',
      'wf.th1': 'Command', 'wf.th2': 'Persona', 'wf.th3': 'Role', 'wf.th1b': 'Command', 'wf.th3b': 'Role',
      'wf.r1': 'Capture idea, create workspace', 'wf.r2': 'Explore & validate ideas, create BRIEF.md',
      'wf.r3': 'Features, phases, risk assessment', 'wf.r4': 'DB schema, API design, acceptance criteria',
      'wf.r5': 'UI mockup generation', 'wf.r6': 'Search-First implementation + Phase Gates',
      'wf.r7': 'Test strategy, flaky detection, coverage', 'wf.r8': 'Root cause with Iron Law enforcement',
      'wf.r9': 'Pre-commit gate, security checklist', 'wf.r10': 'Readability cleanup, safety tiers',
      'wf.r11': 'Full checkup, A-F grading system',
      'wf.r12': 'Auto-detect build system & launch app', 'wf.r13': 'Full production: SEO, analytics, legal, backup, monitoring',
      'wf.r14': 'Emergency recovery via git', 'wf.r15': 'Context recovery from .brain/ files',
      'wf.r16': 'Persist knowledge for next session', 'wf.r17': 'Context-aware help system',
      'wf.r18': 'AI suggests next action', 'wf.r19': 'Preferences (tech level, tone, autonomy)',
      'wf.r20': 'Design DNA + UI component library',
      'ar.label': 'Process Enforcement', 'ar.title': 'Anti-Rationalization',
      'ar.desc': 'Inspired by <a href="https://github.com/obra/superpowers" target="_blank" rel="noopener" style="color:var(--accent-1)">Superpowers</a>. Common AI excuses are explicitly blocked across 7 workflows.',
      'ex1.l': '"I already know how to build this"', 'ex1.r': 'Search anyway. Existing code, libraries, or patterns save hours of work.',
      'ex2.l': '"Just a small change, no test needed"', 'ex2.r': 'Small changes cause the worst bugs. Run the test.',
      'ex3.l': '"Fix this bug while refactoring"', 'ex3.r': 'NEVER mix refactoring and bug fixing. Separate commits, separate concerns.',
      'ex4.l': '"Simple project, skip Risk Assessment"', 'ex4.r': 'Simple projects fail for simple reasons. Risk Assessment takes 2 minutes.',
      'ex5.l': '"Flaky test, just re-run"', 'ex5.r': 'Flaky tests hide real bugs. Quarantine and investigate.',
      'ex6.l': '"The fix is obvious, skip root cause"', 'ex6.r': 'Iron Law: No fix without confirmed root cause. Obvious fixes create new bugs.',
      'arch.label': 'Under the Hood', 'arch.title': '3-Tier Architecture',
      'arch.desc': 'Agent, Workflow, and Skill layers work together seamlessly.',
      'arch.t1': 'Tier 1: Agent Layer', 'arch.t2': 'Tier 2: Workflow Layer',
      'arch.t2s': '\u2022 Shared Protocols', 'arch.t3': 'Tier 3: Skill Layer', 'arch.t3s': '\u2022 Custom Skills',
      'inst.label': 'Get Started', 'inst.title': 'Installation',
      'inst.desc': 'One command. Auto-creates symlinks for <code style="color:var(--accent-2)">.agent/</code> and <code style="color:var(--accent-2)">.agents/</code> directories for multi-agent IDE compatibility.',
      'footer.text': 'AWF is open source under MIT License. Originally created by <a href="https://github.com/TUAN130294/awf" target="_blank" rel="noopener">@TUAN130294</a>. Enhanced by <a href="https://github.com/devtdq1701" target="_blank" rel="noopener">@devtdq1701</a>. Inspired by <a href="https://github.com/obra/superpowers" target="_blank" rel="noopener">Superpowers</a>.',
      'footer.tagline': 'Your dreams, our engineering.'
    },
    vi: {
      'nav.features': 'T\u00ednh n\u0103ng', 'nav.workflows': 'Quy tr\u00ecnh',
      'nav.antirat': 'Ch\u1ed1ng bi\u1ec7n minh', 'nav.arch': 'Ki\u1ebfn tr\u00fac', 'nav.install': 'C\u00e0i \u0111\u1eb7t',
      'hero.title': 'Bi\u1ebfn AI th\u00e0nh<br><span class="gradient">\u0110\u1ed9i ng\u0169 ph\u00e1t tri\u1ec3n</span>',
      'hero.desc': 'AWF l\u00e0 framework prompt engineering bi\u1ebfn tr\u1ee3 l\u00fd AI th\u00e0nh c\u00e1c chuy\u00ean gia \u2014 PM, Developer, Designer, Detective \u2014 m\u1ed7i ng\u01b0\u1eddi c\u00f3 quy tr\u00ecnh v\u00e0 r\u00e0o ch\u1eafn an to\u00e0n ri\u00eang.',
      'hero.cta': 'B\u1eaft \u0111\u1ea7u', 'hero.github': 'Xem tr\u00ean GitHub',
      'hero.stat.wf': 'Quy tr\u00ecnh', 'hero.stat.sk': 'K\u1ef9 n\u0103ng',
      'hero.stat.ps': 'Chuy\u00ean gia', 'hero.stat.sp': 'Giao th\u1ee9c chung',
      'flow.label': 'Chu tr\u00ecnh ph\u00e1t tri\u1ec3n', 'flow.title': 'T\u1eeb \u00fd t\u01b0\u1edfng \u0111\u1ebfn s\u1ea3n ph\u1ea9m',
      'flow.desc': 'M\u1ed7i giai \u0111o\u1ea1n ph\u00e1t tri\u1ec3n \u0111\u1ec1u c\u00f3 quy tr\u00ecnh chuy\u00ean bi\u1ec7t v\u1edbi chuy\u00ean gia ri\u00eang.',
      'feat.label': 'T\u00ednh n\u0103ng ch\u00ednh', 'feat.title': '\u0110i\u1ec3m kh\u00e1c bi\u1ec7t c\u1ee7a AWF',
      'feat.desc': 'Kh\u00f4ng ch\u1ec9 l\u00e0 prompt \u2014 m\u00e0 l\u00e0 h\u1ec7 th\u1ed1ng k\u1ef9 thu\u1eadt ho\u00e0n ch\u1ec9nh v\u1edbi c\u01a1 ch\u1ebf gi\u00e1m s\u00e1t quy tr\u00ecnh.',
      'f1.t': 'H\u1ec7 th\u1ed1ng Persona', 'f1.d': 'M\u1ed7i quy tr\u00ecnh c\u00f3 chuy\u00ean gia ri\u00eang: PM H\u00e0 l\u00ean k\u1ebf ho\u1ea1ch, Th\u00e1m t\u1eed Long debug, K\u1ef9 s\u01b0 BM Khang ki\u1ec3m to\u00e1n. Chuy\u00ean m\u00f4n nh\u1ea5t qu\u00e1n qua c\u00e1c phi\u00ean.',
      'f2.t': 'Ch\u1ed1ng bi\u1ec7n minh', 'f2.d': 'B\u1ea3ng l\u00fd do bi\u1ec7n minh ph\u1ed5 bi\u1ebfn c\u1ee7a AI b\u1ecb ch\u1eb7n r\u00f5 r\u00e0ng. "Thay \u0111\u1ed5i nh\u1ecf, b\u1ecf qua test" \u2192 B\u1ecb CH\u1eb6N. \u00c1p d\u1ee5ng cho 7 quy tr\u00ecnh.',
      'f3.t': 'Ch\u1ebf \u0111\u1ed9 Kh\u00f4ng-K\u1ef9-thu\u1eadt', 'f3.d': 'M\u1ed7i quy tr\u00ecnh h\u1ed7 tr\u1ee3 3 c\u1ea5p \u0111\u1ed9: Ng\u01b0\u1eddi m\u1edbi (ng\u00f4n ng\u1eef \u0111\u01a1n gi\u1ea3n, 1 c\u00e2u h\u1ecfi/l\u01b0\u1ee3t), C\u01a1 b\u1ea3n, v\u00e0 K\u1ef9 thu\u1eadt. L\u1ed7i \u0111\u01b0\u1ee3c d\u1ecbch t\u1ef1 \u0111\u1ed9ng sang ng\u00f4n ng\u1eef d\u1ec5 hi\u1ec3u.',
      'f4.t': 'Qu\u1ea3n l\u00fd Ng\u1eef c\u1ea3nh', 'f4.d': 'Kh\u00f4ng bao gi\u1edd m\u1ea5t ng\u1eef c\u1ea3nh gi\u1eefa c\u00e1c phi\u00ean. Lazy Checkpoint (~20 token/task), Proactive Handover khi ng\u1eef c\u1ea3nh \u0111\u1ea7y 80%, t\u00edch h\u1ee3p MCP Memory.',
      'f5.t': 'T\u00ecm ki\u1ebfm Tr\u01b0\u1edbc', 'f5.d': 'Tr\u01b0\u1edbc khi vi\u1ebft code M\u1edaI, b\u1eaft bu\u1ed9c t\u00ecm gi\u1ea3i ph\u00e1p c\u00f3 s\u1eb5n. Nghi\u00ean c\u1ee9u \u2192 T\u00e1i s\u1eed d\u1ee5ng \u2192 X\u00e2y m\u1edbi. Tr\u00e1nh ph\u00e1t minh l\u1ea1i b\u00e1nh xe.',
      'f6.t': 'Giao th\u1ee9c Chung', 'f6.d': '5 giao th\u1ee9c xuy\u00ean su\u1ed1t: truy xu\u1ea5t ng\u1eef c\u1ea3nh, truy xu\u1ea5t l\u1eb7p, kh\u1ea3 n\u0103ng ph\u1ee5c h\u1ed3i (auto-retry), ki\u1ec3m so\u00e1t token, GitHub CLI mapping.',
      'wf.label': 'Bao ph\u1ee7 to\u00e0n di\u1ec7n', 'wf.title': '22 Quy tr\u00ecnh',
      'wf.desc': 'M\u1ecdi giai \u0111o\u1ea1n ph\u00e1t tri\u1ec3n ph\u1ea7n m\u1ec1m \u0111\u1ec1u \u0111\u01b0\u1ee3c \u0111\u1ecbnh ngh\u0129a quy tr\u00ecnh r\u00f5 r\u00e0ng.',
      'wf.g1': 'V\u00f2ng \u0111\u1eddi Ph\u00e1t tri\u1ec3n', 'wf.g2': 'V\u1eadn h\u00e0nh & Ti\u1ec7n \u00edch',
      'wf.th1': 'L\u1ec7nh', 'wf.th2': 'Chuy\u00ean gia', 'wf.th3': 'Vai tr\u00f2', 'wf.th1b': 'L\u1ec7nh', 'wf.th3b': 'Vai tr\u00f2',
      'wf.r1': 'N\u1eafm b\u1eaft \u00fd t\u01b0\u1edfng, t\u1ea1o workspace', 'wf.r2': 'Kh\u00e1m ph\u00e1 & x\u00e1c th\u1ef1c \u00fd t\u01b0\u1edfng, t\u1ea1o BRIEF.md',
      'wf.r3': 'T\u00ednh n\u0103ng, giai \u0111o\u1ea1n, \u0111\u00e1nh gi\u00e1 r\u1ee7i ro', 'wf.r4': 'DB schema, thi\u1ebft k\u1ebf API, ti\u00eau ch\u00ed ch\u1ea5p nh\u1eadn',
      'wf.r5': 'T\u1ea1o mockup giao di\u1ec7n', 'wf.r6': 'T\u00ecm ki\u1ebfm tr\u01b0\u1edbc + C\u1ed5ng ki\u1ec3m so\u00e1t',
      'wf.r7': 'Chi\u1ebfn l\u01b0\u1ee3c test, ph\u00e1t hi\u1ec7n flaky, \u0111\u1ed9 ph\u1ee7', 'wf.r8': 'T\u00ecm nguy\u00ean nh\u00e2n g\u1ed1c v\u1edbi Lu\u1eadt S\u1eaft',
      'wf.r9': 'C\u1ed5ng ki\u1ec3m tra tr\u01b0\u1edbc commit, checklist b\u1ea3o m\u1eadt', 'wf.r10': 'D\u1ecdn d\u1eb9p \u0111\u1ecdc hi\u1ec3u, c\u00e1c t\u1ea7ng an to\u00e0n',
      'wf.r11': 'Ki\u1ec3m tra to\u00e0n di\u1ec7n, h\u1ec7 th\u1ed1ng ch\u1ea5m \u0111i\u1ec3m A-F',
      'wf.r12': 'T\u1ef1 ph\u00e1t hi\u1ec7n build system & kh\u1edfi ch\u1ea1y app', 'wf.r13': 'Production: SEO, analytics, ph\u00e1p l\u00fd, backup, monitoring',
      'wf.r14': 'Ph\u1ee5c h\u1ed3i kh\u1ea9n c\u1ea5p qua git', 'wf.r15': 'Ph\u1ee5c h\u1ed3i ng\u1eef c\u1ea3nh t\u1eeb file .brain/',
      'wf.r16': 'L\u01b0u ki\u1ebfn th\u1ee9c cho phi\u00ean ti\u1ebfp theo', 'wf.r17': 'H\u1ec7 th\u1ed1ng tr\u1ee3 gi\u00fap theo ng\u1eef c\u1ea3nh',
      'wf.r18': 'AI g\u1ee3i \u00fd h\u00e0nh \u0111\u1ed9ng ti\u1ebfp theo', 'wf.r19': 'T\u00f9y ch\u1ec9nh (c\u1ea5p \u0111\u1ed9 k\u1ef9 thu\u1eadt, gi\u1ecdng v\u0103n, quy\u1ec1n t\u1ef1 ch\u1ee7)',
      'wf.r20': 'Design DNA + th\u01b0 vi\u1ec7n UI component',
      'ar.label': 'Gi\u00e1m s\u00e1t quy tr\u00ecnh', 'ar.title': 'Ch\u1ed1ng bi\u1ec7n minh',
      'ar.desc': 'L\u1ea5y c\u1ea3m h\u1ee9ng t\u1eeb <a href="https://github.com/obra/superpowers" target="_blank" rel="noopener" style="color:var(--accent-1)">Superpowers</a>. Nh\u1eefng l\u00fd do bi\u1ec7n minh ph\u1ed5 bi\u1ebfn c\u1ee7a AI b\u1ecb ch\u1eb7n trong 7 quy tr\u00ecnh.',
      'ex1.l': '"T\u00f4i \u0111\u00e3 bi\u1ebft c\u00e1ch l\u00e0m r\u1ed3i"', 'ex1.r': 'V\u1eabn ph\u1ea3i t\u00ecm. Code, th\u01b0 vi\u1ec7n, pattern c\u00f3 s\u1eb5n ti\u1ebft ki\u1ec7m h\u00e0ng gi\u1edd.',
      'ex2.l': '"Thay \u0111\u1ed5i nh\u1ecf, kh\u00f4ng c\u1ea7n test"', 'ex2.r': 'Thay \u0111\u1ed5i nh\u1ecf g\u00e2y bug t\u1ec7 nh\u1ea5t. Ch\u1ea1y test \u0111i.',
      'ex3.l': '"S\u1eeda bug lu\u00f4n khi refactor"', 'ex3.r': 'KH\u00d4NG BAO GI\u1ede tr\u1ed9n refactor v\u00e0 s\u1eeda bug. Commit ri\u00eang, vi\u1ec7c ri\u00eang.',
      'ex4.l': '"D\u1ef1 \u00e1n \u0111\u01a1n gi\u1ea3n, b\u1ecf qua \u0110\u00e1nh gi\u00e1 R\u1ee7i ro"', 'ex4.r': 'D\u1ef1 \u00e1n \u0111\u01a1n gi\u1ea3n th\u1ea5t b\u1ea1i v\u00ec l\u00fd do \u0111\u01a1n gi\u1ea3n. \u0110\u00e1nh gi\u00e1 r\u1ee7i ro m\u1ea5t 2 ph\u00fat.',
      'ex5.l': '"Test kh\u00f4ng \u1ed5n \u0111\u1ecbnh, ch\u1ea1y l\u1ea1i th\u00f4i"', 'ex5.r': 'Test kh\u00f4ng \u1ed5n \u0111\u1ecbnh che gi\u1ea5u bug th\u1eadt. C\u00e1ch ly v\u00e0 \u0111i\u1ec1u tra.',
      'ex6.l': '"C\u00e1ch s\u1eeda r\u00f5 r\u00e0ng, b\u1ecf qua nguy\u00ean nh\u00e2n g\u1ed1c"', 'ex6.r': 'Lu\u1eadt S\u1eaft: Kh\u00f4ng s\u1eeda khi ch\u01b0a x\u00e1c \u0111\u1ecbnh nguy\u00ean nh\u00e2n g\u1ed1c. S\u1eeda v\u1ed9i t\u1ea1o bug m\u1edbi.',
      'arch.label': 'B\u00ean trong', 'arch.title': 'Ki\u1ebfn tr\u00fac 3 t\u1ea7ng',
      'arch.desc': 'Agent, Workflow v\u00e0 Skill ph\u1ed1i h\u1ee3p li\u1ec1n m\u1ea1ch.',
      'arch.t1': 'T\u1ea7ng 1: Agent', 'arch.t2': 'T\u1ea7ng 2: Workflow',
      'arch.t2s': '\u2022 Giao th\u1ee9c chung', 'arch.t3': 'T\u1ea7ng 3: Skill', 'arch.t3s': '\u2022 Skill t\u00f9y ch\u1ec9nh',
      'inst.label': 'B\u1eaft \u0111\u1ea7u', 'inst.title': 'C\u00e0i \u0111\u1eb7t',
      'inst.desc': 'M\u1ed9t l\u1ec7nh duy nh\u1ea5t. T\u1ef1 \u0111\u1ed9ng t\u1ea1o symlink cho <code style="color:var(--accent-2)">.agent/</code> v\u00e0 <code style="color:var(--accent-2)">.agents/</code> t\u01b0\u01a1ng th\u00edch \u0111a agent IDE.',
      'footer.text': 'AWF l\u00e0 m\u00e3 ngu\u1ed3n m\u1edf theo gi\u1ea5y ph\u00e9p MIT. T\u00e1c gi\u1ea3 g\u1ed1c <a href="https://github.com/TUAN130294/awf" target="_blank" rel="noopener">@TUAN130294</a>. N\u00e2ng c\u1ea5p b\u1edfi <a href="https://github.com/devtdq1701" target="_blank" rel="noopener">@devtdq1701</a>. L\u1ea5y c\u1ea3m h\u1ee9ng t\u1eeb <a href="https://github.com/obra/superpowers" target="_blank" rel="noopener">Superpowers</a>.',
      'footer.tagline': '\u01af\u1edbc m\u01a1 c\u1ee7a b\u1ea1n, k\u1ef9 thu\u1eadt c\u1ee7a ch\u00fang t\u00f4i.'
    }
  };

  let currentLang = localStorage.getItem('awf-lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('awf-lang', lang);
    document.getElementById('langToggle').textContent = lang.toUpperCase();
    document.documentElement.lang = lang;
    const t = i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (t[key]) el.innerHTML = t[key];
    });
  }

  function toggleLang() {
    applyLang(currentLang === 'en' ? 'vi' : 'en');
  }

  // ===== Theme =====
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('awf-theme', theme);
    document.getElementById('themeToggle').innerHTML = theme === 'dark' ? '&#x263E;' : '&#x2600;';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Init
  const savedTheme = localStorage.getItem('awf-theme') || 'dark';
  applyTheme(savedTheme);
  applyLang(currentLang);

  // ===== Intersection Observer =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ===== Tab switching =====
  function switchTab(tab) {
    document.querySelectorAll('.install-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.install-panel').forEach(p => p.classList.remove('active'));
    event.target.closest('.install-tab').classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  }

  // ===== Copy =====
  const installScripts = {
    global: `curl -fsSL https://raw.githubusercontent.com/devtdq1701/awf/main/install.sh | bash`,
    project: `curl -fsSL https://raw.githubusercontent.com/devtdq1701/awf/main/install.sh | bash -s -- --project`,
    manual: `git clone --depth 1 https://github.com/devtdq1701/awf.git /tmp/awf
mkdir -p ~/.gemini/antigravity
cp -r /tmp/awf/workflows ~/.gemini/antigravity/global_workflows
cp -r /tmp/awf/skills    ~/.gemini/antigravity/skills
cp -r /tmp/awf/schemas   ~/.gemini/antigravity/schemas
cp -r /tmp/awf/templates ~/.gemini/antigravity/templates
mkdir -p ~/.agent/skills ~/.agents/skills
ln -sf ~/.gemini/antigravity/skills ~/.agent/skills/awf
ln -sf ~/.gemini/antigravity/skills ~/.agents/skills/awf
rm -rf /tmp/awf`
  };

  function copyCode(type) {
    navigator.clipboard.writeText(installScripts[type]).then(() => {
      const panel = document.getElementById('tab-' + type);
      const btn = panel.querySelector('.copy-btn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    });
  }
