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
}