let collection = [];
let currentCategory = 'all';
let modalMoveListener = null;

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
        if (!response.ok) {
            console.warn(`File not found: data/${filename}`);
            return [];
        }
        const text = await response.text();
        const data = jsyaml.load(text);
        return data || [];
    } catch (e) {
        console.error(`Error loading ${filename}:`, e);
        return [];
    }
}

async function loadAllData() {
    const grid = document.getElementById('collection-grid');
    
    try {
        const [blindboxes, diecast, cards] = await Promise.all([
            loadYAMLFile('blindboxes.yml'),
            loadYAMLFile('diecast.yml'),
            loadYAMLFile('cards.yml')
        ]);
        
        collection = [...blindboxes, ...diecast, ...cards];
        console.log('Loaded items:', collection.length);
        renderCollection();
    } catch (error) {
        console.error('Error loading data:', error);
        grid.innerHTML = `
            <div class="empty-state">
                <div class="emoji">❌</div>
                <p>数据加载失败，请检查控制台</p>
            </div>
        `;
    }
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    
    let filtered = collection;
    if (currentCategory !== 'all') {
        filtered = collection.filter(item => item.category === currentCategory);
    }
    
    console.log('Showing', filtered.length, 'items for category', currentCategory);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="emoji">🎁</div>
                <p>暂无此类藏品</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map((item, index) => createCard(item, index)).join('');
    
    document.querySelectorAll('.item-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(filtered[index]);
        });
        
        card.addEventListener('mousemove', (e) => handleCardMouseMove(e, card));
        card.addEventListener('mouseleave', () => handleCardMouseLeave(card));
        card.addEventListener('mouseenter', () => handleCardMouseEnter(card));
    });
}

function handleCardMouseEnter(card) {
    card.style.transition = 'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.3s ease';
}

function handleCardMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    const shine = card.querySelector('.card-shine');
    if (shine) {
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.setProperty('--shine-x', `${shineX}%`);
        shine.style.setProperty('--shine-y', `${shineY + 20}%`);
    }
    
    card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(8px)
        scale(1.01)
    `;
}

function handleCardMouseLeave(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
}

function createCard(item, index) {
    const categoryClass = `category-${item.category}`;
    const rarityClass = `rarity-${item.rarity}`;
    
    let imageHtml = '';
    if (item.imageUrl) {
        imageHtml = `<img src="${item.imageUrl}" alt="${item.title}" class="item-image">`;
    } else {
        imageHtml = `<div class="item-image">${item.image || '🎁'}</div>`;
    }
    
    return `
        <div class="item-card card-rarity-${item.rarity}" style="animation: fadeIn 0.5s ease ${index * 0.1}s forwards; opacity: 0;">
            <div class="card-shine"></div>
            <div class="item-rarity ${rarityClass}">
                <span class="rarity-icon"></span>
                <span class="rarity-text">${rarityLabels[item.rarity]}</span>
            </div>
            ${imageHtml}
            <div class="item-content">
                <span class="item-category ${categoryClass}">${categoryLabels[item.category]}</span>
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <span class="item-date">${item.date}</span>
                </div>
            </div>
        </div>
    `;
}

function openModal(item) {
    const modal = document.getElementById('modal');
    const modalWrapper = modal.querySelector('.modal-wrapper');
    const modalContent = document.getElementById('modal-content');
    const modalBody = document.getElementById('modal-body');
    
    modalWrapper.className = 'modal-wrapper';
    modalWrapper.classList.add(`modal-${item.rarity}`);
    
    let imageHtml = '';
    if (item.imageUrl) {
        imageHtml = `<img src="${item.imageUrl}" alt="${item.title}" class="modal-image">`;
    } else {
        imageHtml = `<div class="modal-image">${item.image || '🎁'}</div>`;
    }
    
    let detailsHtml = '';
    
    detailsHtml += createDetailRow('分类', categoryLabels[item.category]);
    detailsHtml += createDetailRow('稀有度', rarityLabels[item.rarity]);
    
    if (item.brand) {
        detailsHtml += createDetailRow('品牌', item.brand);
    }
    
    detailsHtml += createDetailRow('入手日期', item.date);
    
    if (item.series) {
        detailsHtml += createDetailRow('系列', item.series);
    }
    
    if (item.model) {
        detailsHtml += createDetailRow('型号', item.model);
    }
    
    if (item.scale) {
        detailsHtml += createDetailRow('比例', item.scale);
    }
    
    if (item.set) {
        detailsHtml += createDetailRow('卡包', item.set);
    }
    
    if (item.type) {
        detailsHtml += createDetailRow('类型', item.type);
    }
    
    if (item.notes) {
        detailsHtml += createDetailRow('备注', item.notes);
    }
    
    modalBody.innerHTML = `
        ${imageHtml}
        <div class="modal-body-content">
            <h2 class="modal-title">${item.title}</h2>
            <p class="modal-description">${item.description}</p>
            <div class="modal-details">
                ${detailsHtml}
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    modalWrapper.classList.add('show-glow');
    
    modalMoveListener = (e) => handleModalMouseMove(e);
    modalWrapper.addEventListener('mousemove', modalMoveListener);
}

function handleModalMouseMove(e) {
    const modalWrapper = document.querySelector('.modal-wrapper');
    const glow = modalWrapper.querySelector('.modal-glow');
    
    const rect = modalWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glow.style.setProperty('--glow-x', `${x}px`);
    glow.style.setProperty('--glow-y', `${y}px`);
}

function createDetailRow(label, value) {
    return `
        <div class="detail-row">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

function closeModal() {
    const modal = document.getElementById('modal');
    const modalWrapper = modal.querySelector('.modal-wrapper');
    
    if (modalMoveListener) {
        modalWrapper.removeEventListener('mousemove', modalMoveListener);
        modalMoveListener = null;
    }
    
    modal.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    loadAllData();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            console.log('Category changed to:', currentCategory);
            renderCollection();
        });
    });
    
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
