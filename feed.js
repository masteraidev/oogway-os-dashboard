// Live feed system for OOGWAY OS
const feedContainer = document.getElementById('feed-container');

export function initFeed() {
    // Initial feed items
    addFeedItem('OOGWAY OS initialized', 'master-oogway', 'success');
    addFeedItem('All agents online', 'master-oogway', 'success');
    addFeedItem('3D scene ready', 'master-oogway', 'info');
}

export function addFeedItem(message, agentId, type = 'info') {
    const agentColors = {
        'master-oogway': '#ffd700',
        'agentmail': '#00ffff',
        'web-scraper': '#ff00ff',
        'elevenlabs': '#ff6600',
        'autopilot': '#00ff00',
        'github': '#ffffff',
        'adaptlypost': '#ff0066',
        'self-improve': '#9d4edd'
    };
    
    const color = agentColors[agentId] || '#ffffff';
    
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.style.borderColor = color;
    item.style.color = color;
    
    const timestamp = new Date().toLocaleTimeString();
    item.innerHTML = `<span style="opacity: 0.7;">[${timestamp}]</span> ${message}`;
    
    feedContainer.appendChild(item);
    feedContainer.scrollTop = feedContainer.scrollHeight;
    
    // Remove old items to prevent memory issues
    while (feedContainer.children.length > 100) {
        feedContainer.removeChild(feedContainer.firstChild);
    }
}

// Simulate realistic feed events
setInterval(() => {
    const events = [
        { message: 'Revenue stream updated', agent: 'master-oogway', type: 'success' },
        { message: 'Email processed', agent: 'agentmail', type: 'info' },
        { message: 'Data extracted', agent: 'web-scraper', type: 'success' },
        { message: 'Voice synthesis completed', agent: 'elevenlabs', type: 'info' },
        { message: 'Workflow executed', agent: 'autopilot', type: 'info' },
        { message: 'Code committed', agent: 'github', type: 'success' },
        { message: 'Post published', agent: 'adaptlypost', type: 'info' },
        { message: 'Self-audit completed', agent: 'self-improve', type: 'success' }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    addFeedItem(event.message, event.agent, event.type);
}, 8000);