// OOGWAY OS - Main entry point
import { initThreeScene, updateThreeScene } from './three-scene.js';
import { initAgents, updateAgentStatus } from './agents.js';
import { initFeed, addFeedItem } from './feed.js';

// Global state
const state = {
    tasks: 0,
    revenue: 0,
    startTime: Date.now(),
    agents: [],
    activeAgent: null
};

// Initialize everything
function init() {
    initThreeScene();
    initAgents();
    initFeed();
    initUI();
    startClock();
    startAutoFeed();
    updateMetrics();
}

// Setup UI elements and event listeners
function initUI() {
    // Close drawer button
    document.getElementById('close-drawer').addEventListener('click', () => {
        document.getElementById('agent-drawer').classList.remove('open');
    });
    
    // Deploy buttons
    const deployPanel = document.getElementById('deploy-buttons');
    const deployActions = [
        { name: 'Data Scrape', agent: 'web-scraper' },
        { name: 'Email Campaign', agent: 'agentmail' },
        { name: 'Voice Synthesis', agent: 'elevenlabs' },
        { name: 'Code Deploy', agent: 'github' },
        { name: 'Content Post', agent: 'adaptlypost' },
        { name: 'Self Audit', agent: 'self-improve' }
    ];
    
    deployActions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'deploy-btn';
        btn.textContent = action.name;
        btn.dataset.agent = action.agent;
        btn.addEventListener('click', () => startDeployWorkflow(action));
        deployPanel.appendChild(btn);
    });
}

// Start a deployment workflow
function startDeployWorkflow(action) {
    addFeedItem(`Starting ${action.name} workflow...`, action.agent, 'info');
    updateTasks(1);
    
    // Simulate multi-step workflow with progress
    const steps = ['Initializing...', 'Processing...', 'Validating...', 'Completing...'];
    let currentStep = 0;
    
    const btn = document.querySelector(`[data-agent="${action.agent}"]`);
    const progressBar = btn.querySelector('.progress-bar') || document.createElement('div');
    progressBar.className = 'progress-bar';
    btn.appendChild(progressBar);
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            addFeedItem(steps[currentStep], action.agent, 'info');
            progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            currentStep++;
        } else {
            clearInterval(interval);
            addFeedItem(`${action.name} completed successfully`, action.agent, 'success');
            updateRevenue(Math.floor(Math.random() * 500) + 100);
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 1000);
        }
    }, 800);
}

// Update task counter
function updateTasks(count) {
    state.tasks += count;
    document.getElementById('task-counter').textContent = state.tasks;
}

// Update revenue tracker
function updateRevenue(amount) {
    state.revenue += amount;
    document.getElementById('revenue-tracker').textContent = `R${state.revenue.toLocaleString()}`;
}

// Start uptime clock
function startClock() {
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('uptime-clock').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// Update metrics
function updateMetrics() {
    const liveCount = state.agents.filter(a => a.status === 'online').length;
    document.getElementById('agents-live').textContent = liveCount;
}

// Auto-generate feed events
function startAutoFeed() {
    setInterval(() => {
        const events = [
            { message: 'System check completed', agent: 'master-oogway', type: 'success' },
            { message: 'New email received', agent: 'agentmail', type: 'info' },
            { message: 'Scraping completed', agent: 'web-scraper', type: 'success' },
            { message: 'Voice synthesis ready', agent: 'elevenlabs', type: 'info' },
            { message: 'Auto-pilot engaged', agent: 'autopilot', type: 'info' },
            { message: 'GitHub sync complete', agent: 'github', type: 'success' },
            { message: 'Post scheduled', agent: 'adaptlypost', type: 'info' },
            { message: 'Self-improvement audit', agent: 'self-improve', type: 'success' }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        addFeedItem(event.message, event.agent, event.type);
        
        // Random revenue update
        if (Math.random() > 0.7) {
            updateRevenue(Math.floor(Math.random() * 200) + 50);
        }
    }, 10000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);