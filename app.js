let collection = [];
let currentCategory = 'all';

const rarityLabels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
};

const categoryLabels = {
    blindbox: '盲盒',
    diecast: '合金车',
    card: '卡片'
};

async function loadYAMLFile(filename) {
    try {
        const response = await fetch(`data/${filename}`);
        if (!response.ok) return [];
        const text = await response.text();
        return jsyaml.load(text) || [];
    } catch (e) {
        console.error(`Error loading ${filename}:`, e);
        return [];
    }
}

async function loadCollection() {
    const [blindboxes, diecast, cards] = await Promise.all([
        loadYAMLFile('blindboxes.yml'),
        loadYAMLFile('diecast.yml'),
        loadYAMLFile('cards.yml')
    ]);
    
    collection = [...blindboxes, ...diecast, ...cards];
    renderCollection();
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    const filtered = currentCategory === 'all' 
        ? collection 
        : collection.filter(item => item.category === currentCategory);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🎁</div>
                <p style="color: var(--text-muted); font-size: 1.2rem;">暂无此类藏品</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map((item, index) => createCard(item, index)).join('');
    
    document.querySelectorAll('.item-card').forEach((card, index) => {
        card.addEventListener('click', () => openModal(filtered[index]));
    });
}

function createCard(item, index) {
    const categoryClass = `category-${item.category}`;
    const rarityClass = `rarity-${item.rarity}`;
    
    const imageContent = item.imageUrl 
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="item-image">`
        : `<div class="item-image">${item.image}</div>`;
    
    return `
        <div class="item-card" style="animation: fadeIn 0.5s ease ${index * 0.1}s forwards; opacity: 0;">
            ${imageContent}
            <div class="item-content">
                <span class="item-category ${categoryClass}">${categoryLabels[item.category]}</span>
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <span class="item-date">${item.date}</span>
                    <span class="item-rarity ${rarityClass}">${rarityLabels[item.rarity]}</span>
                </div>
            </div>
        </div>
    `;
}

function openModal(item) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    const imageContent = item.imageUrl 
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="modal-image">`
        : `<div class="modal-image">${item.image}</div>`;
    
    let details = `
        <div class="detail-row">
            <span class="detail-label">分类</span>
            <span class="detail-value">${categoryLabels[item.category]}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">稀有度</span>
            <span class="detail-value">${rarityLabels[item.rarity]}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">品牌</span>
            <span class="detail-value">${item.brand}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">入手日期</span>
            <span class="detail-value">${item.date}</span>
        </div>
    `;
    
    if (item.series) {
        details += `
            <div class="detail-row">
                <span class="detail-label">系列</span>
                <span class="detail-value">${item.series}</span>
            </div>
        `;
    }
    
    if (item.model) {
        details += `
            <div class="detail-row">
                <span class="detail-label">型号</span>
                <span class="detail-value">${item.model}</span>
            </div>
        `;
    }
    
    if (item.scale) {
        details += `
            <div class="detail-row">
                <span class="detail-label">比例</span>
                <span class="detail-value">${item.scale}</span>
            </div>
        `;
    }
    
    if (item.set) {
        details += `
            <div class="detail-row">
                <span class="detail-label">卡包</span>
                <span class="detail-value">${item.set}</span>
            </div>
        `;
    }
    
    if (item.type) {
        details += `
            <div class="detail-row">
                <span class="detail-label">类型</span>
                <span class="detail-value">${item.type}</span>
            </div>
        `;
    }
    
    if (item.notes) {
        details += `
            <div class="detail-row">
                <span class="detail-label">备注</span>
                <span class="detail-value">${item.notes}</span>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        ${imageContent}
        <div class="modal-body-content">
            <h2 class="modal-title">${item.title}</h2>
            <p class="modal-description">${item.description}</p>
            <div class="modal-details">
                ${details}
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCollection();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderCollection();
        });
    });
    
    document.querySelector('.close').addEventListener('click', closeModal);
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
