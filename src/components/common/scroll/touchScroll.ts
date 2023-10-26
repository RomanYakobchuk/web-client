export const touchScroll = ($bind = '') => {
    const slider = document.querySelector($bind) as HTMLElement | null;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    if (slider) {
        slider.addEventListener('mousedown', (event) => {
            const e = event as MouseEvent;
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelMomentumTracking();
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            beginMomentumTracking();
        });

        slider.addEventListener('mousemove', (event) => {
            const e = event as MouseEvent;
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            let prevScrollLeft = slider.scrollLeft;
            slider.scrollLeft = scrollLeft - walk;
            velX = slider.scrollLeft - prevScrollLeft;
        });

        slider.addEventListener('wheel', () => {
            cancelMomentumTracking();
        });

        let velX = 0;
        let momentumID: number;

        function beginMomentumTracking() {
            cancelMomentumTracking();
            momentumID = requestAnimationFrame(momentumLoop);
        }

        function cancelMomentumTracking() {
            cancelAnimationFrame(momentumID);
        }

        function momentumLoop() {
            if (slider) {
                slider.scrollLeft += velX;
                velX *= 0.95;
                if (Math.abs(velX) > 0.5) {
                    momentumID = requestAnimationFrame(momentumLoop);
                }
            }
        }
    }
}