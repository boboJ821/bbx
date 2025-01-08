/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});
    // 添加复制功能
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('手机号已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败:', err);
            });
    }

    window.addEventListener('load', function() {
        const avatarContainer = document.querySelector('.avatar-container');
        const overlay = document.querySelector('.avatar-overlay');

        // 修改点击事件处理
        avatarContainer.addEventListener('click', function(e) {
            if (this.classList.contains('expanded')) {
                // 如果已经是放大状态，则缩小
                this.classList.remove('expanded');
            } else {
                // 如果是普通状态，则放大
                this.classList.add('expanded');
            }
        });

        // 保留overlay点击事件作为备用关闭方式
        overlay.addEventListener('click', function(e) {
            avatarContainer.classList.remove('expanded');
        });
    });

    // 微信二维码弹窗功能
    $(document).ready(function() {
        $('.icon.brands.fa-weixin').on('click', function(e) {
            e.preventDefault();
            $('#wechatQR').css('display', 'flex');
        });

        $('.close-qr').on('click', function() {
            $('#wechatQR').css('display', 'none');
        });

        $('#wechatQR').on('click', function(e) {
            if (e.target === this) {
                $(this).css('display', 'none');
            }
        });
    });

    // 平滑滚动功能
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.smooth-scroll').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 获取目标元素
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                // 获取header高度（如果header是固定定位的话）
                const headerOffset = document.querySelector('#header').offsetHeight;
                
                // 计算目标位置
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // 平滑滚动
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // 添加活动状态
                document.querySelectorAll('.smooth-scroll').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

    // 滚动时更新活动状态
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.smooth-scroll[href="#${id}"]`);

            if (scrollY > sectionTop && scrollY <= sectionBottom) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });

})(jQuery);