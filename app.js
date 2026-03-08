let collection = [];
let filteredCollection = [];
let currentCategory = 'all';
let currentIndex = 0;

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
    updateFilter();
}

function updateFilter() {
    filteredCollection = currentCategory === 'all' 
        ? collection 
        : collection.filter(item => item.category === currentCategory);
    
    currentIndex = 0;
    renderCarousel();
    renderIndicators();
    updateCount();
}

function renderCarousel() {
    const track = document.getElementById('carousel-track');
    
    if (filteredCollection.length === 0) {
        track.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎁</div>
                <p style="color: var(--text-muted); font-size: 1.3rem;">暂无此类藏品</p>
            </div>
        `;
        return;
    }
    
    const cards = [];
    for (let i = -2; i <= 2; i++) {
        const index = (currentIndex + i + filteredCollection.length) % filteredCollection.length;
        const item = filteredCollection[index];
        const positionClass = getPositionClass(i);
        
        cards.push(createCard(item, positionClass, index));
    }
    
    track.innerHTML = cards.join('');
    
    document.querySelectorAll('.carousel-card').forEach(card => {
        const index = parseInt(card.dataset.index);
        card.addEventListener('click', (e) => {
            if (card.classList.contains('card-0')) {
                openModal(filteredCollection[index]);
            } else {
                const diff = index - currentIndex;
                if (diff > 0) {
                    goTo(Math.min(currentIndex + diff, filteredCollection.length - 1));
                } else {
                    goTo(Math.max(currentIndex + diff, 0));
                }
            }
        });
    });
}

function getPositionClass(offset) {
    const absOffset = Math.abs(offset);
    if (absOffset === 0) return 'card-0';
    if (absOffset === 1) return offset > 0 ? 'card-1' : 'card-2';
    if (absOffset === 2) return offset > 0 ? 'card-3' : 'card-4';
    return 'hidden';
}

function createCard(item, positionClass, index) {
    const categoryClass = `category-${item.category}`;
    const rarityClass = `rarity-${item.rarity}`;
    
    const imageContent = item.imageUrl 
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="item-image">`
        : `<div class="item-image">${item.image}</div>`;
    
    return `
        <div class="carousel-card ${positionClass}" data-index="${index}">
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

function renderIndicators() {
    const container = document.getElementById('carousel-indicators');
    
    if (filteredCollection.length <= 1) {
        container.innerHTML = '';
        return;
    }
    
    const indicators = filteredCollection.map((_, index) => {
        const activeClass = index === currentIndex ? 'active' : '';
        return `<div class="indicator ${activeClass}" data-index="${index}"></div>`;
    });
    
    container.innerHTML = indicators.join('');
    
    container.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', () => {
            goTo(parseInt(indicator.dataset.index));
        });
    });
}

function updateCount() {
    const countEl = document.getElementById('collection-count');
    if (filteredCollection.length === 0) {
        countEl.textContent = '';
    } else {
        countEl.textContent = `${currentIndex + 1} / ${filteredCollection.length}`;
    }
}

function goTo(index) {
    if (filteredCollection.length === 0) return;
    
    currentIndex = (index + filteredCollection.length) % filteredCollection.length;
    renderCarousel();
    renderIndicators();
    updateCount();
}

function prev() {
    goTo(currentIndex - 1);
}

function next() {
    goTo(currentIndex + 1);
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
            updateFilter();
        });
    });
    
    document.getElementById('prev-btn').addEventListener('click', prev);
    document.getElementById('next-btn').addEventListener('click', next);
    
    document.querySelector('.close').addEventListener('click', closeModal);
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prev();
        } else if (e.key === 'ArrowRight') {
            next();
        }
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carouselContainer = document.querySelector('.carousel-container');
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                next();
            } else {
                prev();
            }
        }
    }
});
