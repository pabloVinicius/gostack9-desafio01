const express = require('express');

const server = express();

const projects = [];
let requestsNumber = 0;

server.use(express.json());

server.use((req, res, next) => {
    requestsNumber += 1;

    console.log('Number of current requisitions: ', requestsNumber);

    return next();
})

function verifyProjectExistence(req, res, next) {
    const { id } = req.params;

    const projectIndex = projects.findIndex(el => el.id === id);

    if(projectIndex !== -1) {
        req.projectIndex = projectIndex;
        req.project = projects[projectIndex];

        return next();
    }

    return res.status(404).json({ error: 'This project does not exists'});
}

function verifySameIndex(req, res, next) {
    const { id } = req.body;

    const projectIndex = projects.findIndex(el => el.id === id);
    if(projectIndex !== -1) {
        
        return res.status(400).json({ error: 'Project index must be unique.'});
    }
    return next();

}

server.post('/projects', verifySameIndex, (req, res) => {
    const { id, title } = req.body;

    projects.push({ id, title, tasks: [] });

    return res.json(projects);
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', verifyProjectExistence, (req, res) => {
    const { title } = req.body;
    const { projectIndex, project } = req;

    projects[projectIndex] = {...project, title };

    return res.json(projects);
});

server.delete('/projects/:id', verifyProjectExistence, (req, res) => {
    const { projectIndex } = req;

    projects.splice(projectIndex, 1);

    return res.json({message: 'Deleted'});
});

server.post('/projects/:id/tasks', verifyProjectExistence, (req, res) => {
    const { title } = req.body;
    const { project } = req;

    project.tasks.push(title);
    return res.json(projects);

})

server.listen(3000);