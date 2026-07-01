const BACKEND_URL = "http://localhost:5000"; 

// 1. Data load karna database se
async function loadCaptions() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/captions`);
        const data = await res.json();
        const container = document.getElementById('captionsContainer');
        container.innerHTML = '';

        if(data.length === 0) {
            container.innerHTML = `<p class="text-gray-500 col-span-2 text-center py-8">Vault khali hai bhai. Kuch likho!</p>`;
            return;
        }

        data.forEach(item => {
            container.innerHTML += `
                <div class="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col justify-between shadow-md">
                    <div>
                        <span class="text-xs font-semibold uppercase tracking-wider bg-gray-700 px-2 py-1 rounded text-indigo-300">
                            ${item.category}
                        </span>
                        <p class="mt-3 text-gray-200 whitespace-pre-line text-lg italic">"${item.caption_text}"</p>
                    </div>
                    
                    <div class="mt-5 flex justify-between items-center border-t border-gray-700 pt-3">
                        <button onclick="incrementView(${item.id})" class="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1">
                            👁️ <span id="view-${item.id}">${item.views_count}</span> Views
                        </button>
                        <button onclick="deleteCaption(${item.id})" class="text-sm text-red-400 hover:text-red-500 transition">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

// 2. Naya caption save karna
async function saveCaption() {
    const text = document.getElementById('captionInput').value;
    const cat = document.getElementById('categoryInput').value;

    if(!text.trim()) return alert("Bhai, caption khali nahi ho sakta!");

    await fetch(`${BACKEND_URL}/api/captions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption_text: text, category: cat })
    });

    document.getElementById('captionInput').value = '';
    loadCaptions();
}

// 3. View badhana
async function incrementView(id) {
    await fetch(`${BACKEND_URL}/api/captions/${id}/view`, { method: 'PUT' });
    const viewSpan = document.getElementById(`view-${id}`);
    viewSpan.innerText = parseInt(viewSpan.innerText) + 1;
}

// 4. Delete karna
async function deleteCaption(id) {
    if(confirm("Kya sach me uda de ise database se?")) {
        await fetch(`${BACKEND_URL}/api/captions/${id}`, { method: 'DELETE' });
        loadCaptions();
    }
}

// PWA: Add to Home screen setup
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    installBtn.classList.remove('hidden');

    installBtn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                installBtn.classList.add('hidden');
            }
            deferredPrompt = null;
        });
    });
});

// Initial Load
loadCaptions();