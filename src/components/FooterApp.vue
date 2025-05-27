<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
import IconSocialVk from '@/components/icons/IconSocialVk.vue'
import IconSocialTelegram from '@/components/icons/IconSocialTelegram.vue'
import IconSocialYoutube from '@/components/icons/IconSocialYoutube.vue'
import IconSocialRutube from '@/components/icons/IconSocialRutube.vue'
</script>

<template>
  <footer>
    <div class="bg-zinc-850 py-30">
      <div class="container m-auto grid grid-cols-5 gap-60">
        <div class="grid gap-16">
          <IconLogo class="w-205 h-50 shrink-0 text-white" />
          <div class="flex gap-10">
            <a href="https://t.me/loaderpro" target="_blank" class="text-white w-24 h-24"
              ><IconSocialTelegram
            /></a>
            <a href="https://vk.com/loaderproru" target="_blank" class="text-white w-24 h-24"
              ><IconSocialVk
            /></a>
            <a
              href="https://www.youtube.com/@loaderpro"
              target="_blank"
              class="text-white w-24 h-24"
              ><IconSocialYoutube
            /></a>
            <a
              href="https://rutube.ru/channel/34721255/"
              target="_blank"
              class="text-white w-24 h-24"
              ><IconSocialRutube
            /></a>
          </div>
          <iframe src="https://yandex.ru/sprav/widget/rating-badge/64792251897?type=rating&amp;theme=dark" width="150" height="50"></iframe>
        </div>
      </div>
    </div>
    <div class="bg-zinc-950 py-15">
      <div class="container m-auto flex justify-center">
        <p class="text-white">Все права защищены. 2025</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
