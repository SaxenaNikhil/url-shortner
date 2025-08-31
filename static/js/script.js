// DOM Elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const resultSection = document.getElementById('resultSection');
const shortUrlOutput = document.getElementById('shortUrlOutput');
const originalUrlDisplay = document.getElementById('originalUrlDisplay');
const clickCount = document.getElementById('clickCount');
const recentUrls = document.getElementById('recentUrls');
const copyBtn = document.getElementById('copyBtn');

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Copy to clipboard function
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(shortUrlOutput.value);
        showToast('URL copied to clipboard!');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyBtn.style.background = '#28a745';
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        shortUrlOutput.select();
        document.execCommand('copy');
        showToast('URL copied to clipboard!');
    }
}

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Today';
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Create URL card element
function createUrlCard(urlData) {
    const card = document.createElement('div');
    card.className = 'url-card';
    
    const shortUrl = urlData.short_url;
    const shortCode = urlData.short_code;
    
    card.innerHTML = `
        <h4>Shortened URL</h4>
        <div class="short-url">${shortUrl}</div>
        <div class="original-url">${urlData.original_url}</div>
        <div class="stats">
            <span><i class="fas fa-calendar"></i> ${formatDate(urlData.created_at)}</span>
            <span><i class="fas fa-mouse-pointer"></i> ${urlData.clicks} clicks</span>
        </div>
    `;
    
    // Add click event to copy short URL
    card.addEventListener('click', () => {
        navigator.clipboard.writeText(shortUrl).then(() => {
            showToast('URL copied to clipboard!');
        }).catch(() => {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = shortUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('URL copied to clipboard!');
        });
    });
    
    return card;
}

// Load recent URLs
async function loadRecentUrls() {
    try {
        const response = await fetch('/api/recent');
        const urls = await response.json();
        
        recentUrls.innerHTML = '';
        
        if (urls.length === 0) {
            recentUrls.innerHTML = '<div class="loading">No URLs shortened yet. Be the first!</div>';
            return;
        }
        
        urls.forEach(urlData => {
            const card = createUrlCard(urlData);
            recentUrls.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading recent URLs:', error);
        recentUrls.innerHTML = '<div class="loading">Error loading recent URLs</div>';
    }
}

// Handle form submission
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showToast('Please enter a valid URL', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = urlForm.querySelector('.shorten-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Display result
            shortUrlOutput.value = data.short_url;
            originalUrlDisplay.textContent = data.original_url;
            clickCount.textContent = data.clicks;
            
            resultSection.style.display = 'block';
            
            // Scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // Clear input
            urlInput.value = '';
            
            // Reload recent URLs
            loadRecentUrls();
            
            showToast('URL shortened successfully!');
        } else {
            showToast(data.error || 'Error shortening URL', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Input validation
urlInput.addEventListener('input', function() {
    const url = this.value.trim();
    const submitBtn = urlForm.querySelector('.shorten-btn');
    
    if (url && isValidUrl(url)) {
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
    } else {
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
    }
});

// URL validation function
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Auto-focus on input when page loads
window.addEventListener('load', () => {
    urlInput.focus();
    loadRecentUrls();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        urlForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        urlInput.value = '';
        urlInput.focus();
    }
});

// Add some nice animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate header elements
    const logo = document.querySelector('.logo');
    const tagline = document.querySelector('.tagline');
    
    setTimeout(() => {
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        tagline.style.opacity = '1';
        tagline.style.transform = 'translateY(0)';
    }, 300);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .logo, .tagline {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .url-card {
            animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Add loading animation for the spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinnerStyle);
