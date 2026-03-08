let collection = [];
let currentCategory = 'all';
let currentPage = 0;
let cardsPerPage = 3;

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
    currentPage = 0;
    updateCardsPerPage();
    renderCollection();
}

function updateCardsPerPage() {
    const width = window.innerWidth;
    if (width < 768) {
        cardsPerPage = 1;
    } else if (width < 1100) {
        cardsPerPage = 2;
    } else {
        cardsPerPage = 3;
    }
}

function renderCollection() {
    const container = document.getElementById('collection-cards');
    const filtered = currentCategory === 'all' 
        ? collection 
        : collection.filter(item => item.category === currentCategory);
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px;">
                <div style="text-align: center;">
                    <div style="font-size: 5rem; margin-bottom: 20px;">🎁</div>
                    <p style="color: var(--text-muted); font-size: 1.3rem;">暂无此类藏品</p>
                </div>
            </div>
        `;
        updatePageIndicator(filtered.length);
        updateNavButtons(filtered.length);
        return;
    }
    
    container.innerHTML = filtered.map((item, index) => createCard(item, index)).join('');
    
    document.querySelectorAll('.collection-card').forEach((card, index) => {
        card.addEventListener('click', () => openModal(filtered[index]));
    });
    
    updatePageIndicator(filtered.length);
    updateNavButtons(filtered.length);
    scrollToPage();
}

function createCard(item, index) {
    const categoryClass = `category-${item.category}`;
    const rarityClass = `rarity-${item.rarity}`;
    
    const imageContent = item.imageUrl 
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="card-image">`
        : `<div class="card-image">${item.image}</div>`;
    
    return `
        <div class="collection-card" style="--delay: ${index * 0.1}s;">
            <div class="card-face">
                ${imageContent}
                <div class="card-content">
                    <span class="card-category ${categoryClass}">${categoryLabels[item.category]}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-footer">
                        <span class="card-date">${item.date}</span>
                        <span class="card-rarity ${rarityClass}">${rarityLabels[item.rarity]}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updatePageIndicator(totalItems) {
    const indicator = document.getElementById('pageIndicator');
    const totalPages = Math.ceil(totalItems / cardsPerPage);
    
    if (totalPages <= 1) {
        indicator.innerHTML = '';
        return;
    }
    
    let dots = '';
    for (let i = 0; i < totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        dots += `<div class="page-dot ${activeClass}" data-page="${i}"></div>`;
    }
    
    indicator.innerHTML = dots;
    
    document.querySelectorAll('.page-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentPage = parseInt(dot.dataset.page);
            scrollToPage();
            updatePageIndicator(totalItems);
            updateNavButtons(totalItems);
        });
    });
}

function updateNavButtons(totalItems) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalPages = Math.ceil(totalItems / cardsPerPage);
    
    prevBtn.disabled = currentPage <= 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
}

function scrollToPage() {
    const container = document.getElementById('collection-cards');
    const cardWidth = 320 + 30; 
    const offset = currentPage * cardWidth * cardsPerPage;
    container.style.transform = `translateX(-${offset}px)`;
    
    const filtered = currentCategory === 'all' 
        ? collection 
        : collection.filter(item => item.category === currentCategory);
    updatePageIndicator(filtered.length);
    updateNavButtons(filtered.length);
}

function openModal(item) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
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
    
    modalContent.innerHTML = `
        ${imageContent}
        <div class="modal-body">
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
    
    document.querySelectorAll('.planet').forEach(planet => {
        planet.addEventListener('click', () => {
            document.querySelectorAll('.planet').forEach(p => p.classList.remove('active'));
            planet.classList.add('active');
            currentCategory = planet.dataset.category;
            currentPage = 0;
            renderCollection();
        });
    });
    
    document.getElementById('prevBtn').addEventListener('click', () => {
        const filtered = currentCategory === 'all' 
            ? collection 
            : collection.filter(item => item.category === currentCategory);
        const totalPages = Math.ceil(filtered.length / cardsPerPage);
        
        if (currentPage > 0) {
            currentPage--;
            scrollToPage();
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        const filtered = currentCategory === 'all' 
            ? collection 
            : collection.filter(item => item.category === currentCategory);
        const totalPages = Math.ceil(filtered.length / cardsPerPage);
        
        if (currentPage < totalPages - 1) {
            currentPage++;
            scrollToPage();
        }
    });
    
    document.getElementById('modalClose').addEventListener('click', closeModal);
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'ArrowLeft') {
            document.getElementById('prevBtn').click();
        }
        if (e.key === 'ArrowRight') {
            document.getElementById('nextBtn').click();
        }
    });
    
    window.addEventListener('resize', () => {
        updateCardsPerPage();
        currentPage = 0;
        renderCollection();
    });
});
