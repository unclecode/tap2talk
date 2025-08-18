        // Create floating particles
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }

        // Advanced Audio Wave Visualization
        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');
        const waveContainer = document.getElementById('waveContainer');
        const visualizerLabel = document.getElementById('visualizerLabel');
        const micIndicator = document.getElementById('micIndicator');
        
        let animationId;
        let audioContext;
        let analyser;
        let microphone;
        let dataArray;
        let isListening = false;
        let bars = [];
        const barCount = 150;
        
        // Initialize canvas size
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initBars();
        }
        
        // Initialize bars with thin width
        function initBars() {
            bars = [];
            const totalWidth = canvas.width;
            const barWidth = 2;
            const gap = (totalWidth - (barWidth * barCount)) / (barCount - 1);
            
            for (let i = 0; i < barCount; i++) {
                const centerWeight = 1 - Math.abs((i - barCount/2) / (barCount/2));
                bars.push({
                    x: i * (barWidth + gap),
                    width: barWidth,
                    baseHeight: 5 + Math.random() * 10 + centerWeight * 15,
                    targetHeight: 20,
                    currentHeight: 20,
                    velocity: 0,
                    hue: 250 + (i / barCount) * 60, // Purple to cyan range
                    randomFactor: Math.random() * 0.5 + 0.5
                });
            }
        }
        
        // Setup audio context and microphone
        async function setupAudio() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 1024; // Increased for better frequency resolution
                analyser.smoothingTimeConstant = 0.92; // More smoothing for less jumpy response
                analyser.minDecibels = -90; // Lower sensitivity
                analyser.maxDecibels = -30; // Reduced max to prevent over-sensitivity
                
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                
                isListening = true;
                waveContainer.classList.add('listening');
                visualizerLabel.classList.add('listening');
                visualizerLabel.textContent = '🔴 Listening... Click to stop';
                micIndicator.classList.add('show', 'listening');
                
                drawAudioWave();
            } catch (error) {
                console.error('Microphone access denied:', error);
                visualizerLabel.textContent = 'Microphone access denied. Click to retry';
            }
        }
        
        // Stop listening
        function stopListening() {
            if (microphone && audioContext) {
                microphone.disconnect();
                audioContext.close();
                isListening = false;
                waveContainer.classList.remove('listening');
                visualizerLabel.classList.remove('listening');
                visualizerLabel.textContent = 'Click to activate voice';
                micIndicator.classList.remove('show', 'listening');
                
                bars.forEach(bar => {
                    bar.targetHeight = bar.baseHeight;
                });
            }
        }
        
        // Draw audio wave with realistic spectrum
        function drawAudioWave() {
            if (!isListening) {
                drawDefaultWave();
                return;
            }
            
            animationId = requestAnimationFrame(drawAudioWave);
            
            analyser.getByteFrequencyData(dataArray);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const step = Math.floor(dataArray.length / barCount);
            
            bars.forEach((bar, i) => {
                let sum = 0;
                for (let j = 0; j < step; j++) {
                    sum += dataArray[i * step + j] || 0;
                }
                const audioValue = sum / step;
                
                // More gentle scaling for audio response
                const normalizedValue = Math.pow(audioValue / 255, 1.8); // Power curve for gentler response
                const normalizedHeight = normalizedValue * 80 * bar.randomFactor; // Reduced max height
                
                const springForce = 0.08; // Slower response
                const damping = 0.95; // More damping for smoother motion
                
                bar.targetHeight = Math.max(bar.baseHeight, normalizedHeight + bar.baseHeight);
                bar.velocity += (bar.targetHeight - bar.currentHeight) * springForce;
                bar.velocity *= damping;
                bar.currentHeight += bar.velocity;
                
                bar.currentHeight = Math.max(3, bar.currentHeight);
                
                const intensity = Math.min(audioValue / 255, 0.8); // Cap intensity
                const hue = bar.hue + intensity * 20; // Less hue shift
                const saturation = 70 + intensity * 20; // Higher base saturation
                const lightness = 55 + intensity * 20; // Softer brightness change
                
                const gradient = ctx.createLinearGradient(
                    bar.x, canvas.height / 2 + bar.currentHeight / 2,
                    bar.x, canvas.height / 2 - bar.currentHeight / 2
                );
                gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`);
                gradient.addColorStop(0.3, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`);
                gradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`);
                gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    bar.x, 
                    canvas.height / 2 - bar.currentHeight / 2, 
                    bar.width, 
                    bar.currentHeight
                );
                
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`;
                ctx.fillRect(
                    bar.x, 
                    canvas.height / 2 + bar.currentHeight / 2 + 2, 
                    bar.width, 
                    bar.currentHeight * 0.3
                );
            });
        }
        
        // Default wave animation with varied heights
        let phase = 0;
        function drawDefaultWave() {
            if (isListening) return;
            
            animationId = requestAnimationFrame(drawDefaultWave);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            phase += 0.02;
            
            bars.forEach((bar, i) => {
                const wave1 = Math.sin(i * 0.05 + phase) * 15;
                const wave2 = Math.sin(i * 0.03 + phase * 1.5) * 10;
                const wave3 = Math.cos(i * 0.07 + phase * 0.8) * 8;
                
                const centerWeight = 1 - Math.abs((i - barCount/2) / (barCount/2));
                const waveHeight = bar.baseHeight + (wave1 + wave2 + wave3) * (0.5 + centerWeight * 0.5);
                
                bar.targetHeight = Math.max(3, waveHeight);
                bar.currentHeight += (bar.targetHeight - bar.currentHeight) * 0.08;
                
                const gradient = ctx.createLinearGradient(
                    bar.x, canvas.height / 2 + bar.currentHeight / 2,
                    bar.x, canvas.height / 2 - bar.currentHeight / 2
                );
                // Purple to cyan gradient colors
                const hueShift = (i / barCount) * 30;
                gradient.addColorStop(0, `hsla(${260 + hueShift}, 75%, 65%, 0.2)`);
                gradient.addColorStop(0.5, `hsla(${270 + hueShift}, 80%, 70%, 0.7)`);
                gradient.addColorStop(1, `hsla(${280 + hueShift}, 75%, 65%, 0.2)`);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    bar.x, 
                    canvas.height / 2 - bar.currentHeight / 2, 
                    bar.width, 
                    bar.currentHeight
                );
                
                ctx.fillStyle = `hsla(${270 + (i / barCount) * 30}, 70%, 60%, 0.05)`;
                ctx.fillRect(
                    bar.x, 
                    canvas.height / 2 + bar.currentHeight / 2 + 2, 
                    bar.width, 
                    bar.currentHeight * 0.2
                );
            });
        }
        
        // Click handler for wave container
        waveContainer.addEventListener('click', () => {
            if (isListening) {
                stopListening();
            } else {
                setupAudio();
            }
        });
        
        // Hover effect
        waveContainer.addEventListener('mouseenter', () => {
            if (!isListening) {
                micIndicator.classList.add('show');
            }
        });
        
        waveContainer.addEventListener('mouseleave', () => {
            if (!isListening) {
                micIndicator.classList.remove('show');
            }
        });
        
        // Initialize
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawDefaultWave();

        // Dynamic counter animation
        let userCount = 50000;
        setInterval(() => {
            userCount += Math.floor(Math.random() * 3);
            document.getElementById('userCount').textContent = userCount.toLocaleString() + '+';
        }, 5000);

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Style selector interaction
        const styleChips = document.querySelectorAll('.style-chip');
        const styledOutput = document.getElementById('styledOutput');
        
        const styleOutputs = {
            professional: "Dear Team,<br><br>I hope this message finds you well. I would like to request rescheduling our meeting to tomorrow afternoon due to a scheduling conflict with another client call. This will also allow me additional time to prepare the quarterly report.<br><br>Thank you for your understanding.<br><br>Best regards",
            casual: "Hey team! 👋 Can we move the meeting to tomorrow afternoon? Got another client call that came up and I still need to finish the quarterly report. Thanks!",
            emoji: "Hey! 😊 Can we push the meeting to tomorrow afternoon? 📅 Got a conflict with another client call 📞 and need to prep the quarterly report 📊 Thanks! 🙏",
            bullet: "Meeting Reschedule Request:<br>• Move to tomorrow afternoon<br>• Reason: Client call conflict<br>• Need time for quarterly report prep<br>• Please confirm availability",
            summary: "Request to reschedule meeting to tomorrow afternoon due to client call conflict and report preparation needs."
        };
        
        styleChips.forEach(chip => {
            chip.addEventListener('click', () => {
                styleChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                const style = chip.dataset.style;
                styledOutput.style.opacity = '0';
                setTimeout(() => {
                    styledOutput.innerHTML = styleOutputs[style];
                    styledOutput.style.opacity = '1';
                }, 300);
            });
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for animation
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // CTA button ripple effect
        document.querySelectorAll('.cta-primary, .pricing-cta').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple 0.6s ease-out';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(10, 10, 15, 0.95)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '20px';
            });
        }

        // Typing animation for hero
        let typingText = "Write ";
        let typingElement = document.createElement('span');
        typingElement.style.borderRight = '2px solid white';
        typingElement.style.animation = 'blink 1s infinite';
        
        // Integration cards hover effect
        document.querySelectorAll('.integration-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'bounce 0.5s ease';
            });
            
            card.addEventListener('animationend', function() {
                this.style.animation = '';
            });
        });

        // Add bounce animation
        const bounceStyle = document.createElement('style');
        bounceStyle.textContent = `
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(bounceStyle);

        // Testimonial cards auto-rotate on mobile
        if (window.innerWidth < 768) {
            const testimonials = document.querySelectorAll('.testimonial-card');
            let currentTestimonial = 0;
            
            setInterval(() => {
                testimonials.forEach(t => t.style.display = 'none');
                testimonials[currentTestimonial].style.display = 'block';
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            }, 5000);
        }

        // Add floating animation to badges
        document.querySelectorAll('.floating-badge').forEach((badge, index) => {
            badge.style.animationDelay = `${index * 2}s`;
        });

        // Video placeholder play button animation
        document.querySelector('.video-placeholder').addEventListener('click', function() {
            const playButton = this.querySelector('.play-button');
            playButton.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                playButton.style.animation = '';
            }, 500);
        });

        // Lazy load images when added
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Performance optimization - throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Scroll-based animations here
            });
        }, { passive: true });

        // Initialize tooltips for feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.setAttribute('title', 'Click to learn more');
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isListening) {
                stopListening();
            }
        });

        // Page load animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        // Set initial body opacity to 0 for fade-in
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        // Intersection Observer for step cards animation
        function initStepAnimations() {
            const stepCards = document.querySelectorAll('.step-card');
            
            if (stepCards.length === 0) {
                console.log('No step cards found');
                return;
            }
            
            console.log('Found', stepCards.length, 'step cards');
            
            const stepObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Animating step card');
                        entry.target.classList.add('animate-in');
                        // Also trigger for step numbers explicitly
                        const stepNumber = entry.target.querySelector('.step-number');
                        if (stepNumber) {
                            stepNumber.style.visibility = 'visible';
                        }
                    }
                });
            }, {
                threshold: 0.05, // Lower threshold for earlier trigger
                rootMargin: '0px 0px -20px 0px'
            });

            stepCards.forEach((card, index) => {
                stepObserver.observe(card);
                // Force animation if already in view
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 200);
                }
            });
        }

        // Initialize animations after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initStepAnimations);
        } else {
            // Small delay to ensure everything is rendered
            setTimeout(initStepAnimations, 100);
        }