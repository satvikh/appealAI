// AppealAI Custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Remove any Chainlit branding that might appear dynamically
    function removeBranding() {
        // Remove Chainlit references from document title
        if (document.title.toLowerCase().includes('chainlit')) {
            document.title = 'AppealAI - Professional Dispute Document Generator';
        }
        
        // Remove any "Powered by Chainlit" text
        const poweredByElements = document.querySelectorAll('*');
        poweredByElements.forEach(element => {
            if (element.textContent && 
                (element.textContent.toLowerCase().includes('powered by chainlit') ||
                 element.textContent.toLowerCase().includes('chainlit') ||
                 element.textContent.toLowerCase().includes('built with chainlit'))) {
                element.style.display = 'none';
            }
        });
        
        // Remove any Chainlit logos
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && (img.src.includes('chainlit') || img.alt && img.alt.toLowerCase().includes('chainlit'))) {
                img.style.display = 'none';
            }
        });
        
        // Remove any Chainlit links
        const links = document.querySelectorAll('a[href*="chainlit"]');
        links.forEach(link => {
            link.style.display = 'none';
        });
    }
    
    // Custom welcome message enhancement
    function enhanceWelcomeScreen() {
        const welcomeContent = document.querySelector('.MuiContainer-root');
        if (welcomeContent) {
            welcomeContent.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)';
            welcomeContent.style.borderRadius = '16px';
            welcomeContent.style.padding = '2rem';
            welcomeContent.style.marginTop = '2rem';
        }
    }
    
    // Add smooth scrolling
    function addSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Enhanced message styling
    function enhanceMessages() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Add custom classes to messages
                        const userMessages = node.querySelectorAll('[data-testid="user-message"]');
                        userMessages.forEach(msg => {
                            msg.classList.add('user-message');
                        });
                        
                        const assistantMessages = node.querySelectorAll('[data-testid="assistant-message"]');
                        assistantMessages.forEach(msg => {
                            msg.classList.add('assistant-message');
                        });
                        
                        // Add typing indicator enhancement
                        const typingIndicators = node.querySelectorAll('.typing-indicator');
                        typingIndicators.forEach(indicator => {
                            indicator.innerHTML = '💬 AppealAI is typing...';
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Custom favicon
    function setCustomFavicon() {
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect width="100" height="100" rx="20" fill="#1e40af"/>
                <text x="50" y="60" font-family="Arial" font-size="50" text-anchor="middle" fill="white">⚖️</text>
            </svg>
        `);
        
        if (!document.querySelector('link[rel="icon"]')) {
            document.head.appendChild(favicon);
        }
    }
    
    // Add custom meta tags
    function addCustomMetaTags() {
        // Description meta tag
        let descMeta = document.querySelector('meta[name="description"]');
        if (!descMeta) {
            descMeta = document.createElement('meta');
            descMeta.name = 'description';
            document.head.appendChild(descMeta);
        }
        descMeta.content = 'Professional dispute document generator for parking tickets and housing issues. Generate legal documents quickly and easily with AppealAI.';
        
        // Keywords meta tag
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.name = 'keywords';
            document.head.appendChild(keywordsMeta);
        }
        keywordsMeta.content = 'dispute documents, parking tickets, housing complaints, legal documents, appeal letters';
        
        // Author meta tag
        let authorMeta = document.querySelector('meta[name="author"]');
        if (!authorMeta) {
            authorMeta = document.createElement('meta');
            authorMeta.name = 'author';
            document.head.appendChild(authorMeta);
        }
        authorMeta.content = 'AppealAI';
    }
    
    // Add loading animation for document generation
    function addLoadingAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .generating-document {
                animation: pulse 1.5s ease-in-out infinite;
                background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                color: white;
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Enhanced file download styling
    function enhanceFileDownloads() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const fileElements = node.querySelectorAll('[data-testid="file-element"]');
                        fileElements.forEach(element => {
                            element.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                            element.style.color = 'white';
                            element.style.borderRadius = '12px';
                            element.style.padding = '1rem';
                            element.style.margin = '0.5rem 0';
                            element.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            element.style.transition = 'all 0.2s ease';
                            
                            element.addEventListener('mouseenter', () => {
                                element.style.transform = 'translateY(-2px)';
                                element.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                            });
                            
                            element.addEventListener('mouseleave', () => {
                                element.style.transform = 'translateY(0)';
                                element.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            });
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize all enhancements
    function init() {
        removeBranding();
        enhanceWelcomeScreen();
        addSmoothScrolling();
        enhanceMessages();
        setCustomFavicon();
        addCustomMetaTags();
        addLoadingAnimation();
        enhanceFileDownloads();
        
        // Run branding removal periodically to catch dynamic content
        setInterval(removeBranding, 2000);
    }
    
    // Initialize when DOM is ready
    init();
    
    // Reinitialize when page content changes
    const mainObserver = new MutationObserver(init);
    mainObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Add custom console message
console.log(`
🏛️ AppealAI - Professional Dispute Document Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Custom styling loaded
✅ Branding removal active  
✅ Enhanced user experience enabled

Need help with parking tickets or housing disputes?
Let AppealAI generate professional legal documents for you!
`);

// Enhanced error handling for better user experience
window.addEventListener('error', function(e) {
    console.log('AppealAI: Handled error gracefully');
});

window.addEventListener('unhandledrejection', function(e) {
    console.log('AppealAI: Handled promise rejection gracefully');
});