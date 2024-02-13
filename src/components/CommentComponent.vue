<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {ref} from "vue";
import {Comment} from "../@types";

const comment = ref<string | null>(null);
const props = defineProps<{
  comment: Comment,
  parentId?: string,
  hiddenReply?: boolean,
  onSubmitReplyComment: (reply: string, parentOneId?: string, parentTwoId?: string,) => void,
}>()

const sendComment = () => {
  if (comment.value) {
    if (props.parentId) {
      props.onSubmitReplyComment(comment.value, props.parentId, props.comment.id)
    } else props.onSubmitReplyComment(comment.value, props.comment.id)
    comment.value = '';
  }
};

const openInputReply = ref(false);

</script>
<template>
  <div class="flex flex-column md:flex-column justify-content-between align-items-start gap-2">
    <div class="text-lg font-medium text-900 mt-2">
      {{ props.comment.value }}
    </div>
    <div class="flex flex-column md:align-items-end gap-5" v-if="!hiddenReply">
      <div class="flex flex-column gap-2">
        <div class="flex flex-row gap-2">
          <Button class="flex-auto md:flex-initial white-space-nowrap" link
                  @click="openInputReply = !openInputReply">Répondre
          </Button>
          <span v-if="props.comment">
                <Button v-if="props.comment.replies.length === 1" label="1 commentaire" text/>
                <Button v-if="props.comment.replies.length > 1" :label="props.comment.replies.length +' commentaires'"
                        text/>
              </span>
        </div>
        <div v-if="openInputReply" class="flex flex-row gap-2">
          <InputText type="text" v-model.trim="comment" size="large"/>
          <Button icon="pi pi-send" @click="sendComment" size="large"></Button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>