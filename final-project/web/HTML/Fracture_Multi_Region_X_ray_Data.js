 const uploadBox     = document.getElementById('uploadBox');
        const imageInput    = document.getElementById('imageInput');
        const previewBox    = document.getElementById('previewBox');
        const previewImg    = document.getElementById('previewImg');
        const changeBtn     = document.getElementById('changeBtn');
        const requestText   = document.getElementById('requestText');
        const charCount     = document.getElementById('charCount');
        const form          = document.getElementById('requestForm');
        const submitBtn     = document.getElementById('submitBtn');
        const successMsg    = document.getElementById('successMsg');

        // فتح نافذة اختيار الملف
        uploadBox.addEventListener('click', () => imageInput.click());
        changeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            imageInput.click();
        });

        // معالجة اختيار الملف
        imageInput.addEventListener('change', handleFile);

        // سحب وإفلات
        uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('dragover'); });
        uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragover'));
        uploadBox.addEventListener('drop', e => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                imageInput.files = e.dataTransfer.files;
                handleFile({ target: { files: e.dataTransfer.files } });
            }
        });

        function handleFile(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                previewImg.src = ev.target.result;
                uploadBox.style.display = 'none';
                previewBox.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        // عداد الأحرف
        requestText.addEventListener('input', () => {
            const len = requestText.value.length;
            charCount.textContent = len;
            charCount.style.color = len > 500 ? 'var(--danger)' : 'var(--text-muted)';
            if (len > 500) requestText.value = requestText.value.slice(0, 500);
        });

        // إرسال النموذج
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!imageInput.files[0]) return alert('⚠️ الرجاء رفع صورة أولاً');
            if (requestText.value.trim() === '') return alert('⚠️ الرجاء كتابة نص الطلب');

            submitBtn.textContent = '⏳ جاري الإرسال...';
            submitBtn.disabled = true;

            // محاكاة إرسال للسيرفر
            setTimeout(() => {
                submitBtn.textContent = '🚀 إرسال الطلب';
                submitBtn.disabled = false;
                successMsg.classList.add('show');
                
                // إعادة تعيين النموذج بعد 3 ثواني
                setTimeout(() => {
                    form.reset();
                    previewBox.style.display = 'none';
                    uploadBox.style.display = 'block';
                    successMsg.classList.remove('show');
                    charCount.textContent = '0';
                    charCount.style.color = 'var(--text-muted)';
                }, 3000);
            }, 1500);
        });