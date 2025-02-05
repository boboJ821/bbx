class ThreeBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        this.particles = [];
        this.floatingLights = [];
        this.glowingSpheres = [];
        this.mousePosition = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.currentSection = 'header';
        this.cameraTargets = {
            'header': new THREE.Vector3(0, 2, -8),
            'one': new THREE.Vector3(3, 1, -10),
            'two': new THREE.Vector3(-3, 0, -10),
            'three': new THREE.Vector3(3, -1, -10),
            'four': new THREE.Vector3(0, -2, -8)
        };
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.setupPerformanceMode();
        this.ribbons = [];
        this.orbitRings = [];
        this.crystals = [];
        this.mouseTarget = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.init();
        this.setupNavigation();
        this.setupMouseEvents();
        this.setupTouchEvents();
    }

    init() {
        // 基础设置
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff, 0);
        document.body.appendChild(this.renderer.domElement);
        
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
        this.renderer.domElement.style.pointerEvents = 'none';

        // 相机设置
        this.camera.position.set(0, 0, 30);
        this.camera.lookAt(0, 0, 0);

        // 添加柔和的环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 添加方向光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        // 创建效果
        this.createWhiteParticles();
        this.createFloatingLights();
        this.createGlowingSpheres();
        this.createFog();
        this.createRibbons();
        this.createOrbitRings();
        this.createCrystals();
        this.createLightBeams();
        this.setupParallaxEffect();
        
        // 事件监听
        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    }

    setupNavigation() {
        // 监听导航点击
        document.querySelectorAll('.header-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.transitionToSection(targetId);
            });
        });

        // 监听滚动以更新当前部分
        window.addEventListener('scroll', () => {
            const sections = ['header', 'one', 'two', 'three', 'four'];
            let currentSection = sections[0];
            
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        currentSection = section;
                    }
                }
            });

            if (this.currentSection !== currentSection) {
                this.currentSection = currentSection;
                this.transitionToSection(currentSection, true);
            }
        });
    }

    transitionToSection(sectionId, isScrollTriggered = false) {
        const targetPosition = this.cameraTargets[sectionId];
        if (!targetPosition) return;

        // 如果不是由滚动触发，则平滑滚动到目标部分
        if (!isScrollTriggered) {
            const element = document.getElementById(sectionId);
            element.scrollIntoView({ behavior: 'smooth' });
        }

        // 相机动画
        const startPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };

        const duration = 1000; // 1秒
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数使动画更平滑
            const easeProgress = this.easeInOutCubic(progress);

            this.camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
            this.camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
            this.camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    setupPerformanceMode() {
        if (this.isMobile) {
            // 移动端性能优化
            this.particleCount = 750; // 减少粒子数量
            this.floatingLightCount = 10; // 减少浮动光源
            this.glowingSphereCount = 3; // 减少发光球体
            this.animationFrameRate = 30; // 降低帧率
            
            // 设置较低的渲染质量
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        } else {
            // 桌面端完整效果
            this.particleCount = 1500;
            this.floatingLightCount = 20;
            this.glowingSphereCount = 5;
            this.animationFrameRate = 60;
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
    }

    createWhiteParticles() {
        const particleCount = this.isMobile ? this.particleCount : 1500;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const sizes = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            // 创建螺旋形分布
            const radius = Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 20;
            
            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);

            vertices.push(x, y, z);
            
            // 白色到浅蓝的渐变
            const color = new THREE.Color();
            color.setHSL(0.6, 0.1, 0.9 + Math.random() * 0.1);
            colors.push(color.r, color.g, color.b);
            
            sizes.push(1.5 + Math.random());
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mousePosition: { value: new THREE.Vector2() }
            },
            vertexShader: `
                attribute float size;
                uniform float time;
                uniform vec2 mousePosition;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    float wave = sin(time + position.y * 0.2) * 0.3;
                    pos.x += wave;
                    pos.z += cos(time + position.y * 0.2) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
        this.particles.push(points);
    }

    createFloatingLights() {
        const lightCount = this.isMobile ? this.floatingLightCount : 20;
        for (let i = 0; i < lightCount; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8,
                emissive: 0xffffff,
                emissiveIntensity: 0.5
            });
            
            const light = new THREE.Mesh(geometry, material);
            light.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            );
            
            this.scene.add(light);
            this.floatingLights.push({
                mesh: light,
                speed: 0.2 + Math.random() * 0.3,
                offset: Math.random() * Math.PI * 2
            });
        }
    }

    createGlowingSpheres() {
        const sphereCount = this.isMobile ? this.glowingSphereCount : 5;
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        
        for (let i = 0; i < sphereCount; i++) {
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normal;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    varying vec3 vNormal;
                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5) * intensity;
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const sphere = new THREE.Mesh(sphereGeometry, material);
            sphere.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            sphere.scale.setScalar(0.5 + Math.random() * 0.5);
            
            this.scene.add(sphere);
            this.glowingSpheres.push(sphere);
        }
    }

    createFog() {
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.02);
    }

    createRibbons() {
        const ribbonCount = this.isMobile ? 3 : 5;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, -5, 0),
            new THREE.Vector3(-5, 5, -5),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(5, -5, -5),
            new THREE.Vector3(10, 0, 0)
        ]);

        const geometry = new THREE.TubeGeometry(curve, 100, 0.3, 8, false);
        
        for (let i = 0; i < ribbonCount; i++) {
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xffffff) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    uniform float time;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        pos.x += sin(pos.z * 0.5 + time) * 0.5;
                        pos.y += cos(pos.z * 0.5 + time) * 0.5;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform vec3 color;
                    uniform float time;
                    
                    void main() {
                        float alpha = sin(vUv.x * 20.0 + time) * 0.5 + 0.5;
                        gl_FragColor = vec4(color, alpha * 0.5);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const ribbon = new THREE.Mesh(geometry, material);
            ribbon.rotation.x = Math.random() * Math.PI;
            ribbon.rotation.y = Math.random() * Math.PI;
            ribbon.position.z = -20 - i * 5;
            
            this.scene.add(ribbon);
            this.ribbons.push(ribbon);
        }
    }

    createOrbitRings() {
        const ringCount = this.isMobile ? 2 : 4;
        
        for (let i = 0; i < ringCount; i++) {
            const geometry = new THREE.TorusGeometry(10 + i * 3, 0.1, 16, 100);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    baseColor: { value: new THREE.Color(0xffffff) }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    uniform float time;
                    
                    void main() {
                        vPosition = position;
                        vec3 pos = position;
                        float wave = sin(pos.x * 2.0 + time) * 0.2;
                        pos.z += wave;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPosition;
                    uniform vec3 baseColor;
                    uniform float time;
                    
                    void main() {
                        float glow = sin(vPosition.x * 10.0 + time) * 0.5 + 0.5;
                        vec3 color = mix(baseColor * 0.5, baseColor, glow);
                        gl_FragColor = vec4(color, 0.5 * glow);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 3;
            ring.rotation.y = Math.PI / 6 * i;
            
            this.scene.add(ring);
            this.orbitRings.push(ring);
        }
    }

    createCrystals() {
        const crystalCount = this.isMobile ? 5 : 10;
        const geometry = new THREE.OctahedronGeometry(1, 0);
        
        for (let i = 0; i < crystalCount; i++) {
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    mousePosition: { value: new THREE.Vector2() }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    uniform float time;
                    
                    void main() {
                        vNormal = normal;
                        vPosition = position;
                        vec3 pos = position;
                        pos.y += sin(time + position.x) * 0.2;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    uniform float time;
                    
                    void main() {
                        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                        vec3 color = vec3(1.0) * fresnel;
                        float pulse = sin(time * 2.0 + vPosition.y * 3.0) * 0.5 + 0.5;
                        gl_FragColor = vec4(color, fresnel * pulse);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const crystal = new THREE.Mesh(geometry, material);
            crystal.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            crystal.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            crystal.scale.setScalar(0.5 + Math.random());
            
            this.scene.add(crystal);
            this.crystals.push(crystal);
        }
    }

    createLightBeams() {
        const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 40, 8);
        const beamMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                
                void main() {
                    float beam = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
                    float pulse = sin(time * 2.0 + vUv.y * 10.0) * 0.5 + 0.5;
                    gl_FragColor = vec4(vec3(1.0), beam * pulse * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < 8; i++) {
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.position.set(
                (Math.random() - 0.5) * 40,
                0,
                (Math.random() - 0.5) * 40
            );
            beam.rotation.x = Math.PI / 2;
            this.scene.add(beam);
        }
    }

    setupParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            this.mouseTarget.set(x * 10, y * 10, -20);
            
            // 添加视差效果
            this.crystals.forEach((crystal, i) => {
                const depth = (i / this.crystals.length) * 2;
                crystal.position.x += (x * 5 * depth - crystal.position.x) * 0.02;
                crystal.position.y += (y * 5 * depth - crystal.position.y) * 0.02;
                crystal.rotation.x += 0.01;
                crystal.rotation.y += 0.01;
            });
        });
    }

    onMouseMove(event) {
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 更新相机位置，创建视差效果
        const cameraOffset = new THREE.Vector3(
            this.mousePosition.x * 2,
            this.mousePosition.y * 2,
            0
        );
        
        this.camera.position.lerp(cameraOffset, 0.1);
        this.camera.lookAt(0, 0, 0);
    }

    animate() {
        if (this.isMobile) {
            // 移动端使用较低帧率
            setTimeout(() => requestAnimationFrame(() => this.animate()), 1000 / this.animationFrameRate);
        } else {
            requestAnimationFrame(() => this.animate());
        }

        const time = this.clock.getElapsedTime();

        // 优化动画更新
        if (this.isInViewport()) {
            this.updateParticles(time);
            this.updateLights(time);
            this.updateSpheres(time);
        }

        // 更新新添加的效果
        this.ribbons.forEach((ribbon, i) => {
            ribbon.material.uniforms.time.value = time;
            ribbon.rotation.z = time * 0.1 + i;
        });

        this.orbitRings.forEach((ring, i) => {
            ring.material.uniforms.time.value = time;
            ring.rotation.z = time * (0.1 + i * 0.05);
        });

        this.crystals.forEach((crystal) => {
            crystal.material.uniforms.time.value = time;
            crystal.rotation.x += 0.001;
            crystal.rotation.y += 0.002;
        });

        // 相机动画
        this.camera.position.lerp(this.mouseTarget, 0.05);
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    isInViewport() {
        const rect = this.renderer.domElement.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }

    updateParticles(time) {
        this.particles.forEach((points) => {
            points.material.uniforms.time.value = time;
            points.rotation.y += this.isMobile ? 0.0002 : 0.0005;
        });
    }

    updateLights(time) {
        this.floatingLights.forEach((light) => {
            const speed = this.isMobile ? light.speed * 0.5 : light.speed;
            light.mesh.position.y += Math.sin(time * speed + light.offset) * 0.02;
            light.mesh.position.x += Math.cos(time * speed + light.offset) * 0.02;
        });
    }

    updateSpheres(time) {
        this.glowingSpheres.forEach((sphere, i) => {
            const speed = this.isMobile ? 0.1 : 0.2;
            sphere.rotation.y = time * speed;
            sphere.position.y += Math.sin(time * 0.5 + i) * (this.isMobile ? 0.01 : 0.02);
            sphere.material.uniforms.time.value = time;
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupMouseEvents() {
        // Implementation of setupMouseEvents method
    }

    setupTouchEvents() {
        let touchStartTime;
        let touchStartY;
        
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            
            // 立即反馈
            const section = e.target.closest('section');
            if (section) {
                section.style.transform = 'translateZ(30px) scale(0.98)';
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const section = e.target.closest('section');
            
            if (section) {
                // 快速恢复原状
                section.style.transform = '';
                
                // 如果是短按，触发动画
                if (touchDuration < 300) {
                    section.classList.add('touch-pulse');
                    setTimeout(() => section.classList.remove('touch-pulse'), 300);
                }
            }
        }, { passive: true });

        // 优化滚动性能
        let ticking = false;
        document.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
} 