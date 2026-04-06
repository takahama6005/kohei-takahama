// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }));

    // 2. Navbar Background on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.skill-card, .project-card, .about-text h3, .about-text p, .section-title');
    
    // Initial class addition for reveal
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealFunction = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Offset before element appears

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealFunction);
    revealFunction(); // Trigger on load

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjusting for fixed header height
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Form Submit Interaction
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const btn = contactForm.querySelector('button[type="submit"]');
            
            // Show sending effect, form will be submitted natively to FormSubmit
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
            btn.style.opacity = '0.8';
            // We do not disable the button because form submission might be aborted or need active state
        });
    }

    // 6. Fetch Note Articles via RSS to JSON adapter
    const articlesContainer = document.getElementById('articles-container');
    if (articlesContainer) {
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https://note.com/kouhei6050/rss')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    articlesContainer.innerHTML = ''; // clear loading
                    
                    // Display up to 6 items
                    const articles = data.items.slice(0, 6);
                    
                    articles.forEach((item, index) => {
                        // Format date (YYYY/MM/DD)
                        const pubDate = new Date(item.pubDate);
                        const dateStr = !isNaN(pubDate) ? `${pubDate.getFullYear()}/${String(pubDate.getMonth() + 1).padStart(2, '0')}/${String(pubDate.getDate()).padStart(2, '0')}` : '';
                        
                        const articleHtml = `
                            <div class="article-card reveal" style="animation-delay: ${index * 0.1}s">
                                <div class="article-date"><i class="fa-regular fa-clock"></i> ${dateStr}</div>
                                <h3 class="article-title">${item.title}</h3>
                                <a href="${item.link}" target="_blank" class="article-link">Read Article <i class="fa-solid fa-arrow-right"></i></a>
                            </div>
                        `;
                        articlesContainer.insertAdjacentHTML('beforeend', articleHtml);
                    });

                    // Trigger reveal for dynamically added elements immediately
                    setTimeout(() => {
                        const newReveals = articlesContainer.querySelectorAll('.reveal');
                        newReveals.forEach(el => el.classList.add('active'));
                    }, 50);
                } else {
                    articlesContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--gray-600);">記事が見つかりませんでした。</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching Note articles:', error);
                articlesContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--gray-600);">通信エラーにより記事を取得できませんでした。</p>';
            });
    }

    // 7. Fetch Spotify Episodes via RSS to JSON adapter
    const spotifyContainer = document.getElementById('spotify-container');
    if (spotifyContainer) {
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https://anchor.fm/s/108d550e4/podcast/rss')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    spotifyContainer.innerHTML = ''; // clear loading
                    
                    // Display up to 3 items
                    const episodes = data.items.slice(0, 3);
                    
                    episodes.forEach((item, index) => {
                        let embedSrc = '';
                        if (item.link.includes('podcasters.spotify.com')) {
                            const url = new URL(item.link);
                            embedSrc = `https://podcasters.spotify.com${url.pathname.replace('/episodes/', '/embed/episodes/')}`;
                        }
                        
                        if (embedSrc) {
                            const iframeHtml = `
                                <iframe style="border-radius:12px; margin-bottom: 1rem;"
                                    src="${embedSrc}"
                                    width="100%" height="152" frameBorder="0" allowfullscreen=""
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"></iframe>
                            `;
                            spotifyContainer.insertAdjacentHTML('beforeend', iframeHtml);
                        }
                    });
                } else {
                    spotifyContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--gray-600);">エピソードが見つかりませんでした。</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching Spotify episodes:', error);
                spotifyContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--gray-600);">通信エラーにより取得できませんでした。</p>';
            });
    }
});
