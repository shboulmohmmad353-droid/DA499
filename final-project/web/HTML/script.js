const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const previewWrapper = document.getElementById('preview-wrapper');
const uploadPlaceholder = document.querySelector('.upload-placeholder');
const imagePreview = document.getElementById('image-preview');
const runBtn = document.getElementById('run-btn');
const resultsArea = document.getElementById('results');
const loadingOverlay = document.getElementById('loading-overlay');
const mainResult = document.getElementById('main-result');
const resStatus = document.getElementById('res-status');
const resProb = document.getElementById('res-prob');
const viewBtns = document.querySelectorAll('.view-toggle button');

let aiResults = null;

// التفاعل مع منطقة الرفع
dropZone.onclick = () => fileInput.click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--accent)';
};

dropZone.ondragleave = () => {
    dropZone.style.borderColor = 'rgba(0, 242, 255, 0.1)';
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
};

fileInput.onchange = (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
};

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        uploadPlaceholder.classList.add('hidden');
        previewWrapper.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// تنفيذ عملية التنبؤ
runBtn.onclick = async (e) => {
    e.stopPropagation();
    const file = fileInput.files[0];
    if (!file) return;

    loadingOverlay.classList.remove('hidden');
    runBtn.disabled = true;
    runBtn.innerText = 'جاري المعالجة...';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('فشل الاتصال بالخادم');

        aiResults = await response.json();
        renderUI(aiResults);
    } catch (err) {
        alert('خطأ في الاتصال: ' + err.message);
    } finally {
        loadingOverlay.classList.add('hidden');
        runBtn.disabled = false;
        runBtn.innerText = 'بدء عملية التحليل الذكي';
    }
};

function renderUI(data) {
    resultsArea.classList.remove('hidden');
    
    // تحديث الأرقام والحالة
    resStatus.innerText = data.status === 'Fractured' ? 'تم اكتشاف كسر' : 'سليم';
    resStatus.className = data.status === 'Fractured' ? 'danger' : 'success';
    resProb.innerText = `${data.probability}%`;

    // عرض صورة التحديد افتراضياً
    mainResult.src = `data:image/png;base64,${data.image_bbox}`;
    
    // التمرير التلقائي للنتائج في الشاشات الصغيرة
    if (window.innerWidth < 900) {
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }
}

// التبديل بين طرق العرض (BBox vs Mask)
viewBtns.forEach(btn => {
    btn.onclick = () => {
        if (!aiResults) return;
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const viewType = btn.getAttribute('data-view');
        mainResult.src = `data:image/png;base64,${aiResults[viewType]}`;
    };
});
