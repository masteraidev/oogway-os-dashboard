// Agent management for OOGWAY OS
const agents = [
    { id: 'master-oogway', name: 'Master Oogway', status: 'online', color: '#ffd700' },
    { id: 'agentmail', name: 'AgentMail', status: 'online', color: '#00ffff' },
    { id: 'web-scraper', name: 'Web Scraper', status: 'online', color: '#ff00ff' },
    { id: 'elevenlabs', name: 'ElevenLabs', status: 'online', color: '#ff6600' },
    { id: 'autopilot', name: 'AutoPilot', status: 'online', color: '#00ff00' },
    { id: 'github', name: 'GitHub', status: 'online', color: '#ffffff' },
    { id: 'adaptlypost', name: 'AdaptlyPost', status: 'online', color: '#ff0066' },
    { id: 'self-improve', name: 'Self-Improve', status: 'online', color: '#9d4edd' }
];

const activityLogs = {};

export function initAgents() {
    const agentList = document.getElementById('agent-list');
    
    agents.forEach(agent => {
        // Initialize activity log
        activityLogs[agent.id] = [];
        
        // Create agent item
        const item = document.createElement('div');
        item.className = `agent-item agent-${agent.id}`;
        item.dataset.agentId = agent.id;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = agent.name;
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `agent-status ${agent.status === 'online' ? '' : 'offline'}`;
        
        item.appendChild(nameSpan);
        item.appendChild(statusDiv);
        
        // Click handler
        item.addEventListener('click', () => openAgentDrawer(agent));
        
        agentList.appendChild(item);
        
        // Simulate initial activity
        addActivity(agent.id, `${agent.name} initialized and ready`);
    });
    
    // Update agents live count
    updateAgentsLiveCount();
}

function openAgentDrawer(agent) {
    const drawer = document.getElementById('agent-drawer');
    const title = document.getElementById('drawer-title');
    const content = document.getElementById('drawer-content');
    
    title.textContent = agent.name;
    title.style.color = agent.color;
    
    // Clear and populate content
    content.innerHTML = '';
    activityLogs[agent.id].forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${log.time}] ${log.message}`;
        logEntry.style.color = agent.color;
        content.appendChild(logEntry);
    });
    
    drawer.classList.add('open');
    
    // Highlight selected agent
    document.querySelectorAll('.agent-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.agentId === agent.id) {
            item.classList.add('active');
        }
    });
}

export function addActivity(agentId, message) {
    const time = new Date().toLocaleTimeString();
    activityLogs[agentId].push({ time, message });
    
    // Keep only last 50 entries
    if (activityLogs[agentId].length > 50) {
        activityLogs[agentId].shift();
    }
    
    // If drawer is open for this agent, update it
    const drawer = document.getElementById('agent-drawer');
    if (drawer.classList.contains('open')) {
        const title = document.getElementById('drawer-title');
        const currentAgent = agents.find(a => a.name === title.textContent);
        if (currentAgent && currentAgent.id === agentId) {
            const content = document.getElementById('drawer-content');
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${time}] ${message}`;
            logEntry.style.color = currentAgent.color;
            content.appendChild(logEntry);
            content.scrollTop = content.scrollHeight;
        }
    }
}

export function updateAgentStatus(agentId, status) {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
        agent.status = status;
        const item = document.querySelector(`[data-agent-id="${agentId}"]`);
        if (item) {
            const statusDiv = item.querySelector('.agent-status');
            statusDiv.className = `agent-status ${status === 'online' ? '' : 'offline'}`;
        }
        updateAgentsLiveCount();
    }
}

function updateAgentsLiveCount() {
    const liveCount = agents.filter(a => a.status === 'online').length;
    document.getElementById('agents-live').textContent = liveCount;
}

// Simulate random agent activity
setInterval(() => {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const activities = [
        'Processing task queue',
        'Scanning for updates',
        'Monitoring system',
        'Performing self-check',
        'Syncing with cloud',
        'Analyzing data stream'
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    addActivity(randomAgent.id, activity);
}, 5000);