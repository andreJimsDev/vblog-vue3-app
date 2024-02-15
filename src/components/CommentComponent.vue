<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {ref} from "vue";
import {Comment} from "../@types";
import {useCommentStore} from "../store/comment.store.ts";

const comment = ref<string | null>(null);
const props = defineProps<{
  comment: Comment,
  parentId: string,
  parentIds: string[],
  onSubmitReplyComment: (reply: string, parentOneIds?: string[], parentTwoId?: string) => void,
}>()
const commentStore = useCommentStore();
const sendComment = () => {
  if (comment.value) {
    const parentIds = props.parentIds ?? [];
    if (props.parentId)
    {
      const isChecked = parentIds.filter(el => el === props.parentId).length > 0;
      if(!isChecked) {
        parentIds.push(props.parentId);
      }
    }
    props.onSubmitReplyComment(comment.value, parentIds, props.comment.id)
    comment.value = '';
  }
};


const addReply = (reply: string, parentOneIds?: string[], parentSecondId?: string) => {
  commentStore.addReply(reply, parentOneIds, parentSecondId);
}

const openInputReply = ref(false);

</script>
<template>
  <div class="comment-container">
    <div class="flex flex-column md:flex-column justify-content-between align-items-start gap-2">
      <div class="text-lg font-medium text-900 mt-2">
        {{ props.comment.value }}
      </div>
      <div class="flex flex-column md:align-items-end gap-5">
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
    <div v-if="props.comment.replies.length > 0" class="reply-container flex flex-column-reverse">
      <div v-for="reply in props.comment.replies" :key="reply.id" class="reply">
        <CommentComponent
            v-for="repRecur in props.comment.replies"
            :key="repRecur.id"
            :comment="repRecur"
            :on-submit-reply-comment="addReply"
            :parent-id="repRecur.id"
            :parent-ids="parentIds"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.comment-container {
  margin-bottom: 20px;
}

.comment {
  border: 1px solid #ccc;
  padding: 10px;
}

.reply-container {
  margin-left: 20px;
}

.reply {
  border: 1px solid #ddd;
  padding: 10px;
}
</style>