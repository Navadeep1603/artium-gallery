const fs = require('fs');
const path = require('path');

const css = `
/* =========================================
   Artist Dashboard V2 Sidebar Layout
   ========================================= */

.artist-dashboard-v2 {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
}

@media (max-width: 1024px) {
    .artist-dashboard-v2 {
        flex-direction: column;
    }
}

.dashboard__sidebar {
    width: 280px;
    flex-shrink: 0;
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    position: sticky;
    top: 100px;
}

@media (max-width: 1024px) {
    .dashboard__sidebar {
        width: 100%;
        position: static;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2rem;
        align-items: center;
        padding: var(--space-4);
    }
}

@media (max-width: 768px) {
    .dashboard__sidebar {
        grid-template-columns: 1fr;
        text-align: center;
    }
}

.sidebar__profile {
    text-align: center;
    margin-bottom: var(--space-8);
}

@media (max-width: 1024px) {
    .sidebar__profile {
        margin-bottom: 0;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
}

@media (max-width: 768px) {
    .sidebar__profile {
        flex-direction: column;
        text-align: center;
    }
}

.sidebar__avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 2px solid var(--gold);
    padding: 3px;
    margin: 0 auto var(--space-4);
    overflow: hidden;
}

@media (max-width: 1024px) {
    .sidebar__avatar {
        margin: 0;
        width: 64px;
        height: 64px;
    }
}

@media (max-width: 768px) {
    .sidebar__avatar {
        margin: 0 auto 1rem;
    }
}

.sidebar__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.sidebar__profile h3 {
    font-size: var(--text-xl);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
}

.sidebar__role {
    font-size: var(--text-sm);
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

@media (max-width: 1024px) {
    .sidebar__nav {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
    }
}

@media (max-width: 768px) {
    .sidebar__nav {
        justify-content: center;
    }
}

.sidebar__nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
}

@media (max-width: 1024px) {
    .sidebar__nav-item {
        width: auto;
    }
}

.sidebar__nav-item:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
}

.sidebar__nav-item.active {
    color: var(--gold);
    background: rgba(201, 169, 98, 0.1);
    box-shadow: inset 3px 0 0 var(--gold);
}

@media (max-width: 1024px) {
    .sidebar__nav-item.active {
        box-shadow: inset 0 -3px 0 var(--gold);
    }
}

.sidebar__footer {
    margin-top: var(--space-8);
    padding-top: var(--space-4);
    border-top: 1px solid var(--glass-border);
}

@media (max-width: 1024px) {
    .sidebar__footer {
        display: none;
    }
}

.dashboard__main-content {
    flex: 1;
    min-width: 0;
}

/* Edit Artwork Form */
.edit-artwork-form {
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
}

.edit-artwork-form input,
.edit-artwork-form textarea {
    background: var(--bg-primary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    padding: var(--space-3);
    color: var(--text-primary);
    font-family: var(--font-body);
    transition: border-color 0.3s ease;
}

.edit-artwork-form input:focus,
.edit-artwork-form textarea:focus {
    outline: none;
    border-color: var(--gold);
}

.edit-artwork-form label {
    display: block;
    margin-bottom: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.bg-tertiary {
    background: var(--bg-tertiary) !important;
}

/* Utilities for interaction list */
.message-list .message-item:hover {
    background: rgba(201, 169, 98, 0.05);
}
`;

const cssPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'Dashboard.css');
fs.appendFileSync(cssPath, css);
console.log('CSS appended successfully');
