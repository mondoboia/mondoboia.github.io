document.getElementById('year').textContent = new Date().getFullYear();

// ---- Hero headline rotator — edit this list to change what cycles through ----
const rotatorWords = [
    "Linked Data systems",
    "cultural heritage infrastructures",
    "semantic data pipelines",
    "data storytelling tools"
];
const rotatorEl = document.getElementById('rotator');
if (rotatorEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let rIdx = 0;
    setInterval(() => {
        rotatorEl.classList.add('fade-out');
        setTimeout(() => {
            rIdx = (rIdx + 1) % rotatorWords.length;
            rotatorEl.textContent = rotatorWords[rIdx];
            rotatorEl.classList.remove('fade-out');
        }, 300);
    }, 2600);
}

const list = document.getElementById('list');
const loadState = document.getElementById('load-state');
const countLabel = document.getElementById('project-count');

fetch('projects.json?v=' + Date.now())
    .then(res => {
        if (!res.ok) throw new Error('projects.json not found (' + res.status + ')');
        return res.json();
    })
    .then(renderProjects)
    .catch(err => {
        loadState.textContent = 'Could not load projects.json — ' + err.message;
        console.error(err);
    });

function renderProjects(projects) {
    list.innerHTML = '';
    countLabel.textContent = `// ${String(projects.length).padStart(2, '0')} entries`;

    if (!projects.length) {
        list.innerHTML = '<p class="load-state">No projects yet — add one to projects.json.</p>';
        return;
    }

    projects.forEach((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        const validStatuses = ['active', 'maintained', 'completed'];
        const statusClass = validStatuses.includes(p.status) ? p.status : 'completed';

        const yearText = p.yearEnd
            ? `${p.year}–${p.yearEnd}`
            : (p.year ?? '');

        const row = document.createElement('div');
        row.className = 'row';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.setAttribute('aria-expanded', 'false');

        const thumbContent = p.image
            ? `<img src="${p.image}" alt="${escapeHtml(p.title)} screenshot" loading="lazy">`
            : '[add image]';

        const papersHtml = (p.papers && p.papers.length)
            ? p.papers.map(pap => `<a href="${pap.url}" target="_blank" rel="noopener"${pap.title ? ` title="${escapeHtml(pap.title)}"` : ''}>${escapeHtml(pap.label)}</a>`).join('')
            : '';

        row.innerHTML = `
      <div class="row-top">
        <span class="row-num">${num} <span class="year">${yearText}</span></span>
        <span class="row-title">${escapeHtml(p.title)}</span>
        <span class="row-status ${statusClass}"><span class="dot"></span>${statusClass}</span>
        <span class="row-toggle">expand</span>
      </div>
      <div class="row-desc">${escapeHtml(p.description || '')}</div>
      <div class="row-detail">
        <div class="detail-inner">
          <div class="thumb-col">
            <div class="thumb${p.image ? ' has-image' : ''}">${thumbContent}</div>
            ${p.link ? `<a class="view-project" href="${p.link}" target="_blank" rel="noopener">View project ↗</a>` : ''}
          </div>
          <div class="detail-grid">
            <div class="block">
              <div class="k">Stack</div>
              <div class="tags">${(p.stack || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}</div>
            </div>
            <div class="block"><div class="k">What I did</div>${escapeHtml(p.role || '')}</div>
            ${papersHtml ? `<div class="block links"><div class="k">References</div>${papersHtml}</div>` : ''}
          </div>
        </div>
      </div>
    `;

        const toggle = () => {
            const isOpen = row.classList.toggle('open');
            row.querySelector('.row-toggle').textContent = isOpen ? 'collapse' : 'expand';
            row.setAttribute('aria-expanded', String(isOpen));
        };

        row.addEventListener('click', toggle);
        row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        list.appendChild(row);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}