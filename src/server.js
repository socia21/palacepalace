import express from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDirectory = process.env.DATA_DIR || path.join(projectRoot, 'data');
const dataFile = path.join(dataDirectory, 'projects.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(projectRoot, 'public')));

async function getProjects() {
  try { return JSON.parse(await fs.readFile(dataFile, 'utf8')); }
  catch { return []; }
}
async function saveProjects(projects) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));
}

app.get('/api/health', (_, response) => response.json({ ok: true, service: 'palace-designer', timestamp: new Date().toISOString() }));
app.get('/api/projects', async (_, response, next) => { try { response.json(await getProjects()); } catch (error) { next(error); } });
app.post('/api/projects', async (request, response, next) => {
  try {
    const { name = 'Untitled Palace', design = {} } = request.body || {};
    if (typeof name !== 'string' || name.length > 80) return response.status(400).json({ error: 'A valid project name is required.' });
    const projects = await getProjects();
    const project = { id: crypto.randomUUID(), name: name.trim() || 'Untitled Palace', design, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    projects.unshift(project); await saveProjects(projects.slice(0, 100)); response.status(201).json(project);
  } catch (error) { next(error); }
});
app.put('/api/projects/:id', async (request, response, next) => {
  try {
    const projects = await getProjects(); const index = projects.findIndex(project => project.id === request.params.id);
    if (index < 0) return response.status(404).json({ error: 'Project not found.' });
    const { name, design } = request.body || {};
    if (name !== undefined && (typeof name !== 'string' || name.length > 80)) return response.status(400).json({ error: 'Invalid name.' });
    projects[index] = { ...projects[index], ...(name !== undefined ? { name: name.trim() || 'Untitled Palace' } : {}), ...(design !== undefined ? { design } : {}), updatedAt: new Date().toISOString() };
    await saveProjects(projects); response.json(projects[index]);
  } catch (error) { next(error); }
});
app.delete('/api/projects/:id', async (request, response, next) => {
  try { const projects = await getProjects(); const remaining = projects.filter(project => project.id !== request.params.id); await saveProjects(remaining); response.status(remaining.length === projects.length ? 404 : 204).end(); }
  catch (error) { next(error); }
});
app.use((error, _, response, __) => { console.error(error); response.status(500).json({ error: 'The studio could not save that change.' }); });

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Palace Designer listening on ${port}`));
