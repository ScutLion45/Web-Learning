var sliderApp = new Vue({
  el: '#slider',
  data () {
    return {
      sliders: [
        { src: 'img/img-1.jpg' },
        { src: 'img/img-2.jpg' },
        { src: 'img/img-3.jpg' },
        { src: 'img/img-4.jpg' },
        { src: 'img/img-5.jpg' },
      ],
      currentIndex: 0,
      distance: -600,
      transitionEnd: true,
      animateTimer: null,
      // 自动轮播与停止
      autoplayTimer: null,
      animateTrigger: true,
    };
  },
  computed: {
    containerStyle () {
      // 这里使用计算属性，用transform+translate3d来移动整个图片列表
      return {
        transform: `translate3d(${this.distance}px, 0, 0)`,
        width: `${this.sliders.length + 2}00%`,
      }
    },
    interval () {
      return 5 * 1000;
    }
  },
  methods: {
    init () {
      this.play();
      // 移入时停止轮播，移出时开始轮播
      this.$refs.sliderWindow.addEventListener('mouseleave', function () {
        this.play();
      }.bind(this));
      this.$refs.sliderWindow.addEventListener('mouseenter', function () {
        this.stop();
      }.bind(this));
    },
    move (offset, direction) {
      if (!this.transitionEnd) return;
      this.transitionEnd = false;

      this.distance += offset * direction;
      setTimeout(() => {
        this.animateTrigger = true;
        this.transitionEnd = true;
      }, 500);
      // 所谓“瞬间”拉回，实现无限滚动
      if (this.distance < -3000) {
        setTimeout(() => {
          this.animateTrigger = false;
          this.distance = -600;
        }, 300);
      }
      if (this.distance > -600) {
        setTimeout(() => {
          this.animateTrigger = false;
          this.distance = -3000;
        }, 300);
      }
      
      // dot
      direction === -1 ?
        this.currentIndex += offset/600:
        this.currentIndex -= offset/600;
      if (this.currentIndex >= this.sliders.length) this.currentIndex = 0;
      if (this.currentIndex < 0) this.currentIndex = this.sliders.length - 1;
    
    },
    jump (index) {
      // console.log('jump to:', index, 'currentIndex:', this.currentIndex);
      if (index === this.currentIndex) return;
      // 获取滑动方向
      const direction = index - this.currentIndex >= 0 ? -1 : 1;
      // 获取滑动距离
      const offset = Math.abs(index - this.currentIndex) * 600;
      // 设置滑动速度
      // const jumpSpeed = Math.abs(index - this.currentIndex) * 30
      // 调用move
      this.move(offset, direction);
    },
    // 自动轮播与停止
    play () {
      console.log('play');
      if (this.autoplayTimer) {
        window.clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
      this.autoplayTimer = window.setInterval(() => {
        this.move(600, -1);
      }, this.interval);
    },
    stop () {
      console.log('stop');
      if (this.autoplayTimer) {
        window.clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }
  },
  mounted () {
    this.init();
  },
  destroyed () {
    this.stop();
  },
});