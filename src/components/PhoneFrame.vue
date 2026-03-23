<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  shadowIntensity: { type: String, default: 'medium', validator: (v) => ['low', 'medium', 'high'].includes(v) },
  angle: { type: Number, default: 0 },
  eager: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="phone-frame-wrap"
    :class="['shadow-' + shadowIntensity]"
    :style="angle ? { transform: `perspective(800px) rotateY(${angle}deg)` } : {}"
  >
    <div class="phone-bezel">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <img
          :src="src"
          :alt="alt"
          :loading="eager ? 'eager' : 'lazy'"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-frame-wrap {
  display: inline-block;
  will-change: transform;
}

.phone-bezel {
  position: relative;
  width: 260px;
  background: #1a1a2e;
  border-radius: 36px;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.phone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  z-index: 2;
}

.phone-screen {
  border-radius: 24px;
  overflow: hidden;
  background: #000;
}

.phone-screen img {
  display: block;
  width: 100%;
  height: auto;
}

.shadow-low {
  filter: drop-shadow(0 10px 30px rgba(22, 90, 155, 0.15));
}

.shadow-medium {
  filter: drop-shadow(0 20px 60px rgba(22, 90, 155, 0.3));
}

.shadow-high {
  filter: drop-shadow(0 30px 80px rgba(22, 90, 155, 0.4));
}

@media (max-width: 768px) {
  .phone-bezel {
    width: 200px;
    border-radius: 28px;
    padding: 10px;
  }

  .phone-screen {
    border-radius: 18px;
  }

  .phone-notch {
    width: 60px;
    height: 5px;
    top: 10px;
  }
}

@media (max-width: 480px) {
  .phone-bezel {
    width: 180px;
    border-radius: 24px;
    padding: 8px;
  }

  .phone-screen {
    border-radius: 16px;
  }
}
</style>
