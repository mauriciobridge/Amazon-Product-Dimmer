(function() {
    'use strict';

    // Keywords indicating sponsored content in different languages
    const SPONSORED_KEYWORDS = [
        'sponsored',
        'patrocinado',
        'sponsorisé',
        'gesponsert',
        'スポンサー',
        '赞助'
    ];

    // Specific sponsored content selectors
    const SPONSORED_SELECTORS = [
        '[data-component-type="sp-sponsored-result"]',
        '.AdHolder',
        '.sp_desktop_sponsored_label',
        '[data-cel-widget*="adplacements"]',
        '[class*="_adPlacements"]',
        '.celwidget .s-sponsored-info-icon'
    ];

    // Check if element contains sponsored text
    function containsSponsoredText(element) {
        const text = element.textContent.toLowerCase().trim();
        return SPONSORED_KEYWORDS.some(keyword => text.includes(keyword));
    }

    // Apply dimming effect to element
    function dimElement(element) {
        if (element.classList.contains('sponsored-content-dimmed')) {
            return; // Already dimmed
        }

        // Ensure relative positioning
        element.style.position = 'relative';
        
        // Add dimming class
        element.classList.add('sponsored-content-dimmed');
        
        // Add sponsored badge
        const badge = document.createElement('div');
        badge.className = 'sponsored-badge';
        badge.textContent = 'Sponsored';
        element.appendChild(badge);

        // Make content interactive on hover
        element.style.cursor = 'pointer';
    }

    // Main function to process elements
    function processSponsoredContent() {
        // Process by specific selectors
        SPONSORED_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const productCard = element.closest('[data-asin]') || 
                                  element.closest('[data-component-type="s-search-result"]') ||
                                  element;
                if (productCard) {
                    dimElement(productCard);
                }
            });
        });

        // Process by text content
        document.querySelectorAll('span').forEach(span => {
            if (containsSponsoredText(span)) {
                const productCard = span.closest('[data-asin]') || 
                                  span.closest('[data-component-type="s-search-result"]');
                if (productCard) {
                    dimElement(productCard);
                }
            }
        });
    }

    // Create and configure mutation observer
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
            }
        });
        
        if (shouldProcess) {
            setTimeout(processSponsoredContent, 100);
        }
    });

    // Start observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial processing
    setTimeout(processSponsoredContent, 1000);

    // Run on load events
    window.addEventListener('load', processSponsoredContent);
    window.addEventListener('urlchange', processSponsoredContent);

    console.log('Amazon Sponsored Content Dimmer - Loaded Successfully');
})();