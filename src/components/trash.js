AFRAME.registerComponent('trash', {
  schema: {
    type: {
      type: 'string',
      default: 'paper',
    },
    timeout: {
      type: 'number',
      default: 10000,
    },
  },

  init() {
    this.nodes = [];
    this.el.isTrash = true;
    this.system.registerTrash(this);
    this.setTimeout();
    this.isGameActive = true; // Trạng thái trò chơi đang hoạt động

    // Lắng nghe sự kiện kết thúc trò chơi
    this.el.sceneEl.addEventListener('stop-trash-spawn', () => {
      this.isGameActive = false; // Ngăn không cho hành động rác tiếp diễn
      clearTimeout(this.timeout); // Dừng hẹn giờ của rác
    });

    this.el.addEventListener('grab-start', () => {
      if (this.isGameActive) {
        this.el.sceneEl.emit('grab-start');
      }
    });
  },

  onModelLoaded(e) {
    e.detail.model.traverse((node) => {
      if (node.isMesh) {
        this.nodes.push(node);
      }
    });
  },

  onHover() {
    if (!this.isGameActive) return; // Không làm gì nếu trò chơi đã kết thúc
    this.nodes.forEach((node) => {
      node.material.transparent = true;
      node.material.opacity = 0.5;
    });
  },

  onHoverEnd() {
    if (!this.isGameActive) return; // Không làm gì nếu trò chơi đã kết thúc
    this.nodes.forEach((node) => {
      node.material.transparent = false;
      node.material.opacity = 1;
    });
  },

  setTimeout() {
    this.timeout = setTimeout(() => {
      if (this && this.el && !this.el.isRemoved && this.isGameActive) {
        this.system.removeTrash(this.el);
        this.el.sceneEl.emit('decreaseLives', { points: 1 });
        this.el.sceneEl.emit('fail-sound');
        this.el.sceneEl.emit('runIndicator', {
          src: '#heart_tpnt',
          text: '-1',
          textColor: '#FF7D7D',
          startPosition: this.el.getAttribute('position'),
        });
      }
    }, this.data.timeout);
  },

  remove() {
    clearTimeout(this.timeout); // Dọn dẹp hẹn giờ khi thành phần bị xóa
  },
});
