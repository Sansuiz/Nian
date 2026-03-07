class NianApp {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.viewMode = 'year';
        this.data = { anniversaries: [], notes: [] };
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderYearView();
        this.updateCornerInfo();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            const annivResponse = await fetch('/assets/data/anniversaries.yml');
            if (annivResponse.ok) {
                const annivText = await annivResponse.text();
                this.data.anniversaries = jsyaml.load(annivText) || [];
            }
        } catch (e) {
            console.log('anniversaries.yml 未找到，使用默认数据');
        }

        try {
            const notesResponse = await fetch('/assets/data/notes.yml');
            if (notesResponse.ok) {
                const notesText = await notesResponse.text();
                this.data.notes = jsyaml.load(notesText) || [];
            }
        } catch (e) {
            console.log('notes.yml 未找到，使用默认数据');
        }
    }

    getDaysInYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 366 : 365;
    }

    getDateFromDayOfYear(year, dayOfYear) {
        const date = new Date(year, 0, 1);
        date.setDate(date.getDate() + dayOfYear - 1);
        return date;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDateDisplay(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[date.getDay()];
        return `${month}月${day}日 ${weekday}`;
    }

    getDataForDate(dateStr) {
        const anniversary = this.data.anniversaries.find(a => a.date === dateStr);
        const note = this.data.notes.find(n => n.date === dateStr);
        
        if (anniversary && note) {
            return {
                type: 'both',
                title: anniversary.title || note.title,
                content: (anniversary.content || '') + '\n\n' + (note.content || ''),
                mood: anniversary.mood || note.mood,
                style: anniversary.style || note.style
            };
        } else if (anniversary) {
            return {
                type: 'anniversary',
                title: anniversary.title,
                content: anniversary.content,
                mood: anniversary.mood,
                style: anniversary.style
            };
        } else if (note) {
            return {
                type: 'note',
                title: note.title,
                content: note.content,
                mood: note.mood,
                style: note.style
            };
        }
        return null;
    }

    renderYearView() {
        const container = document.getElementById('dotsContainer');
        container.innerHTML = '';
        container.className = 'dots-container';
        
        const daysInYear = this.getDaysInYear(this.currentYear);
        const cols = Math.ceil(Math.sqrt(daysInYear));
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let day = 1; day <= daysInYear; day++) {
            const date = this.getDateFromDayOfYear(this.currentYear, day);
            const dateStr = this.formatDate(date);
            const data = this.getDataForDate(dateStr);
            
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.date = dateStr;
            dot.dataset.day = day;
            
            if (data) {
                dot.classList.add('has-content');
                if (data.style) {
                    dot.classList.add(`style-${data.style}`);
                }
                
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = data.title || this.formatDateDisplay(date);
                dot.appendChild(tooltip);
            }
            
            dot.addEventListener('click', () => this.openCard(dateStr));
            dot.addEventListener('mouseenter', (e) => this.onDotHover(e, date));
            
            container.appendChild(dot);
        }
    }

    renderMonthView(month) {
        const container = document.getElementById('dotsContainer');
        container.innerHTML = '';
        container.className = 'dots-container month-grid';
        
        const daysInMonth = new Date(this.currentYear, month + 1, 0).getDate();
        const firstDay = new Date(this.currentYear, month, 1).getDay();
        
        container.style.gridTemplateColumns = 'repeat(7, 1fr)';
        
        const monthLabel = document.createElement('div');
        monthLabel.className = 'month-label';
        monthLabel.textContent = `${this.currentYear}年 ${month + 1}月`;
        container.appendChild(monthLabel);
        
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const weekdayEl = document.createElement('div');
            weekdayEl.className = 'weekday';
            weekdayEl.textContent = day;
            weekdayEl.style.color = 'rgba(255,255,255,0.6)';
            weekdayEl.style.fontSize = '12px';
            weekdayEl.style.textAlign = 'center';
            container.appendChild(weekdayEl);
        });
        
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'dot';
            empty.style.visibility = 'hidden';
            container.appendChild(empty);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, month, day);
            const dateStr = this.formatDate(date);
            const data = this.getDataForDate(dateStr);
            
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.date = dateStr;
            
            if (data) {
                dot.classList.add('has-content');
                if (data.style) {
                    dot.classList.add(`style-${data.style}`);
                }
                
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = data.title || this.formatDateDisplay(date);
                dot.appendChild(tooltip);
            }
            
            dot.addEventListener('click', () => this.openCard(dateStr));
            dot.addEventListener('mouseenter', (e) => this.onDotHover(e, date));
            
            container.appendChild(dot);
        }
    }

    onDotHover(e, date) {
    }

    openCard(dateStr) {
        const data = this.getDataForDate(dateStr);
        if (!data) return;
        
        const date = new Date(dateStr);
        const modal = document.getElementById('cardModal');
        const content = document.getElementById('cardContent');
        
        const typeLabels = {
            anniversary: '纪念日',
            note: '笔记',
            both: '纪念日 & 笔记'
        };
        
        const moodLabels = {
            love: '💕 爱意满满',
            happy: '😊 开心',
            sad: '😢 伤感',
            excited: '🎉 激动',
            peaceful: '🌿 平静'
        };
        
        content.innerHTML = `
            <button class="card-close" onclick="app.closeCard()">&times;</button>
            <div class="card-date">${this.formatDateDisplay(date)}</div>
            <div class="card-title">${data.title || ''}</div>
            <div class="card-type">${typeLabels[data.type]}</div>
            ${data.content ? `<div class="card-content-text">${data.content}</div>` : ''}
            ${data.mood ? `
                <div class="card-mood">
                    <div class="card-mood-label">心情</div>
                    <div class="card-mood-value">${moodLabels[data.mood] || data.mood}</div>
                </div>
            ` : ''}
        `;
        
        modal.classList.add('active');
    }

    closeCard() {
        const modal = document.getElementById('cardModal');
        modal.classList.remove('active');
    }

    updateCornerInfo() {
        const yearInfo = document.getElementById('yearInfo');
        const statsInfo = document.getElementById('statsInfo');
        
        yearInfo.textContent = this.currentYear;
        
        const totalContent = this.data.anniversaries.length + this.data.notes.length;
        const daysInYear = this.getDaysInYear(this.currentYear);
        
        statsInfo.innerHTML = `
            <div class="stat-item">
                有记忆的日子
                <span class="stat-value">${totalContent}</span>
            </div>
            <div class="stat-item">
                纪念日
                <span class="stat-value">${this.data.anniversaries.length}</span>
            </div>
            <div class="stat-item">
                笔记
                <span class="stat-value">${this.data.notes.length}</span>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('cardModal').addEventListener('click', (e) => {
            if (e.target.id === 'cardModal') {
                this.closeCard();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCard();
            }
        });
        
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        }, { passive: false });
    }

    zoomIn() {
        if (this.viewMode === 'year') {
            const currentMonth = new Date().getMonth();
            this.viewMode = 'month';
            this.renderMonthView(currentMonth);
        }
    }

    zoomOut() {
        if (this.viewMode === 'month') {
            this.viewMode = 'year';
            this.renderYearView();
        }
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new NianApp();
});
