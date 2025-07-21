// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "yks-tercih-takip.firebaseapp.com",
    databaseURL: "https://yks-tercih-takip-default-rtdb.firebaseio.com",
    projectId: "yks-tercih-takip",
    storageBucket: "yks-tercih-takip.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Global Variables
let currentPerson = 'semih';
let currentEditingId = null;
let preferences = {
    semih: [],
    sema: []
};
let dragMode = false;
let draggedElement = null;
let draggedIndex = -1;

// DOM Elements
const personButtons = document.querySelectorAll('.person-btn');
const preferenceForm = document.getElementById('preferenceForm');
const preferencesList = document.getElementById('preferencesList');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const loading = document.getElementById('loading');
const filterScoreType = document.getElementById('filterScoreType');
const filterPriority = document.getElementById('filterPriority');
const clearFiltersBtn = document.getElementById('clearFilters');
const connectionStatus = document.getElementById('connectionStatus');
const sortByRankBtn = document.getElementById('sortByRank');
const sortByScoreBtn = document.getElementById('sortByScore');
const enableDragModeBtn = document.getElementById('enableDragMode');
const addPreferenceBtn = document.getElementById('addPreferenceBtn');
const addModal = document.getElementById('addModal');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    showLoading();
    setupConnectionStatus();
    loadPreferences();
}

function setupEventListeners() {
    // Person selector
    personButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPerson = btn.dataset.person;
            updatePersonSelector();
            renderPreferences();
        });
    });

    // Form submission
    preferenceForm.addEventListener('submit', handleAddPreference);
    editForm.addEventListener('submit', handleEditPreference);

    // Filters
    filterScoreType.addEventListener('change', renderPreferences);
    filterPriority.addEventListener('change', renderPreferences);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Sorting and drag mode
    sortByRankBtn.addEventListener('click', () => sortPreferences('rank'));
    sortByScoreBtn.addEventListener('click', () => sortPreferences('score'));
    enableDragModeBtn.addEventListener('click', toggleDragMode);

    // Add preference modal
    addPreferenceBtn.addEventListener('click', openAddModal);

    // Modal close
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
        if (e.target === addModal) {
            closeAddModal();
        }
    });
}

// Firebase Functions
function loadPreferences() {
    const preferencesRef = database.ref('preferences');
    
    preferencesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            preferences = {
                semih: data.semih || [],
                sema: data.sema || []
            };
        } else {
            // Boş tercih listesi (ilk kullanımda)
            preferences = { semih: [], sema: [] };
        }
        hideLoading();
        renderPreferences();
    }, (error) => {
        console.error('Error loading preferences:', error);
        hideLoading();
        showNotification('Veriler yüklenirken hata oluştu', 'error');
        preferences = { semih: [], sema: [] };
        renderPreferences();
    });
}

function savePreferences() {
    const preferencesRef = database.ref('preferences');
    return preferencesRef.set(preferences);
}

function setupConnectionStatus() {
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Bağlı';
            connectionStatus.className = 'status-indicator connected';
        } else {
            connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Bağlantı Yok';
            connectionStatus.className = 'status-indicator disconnected';
        }
    });
}

// UI Functions
function updatePersonSelector() {
    personButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.person === currentPerson) {
            btn.classList.add('active');
        }
    });
}

function renderPreferences() {
    const currentPreferences = preferences[currentPerson];
    const filteredPreferences = filterPreferences(currentPreferences);
    
    preferencesList.innerHTML = '';
    
    if (filteredPreferences.length === 0) {
        preferencesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle" style="font-size: 3rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 1rem;"></i>
                <p style="color: rgba(255, 255, 255, 0.8); text-align: center; font-size: 1.1rem; margin-bottom: 0.5rem;">Henüz tercih eklenmemiş</p>
                <p style="color: rgba(255, 255, 255, 0.6); text-align: center; font-size: 0.9rem;">"Yeni Tercih Ekle" butonuna tıklayarak ilk tercihinizi ekleyin</p>
            </div>
        `;
        return;
    }
    
    filteredPreferences.forEach(preference => {
        const preferenceCard = createPreferenceCard(preference);
        preferencesList.appendChild(preferenceCard);
    });
}

function filterPreferences(preferences) {
    let filtered = [...preferences];
    
    const scoreTypeFilter = filterScoreType.value;
    const priorityFilter = filterPriority.value;
    
    if (scoreTypeFilter) {
        filtered = filtered.filter(p => p.scoreType === scoreTypeFilter);
    }
    
    if (priorityFilter !== '') {
        const isPriority = priorityFilter === 'true';
        filtered = filtered.filter(p => p.priority === isPriority);
    }
    
    return filtered;
}

function clearFilters() {
    filterScoreType.value = '';
    filterPriority.value = '';
    renderPreferences();
}

function createPreferenceCard(preference) {
    const card = document.createElement('div');
    card.className = `preference-card ${preference.priority ? 'priority' : ''}`;
    card.style.borderLeftColor = preference.color || '#667eea';
    card.dataset.id = preference.id;
    
    card.innerHTML = `
        <div class="drag-handle" title="Sürüklemek için tutun">
            <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="preference-header">
            <div class="preference-title">
                <h3>${preference.university}</h3>
                <p>${preference.department}</p>
            </div>
            <div class="preference-actions">
                <button class="action-btn priority-btn ${preference.priority ? 'active' : ''}" 
                        onclick="togglePriority('${preference.id}')" title="Öncelikli Tercih">
                    <i class="fas fa-star"></i>
                </button>
                <button class="action-btn" onclick="editPreference('${preference.id}')" title="Düzenle">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deletePreference('${preference.id}')" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="preference-details">
            <div class="detail-item">
                <span class="detail-label">Puan</span>
                <span class="detail-value">${preference.score}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Sıralama</span>
                <span class="detail-value">${preference.rank.toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Puan Türü</span>
                <span class="score-type ${preference.scoreType}">${preference.scoreType}</span>
            </div>
        </div>
        ${preference.notes ? `<div class="preference-notes">${preference.notes}</div>` : ''}
    `;
    
    // Add drag and drop functionality
    setupDragAndDrop(card, preference.id);
    
    return card;
}

// Form Handlers
function handleAddPreference(e) {
    e.preventDefault();
    
    const formData = new FormData(preferenceForm);
    const preference = {
        id: generateId(),
        university: formData.get('university'),
        department: formData.get('department'),
        score: parseFloat(formData.get('score')),
        rank: parseInt(formData.get('rank')),
        scoreType: formData.get('scoreType'),
        color: formData.get('color'),
        notes: formData.get('notes'),
        priority: formData.get('priority') === 'on',
        createdAt: Date.now()
    };
    
    preferences[currentPerson].push(preference);
    savePreferences().then(() => {
        closeAddModal();
        showNotification('Tercih başarıyla eklendi', 'success');
    }).catch(error => {
        console.error('Error saving preference:', error);
        showNotification('Tercih eklenirken hata oluştu', 'error');
    });
}

function handleEditPreference(e) {
    e.preventDefault();
    
    if (!currentEditingId) return;
    
    const formData = new FormData(editForm);
    const updatedPreference = {
        university: formData.get('university'),
        department: formData.get('department'),
        score: parseFloat(formData.get('score')),
        rank: parseInt(formData.get('rank')),
        scoreType: formData.get('scoreType'),
        color: formData.get('color'),
        notes: formData.get('notes'),
        priority: formData.get('priority') === 'on'
    };
    
    const index = preferences[currentPerson].findIndex(p => p.id === currentEditingId);
    if (index !== -1) {
        preferences[currentPerson][index] = { ...preferences[currentPerson][index], ...updatedPreference };
        savePreferences().then(() => {
            closeEditModal();
            showNotification('Tercih başarıyla güncellendi', 'success');
        }).catch(error => {
            console.error('Error updating preference:', error);
            showNotification('Tercih güncellenirken hata oluştu', 'error');
        });
    }
}

// Action Functions
function editPreference(id) {
    const preference = preferences[currentPerson].find(p => p.id === id);
    if (!preference) return;
    
    currentEditingId = id;
    
    // Fill form with current values
    document.getElementById('editUniversity').value = preference.university;
    document.getElementById('editDepartment').value = preference.department;
    document.getElementById('editScore').value = preference.score;
    document.getElementById('editRank').value = preference.rank;
    document.getElementById('editScoreType').value = preference.scoreType;
    document.getElementById('editColor').value = preference.color || '#4CAF50';
    document.getElementById('editNotes').value = preference.notes || '';
    document.getElementById('editPriority').checked = preference.priority;
    
    editModal.classList.remove('hidden');
}

function openAddModal() {
    addModal.classList.remove('hidden');
    preferenceForm.reset();
    document.getElementById('color').value = '#4CAF50';
}

function closeAddModal() {
    addModal.classList.add('hidden');
    preferenceForm.reset();
}

function closeEditModal() {
    editModal.classList.add('hidden');
    currentEditingId = null;
    editForm.reset();
}

function deletePreference(id) {
    if (!confirm('Bu tercihi silmek istediğinizden emin misiniz?')) return;
    
    preferences[currentPerson] = preferences[currentPerson].filter(p => p.id !== id);
    savePreferences().then(() => {
        showNotification('Tercih başarıyla silindi', 'success');
    }).catch(error => {
        console.error('Error deleting preference:', error);
        showNotification('Tercih silinirken hata oluştu', 'error');
    });
}

function togglePriority(id) {
    const index = preferences[currentPerson].findIndex(p => p.id === id);
    if (index !== -1) {
        preferences[currentPerson][index].priority = !preferences[currentPerson][index].priority;
        savePreferences().then(() => {
            showNotification('Öncelik durumu güncellendi', 'success');
        }).catch(error => {
            console.error('Error updating priority:', error);
            showNotification('Öncelik güncellenirken hata oluştu', 'error');
        });
    }
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Drag and Drop Functions
function setupDragAndDrop(card, preferenceId) {
    const dragHandle = card.querySelector('.drag-handle');
    
    if (dragMode) {
        card.classList.add('draggable');
        dragHandle.style.display = 'block';
    } else {
        card.classList.remove('draggable');
        dragHandle.style.display = 'none';
    }
    
    dragHandle.addEventListener('mousedown', (e) => {
        if (!dragMode) return;
        e.preventDefault();
        startDrag(card, preferenceId);
    });
    
    // Touch support for mobile devices
    dragHandle.addEventListener('touchstart', (e) => {
        if (!dragMode) return;
        e.preventDefault();
        startDrag(card, preferenceId);
    });
    
    card.addEventListener('dragover', (e) => {
        if (!dragMode || !draggedElement) return;
        e.preventDefault();
        card.classList.add('drag-over');
    });
    
    card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
    });
    
    card.addEventListener('drop', (e) => {
        if (!dragMode || !draggedElement) return;
        e.preventDefault();
        card.classList.remove('drag-over');
        const targetId = card.dataset.id;
        if (targetId !== draggedElement.dataset.id) {
            movePreference(draggedElement.dataset.id, targetId);
        }
    });
}

function startDrag(card, preferenceId) {
    draggedElement = card;
    draggedIndex = preferences[currentPerson].findIndex(p => p.id === preferenceId);
    
    card.classList.add('dragging');
    card.querySelector('.drag-handle').classList.add('dragging');
    
    // Create ghost element
    const ghost = card.cloneNode(true);
    ghost.style.opacity = '0.5';
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '10000';
    document.body.appendChild(ghost);
    
    const moveGhost = (e) => {
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        
        if (clientX && clientY) {
            ghost.style.left = clientX - card.offsetWidth / 2 + 'px';
            ghost.style.top = clientY - card.offsetHeight / 2 + 'px';
        }
    };
    
    const stopDrag = () => {
        card.classList.remove('dragging');
        card.querySelector('.drag-handle').classList.remove('dragging');
        if (document.body.contains(ghost)) {
            document.body.removeChild(ghost);
        }
        draggedElement = null;
        draggedIndex = -1;
        
        document.removeEventListener('mousemove', moveGhost);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', moveGhost);
        document.removeEventListener('touchend', stopDrag);
    };
    
    document.addEventListener('mousemove', moveGhost);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', moveGhost, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

function movePreference(fromId, toId) {
    const fromIndex = preferences[currentPerson].findIndex(p => p.id === fromId);
    const toIndex = preferences[currentPerson].findIndex(p => p.id === toId);
    
    if (fromIndex === -1 || toIndex === -1) return;
    
    const [movedItem] = preferences[currentPerson].splice(fromIndex, 1);
    preferences[currentPerson].splice(toIndex, 0, movedItem);
    
    savePreferences().then(() => {
        renderPreferences();
        showNotification('Tercih sırası güncellendi', 'success');
    }).catch(error => {
        console.error('Error moving preference:', error);
        showNotification('Tercih taşınırken hata oluştu', 'error');
    });
}

// Sorting Functions
function sortPreferences(type) {
    const currentPreferences = preferences[currentPerson];
    
    if (type === 'rank') {
        currentPreferences.sort((a, b) => a.rank - b.rank);
    } else if (type === 'score') {
        currentPreferences.sort((a, b) => b.score - a.score);
    }
    
    savePreferences().then(() => {
        renderPreferences();
        showNotification(`Tercihler ${type === 'rank' ? 'sıralamaya' : 'puana'} göre sıralandı`, 'success');
    }).catch(error => {
        console.error('Error sorting preferences:', error);
        showNotification('Sıralama yapılırken hata oluştu', 'error');
    });
}

function toggleDragMode() {
    dragMode = !dragMode;
    
    if (dragMode) {
        enableDragModeBtn.innerHTML = '<i class="fas fa-times"></i> Sürükle-Bırak Modunu Kapat';
        enableDragModeBtn.classList.remove('btn-primary');
        enableDragModeBtn.classList.add('btn-danger');
        showNotification('Sürükle-bırak modu aktif', 'success');
    } else {
        enableDragModeBtn.innerHTML = '<i class="fas fa-grip-vertical"></i> Sürükle-Bırak Modu';
        enableDragModeBtn.classList.remove('btn-danger');
        enableDragModeBtn.classList.add('btn-primary');
        showNotification('Sürükle-bırak modu kapatıldı', 'info');
    }
    
    renderPreferences();
}

// Global functions for HTML onclick
window.editPreference = editPreference;
window.deletePreference = deletePreference;
window.closeEditModal = closeEditModal;
window.closeAddModal = closeAddModal;
window.togglePriority = togglePriority; 
