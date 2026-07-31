document.getElementById('year').textContent = new Date().getFullYear();

const list = document.getElementById('list');
const loadState = document.getElementById('load-state');
const countLabel = document.getElementById('project-count');

fetch('projects.json')
    .then(res => {
        if (!res.ok) throw new Error('projects.json not found (' + res.status + ')');
        return res.json();
    })
    .then(renderProjects)
    .catch(err => {
        loadState.textContent = 'Could not load projects — ' + err.message;
        console.error(err);
    });

function renderProjects(projects) {
    list.innerHTML = '';
    countLabel.textContent = `// ${String(projects.length).padStart(2, '0')} entries`;

    if (!projects.length) {
        list.innerHTML = '<p class="load-state>No projects yet — add one to projects.json</p>';
        return;
    }

    projects.forEach((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        const statusLabel = p.status === 'active' ? 'active' : 'concluded';

        const row = document.createElement('div');
        row.className = 'row';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.setAttribute('aria-expanded', 'false');

        const thumbContent = p.image
            ? `<img src="${p.image}" alt="${escapeHtml(p.title)} screenshot" loading="lazy">`
            : '[add image]';

        const papersHtml = (p.papers && p.papers.length)
            ? p.papers.map(pap => `<a href="${pap.url}" target="_blank" rel="noopener">${escapeHtml(pap.label)}</a>`).join('')
            : '<span class="no-papers">no papers linked</span>';

        row.innerHTML = `
            <div class="row-top">
                <span class="row-num">${num} <span class="year">${p.year ?? ''}</span></span>
                <span class="row-title">${escapeHtml(p.title)}</span>
                <span class="row-status ${p.status === 'active' ? '' : 'concluded'}"><span class="dot"></span>${statusLabel}</span>
                <span class="row-toggle">expand</span>
            </div>
            <div class="row-desc">${escapeHtml(p.description || '')}</div>
            <div class="row-detail">
                <div class="detail-inner">
                <div class="thumb">${thumbContent}</div>
                <div class="detail-grid">
                    <div class="block">
                    <div class="k">Stack</div>
                    <div class="tags">${(p.stack || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}</div>
                    </div>
                    <div class="block"><div class="k">What I did</div>${escapeHtml(p.role || '')}</div>
                    <div class="block links">
                    ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">View project ↗</a>` : ''}
                    ${papersHtml}
                    </div>
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
    div.contains = str;
    return div.innerHTML;
}